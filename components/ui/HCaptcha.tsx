"use client";

import { useEffect, useRef, useState } from 'react';

interface HCaptchaProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: (error: string) => void;
}

declare global {
  interface Window {
    hcaptcha: {
      render: (container: HTMLElement, config: {
        sitekey: string;
        callback: (token: string) => void;
        'expired-callback'?: () => void;
        'error-callback'?: (error: string) => void;
      }) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    hcaptchaLoaded?: boolean;
  }
}

export default function HCaptcha({ onVerify, onExpire, onError }: HCaptchaProps) {
  const captchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

    if (!siteKey) {
      console.error('NEXT_PUBLIC_HCAPTCHA_SITE_KEY is not configured');
      return;
    }

    // Check if script is already loaded
    if (window.hcaptchaLoaded && window.hcaptcha) {
      // Script already loaded, just render
      if (captchaRef.current && !widgetIdRef.current) {
        try {
          widgetIdRef.current = window.hcaptcha.render(captchaRef.current, {
            sitekey: siteKey,
            callback: onVerify,
            'expired-callback': onExpire,
            'error-callback': onError,
          });
          setIsReady(true);
        } catch (e) {
          console.error('hCaptcha render error:', e);
        }
      }
      return;
    }

    // Check if script is being loaded
    const existingScript = document.querySelector('script[src*="hcaptcha.com"]');
    if (existingScript) {
      // Script is loading, wait for it
      existingScript.addEventListener('load', () => {
        window.hcaptchaLoaded = true;
        if (captchaRef.current && window.hcaptcha && !widgetIdRef.current) {
          try {
            widgetIdRef.current = window.hcaptcha.render(captchaRef.current, {
              sitekey: siteKey,
              callback: onVerify,
              'expired-callback': onExpire,
              'error-callback': onError,
            });
            setIsReady(true);
          } catch (e) {
            console.error('hCaptcha render error:', e);
          }
        }
      });
      return;
    }

    // Load hCaptcha script for the first time
    const script = document.createElement('script');
    script.src = 'https://js.hcaptcha.com/1/api.js?render=explicit';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      window.hcaptchaLoaded = true;
      if (captchaRef.current && window.hcaptcha && !widgetIdRef.current) {
        try {
          widgetIdRef.current = window.hcaptcha.render(captchaRef.current, {
            sitekey: siteKey,
            callback: onVerify,
            'expired-callback': onExpire,
            'error-callback': onError,
          });
          setIsReady(true);
        } catch (e) {
          console.error('hCaptcha render error:', e);
        }
      }
    };

    document.head.appendChild(script);

    return () => {
      // Only remove widget, not the script (it's shared)
      if (widgetIdRef.current && window.hcaptcha) {
        try {
          window.hcaptcha.remove(widgetIdRef.current);
        } catch (e) {
          console.error('hCaptcha remove error:', e);
        }
        widgetIdRef.current = null;
      }
    };
  }, [onVerify, onExpire, onError]);

  return <div ref={captchaRef} />;
}
