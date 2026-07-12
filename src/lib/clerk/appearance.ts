const clerkInteractiveState = {
  backgroundColor: "var(--ml-clerk-hover-bg)",
  borderColor: "var(--ml-clerk-hover-border)",
  color: "var(--ml-clerk-hover-fg)",
} as const

const clerkInteractiveElement = {
  color: "var(--ml-ink-primary)",
  transition:
    "background-color 160ms ease, border-color 160ms ease, color 160ms ease",
  "&:hover": clerkInteractiveState,
  "&:focus-visible": clerkInteractiveState,
} as const

const clerkIconElement = {
  color: "currentColor",
} as const

const clerkActionElement = {
  ...clerkInteractiveElement,
  fontSize: "0.9rem",
  gap: "0.7rem",
  minHeight: "2.55rem",
  padding: "0 0.9rem",
} as const

const clerkDangerElement = {
  color: "var(--ml-clerk-danger)",
  "&:hover": {
    backgroundColor: "var(--ml-clerk-danger-bg)",
    borderColor: "var(--ml-clerk-danger-border)",
    color: "var(--ml-clerk-danger)",
  },
  "&:focus-visible": {
    backgroundColor: "var(--ml-clerk-danger-bg)",
    borderColor: "var(--ml-clerk-danger-border)",
    color: "var(--ml-clerk-danger)",
  },
} as const

const clerkBadgeElement = {
  backgroundColor: "var(--ml-clerk-badge-bg)",
  border: "1px solid var(--ml-clerk-badge-border)",
  boxShadow: "none",
  color: "var(--ml-clerk-badge-fg)",
  fontWeight: 600,
} as const

export const userButtonCompactElements = {
  userButtonTrigger: {
    borderRadius: "999px",
    cursor: "pointer",
    outlineColor: "var(--ml-focus-ring)",
    "&:hover": {
      boxShadow: "0 0 0 2px var(--ml-clerk-hover-border)",
    },
    "&:focus-visible": {
      boxShadow: "0 0 0 2px var(--ml-focus-ring)",
    },
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
  userButtonPopoverActionButton: clerkActionElement,
  userButtonPopoverActionButtonIconBox: clerkIconElement,
  userButtonPopoverActionButtonIcon: {
    ...clerkIconElement,
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
    colorDanger: "var(--ml-clerk-danger)",
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
    button: {
      '&[data-color="danger"]': clerkDangerElement,
      '&[data-variant="ghost"]': clerkInteractiveElement,
      '&[data-variant="outline"]': clerkInteractiveElement,
      '&[data-variant="bordered"]': clerkInteractiveElement,
    },
    card: {
      background:
        "linear-gradient(180deg, var(--ml-surface-panel-raised), var(--ml-surface-panel))",
      border: "1px solid var(--ml-border-aged)",
      boxShadow: "0 24px 80px rgba(0, 0, 0, 0.48)",
      color: "var(--ml-ink-primary)",
    },
    accountSwitcherActionButton: clerkActionElement,
    accountSwitcherActionButtonIcon: clerkIconElement,
    alternativeMethodsBlockButton: {
      ...clerkInteractiveElement,
      border:
        "1px solid color-mix(in srgb, var(--ml-border-aged) 78%, var(--ml-accent-brass) 22%)",
      borderRadius: "3px",
    },
    alternativeMethodsBlockButtonText: {
      color: "currentColor",
      fontWeight: 600,
    },
    badge: clerkBadgeElement,
    footerActionLink: {
      color: "var(--ml-accent-brass-strong)",
      "&:hover": {
        color: "var(--ml-clerk-hover-fg)",
      },
      "&:focus-visible": {
        color: "var(--ml-clerk-hover-fg)",
      },
    },
    formButtonPrimary: {
      backgroundColor: "var(--ml-accent-brass-strong)",
      borderRadius: "3px",
      color: "var(--ml-ink-on-paper)",
      fontWeight: 600,
    },
    formButtonReset: clerkInteractiveElement,
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
    lastAuthenticationStrategyBadge: clerkBadgeElement,
    headerTitle: {
      color: "var(--ml-ink-primary)",
      fontFamily: "var(--font-display), Georgia, serif",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    },
    menuItem: clerkInteractiveElement,
    menuButton: {
      ...clerkInteractiveElement,
      backgroundColor:
        "color-mix(in srgb, var(--ml-surface-panel-raised) 88%, transparent)",
      border: "1px solid var(--ml-border-aged)",
      borderRadius: "3px",
      minHeight: "2.25rem",
      minWidth: "2.25rem",
    },
    modalBackdrop: {
      backdropFilter: "blur(3px)",
      backgroundColor: "rgba(10, 8, 6, 0.82)",
    },
    modalCloseButton: {
      ...clerkInteractiveElement,
      borderRadius: "3px",
    },
    modalContent: {
      borderRadius: "4px",
    },
    navbarButton: clerkInteractiveElement,
    navbarButtonIcon: clerkIconElement,
    notificationBadge: clerkBadgeElement,
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
    organizationSwitcherPopoverActionButton: clerkActionElement,
    organizationSwitcherPopoverActionButtonIcon: clerkIconElement,
    paymentAttemptHeaderBadge: clerkBadgeElement,
    paymentMethodRowBadge: clerkBadgeElement,
    planDetailBadge: clerkBadgeElement,
    pricingTableCardBadge: clerkBadgeElement,
    pricingTableMatrixBadge: clerkBadgeElement,
    profileSectionButtonGroup: {
      justifyContent: "center",
      width: "100%",
    },
    profileSectionItem: {
      backgroundColor: "transparent",
      border: "none",
      minHeight: "3rem",
      padding: "0.55rem 0.65rem",
    },
    profileSectionPrimaryButton: {
      ...clerkInteractiveElement,
      backgroundColor:
        "color-mix(in srgb, var(--ml-surface-panel-raised) 88%, transparent)",
      border: "1px solid var(--ml-border-aged)",
      borderRadius: "3px",
      color: "var(--ml-accent-brass-strong)",
      fontWeight: 600,
      justifyContent: "center",
      minHeight: "2.5rem",
      padding: "0.5rem 0.75rem",
    },
    profileSectionTitleText: {
      color: "var(--ml-ink-primary)",
      fontWeight: 600,
    },
    selectOption: clerkInteractiveElement,
    socialButtonsBlockButton: {
      ...clerkInteractiveElement,
      backgroundColor:
        "color-mix(in srgb, var(--ml-surface-panel-raised) 92%, var(--ml-accent-brass) 8%)",
      border:
        "1px solid color-mix(in srgb, var(--ml-border-aged) 78%, var(--ml-accent-brass) 22%)",
      borderRadius: "3px",
      boxShadow: "inset 0 0 0 1px rgba(214, 199, 145, 0.05)",
    },
    socialButtonsBlockButtonText: {
      color: "currentColor",
      fontWeight: 600,
    },
    statementHeaderBadge: clerkBadgeElement,
    tabButton: clerkInteractiveElement,
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
