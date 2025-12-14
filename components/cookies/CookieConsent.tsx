"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { X, Cookie } from "lucide-react";
import { hasConsentChoice, setCookieConsent } from "@/lib/cookies";

export default function CookieConsent() {
  const t = useTranslations("CookieConsent");
  const [showBanner, setShowBanner] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const hasChoice = hasConsentChoice();

    if (!hasChoice) {
      // Small delay to show smooth animation
      setTimeout(() => {
        setShowBanner(true);
        setTimeout(() => setIsVisible(true), 100);
      }, 1000);
    }
  }, []);

  const handleAccept = () => {
    setCookieConsent(true);
    hideBanner();
  };

  const handleRefuse = () => {
    setCookieConsent(false);
    hideBanner();
  };

  const hideBanner = () => {
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300);
  };

  if (!showBanner) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      {/* Backdrop blur */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent backdrop-blur-sm" />

      {/* Banner content */}
      <div className="relative bg-card/95 backdrop-blur-md border-t shadow-2xl">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Left: Icon + Text */}
            <div className="flex items-start gap-4 flex-1">
              <div className="flex-shrink-0">
                <Cookie className="w-8 h-8 text-primary" aria-hidden="true" />
              </div>

              <div className="flex-1">
                <h2
                  id="cookie-consent-title"
                  className="text-lg font-semibold mb-2 text-foreground"
                >
                  {t("title")}
                </h2>
                <p
                  id="cookie-consent-description"
                  className="text-sm text-muted-foreground leading-relaxed"
                >
                  {t("description")}{" "}
                  <a
                    href="/privacy"
                    className="underline hover:text-primary transition-colors"
                  >
                    {t("learnMore")}
                  </a>
                </p>
              </div>
            </div>

            {/* Right: Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:flex-shrink-0">
              <button
                onClick={handleRefuse}
                className="px-6 py-2.5 rounded-lg border border-border bg-background text-foreground hover:bg-accent transition-colors font-medium text-sm"
                aria-label={t("refuse")}
              >
                {t("refuse")}
              </button>
              <button
                onClick={handleAccept}
                className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-sm shadow-md"
                aria-label={t("accept")}
              >
                {t("accept")}
              </button>
            </div>

            {/* Close button (optional - some regulations require explicit choice) */}
            <button
              onClick={hideBanner}
              className="absolute top-4 right-4 md:relative md:top-0 md:right-0 p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label={t("close")}
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
