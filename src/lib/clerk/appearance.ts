export const clerkAppearance = {
  variables: {
    borderRadius: "0.25rem",
    colorBackground: "var(--ml-surface-panel)",
    colorBorder: "var(--ml-border-aged)",
    colorDanger: "var(--ml-accent-danger)",
    colorForeground: "var(--ml-ink-primary)",
    colorInput: "color-mix(in srgb, var(--ml-surface-panel-raised) 86%, black)",
    colorInputForeground: "var(--ml-ink-primary)",
    colorModalBackdrop: "rgba(10, 8, 6, 0.82)",
    colorMuted: "var(--ml-surface-panel-raised)",
    colorMutedForeground: "var(--ml-ink-muted)",
    colorPrimary: "var(--ml-accent-brass-strong)",
    colorPrimaryForeground: "var(--ml-ink-on-paper)",
    colorRing: "var(--ml-focus-ring)",
    fontFamily: "var(--font-body), Georgia, serif",
    fontFamilyButtons: "var(--font-body), Georgia, serif",
    fontFamilyMono: "var(--font-code), monospace",
    fontSize: "0.9rem",
    spacing: "0.95rem",
  },
  elements: {
    card: {
      background:
        "linear-gradient(180deg, var(--ml-surface-panel-raised), var(--ml-surface-panel))",
      border: "1px solid var(--ml-border-aged)",
      boxShadow: "0 24px 80px rgba(0, 0, 0, 0.48)",
      color: "var(--ml-ink-primary)",
    },
    footerActionLink: {
      color: "var(--ml-accent-brass-strong)",
    },
    formButtonPrimary: {
      backgroundColor: "var(--ml-accent-brass-strong)",
      borderRadius: "3px",
      color: "var(--ml-ink-on-paper)",
      fontWeight: 600,
    },
    formFieldInput: {
      backgroundColor:
        "color-mix(in srgb, var(--ml-surface-panel-raised) 86%, black)",
      border: "1px solid var(--ml-border-aged)",
      borderRadius: "3px",
      color: "var(--ml-ink-primary)",
    },
    formFieldLabel: {
      color: "var(--ml-ink-primary)",
      fontWeight: 600,
    },
    headerSubtitle: {
      color: "var(--ml-ink-muted)",
    },
    headerTitle: {
      color: "var(--ml-ink-primary)",
      fontFamily: "var(--font-display), Georgia, serif",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    },
    modalBackdrop: {
      backdropFilter: "blur(3px)",
      backgroundColor: "rgba(10, 8, 6, 0.82)",
    },
    modalCloseButton: {
      borderRadius: "3px",
      color: "var(--ml-ink-muted)",
    },
    modalContent: {
      borderRadius: "4px",
    },
    socialButtonsBlockButton: {
      backgroundColor:
        "color-mix(in srgb, var(--ml-surface-panel-raised) 82%, black)",
      border: "1px solid var(--ml-border-aged)",
      borderRadius: "3px",
      color: "var(--ml-ink-primary)",
    },
    userButtonAvatarBox: {
      height: "2rem",
      width: "2rem",
    },
    userButtonPopoverCard: {
      backgroundColor: "var(--ml-surface-panel-raised)",
      border: "1px solid var(--ml-border-aged)",
      borderRadius: "4px",
      color: "var(--ml-ink-primary)",
      boxShadow: "0 18px 60px rgba(0, 0, 0, 0.46)",
    },
    userButtonPopoverActionButton: {
      color: "var(--ml-ink-primary)",
    },
  },
  options: {
    logoPlacement: "none",
    socialButtonsPlacement: "bottom",
    socialButtonsVariant: "blockButton",
  },
} as const;
