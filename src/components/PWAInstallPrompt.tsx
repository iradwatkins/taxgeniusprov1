'use client'

import { useState, useEffect } from 'react'
import { X, Download, Smartphone, Bell, Wifi, WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { usePWA } from '@/hooks/usePWA'

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false)
  const {
    isInstalled,
    isOffline,
    canInstall,
    updateAvailable,
    pushSubscription,
    installApp,
    subscribeToPush,
    updateApp
  } = usePWA()

  useEffect(() => {
    // Show install prompt after 30 seconds if not installed
    if (!isInstalled && canInstall) {
      const timer = setTimeout(() => {
        setShowPrompt(true)
      }, 30000)

      return () => clearTimeout(timer)
    }
  }, [isInstalled, canInstall])

  useEffect(() => {
    // Show notification prompt after install
    if (isInstalled && !pushSubscription) {
      const timer = setTimeout(() => {
        setShowNotificationPrompt(true)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [isInstalled, pushSubscription])

  const handleInstall = async () => {
    await installApp()
    setShowPrompt(false)

    // Show notification prompt after install
    setTimeout(() => {
      setShowNotificationPrompt(true)
    }, 2000)
  }

  const handleEnableNotifications = async () => {
    await subscribeToPush()
    setShowNotificationPrompt(false)
  }

  // Connection status indicator
  const ConnectionStatus = () => (
    <div className="fixed bottom-4 left-4 z-50">
      {isOffline && (
        <Badge variant="destructive" className="flex items-center gap-2">
          <WifiOff className="h-3 w-3" />
          Offline Mode
        </Badge>
      )}
      {!isOffline && updateAvailable && (
        <Badge variant="default" className="flex items-center gap-2 cursor-pointer" onClick={updateApp}>
          <Download className="h-3 w-3" />
          Update Available
        </Badge>
      )}
    </div>
  )

  return (
    <>
      <ConnectionStatus />

      {/* Install Prompt */}
      {showPrompt && canInstall && !isInstalled && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full p-6 relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => setShowPrompt(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Smartphone className="h-8 w-8 text-primary" />
              </div>

              <div>
                <h3 className="text-lg font-semibold">Install Tax Genius Pro</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Add Tax Genius Pro to your home screen for quick access and a better experience.
                </p>
              </div>

              <div className="space-y-2 w-full">
                <div className="flex items-start gap-3 text-left">
                  <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 dark:text-green-400 text-xs">✓</span>
                  </div>
                  <p className="text-sm">Works offline - access your data anytime</p>
                </div>
                <div className="flex items-start gap-3 text-left">
                  <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 dark:text-green-400 text-xs">✓</span>
                  </div>
                  <p className="text-sm">Instant notifications for tax updates</p>
                </div>
                <div className="flex items-start gap-3 text-left">
                  <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 dark:text-green-400 text-xs">✓</span>
                  </div>
                  <p className="text-sm">Fast and responsive like a native app</p>
                </div>
              </div>

              <div className="flex gap-3 w-full">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowPrompt(false)}
                >
                  Not Now
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleInstall}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Install
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Notification Prompt */}
      {showNotificationPrompt && !pushSubscription && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full p-6 relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => setShowNotificationPrompt(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Bell className="h-8 w-8 text-primary" />
              </div>

              <div>
                <h3 className="text-lg font-semibold">Stay Updated</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Enable notifications to receive important updates about your tax returns and deadlines.
                </p>
              </div>

              <div className="space-y-2 w-full">
                <div className="flex items-start gap-3 text-left">
                  <Bell className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Tax return status updates</p>
                </div>
                <div className="flex items-start gap-3 text-left">
                  <Bell className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Important deadline reminders</p>
                </div>
                <div className="flex items-start gap-3 text-left">
                  <Bell className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Messages from your tax preparer</p>
                </div>
              </div>

              <div className="flex gap-3 w-full">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowNotificationPrompt(false)}
                >
                  Maybe Later
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleEnableNotifications}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Enable
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}