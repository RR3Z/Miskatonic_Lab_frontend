import { createContext } from "react"

import type { SidebarStore } from "@/stores/ui/types/sidebar-store.types"

export const SidebarContext = createContext<SidebarStore | null>(null)
