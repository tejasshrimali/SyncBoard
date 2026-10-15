import React from 'react';

// Cute hand-crafted Matcha Cup SVG (Japanese Chawan with frothy green tea)
export function MatchaIcon({ className = "w-4 h-4", active = false }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cup Base Stand */}
      <path 
        d="M9 19H15" 
        stroke={active ? "#ffffff" : "#456d5e"} 
        strokeWidth="2" 
        strokeLinecap="round" 
      />
      {/* Cup Body */}
      <path 
        d="M4.5 10C4.5 15 7.5 18 12 18C16.5 18 19.5 15 19.5 10H4.5Z" 
        fill={active ? "rgba(255,255,255,0.25)" : "#e4ece7"} 
        stroke={active ? "#ffffff" : "#456d5e"} 
        strokeWidth="1.8" 
        strokeLinejoin="round" 
      />
      {/* Matcha Liquid Rim / Surface */}
      <ellipse 
        cx="12" 
        cy="10" 
        rx="7.5" 
        ry="2.2" 
        fill={active ? "#ffffff" : "#76a08a"} 
      />
      {/* Cute Whisk froth swirls / tea leaf */}
      <path 
        d="M10 9.8C10.8 9.3 12 9.5 12.5 10.2C13 10.9 14 10.9 14.5 10.2" 
        stroke={active ? "#456d5e" : "#ffffff"} 
        strokeWidth="1.2" 
        strokeLinecap="round" 
      />
      {/* Gentle steam vapor */}
      <path 
        d="M9.5 5.5C9.5 4.5 10.5 4 10.5 3M14 6C14 5 15 4.5 15 3.5" 
        stroke={active ? "#ffffff" : "#76a08a"} 
        strokeWidth="1.4" 
        strokeLinecap="round" 
      />
    </svg>
  );
}

// Cute hand-crafted Sakura Cherry Blossom 5-petal Flower SVG
export function SakuraIcon({ className = "w-4 h-4", active = false }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 5 Blossoming Petals */}
      {/* Top Petal */}
      <path 
        d="M12 12 C10.5 8 10 5 12 3 C14 5 13.5 8 12 12Z" 
        fill={active ? "rgba(255,255,255,0.9)" : "#f29cb1"} 
      />
      {/* Top Right Petal */}
      <path 
        d="M12 12 C14.5 9 17.5 7.5 19.5 9 C19 11.2 16.5 12.5 12 12Z" 
        fill={active ? "rgba(255,255,255,0.85)" : "#ea839b"} 
      />
      {/* Bottom Right Petal */}
      <path 
        d="M12 12 C15 13.5 17 16.5 16 18.5 C13.8 19 12.5 16.5 12 12Z" 
        fill={active ? "rgba(255,255,255,0.8)" : "#e06c88"} 
      />
      {/* Bottom Left Petal */}
      <path 
        d="M12 12 C9 15 7 17 5 15.5 C4.8 13.2 7.5 12.2 12 12Z" 
        fill={active ? "rgba(255,255,255,0.85)" : "#e06c88"} 
      />
      {/* Top Left Petal */}
      <path 
        d="M12 12 C9.5 9 6.5 7.5 4.5 9 C5 11.2 7.5 12.5 12 12Z" 
        fill={active ? "rgba(255,255,255,0.9)" : "#ea839b"} 
      />
      {/* Golden Floral Center Stamen */}
      <circle 
        cx="12" 
        cy="12" 
        r="2.2" 
        fill={active ? "#cf627d" : "#ffd166"} 
      />
      <circle 
        cx="12" 
        cy="12" 
        r="1" 
        fill={active ? "#ffffff" : "#cf627d"} 
      />
    </svg>
  );
}

// Cute hand-crafted Lavender Sprig SVG with blooming buds and stem
export function LavenderIcon({ className = "w-4 h-4", active = false }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Elegant Stem */}
      <path 
        d="M12 21V9" 
        stroke={active ? "rgba(255,255,255,0.6)" : "#8f8bc9"} 
        strokeWidth="1.8" 
        strokeLinecap="round" 
      />
      {/* Top Spike Bud */}
      <ellipse 
        cx="12" 
        cy="4.5" 
        rx="2" 
        ry="2.8" 
        fill={active ? "#ffffff" : "#9893eb"} 
      />
      {/* Tier 1 Buds */}
      <ellipse 
        cx="9.8" 
        cy="7.8" 
        rx="2.4" 
        ry="1.8" 
        transform="rotate(-25 9.8 7.8)" 
        fill={active ? "rgba(255,255,255,0.9)" : "#827ce3"} 
      />
      <ellipse 
        cx="14.2" 
        cy="7.8" 
        rx="2.4" 
        ry="1.8" 
        transform="rotate(25 14.2 7.8)" 
        fill={active ? "rgba(255,255,255,0.9)" : "#827ce3"} 
      />
      {/* Tier 2 Buds */}
      <ellipse 
        cx="9.2" 
        cy="11.2" 
        rx="2.6" 
        ry="1.9" 
        transform="rotate(-25 9.2 11.2)" 
        fill={active ? "rgba(255,255,255,0.85)" : "#6c66cc"} 
      />
      <ellipse 
        cx="14.8" 
        cy="11.2" 
        rx="2.6" 
        ry="1.9" 
        transform="rotate(25 14.8 11.2)" 
        fill={active ? "rgba(255,255,255,0.85)" : "#6c66cc"} 
      />
      {/* Tier 3 Buds */}
      <ellipse 
        cx="9.4" 
        cy="14.6" 
        rx="2.4" 
        ry="1.7" 
        transform="rotate(-20 9.4 14.6)" 
        fill={active ? "rgba(255,255,255,0.8)" : "#5a53b8"} 
      />
      <ellipse 
        cx="14.6" 
        cy="14.6" 
        rx="2.4" 
        ry="1.7" 
        transform="rotate(20 14.6 14.6)" 
        fill={active ? "rgba(255,255,255,0.8)" : "#5a53b8"} 
      />
    </svg>
  );
}
