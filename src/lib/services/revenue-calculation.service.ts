import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { Decimal } from '@prisma/client/runtime/library';

/**
 * Default revenue split configuration (30/70 model)
 * Can be customized per preparer: 20/80, 30/70, or 40/60
 */
const DEFAULT_TAXGENIUS_PERCENTAGE = 30;

/**
 * Default commission rates (dollar amounts)
 */
const DEFAULT_COMMISSION_RATES = {
  TAX_PREPARER: 0, // Tax preparers don't earn commissions for their own clients
  AFFILIATE: 50,
  CLIENT: 50,
  ADMIN: 0,
  LEAD: 0,
} as const;

export interface RevenueBreakdown {
  processingFee: number;
  taxGeniusRevenue: number;
  preparerRevenue: number;
  totalCommissions: number;
  netRevenue: number; // TaxGenius revenue minus commissions
  profitMargin: number; // Percentage
}

export interface CommissionTier {
  id: string;
  name: string;
  role: string;
  rate: number;
  amount: number;
  tier: number; // 1 = direct referrer, 2 = second tier, etc.
}

export interface ReferralChainData {
  chain: CommissionTier[];
  totalCommissions: number;
}

/**
 * Calculate the revenue split based on preparer's configured percentage
 * @param processingFee - Total fee charged to client
 * @param taxGeniusPercentage - TaxGenius percentage (20, 30, or 40)
 */
export function calculateRevenueSplit(
  processingFee: number,
  taxGeniusPercentage: number = DEFAULT_TAXGENIUS_PERCENTAGE
): {
  taxGeniusRevenue: number;
  preparerRevenue: number;
  taxGeniusPercentage: number;
  preparerPercentage: number;
} {
  const taxGeniusDecimal = taxGeniusPercentage / 100;
  const preparerDecimal = (100 - taxGeniusPercentage) / 100;

  return {
    taxGeniusRevenue: processingFee * taxGeniusDecimal,
    preparerRevenue: processingFee * preparerDecimal,
    taxGeniusPercentage,
    preparerPercentage: 100 - taxGeniusPercentage,
  };
}

/**
 * Get commission rate for a referrer based on their role and any custom bonding
 */
export async function getCommissionRate(
  referrerId: string,
  preparerId?: string
): Promise<number> {
  try {
    // Get referrer profile
    const referrer = await prisma.profile.findUnique({
      where: { id: referrerId },
      select: { role: true },
    });

    if (!referrer) {
      return 0;
    }

    // Check for custom bonding rate (if affiliate bonded to specific preparer)
    if (preparerId && referrer.role === 'AFFILIATE') {
      const bonding = await prisma.affiliateBonding.findFirst({
        where: {
          affiliateId: referrerId,
          preparerId,
          isActive: true,
        },
        select: { commissionStructure: true },
      });

      if (bonding?.commissionStructure) {
        // Extract custom rate from commission structure JSON
        const structure = bonding.commissionStructure as {
          defaultRate?: number;
          tier1?: { rate: number };
        };
        if (structure.defaultRate) return structure.defaultRate;
        if (structure.tier1?.rate) return structure.tier1.rate;
      }
    }

    // Return default rate based on role
    return DEFAULT_COMMISSION_RATES[referrer.role] || 50;
  } catch (error) {
    logger.error('Error getting commission rate:', error);
    return 50; // Default fallback
  }
}

/**
 * Build the complete referral chain with multi-tier commissions
 * Example: Client A referred by Client B, who was referred by Affiliate C
 * Result: [Client B: $50, Affiliate C: $25]
 */
export async function buildReferralChain(clientId: string): Promise<ReferralChainData> {
  const chain: CommissionTier[] = [];
  let totalCommissions = 0;
  let currentClientId = clientId;
  let tier = 1;

  try {
    // Traverse the referral chain (max 3 tiers to prevent infinite loops)
    while (tier <= 3) {
      // Find who referred this client
      const referral = await prisma.referral.findFirst({
        where: {
          clientId: currentClientId,
          status: { in: ['ACTIVE', 'COMPLETED'] },
        },
        include: {
          referrer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          },
        },
      });

      if (!referral) {
        break; // No more referrers in chain
      }

      // Get commission rate for this tier
      // Tier 1: Full commission
      // Tier 2: 50% of tier 1
      // Tier 3: 25% of tier 1
      const baseRate = await getCommissionRate(referral.referrer.id);
      const tierMultiplier = tier === 1 ? 1 : tier === 2 ? 0.5 : 0.25;
      const tierCommission = baseRate * tierMultiplier;

      chain.push({
        id: referral.referrer.id,
        name: `${referral.referrer.firstName || ''} ${referral.referrer.lastName || ''}`.trim(),
        role: referral.referrer.role,
        rate: baseRate,
        amount: tierCommission,
        tier,
      });

      totalCommissions += tierCommission;

      // Move up the chain
      currentClientId = referral.referrerId;
      tier++;
    }

    return { chain, totalCommissions };
  } catch (error) {
    logger.error('Error building referral chain:', error);
    return { chain: [], totalCommissions: 0 };
  }
}

/**
 * Calculate complete revenue breakdown including multi-tier commissions
 * @param processingFee - Total fee charged to client
 * @param clientId - Client profile ID
 * @param taxGeniusPercentage - TaxGenius percentage (20, 30, or 40)
 */
export async function calculateRevenueBreakdown(
  processingFee: number,
  clientId: string,
  taxGeniusPercentage: number = DEFAULT_TAXGENIUS_PERCENTAGE
): Promise<RevenueBreakdown> {
  const { taxGeniusRevenue, preparerRevenue } = calculateRevenueSplit(
    processingFee,
    taxGeniusPercentage
  );

  // Get the full referral chain
  const { totalCommissions } = await buildReferralChain(clientId);

  // Calculate net revenue
  const netRevenue = taxGeniusRevenue - totalCommissions;
  const profitMargin = taxGeniusRevenue > 0 ? (netRevenue / taxGeniusRevenue) * 100 : 0;

  return {
    processingFee,
    taxGeniusRevenue,
    preparerRevenue,
    totalCommissions,
    netRevenue,
    profitMargin,
  };
}

/**
 * Get aggregated revenue statistics for a time period
 */
export async function getRevenueStatistics(
  startDate: Date,
  endDate: Date
): Promise<{
  totalReturns: number;
  totalProcessingFees: number;
  totalTaxGeniusRevenue: number;
  totalPreparerRevenue: number;
  totalCommissionsPaid: number;
  totalNetRevenue: number;
  avgProcessingFee: number;
  avgProfitMargin: number;
}> {
  try {
    const returns = await prisma.taxReturn.findMany({
      where: {
        markedCompleteAt: {
          gte: startDate,
          lte: endDate,
        },
        autoRevenueCalculated: true,
      },
      select: {
        processingFeeCharged: true,
        taxGeniusRevenue: true,
        preparerRevenue: true,
        totalCommissionsPaid: true,
      },
    });

    if (returns.length === 0) {
      return {
        totalReturns: 0,
        totalProcessingFees: 0,
        totalTaxGeniusRevenue: 0,
        totalPreparerRevenue: 0,
        totalCommissionsPaid: 0,
        totalNetRevenue: 0,
        avgProcessingFee: 0,
        avgProfitMargin: 0,
      };
    }

    const stats = returns.reduce(
      (acc, ret) => ({
        totalProcessingFees: acc.totalProcessingFees + (ret.processingFeeCharged ? parseFloat(ret.processingFeeCharged.toString()) : 0),
        totalTaxGeniusRevenue: acc.totalTaxGeniusRevenue + (ret.taxGeniusRevenue ? parseFloat(ret.taxGeniusRevenue.toString()) : 0),
        totalPreparerRevenue: acc.totalPreparerRevenue + (ret.preparerRevenue ? parseFloat(ret.preparerRevenue.toString()) : 0),
        totalCommissionsPaid: acc.totalCommissionsPaid + (ret.totalCommissionsPaid ? parseFloat(ret.totalCommissionsPaid.toString()) : 0),
      }),
      {
        totalProcessingFees: 0,
        totalTaxGeniusRevenue: 0,
        totalPreparerRevenue: 0,
        totalCommissionsPaid: 0,
      }
    );

    const totalNetRevenue = stats.totalTaxGeniusRevenue - stats.totalCommissionsPaid;
    const avgProcessingFee = stats.totalProcessingFees / returns.length;
    const avgProfitMargin =
      stats.totalTaxGeniusRevenue > 0
        ? (totalNetRevenue / stats.totalTaxGeniusRevenue) * 100
        : 0;

    return {
      totalReturns: returns.length,
      ...stats,
      totalNetRevenue,
      avgProcessingFee,
      avgProfitMargin,
    };
  } catch (error) {
    logger.error('Error calculating revenue statistics:', error);
    throw error;
  }
}

/**
 * Forecast revenue based on historical data and current pipeline
 */
export async function forecastRevenue(months: number = 6): Promise<{
  monthlyForecasts: Array<{
    month: string;
    expectedReturns: number;
    expectedRevenue: number;
    expectedCommissions: number;
    expectedNetRevenue: number;
  }>;
  summary: {
    totalExpectedReturns: number;
    totalExpectedRevenue: number;
    totalExpectedCommissions: number;
    totalExpectedNetRevenue: number;
    avgMonthlyNetRevenue: number;
  };
}> {
  try {
    // Get historical data (last 3 months)
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const historicalStats = await getRevenueStatistics(threeMonthsAgo, new Date());

    // Calculate monthly averages
    const avgReturnsPerMonth = historicalStats.totalReturns / 3;
    const avgRevenuePerReturn =
      historicalStats.totalReturns > 0
        ? historicalStats.totalTaxGeniusRevenue / historicalStats.totalReturns
        : 0;
    const avgCommissionPerReturn =
      historicalStats.totalReturns > 0
        ? historicalStats.totalCommissionsPaid / historicalStats.totalReturns
        : 0;

    // Get current pipeline
    const pipelineReturns = await prisma.taxReturn.count({
      where: {
        status: { in: ['DRAFT', 'IN_REVIEW'] },
        markedCompleteAt: null,
      },
    });

    const monthlyForecasts = [];
    let totalExpectedReturns = 0;
    let totalExpectedRevenue = 0;
    let totalExpectedCommissions = 0;
    let totalExpectedNetRevenue = 0;

    for (let i = 1; i <= months; i++) {
      const forecastDate = new Date();
      forecastDate.setMonth(forecastDate.getMonth() + i);

      // Month 1 includes pipeline + historical average
      // Subsequent months use historical average only
      const expectedReturns =
        i === 1 ? pipelineReturns + avgReturnsPerMonth : avgReturnsPerMonth;

      const expectedRevenue = expectedReturns * avgRevenuePerReturn;
      const expectedCommissions = expectedReturns * avgCommissionPerReturn;
      const expectedNetRevenue = expectedRevenue - expectedCommissions;

      monthlyForecasts.push({
        month: forecastDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
        expectedReturns: Math.round(expectedReturns),
        expectedRevenue: Math.round(expectedRevenue * 100) / 100,
        expectedCommissions: Math.round(expectedCommissions * 100) / 100,
        expectedNetRevenue: Math.round(expectedNetRevenue * 100) / 100,
      });

      totalExpectedReturns += expectedReturns;
      totalExpectedRevenue += expectedRevenue;
      totalExpectedCommissions += expectedCommissions;
      totalExpectedNetRevenue += expectedNetRevenue;
    }

    return {
      monthlyForecasts,
      summary: {
        totalExpectedReturns: Math.round(totalExpectedReturns),
        totalExpectedRevenue: Math.round(totalExpectedRevenue * 100) / 100,
        totalExpectedCommissions: Math.round(totalExpectedCommissions * 100) / 100,
        totalExpectedNetRevenue: Math.round(totalExpectedNetRevenue * 100) / 100,
        avgMonthlyNetRevenue: Math.round((totalExpectedNetRevenue / months) * 100) / 100,
      },
    };
  } catch (error) {
    logger.error('Error forecasting revenue:', error);
    throw error;
  }
}
