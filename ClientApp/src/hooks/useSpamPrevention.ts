import { useState } from 'react';

/**
 * Custom hook for spam prevention in forms
 * Combines honeypot field and time-based validation
 * 
 * @param minimumFillTimeMs - Minimum time (ms) required before form can be submitted (default: 3000)
 * @returns Object containing honeypot field management and validation functions
 */
export function useSpamPrevention(minimumFillTimeMs: number = 3000) {
  const [formLoadTime] = useState(Date.now());

  /**
   * Validates form against spam detection mechanisms
   * @returns { valid: boolean, error?: string }
   */
  const validateSpamPrevention = (honeypotValue: string): { valid: boolean; error?: string } => {
    // Check honeypot - if filled, it's likely a bot
    if (honeypotValue && honeypotValue.trim()) {
      return {
        valid: false,
        error: 'Spam detected. Please try again.'
      };
    }

    // Time-based validation - reject if submitted too quickly (less than minimum time)
    const timeSinceLoad = Date.now() - formLoadTime;
    if (timeSinceLoad < minimumFillTimeMs) {
      return {
        valid: false,
        error: 'Please take your time to fill out the form.'
      };
    }

    return { valid: true };
  };

  /**
   * Returns honeypot field props for React form inputs
   * @returns Input element props for honeypot field
   */
  const getHoneypotProps = () => ({
    style: { display: 'none' },
    tabIndex: -1,
    autoComplete: 'off'
  });

  return {
    validateSpamPrevention,
    getHoneypotProps,
    formLoadTime
  };
}
