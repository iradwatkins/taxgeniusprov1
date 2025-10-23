'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

/**
 * Mobile Hub Redirect Component
 *
 * Redirects logged-in mobile users to /mobile-hub from homepage
 */
export function MobileHubRedirect() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    // Wait for auth to load
    if (!isLoaded) return;

    // Only redirect if signed in
    if (!isSignedIn) return;

    // Check if on mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    // Check if user disabled mobile hub (localStorage)
    const mobileHubDisabled = localStorage.getItem('mobile_hub_disabled') === 'true';

    // Redirect mobile users to mobile hub
    if (isMobile && !mobileHubDisabled) {
      router.push('/mobile-hub');
    }
  }, [isLoaded, isSignedIn, router]);

  return null; // This component doesn't render anything
}
