import { prisma } from '@/lib/prisma';
import { ProductCard } from './_components/ProductCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Package, QrCode, FileText, MessageSquare, TrendingUp } from 'lucide-react';

export const metadata = {
  title: 'Marketing Store - Tax Genius Pro',
  description:
    'Purchase marketing materials, landing pages, and subscriptions to grow your business',
};

async function getProducts() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  // Convert Decimal to number for client components
  return products.map((product) => ({
    ...product,
    price: Number(product.price),
  }));
}

export default async function StorePage() {
  // Authentication and access control handled in layout.tsx
  const products = await getProducts();

  // Group products by category
  const landingPages = products.filter((p) => p.type === 'LANDING_PAGE');
  const marketingMaterials = products.filter((p) => p.type === 'MARKETING_MATERIAL');
  const digitalAssets = products.filter((p) => p.type === 'DIGITAL_ASSET');
  const emailAddresses = products.filter((p) => p.type === 'EMAIL_ADDRESS');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Marketing Store</h1>
        <p className="text-muted-foreground text-lg">
          Professional marketing materials and tools to grow your tax business
        </p>
      </div>

      {/* Featured Subscription Plans */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="h-6 w-6" />
          Landing Page Subscriptions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Plan */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle>Free</CardTitle>
                <Badge variant="secondary">Basic</Badge>
              </div>
              <CardDescription>Get started with lead generation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <span className="text-3xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />1 Landing Page
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Basic Analytics
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Generic Branding
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Monthly Plan */}
          <Card className="border-2 border-primary shadow-lg relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="px-4">Most Popular</Badge>
            </div>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle>Monthly</CardTitle>
                <Badge>Professional</Badge>
              </div>
              <CardDescription>Perfect for active marketers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <span className="text-3xl font-bold">$49</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />5 Landing Pages
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Advanced Analytics
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Custom Branding (Tax Preparers)
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  A/B Testing
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Annual Plan */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle>Annual</CardTitle>
                <Badge variant="secondary">Best Value</Badge>
              </div>
              <CardDescription>Save 41% with annual billing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <span className="text-3xl font-bold">$29</span>
                <span className="text-muted-foreground">/month</span>
                <p className="text-xs text-muted-foreground">Billed annually at $348</p>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Unlimited Landing Pages
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Premium Analytics
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Priority Support
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  All Professional Features
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Categories */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="materials">Marketing Materials</TabsTrigger>
          <TabsTrigger value="digital">Digital Assets</TabsTrigger>
          <TabsTrigger value="qr">QR Codes</TabsTrigger>
          <TabsTrigger value="email">Email Addresses</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground text-lg">
                No products available at the moment. Check back soon!
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="materials">
          {marketingMaterials.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {marketingMaterials.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No marketing materials available</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="digital">
          {digitalAssets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {digitalAssets.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No digital assets available</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="qr">
          <div className="text-center py-12">
            <QrCode className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">
              QR codes are generated automatically with your campaigns
            </p>
          </div>
        </TabsContent>

        <TabsContent value="email">
          {emailAddresses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {emailAddresses.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Professional email addresses coming soon</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
