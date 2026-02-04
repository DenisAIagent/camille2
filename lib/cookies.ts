"use client";

/**
 * Cookie Consent Management - GDPR Compliant
 * Stores user consent preferences in localStorage
 */

export type CookieConsent = {
  analytics: boolean;
  timestamp: number;
};

const CONSENT_KEY = "cookie-consent";
const CONSENT_EXPIRY_DAYS = 365; // 1 year

/**
 * Get current cookie consent from localStorage
 */
export function getCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) return null;

    const consent = JSON.parse(stored) as CookieConsent;

    // Check if consent has expired (older than 1 year)
    const now = Date.now();
    const expiryTime = consent.timestamp + CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

    if (now > expiryTime) {
      // Consent expired, remove it
      localStorage.removeItem(CONSENT_KEY);
      return null;
    }

    return consent;
  } catch (error) {
    console.error("Error reading cookie consent:", error);
    return null;
  }
}

/**
 * Save cookie consent to localStorage
 */
export function setCookieConsent(analytics: boolean): void {
  if (typeof window === "undefined") return;

  const consent: CookieConsent = {
    analytics,
    timestamp: Date.now(),
  };

  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));

    // Dispatch custom event to notify components
    window.dispatchEvent(new CustomEvent("cookieConsentChange", { detail: consent }));
  } catch (error) {
    console.error("Error saving cookie consent:", error);
  }
}

/**
 * Check if user has given consent for analytics cookies
 */
export function hasAnalyticsConsent(): boolean {
  const consent = getCookieConsent();
  return consent?.analytics ?? false;
}

/**
 * Remove cookie consent (user withdraws consent)
 */
export function removeCookieConsent(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(CONSENT_KEY);

    // Dispatch event to notify components
    window.dispatchEvent(new CustomEvent("cookieConsentChange", { detail: null }));
  } catch (error) {
    console.error("Error removing cookie consent:", error);
  }
}

/**
 * Check if user has made a choice (accepted or refused)
 */
export function hasConsentChoice(): boolean {
  return getCookieConsent() !== null;
}
