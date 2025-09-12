import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Rocket, Terminal } from "lucide-react"

export default function TestDesignPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Shadcn/UI Test Page</h1>
          <p className="text-xl text-muted-foreground">Testing all design components</p>
        </div>

        {/* Buttons Section */}
        <Card>
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
            <CardDescription>Different button styles from Shadcn/UI</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Disabled</Button>
          </CardContent>
        </Card>

        {/* Badges Section */}
        <Card>
          <CardHeader>
            <CardTitle>Badge Variants</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </CardContent>
        </Card>

        {/* Alerts Section */}
        <div className="space-y-4">
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              You can add components to your app using the cli.
            </AlertDescription>
          </Alert>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Your session has expired. Please log in again.
            </AlertDescription>
          </Alert>
        </div>

        {/* Complex Card */}
        <Card className="border-2 border-primary">
          <CardHeader className="bg-primary/5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Premium Features</CardTitle>
              <Badge className="bg-green-500">New</Badge>
            </div>
            <CardDescription>Unlock advanced capabilities</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Rocket className="h-5 w-5 text-primary" />
                <span className="font-medium">Blazing fast performance</span>
              </div>
              <div className="flex items-center space-x-3">
                <Rocket className="h-5 w-5 text-primary" />
                <span className="font-medium">Advanced analytics</span>
              </div>
              <div className="flex items-center space-x-3">
                <Rocket className="h-5 w-5 text-primary" />
                <span className="font-medium">Priority support</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-secondary/20">
            <Button className="w-full" size="lg">
              Upgrade Now
            </Button>
          </CardFooter>
        </Card>

        {/* Color Palette */}
        <Card>
          <CardHeader>
            <CardTitle>Color Palette</CardTitle>
            <CardDescription>Current theme colors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-20 bg-primary rounded-lg"></div>
                <p className="text-sm font-medium">Primary</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-secondary rounded-lg"></div>
                <p className="text-sm font-medium">Secondary</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-destructive rounded-lg"></div>
                <p className="text-sm font-medium">Destructive</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-muted rounded-lg"></div>
                <p className="text-sm font-medium">Muted</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-accent rounded-lg"></div>
                <p className="text-sm font-medium">Accent</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-card border rounded-lg"></div>
                <p className="text-sm font-medium">Card</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-popover border rounded-lg"></div>
                <p className="text-sm font-medium">Popover</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 border-2 border-border rounded-lg"></div>
                <p className="text-sm font-medium">Border</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}