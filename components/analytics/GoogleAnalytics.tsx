"use client";

import Script from 'next/script';
import { useState, useEffect } from 'react';
import { hasAnalyticsConsent } from '@/lib/cookies';

export default function GoogleAnalytics() {
  const [hasConsent, setHasConsent] = useState(false);

  // Validate GA_MEASUREMENT_ID format to prevent XSS
  const rawId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-YVSR4T8E7G';

  // GA Measurement IDs must match pattern: G-XXXXXXXXXX
  const GA_ID_REGEX = /^G-[A-Z0-9]{10}$/;

  useEffect(() => {
    // Check initial consent
    setHasConsent(hasAnalyticsConsent());

    // Listen for consent changes
    const handleConsentChange = () => {
      const newConsent = hasAnalyticsConsent();
      setHasConsent(newConsent);

      // If consent is withdrawn, reload page to remove GA scripts
      if (!newConsent && window.gtag) {
        window.location.reload();
      }
    };

    window.addEventListener('cookieConsentChange', handleConsentChange);

    return () => {
      window.removeEventListener('cookieConsentChange', handleConsentChange);
    };
  }, []);

  // Don't load GA if no consent
  if (!hasConsent) {
    return null;
  }

  if (!GA_ID_REGEX.test(rawId)) {
    // If invalid, don't render analytics (prevents XSS)
    if (process.env.NODE_ENV === 'development') {
      console.warn('[DEV] Invalid GA_MEASUREMENT_ID format:', rawId);
    }
    return null;
  }

  const GA_MEASUREMENT_ID = rawId;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
            });
          `,
        }}
      />
    </>
  );
}
