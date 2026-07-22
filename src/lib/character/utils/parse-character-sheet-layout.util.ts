import type { Layout } from "react-resizable-panels"

import {
  SECTIONS_PANEL_ID,
  SKILLS_PANEL_ID,
} from "@/lib/character/constants/character-sheet-layout.constants"

export function parseCharacterSheetLayout(value: string | null): Layout | null {
  if (!value) return null

  try {
    const layout = JSON.parse(value) as Partial<Layout>
    const skills = layout[SKILLS_PANEL_ID]
    const sections = layout[SECTIONS_PANEL_ID]

    if (
      typeof skills !== "number" ||
      typeof sections !== "number" ||
      skills < 45 ||
      skills > 68 ||
      sections < 32 ||
      sections > 55 ||
      Math.abs(skills + sections - 100) > 0.1
    ) {
      return null
    }

    return {
      [SKILLS_PANEL_ID]: skills,
      [SECTIONS_PANEL_ID]: sections,
    }
  } catch {
    return null
  }
}
