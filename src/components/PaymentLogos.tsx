import React from "react"

/**
 * Authentic Fonepay Brand Logo for Nepal QR Payments
 */
export function FonepayLogo({ className = "w-11 h-9" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 54 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Fonepay Logo"
    >
      {/* Brand Red Background */}
      <rect width="54" height="36" rx="8" fill="#E11B22" />
      
      {/* White text: fone */}
      <text
        x="6"
        y="23.5"
        fill="#FFFFFF"
        fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
        fontSize="13"
        fontWeight="900"
        letterSpacing="-0.6px"
      >
        fone
      </text>

      {/* White Pill Container for 'pay' */}
      <rect x="29.5" y="10.5" width="19" height="15" rx="4" fill="#FFFFFF" />
      
      {/* Red text: pay inside pill */}
      <text
        x="31.5"
        y="22"
        fill="#E11B22"
        fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
        fontSize="10"
        fontWeight="900"
        letterSpacing="-0.2px"
      >
        pay
      </text>
    </svg>
  )
}

/**
 * Authentic eSewa Brand Logo for Nepal Digital Wallet
 */
export function EsewaLogo({ className = "w-11 h-9" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 54 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="eSewa Logo"
    >
      {/* Brand Green Background */}
      <rect width="54" height="36" rx="8" fill="#60BB46" />
      
      {/* Stylized lowercase 'e' emblem */}
      <circle cx="14" cy="18" r="8" fill="#FFFFFF" />
      <path
        d="M14 13.5C11.5 13.5 9.5 15.5 9.5 18C9.5 20.5 11.5 22.5 14 22.5C15.8 22.5 17.3 21.4 18 19.8H15.8C15.3 20.6 14.5 21 13.8 21C12.3 21 11.2 19.8 11 18.2H18.4C18.5 17.9 18.5 17.7 18.5 17.5C18.5 15.3 16.5 13.5 14 13.5ZM11.1 16.8C11.4 15.4 12.5 14.5 13.8 14.5C15.1 14.5 16.2 15.4 16.5 16.8H11.1Z"
        fill="#60BB46"
      />

      {/* White text: sewa */}
      <text
        x="24"
        y="23.5"
        fill="#FFFFFF"
        fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
        fontSize="12.5"
        fontWeight="800"
        letterSpacing="-0.3px"
      >
        sewa
      </text>
    </svg>
  )
}

