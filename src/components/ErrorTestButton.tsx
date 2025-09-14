'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function ErrorTestButton() {
  const [shouldError, setShouldError] = useState(false)

  if (shouldError) {
    throw new Error('Test error boundary - this is intentional!')
  }

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setShouldError(true)}
        className="text-xs"
      >
        Test Error Boundary
      </Button>
    </div>
  )
}