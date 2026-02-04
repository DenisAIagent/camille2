"use client";

import { useEffect, useRef } from 'react';

interface ReCaptchaProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
}

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      render: (container: HTMLElement | string, params: {
        sitekey: string;
        callback?: (token: string) => void;
        'expired-callback'?: () => void;
        'error-callback'?: () => void;
        theme?: 'light' | 'dark';
        size?: 'normal' | 'compact';
      }) => number;
      reset: (widgetId?: number) => void;
    };
    recaptchaLoaded?: boolean;
  }
}

export default function ReCaptcha({ onVerify, onExpire, onError }: ReCaptchaProps) {
  const captchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    if (!siteKey) {
      console.error('NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not configured');
      return;
    }

    const renderCaptcha = () => {
      if (captchaRef.current && window.grecaptcha && widgetIdRef.current === null) {
        try {
          widgetIdRef.current = window.grecaptcha.render(captchaRef.current, {
            sitekey: siteKey,
            callback: onVerify,
            'expired-callback': onExpire,
            'error-callback': onError,
            theme: 'light',
            size: 'normal',
          });
        } catch (e) {
          console.error('reCAPTCHA render error:', e);
        }
      }
    };

    // Check if script is already loaded
    if (window.recaptchaLoaded && window.grecaptcha) {
      window.grecaptcha.ready(() => {
        renderCaptcha();
      });
      return;
    }

    // Check if script is being loaded
    const existingScript = document.querySelector('script[src*="recaptcha"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        window.recaptchaLoaded = true;
        window.grecaptcha.ready(() => {
          renderCaptcha();
        });
      });
      return;
    }

    // Load reCAPTCHA script for the first time
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      window.recaptchaLoaded = true;
      window.grecaptcha.ready(() => {
        renderCaptcha();
      });
    };

    document.head.appendChild(script);

    return () => {
      // Reset widget on unmount
      if (widgetIdRef.current !== null && window.grecaptcha) {
        try {
          window.grecaptcha.reset(widgetIdRef.current);
        } catch (e) {
          console.error('reCAPTCHA reset error:', e);
        }
        widgetIdRef.current = null;
      }
    };
  }, [onVerify, onExpire, onError]);

  return <div ref={captchaRef} />;
}
