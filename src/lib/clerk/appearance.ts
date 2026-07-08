export const userButtonCompactElements = {
  userButtonTrigger: {
    borderRadius: "999px",
    cursor: "pointer",
    outlineColor: "var(--ml-focus-ring)",
  },
  userButtonAvatarBox: {
    height: "2rem",
    width: "2rem",
  },
  userButtonPopoverCard: {
    backgroundColor: "var(--ml-surface-panel-raised)",
    border: "1px solid var(--ml-border-aged)",
    borderRadius: "4px",
    boxShadow: "0 14px 44px rgba(0, 0, 0, 0.44)",
    color: "var(--ml-ink-primary)",
    maxWidth: "17.5rem",
    minWidth: "16.25rem",
    overflow: "hidden",
    width: "17.5rem",
  },
  userButtonPopoverMain: {
    padding: "0.45rem 0",
  },
  userPreview: {
    gap: "0.65rem",
    padding: "0.75rem 0.85rem",
  },
  userPreviewAvatarBox: {
    height: "2.25rem",
    width: "2.25rem",
  },
  userPreviewMainIdentifier: {
    fontSize: "0.95rem",
    lineHeight: "1.1",
  },
  userPreviewSecondaryIdentifier: {
    color: "var(--ml-ink-muted)",
    fontSize: "0.78rem",
    lineHeight: "1.1",
  },
  userButtonPopoverActions: {
    padding: "0.25rem 0",
  },
  userButtonPopoverActionButton: {
    color: "var(--ml-ink-primary)",
    fontSize: "0.9rem",
    gap: "0.7rem",
    minHeight: "2.55rem",
    padding: "0 0.9rem",
  },
  userButtonPopoverActionButtonIcon: {
    height: "1rem",
    width: "1rem",
  },
  userButtonPopoverFooter: {
    padding: "0.65rem 0.85rem 0.75rem",
  },
} as const

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
    logoBox: {
      height: "3.1rem",
      justifyContent: "center",
      margin: "0 auto 0.85rem",
      width: "10.5rem",
    },
    logoImage: {
      height: "100%",
      objectFit: "contain",
      width: "100%",
    },
    socialButtonsBlockButton: {
      backgroundColor:
        "color-mix(in srgb, var(--ml-surface-panel-raised) 92%, var(--ml-accent-brass) 8%)",
      border:
        "1px solid color-mix(in srgb, var(--ml-border-aged) 78%, var(--ml-accent-brass) 22%)",
      borderRadius: "3px",
      color: "var(--ml-ink-primary)",
      boxShadow: "inset 0 0 0 1px rgba(214, 199, 145, 0.05)",
    },
    socialButtonsBlockButtonText: {
      color: "var(--ml-ink-primary)",
      fontWeight: 600,
    },
    ...userButtonCompactElements,
  },
  layout: {
    logoImageUrl: "/miskatonic-logo.webp",
    logoPlacement: "inside",
    logoLinkUrl: "/",
    socialButtonsPlacement: "bottom",
    socialButtonsVariant: "blockButton",
  },
} as const
