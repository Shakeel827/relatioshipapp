/**
 * RELASTIN THEME SYSTEM
 * 
 * Design Philosophy:
 * - Warm, calming, emotionally supportive
 * - Slow, breathing-style animations
 * - Large, readable typography
 * - Muted, natural colors
 * - Ample whitespace and breathing room
 */

export const theme = {
  // Colors - Warm, calm, emotionally supportive
  colors: {
    // Primary palette
    background: "#F8F7F5", // Soft off-white
    paper: "#FFFFFF", // Clean white
    sand: "#FAF9F8", // Subtle off-white
    
    // Text colors
    ink: "#2B2621", // Warm charcoal
    inkMuted: "#6B6560", // Muted warm gray
    inkLight: "#8B8580", // Light warm gray
    mist: "rgba(255,255,255,0.55)",

    // Accent colors - calm and supportive
    blueDusk: "#6B7A9F", // Muted cool blue
    blueQuiet: "#7A9FB6", // Gentle steel blue
    lavender: "#8B7FA8", // Soft lavender
    lavenderMist: "#E4DCEF", // Light lavender

    // Semantic colors
    success: "#6B8B6B", // Soft sage green
    warning: "#9F8B6B", // Warm amber
    danger: "#8B6B6B", // Soft warm brown (NOT bright red)
    
    // States
    disabled: "#D4D0CB",
    hairline: "rgba(43, 38, 33, 0.10)",
    glass: "rgba(255,255,255,0.20)",
    overlay: "rgba(43, 38, 33, 0.5)",
  },

  // Spacing - Breathing room
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    xxxl: 48,
  },

  // Border radius - Rounded and gentle
  radii: {
    none: 0,
    sm: 8,
    card: 16,
    lg: 24,
    pill: 999,
  },

  // Typography - Large, readable, human
  type: {
    display: { fontSize: 48, letterSpacing: -0.5, lineHeight: 56, fontWeight: "300" },
    title: { fontSize: 28, letterSpacing: -0.2, lineHeight: 36, fontWeight: "300" },
    subtitle: { fontSize: 20, letterSpacing: 0.2, lineHeight: 26, fontWeight: "400" },
    body: { fontSize: 17, letterSpacing: 0.1, lineHeight: 24, fontWeight: "400" },
    bodyLarge: { fontSize: 18, letterSpacing: 0, lineHeight: 28, fontWeight: "400" },
    small: { fontSize: 13, letterSpacing: 0.15, lineHeight: 18, fontWeight: "400" },
    caption: { fontSize: 12, letterSpacing: 0.3, lineHeight: 16, fontWeight: "400" },
  },

  // Animation timings - Slow, breathing
  motion: {
    slow: 1200, // Meditation-paced
    calm: 850, // Gentle
    gentle: 650, // Breathing
    micro: 320, // Micro-interactions
  },

  // Shadows - Subtle and soft
  shadows: {
    none: "none",
    xs: "0 1px 2px rgba(43, 38, 33, 0.05)",
    sm: "0 1px 3px rgba(43, 38, 33, 0.08)",
    md: "0 4px 6px rgba(43, 38, 33, 0.1)",
    lg: "0 10px 15px rgba(43, 38, 33, 0.1)",
  },
} as const;

