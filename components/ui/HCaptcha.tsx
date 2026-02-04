"use client";

import { useEffect, useRef } from 'react';

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
  }
}

export default function HCaptcha({ onVerify, onExpire, onError }: HCaptchaProps) {
  const captchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

    if (!siteKey) {
      console.error('NEXT_PUBLIC_HCAPTCHA_SITE_KEY is not configured');
      return;
    }

    // Load hCaptcha script
    const script = document.createElement('script');
    script.src = 'https://js.hcaptcha.com/1/api.js';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (captchaRef.current && window.hcaptcha) {
        widgetIdRef.current = window.hcaptcha.render(captchaRef.current, {
          sitekey: siteKey,
          callback: onVerify,
          'expired-callback': onExpire,
          'error-callback': onError,
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      if (widgetIdRef.current && window.hcaptcha) {
        window.hcaptcha.remove(widgetIdRef.current);
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [onVerify, onExpire, onError]);

  return <div ref={captchaRef} />;
}
