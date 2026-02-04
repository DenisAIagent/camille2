"use client";

import { useEffect } from 'react';

interface ReCaptchaV3Props {
  onVerify: (token: string) => void;
  onError?: () => void;
  action?: string;
}

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
    recaptchaLoaded?: boolean;
  }
}

export default function ReCaptchaV3({ onVerify, onError, action = 'submit' }: ReCaptchaV3Props) {
  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    if (!siteKey) {
      console.error('NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not configured');
      return;
    }

    // Check if script is already loaded
    if (window.recaptchaLoaded && window.grecaptcha) {
      return;
    }

    // Check if script is being loaded
    const existingScript = document.querySelector('script[src*="recaptcha/api.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        window.recaptchaLoaded = true;
      });
      return;
    }

    // Load reCAPTCHA v3 script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      window.recaptchaLoaded = true;
    };

    script.onerror = () => {
      console.error('Failed to load reCAPTCHA script');
      if (onError) onError();
    };

    document.head.appendChild(script);
  }, [onError]);

  // Expose execute function for parent component
  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!siteKey) return;

    // Store execute function in component
    (window as any).executeRecaptcha = async (actionName: string = action) => {
      try {
        if (!window.grecaptcha) {
          throw new Error('reCAPTCHA not loaded');
        }

        const token = await new Promise<string>((resolve, reject) => {
          window.grecaptcha.ready(async () => {
            try {
              const token = await window.grecaptcha.execute(siteKey, {
                action: actionName
              });
              resolve(token);
            } catch (error) {
              reject(error);
            }
          });
        });

        onVerify(token);
        return token;
      } catch (error) {
        console.error('reCAPTCHA execution error:', error);
        if (onError) onError();
        throw error;
      }
    };
  }, [action, onVerify, onError]);

  // reCAPTCHA v3 is invisible, no UI needed
  return null;
}
