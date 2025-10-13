import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Settings,
  User,
  Bell,
  Shield,
  CreditCard,
  Share2,
  Trash2,
  Save,
  Upload,
  Link2,
} from 'lucide-react'

export const metadata = {
  title: 'Settings | Tax Genius Pro',
  description: 'Manage your referrer settings',
}

async function isReferrer() {
  const user = await currentUser()
  if (!user) return false
  const role = user.publicMetadata?.role
  return role === 'referrer' || role === 'admin'
}

export default async function ReferrerSettingsPage() {
  const userIsReferrer = await isReferrer()

  if (!userIsReferrer) {
    redirect('/forbidden')
  }

  const user = await currentUser()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Referrer Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and referral preferences
          </p>
        </div>
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <CardTitle>Profile Information</CardTitle>
          </div>
          <CardDescription>
            Your public profile information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Photo */}
          <div className="flex items-center gap-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback className="text-2xl">
                {user?.firstName?.[0] || user?.emailAddresses[0]?.emailAddress[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Change Photo
              </Button>
              <p className="text-xs text-muted-foreground">
                JPG, PNG or GIF. Max size 2MB.
              </p>
            </div>
          </div>

          <Separator />

          {/* Personal Information */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" defaultValue={user?.firstName || ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" defaultValue={user?.lastName || ''} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              defaultValue={user?.emailAddresses[0]?.emailAddress || ''}
              disabled
            />
            <p className="text-xs text-muted-foreground">
              Contact support to change your email address
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue="est">
                <SelectTrigger id="timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="est">Eastern Time (ET)</SelectItem>
                  <SelectItem value="cst">Central Time (CT)</SelectItem>
                  <SelectItem value="mst">Mountain Time (MT)</SelectItem>
                  <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Referral Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell potential referrals why they should work with you..."
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              This will be shown on your referral landing page
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Referral Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            <CardTitle>Referral Link Settings</CardTitle>
          </div>
          <CardDescription>
            Customize your referral link and vanity URL
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vanityUrl">Custom Vanity URL</Label>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                <span className="text-sm text-muted-foreground">taxgeniuspro.tax/</span>
                <Input
                  id="vanityUrl"
                  placeholder="yourname"
                  className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0"
                />
              </div>
              <Button variant="outline">Check</Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Create a memorable, personalized referral link
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="referralCode">Referral Code</Label>
            <div className="flex gap-2">
              <Input
                id="referralCode"
                defaultValue="TAXGENIUS2024"
                className="font-mono"
                disabled
              />
              <Button variant="outline">
                Regenerate
              </Button>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-apply Referral Code</Label>
              <p className="text-sm text-muted-foreground">
                Automatically apply your code when referrals use your link
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            <CardTitle>Notification Preferences</CardTitle>
          </div>
          <CardDescription>
            Choose how you want to receive updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: 'New Referral Signups', description: 'Notify when someone uses your referral link' },
            { label: 'Return Filed', description: 'Alert when a referral completes their tax return' },
            { label: 'Commission Earned', description: 'Notify when you earn a commission' },
            { label: 'Payout Processed', description: 'Alert when your payout is sent' },
            { label: 'Contest Updates', description: 'Updates about contests and leaderboard changes' },
            { label: 'Marketing Tips', description: 'Receive tips to improve your referral success' },
          ].map((setting) => (
            <div key={setting.label}>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{setting.label}</Label>
                  <p className="text-sm text-muted-foreground">
                    {setting.description}
                  </p>
                </div>
                <Switch defaultChecked={!setting.label.includes('Marketing')} />
              </div>
              <Separator className="mt-4" />
            </div>
          ))}

          <div className="pt-4 space-y-2">
            <Label>Notification Delivery Method</Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="email-notif" defaultChecked />
                <Label htmlFor="email-notif" className="font-normal">Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="sms-notif" />
                <Label htmlFor="sms-notif" className="font-normal">SMS</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="push-notif" defaultChecked />
                <Label htmlFor="push-notif" className="font-normal">Push Notifications</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            <CardTitle>Payment Settings</CardTitle>
          </div>
          <CardDescription>
            Manage how you receive commission payouts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Direct Deposit</p>
                <p className="text-sm text-muted-foreground">Bank Account •••• 4567</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-700">Active</Badge>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
          </div>

          <Button variant="outline" className="w-full">
            <CreditCard className="w-4 h-4 mr-2" />
            Update Payment Method
          </Button>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="payoutThreshold">Minimum Payout Threshold</Label>
            <Select defaultValue="50">
              <SelectTrigger id="payoutThreshold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">$25</SelectItem>
                <SelectItem value="50">$50</SelectItem>
                <SelectItem value="100">$100</SelectItem>
                <SelectItem value="200">$200</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Receive payouts when your balance reaches this amount
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payoutFrequency">Payout Frequency</Label>
            <Select defaultValue="monthly">
              <SelectTrigger id="payoutFrequency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <CardTitle>Privacy & Security</CardTitle>
          </div>
          <CardDescription>
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show on Leaderboard</Label>
              <p className="text-sm text-muted-foreground">
                Display your name and stats on public leaderboard
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security
              </p>
            </div>
            <Button variant="outline" size="sm">
              Enable
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Change Password</Label>
              <p className="text-sm text-muted-foreground">
                Update your account password
              </p>
            </div>
            <Button variant="outline" size="sm">
              Change
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sharing Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            <CardTitle>Sharing Preferences</CardTitle>
          </div>
          <CardDescription>
            Customize your referral sharing experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Include QR Code in Shares</Label>
              <p className="text-sm text-muted-foreground">
                Automatically include QR code when sharing
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Track Link Clicks</Label>
              <p className="text-sm text-muted-foreground">
                See analytics on who clicks your referral links
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-600" />
            <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
          </div>
          <CardDescription>
            Irreversible actions for your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Deactivate Referral Account</Label>
              <p className="text-sm text-muted-foreground">
                Temporarily stop your referral link from working
              </p>
            </div>
            <Button variant="outline" size="sm">
              Deactivate
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Delete Account</Label>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all data
              </p>
            </div>
            <Button variant="destructive" size="sm">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancel</Button>
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
