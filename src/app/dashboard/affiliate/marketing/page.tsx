import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Share2,
  Copy,
  Download,
  Link2,
  FileText,
  Image,
  Video,
  Mail,
  Lightbulb,
  BarChart3,
  ExternalLink,
  Eye,
} from 'lucide-react'

export const metadata = {
  title: 'Marketing Tools | Tax Genius Pro',
  description: 'Access affiliate marketing materials',
}

async function isAffiliate() {
  const user = await currentUser()
  if (!user) return false
  const role = user.publicMetadata?.role
  return role === 'affiliate' || role === 'admin'
}

export default async function AffiliateMarketingPage() {
  const userIsAffiliate = await isAffiliate()

  if (!userIsAffiliate) {
    redirect('/forbidden')
  }

  const affiliateId = 'AFF12345'
  const affiliateLink = `https://taxgeniuspro.tax/aff/${affiliateId}`

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketing Hub</h1>
          <p className="text-muted-foreground mt-1">
            Access promotional materials and tracking tools
          </p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Download All Assets
        </Button>
      </div>

      {/* Affiliate Link */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            <CardTitle>Your Affiliate Link</CardTitle>
          </div>
          <CardDescription>
            Share this link to track conversions and earn commissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={affiliateLink}
              readOnly
              className="font-mono text-sm"
            />
            <Button variant="outline">
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Affiliate ID</Label>
              <div className="flex gap-2">
                <Input
                  value={affiliateId}
                  readOnly
                  className="font-mono font-bold text-lg"
                />
                <Button variant="outline" size="icon">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Campaign Tracking</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="utm_campaign=tax-season"
                  className="font-mono text-sm"
                />
                <Button variant="outline">Add</Button>
              </div>
            </div>
          </div>

          {/* Link Performance */}
          <div className="grid gap-3 md:grid-cols-4 pt-4 border-t">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Clicks</p>
              <p className="text-2xl font-bold">1,234</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Conversions</p>
              <p className="text-2xl font-bold">23</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Conv. Rate</p>
              <p className="text-2xl font-bold">1.86%</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Earnings</p>
              <p className="text-2xl font-bold text-green-600">$1,610</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Marketing Materials Tabs */}
      <Tabs defaultValue="content" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="creatives">Creatives</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="tips">Tips</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ready-to-Use Content</CardTitle>
              <CardDescription>Blog posts, articles, and social media content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  {
                    title: '5 Tax Deductions You Might Be Missing',
                    type: 'Blog Post',
                    words: 1200,
                    format: 'Markdown',
                  },
                  {
                    title: 'How to Prepare for Tax Season',
                    type: 'Article',
                    words: 800,
                    format: 'PDF',
                  },
                  {
                    title: 'Social Media Post Templates',
                    type: 'Social Media',
                    words: 150,
                    format: 'Text',
                  },
                  {
                    title: 'Video Script: Tax Filing Made Easy',
                    type: 'Video Script',
                    words: 500,
                    format: 'PDF',
                  },
                ].map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{item.type}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {item.words} words
                          </span>
                        </div>
                      </div>
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-3 h-3 mr-2" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="w-3 h-3 mr-2" />
                        {item.format}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Creatives Tab */}
        <TabsContent value="creatives" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visual Assets</CardTitle>
              <CardDescription>Banners, images, and graphics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    name: 'Hero Banner - Tax Season',
                    size: '1200x628',
                    format: 'PNG',
                    type: 'banner',
                  },
                  {
                    name: 'Square Social Post',
                    size: '1080x1080',
                    format: 'JPG',
                    type: 'social',
                  },
                  {
                    name: 'Story Template',
                    size: '1080x1920',
                    format: 'PNG',
                    type: 'story',
                  },
                  {
                    name: 'Email Header',
                    size: '600x200',
                    format: 'PNG',
                    type: 'email',
                  },
                  {
                    name: 'Sidebar Banner',
                    size: '300x600',
                    format: 'PNG',
                    type: 'banner',
                  },
                  {
                    name: 'Video Thumbnail',
                    size: '1280x720',
                    format: 'JPG',
                    type: 'video',
                  },
                ].map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="w-full h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded flex items-center justify-center">
                      <Image className="w-12 h-12 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{item.size}</Badge>
                        <span className="text-xs text-muted-foreground">{item.format}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="w-3 h-3 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Tab */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Pre-written email campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    subject: 'Get Your Maximum Tax Refund This Year',
                    type: 'Promotional',
                    opens: '28%',
                    clicks: '4.2%',
                  },
                  {
                    subject: "Don't Miss These Tax Deductions",
                    type: 'Educational',
                    opens: '32%',
                    clicks: '5.8%',
                  },
                  {
                    subject: 'File Your Taxes in 3 Easy Steps',
                    type: 'Onboarding',
                    opens: '41%',
                    clicks: '7.1%',
                  },
                ].map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <h4 className="font-semibold">{item.subject}</h4>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <Badge variant="outline">{item.type}</Badge>
                          <span className="text-xs text-muted-foreground">
                            Opens: {item.opens}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Clicks: {item.clicks}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-3 h-3 mr-2" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="w-3 h-3 mr-2" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-3 h-3 mr-2" />
                        HTML
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tips Tab */}
        <TabsContent value="tips" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                <CardTitle>Marketing Tips & Strategies</CardTitle>
              </div>
              <CardDescription>
                Proven tactics from our top affiliates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    title: 'SEO Optimization',
                    description: 'Optimize your content for tax-related keywords to drive organic traffic.',
                    tips: [
                      'Target long-tail keywords like "best online tax filing service"',
                      'Create comparison articles with other tax services',
                      'Publish content 2-3 months before tax season',
                    ],
                  },
                  {
                    title: 'Content Marketing',
                    description: 'Create valuable content that educates and converts.',
                    tips: [
                      'Write detailed tax guides and how-to articles',
                      'Create tax calculator tools on your site',
                      'Use case studies showing real refund amounts',
                    ],
                  },
                  {
                    title: 'Email Marketing',
                    description: 'Build and nurture an email list for consistent conversions.',
                    tips: [
                      'Offer a free tax checklist as a lead magnet',
                      'Send weekly tax tips during tax season',
                      'Include your affiliate link in every email',
                    ],
                  },
                  {
                    title: 'Social Media',
                    description: 'Leverage social platforms to reach more potential customers.',
                    tips: [
                      'Share tax tips on Instagram Stories daily',
                      'Create short educational videos for TikTok',
                      'Join Facebook groups related to personal finance',
                    ],
                  },
                ].map((section, index) => (
                  <div key={index} className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold text-lg mb-2">{section.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {section.description}
                    </p>
                    <ul className="space-y-2">
                      {section.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-2">
                          <Badge className="mt-0.5">
                            {tipIndex + 1}
                          </Badge>
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Resources */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              <CardTitle>Link Analytics</CardTitle>
            </div>
            <CardDescription>Track your affiliate link performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Clicks (30 days)</span>
                <span className="font-semibold">1,234</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Unique Visitors</span>
                <span className="font-semibold">856</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Conversion Rate</span>
                <span className="font-semibold text-green-600">1.86%</span>
              </div>
              <Button variant="outline" className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Full Analytics
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              <CardTitle>Video Resources</CardTitle>
            </div>
            <CardDescription>Training videos and tutorials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                'Affiliate Onboarding (5:32)',
                'How to Create Content (8:15)',
                'SEO Best Practices (12:40)',
                'Email Marketing Guide (10:22)',
              ].map((video, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                      <Video className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium">{video}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
