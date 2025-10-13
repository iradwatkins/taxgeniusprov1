/**
 * Google Analytics Event Tracking Utilities
 *
 * Provides type-safe event tracking for GA4
 * All events are automatically sent to Google Analytics
 */

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void
  }
}

/**
 * Send custom event to Google Analytics
 */
export function trackEvent(
  eventName: string,
  parameters?: Record<string, any>
): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters)
  }
}

/**
 * Track page view (usually automatic, but useful for SPA navigation)
 */
export function trackPageView(url: string): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
      page_path: url,
    })
  }
}

// ============================================================================
// TAX FILING EVENTS
// ============================================================================

/**
 * Track when user starts tax intake form
 */
export function trackTaxIntakeStarted(params: {
  filingType?: string
  source?: string
}): void {
  trackEvent('tax_intake_started', {
    filing_type: params.filingType || 'unknown',
    source: params.source || 'direct',
  })
}

/**
 * Track when user completes tax intake form
 */
export function trackTaxIntakeCompleted(params: {
  filingType?: string
  formSteps?: number
}): void {
  trackEvent('tax_intake_completed', {
    filing_type: params.filingType || 'unknown',
    form_steps: params.formSteps || 0,
  })
}

/**
 * Track when tax return is filed
 */
export function trackTaxReturnFiled(params: {
  filingType?: string
  preparerId?: string
}): void {
  trackEvent('tax_return_filed', {
    filing_type: params.filingType || 'unknown',
    preparer_id: params.preparerId || 'none',
  })
}

// ============================================================================
// DOCUMENT EVENTS
// ============================================================================

/**
 * Track document upload
 */
export function trackDocumentUploaded(params: {
  documentType?: string
  fileSize?: number
}): void {
  trackEvent('document_uploaded', {
    document_type: params.documentType || 'unknown',
    file_size_kb: params.fileSize ? Math.round(params.fileSize / 1024) : 0,
  })
}

// ============================================================================
// APPOINTMENT EVENTS
// ============================================================================

/**
 * Track appointment booking
 */
export function trackAppointmentBooked(params: {
  appointmentType?: string
  preparerId?: string
}): void {
  trackEvent('appointment_booked', {
    appointment_type: params.appointmentType || 'consultation',
    preparer_id: params.preparerId || 'none',
  })
}

// ============================================================================
// REFERRAL EVENTS
// ============================================================================

/**
 * Track referral link click
 */
export function trackReferralClick(params: {
  referrerId: string
  materialId?: string
  materialType?: string
}): void {
  trackEvent('referral_click', {
    referrer_id: params.referrerId,
    material_id: params.materialId || 'unknown',
    material_type: params.materialType || 'unknown',
  })
}

/**
 * Track referral signup
 */
export function trackReferralSignup(params: {
  referrerId?: string
  referralCode?: string
}): void {
  trackEvent('referral_signup', {
    referrer_id: params.referrerId || 'direct',
    referral_code: params.referralCode || 'none',
  })
}

/**
 * Track referral conversion (completed tax filing)
 */
export function trackReferralConversion(params: {
  referrerId: string
  commissionAmount?: number
}): void {
  trackEvent('referral_conversion', {
    referrer_id: params.referrerId,
    commission_amount: params.commissionAmount || 0,
  })
}

// ============================================================================
// ECOMMERCE EVENTS
// ============================================================================

/**
 * Track product view
 */
export function trackProductView(params: {
  productId: string
  productName: string
  price: number
  category?: string
}): void {
  trackEvent('view_item', {
    currency: 'USD',
    value: params.price,
    items: [
      {
        item_id: params.productId,
        item_name: params.productName,
        price: params.price,
        item_category: params.category || 'tax_services',
      },
    ],
  })
}

/**
 * Track add to cart
 */
export function trackAddToCart(params: {
  productId: string
  productName: string
  price: number
  quantity?: number
}): void {
  trackEvent('add_to_cart', {
    currency: 'USD',
    value: params.price * (params.quantity || 1),
    items: [
      {
        item_id: params.productId,
        item_name: params.productName,
        price: params.price,
        quantity: params.quantity || 1,
      },
    ],
  })
}

/**
 * Track purchase
 */
export function trackPurchase(params: {
  transactionId: string
  value: number
  items: Array<{
    productId: string
    productName: string
    price: number
    quantity: number
  }>
}): void {
  trackEvent('purchase', {
    transaction_id: params.transactionId,
    currency: 'USD',
    value: params.value,
    items: params.items.map((item) => ({
      item_id: item.productId,
      item_name: item.productName,
      price: item.price,
      quantity: item.quantity,
    })),
  })
}

// ============================================================================
// LEAD GENERATION EVENTS
// ============================================================================

/**
 * Track lead form submission
 */
export function trackLeadSubmission(params: {
  formType: string
  source?: string
}): void {
  trackEvent('generate_lead', {
    form_type: params.formType,
    source: params.source || 'website',
  })
}

/**
 * Track contact form submission
 */
export function trackContactFormSubmission(params: {
  contactType?: string
}): void {
  trackEvent('contact_form_submitted', {
    contact_type: params.contactType || 'general',
  })
}

// ============================================================================
// USER ENGAGEMENT EVENTS
// ============================================================================

/**
 * Track when user signs up
 */
export function trackSignup(params: {
  method?: string
  role?: string
}): void {
  trackEvent('sign_up', {
    method: params.method || 'email',
    role: params.role || 'client',
  })
}

/**
 * Track when user logs in
 */
export function trackLogin(params: {
  method?: string
}): void {
  trackEvent('login', {
    method: params.method || 'email',
  })
}

/**
 * Track when user searches
 */
export function trackSearch(params: {
  searchTerm: string
  resultsCount?: number
}): void {
  trackEvent('search', {
    search_term: params.searchTerm,
    results_count: params.resultsCount || 0,
  })
}

// ============================================================================
// DASHBOARD EVENTS
// ============================================================================

/**
 * Track dashboard report export
 */
export function trackReportExport(params: {
  reportType: string
  format: 'csv' | 'pdf'
  dataRows?: number
}): void {
  trackEvent('report_exported', {
    report_type: params.reportType,
    export_format: params.format,
    data_rows: params.dataRows || 0,
  })
}

/**
 * Track dashboard filter usage
 */
export function trackDashboardFilter(params: {
  filterType: string
  filterValue: string
}): void {
  trackEvent('dashboard_filter_applied', {
    filter_type: params.filterType,
    filter_value: params.filterValue,
  })
}
