/**
 * Type declarations for global window object extensions
 */

interface Window {
  /**
   * Google Analytics gtag function
   * Loaded by Google Analytics script
   */
  gtag?: (
    command: 'config' | 'event' | 'js' | 'set',
    targetId: string | Date,
    config?: Record<string, unknown>
  ) => void;

  /**
   * Google Analytics dataLayer
   */
  dataLayer?: unknown[];
}
