import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  QrCode,
  Share2,
  Copy,
  Download,
  Facebook,
  Twitter,
  Instagram,
  Mail,
  MessageSquare,
  Link2,
  Smartphone,
  FileText,
  Image,
  Video,
} from 'lucide-react'

export const metadata = {
  title: 'Marketing Tools | Tax Genius Pro',
  description: 'Access marketing materials and share tools',
}

async function isReferrer() {
  const user = await currentUser()
  if (!user) return false
  const role = user.publicMetadata?.role
  return role === 'referrer' || role === 'admin'
}

export default async function ReferrerMarketingPage() {
  const userIsReferrer = await isReferrer()

  if (!userIsReferrer) {
    redirect('/forbidden')
  }

  const user = await currentUser()
  const referralCode = 'TAXGENIUS2024'
  const referralLink = `https://taxgeniuspro.tax/referral/${referralCode}`

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketing Hub</h1>
          <p className="text-muted-foreground mt-1">
            Access promotional materials and sharing tools
          </p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Download All Assets
        </Button>
      </div>

      {/* Referral Link */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            <CardTitle>Your Referral Link</CardTitle>
          </div>
          <CardDescription>
            Share this link to earn commissions on every referral
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={referralLink}
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
              <Label>Referral Code</Label>
              <div className="flex gap-2">
                <Input
                  value={referralCode}
                  readOnly
                  className="font-mono font-bold text-lg"
                />
                <Button variant="outline" size="icon">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Short Link</Label>
              <div className="flex gap-2">
                <Input
                  value="tgp.tax/ref/TG24"
                  readOnly
                  className="font-mono"
                />
                <Button variant="outline" size="icon">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Sharing */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            <CardTitle>Social Media Sharing</CardTitle>
          </div>
          <CardDescription>
            One-click sharing to your social networks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="justify-start h-auto py-4">
              <div className="flex flex-col items-center w-full gap-2">
                <Facebook className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-medium">Facebook</span>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-4">
              <div className="flex flex-col items-center w-full gap-2">
                <Twitter className="w-6 h-6 text-sky-500" />
                <span className="text-sm font-medium">Twitter</span>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-4">
              <div className="flex flex-col items-center w-full gap-2">
                <Instagram className="w-6 h-6 text-pink-600" />
                <span className="text-sm font-medium">Instagram</span>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-4">
              <div className="flex flex-col items-center w-full gap-2">
                <MessageSquare className="w-6 h-6 text-green-600" />
                <span className="text-sm font-medium">WhatsApp</span>
              </div>
            </Button>
          </div>

          <div className="mt-4 p-4 bg-muted/30 rounded-lg">
            <Label className="text-sm font-medium">Pre-written Message</Label>
            <p className="text-sm mt-2 text-muted-foreground">
              "Get your taxes done right with Tax Genius Pro! Professional tax preparation made easy.
              Use my referral link to get started: {referralLink}"
            </p>
            <Button variant="outline" size="sm" className="mt-2">
              <Copy className="w-3 h-3 mr-2" />
              Copy Message
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* QR Code */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              <CardTitle>QR Code</CardTitle>
            </div>
            <CardDescription>
              Download and share your personalized QR code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="w-64 h-64 bg-white rounded-lg border-2 border-primary p-4 flex items-center justify-center">
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <QrCode className="w-32 h-32 text-muted-foreground" />
                </div>
              </div>
              <div className="flex gap-2 w-full">
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  PNG
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  SVG
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              <CardTitle>Digital Business Card</CardTitle>
            </div>
            <CardDescription>
              Share your digital card with prospects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-primary rounded-lg p-6 bg-gradient-to-br from-primary/5 to-background">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-primary/20 mx-auto flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {user?.firstName?.[0] || 'U'}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">Tax Referral Partner</p>
                </div>
                <div className="pt-3 border-t space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Mail className="w-3 h-3" />
                    {user?.emailAddresses[0]?.emailAddress}
                  </div>
                  <Badge className="font-mono">{referralCode}</Badge>
                </div>
              </div>
            </div>
            <Button className="w-full mt-4">
              <Share2 className="w-4 h-4 mr-2" />
              Share Digital Card
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Marketing Materials */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            <CardTitle>Marketing Materials</CardTitle>
          </div>
          <CardDescription>
            Download professional marketing assets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {/* Flyers */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="w-full h-32 bg-muted rounded flex items-center justify-center">
                <FileText className="w-12 h-12 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-semibold">Promotional Flyers</h4>
                <p className="text-xs text-muted-foreground">PDF format, ready to print</p>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <Download className="w-3 h-3 mr-2" />
                Download
              </Button>
            </div>

            {/* Social Media Graphics */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="w-full h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded flex items-center justify-center">
                <Image className="w-12 h-12 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold">Social Media Graphics</h4>
                <p className="text-xs text-muted-foreground">Instagram, Facebook posts</p>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <Download className="w-3 h-3 mr-2" />
                Download
              </Button>
            </div>

            {/* Email Templates */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="w-full h-32 bg-muted rounded flex items-center justify-center">
                <Mail className="w-12 h-12 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-semibold">Email Templates</h4>
                <p className="text-xs text-muted-foreground">Pre-written email copy</p>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <Download className="w-3 h-3 mr-2" />
                Download
              </Button>
            </div>

            {/* Video Scripts */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="w-full h-32 bg-muted rounded flex items-center justify-center">
                <Video className="w-12 h-12 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-semibold">Video Scripts</h4>
                <p className="text-xs text-muted-foreground">Social media video ideas</p>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <Download className="w-3 h-3 mr-2" />
                Download
              </Button>
            </div>

            {/* Business Cards */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="w-full h-32 bg-muted rounded flex items-center justify-center">
                <FileText className="w-12 h-12 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-semibold">Business Cards</h4>
                <p className="text-xs text-muted-foreground">Print-ready templates</p>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <Download className="w-3 h-3 mr-2" />
                Download
              </Button>
            </div>

            {/* Brochures */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="w-full h-32 bg-muted rounded flex items-center justify-center">
                <FileText className="w-12 h-12 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-semibold">Brochures</h4>
                <p className="text-xs text-muted-foreground">Detailed service info</p>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <Download className="w-3 h-3 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Marketing Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Marketing Tips & Best Practices</CardTitle>
          <CardDescription>
            Proven strategies to maximize your referrals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Badge className="bg-primary">1</Badge>
                Share Consistently
              </h4>
              <p className="text-sm text-muted-foreground">
                Post about Tax Genius Pro at least 2-3 times per week during tax season. Consistency builds trust.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Badge className="bg-primary">2</Badge>
                Personal Stories
              </h4>
              <p className="text-sm text-muted-foreground">
                Share your own positive experiences. Personal testimonials convert better than generic ads.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Badge className="bg-primary">3</Badge>
                Use Multiple Channels
              </h4>
              <p className="text-sm text-muted-foreground">
                Don't rely on just one platform. Share on Facebook, Instagram, email, and in-person.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Badge className="bg-primary">4</Badge>
                Track Your Results
              </h4>
              <p className="text-sm text-muted-foreground">
                Monitor which channels bring the most referrals and focus your efforts there.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
