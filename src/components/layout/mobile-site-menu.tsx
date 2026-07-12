"use client"

import { Menu, X } from "lucide-react"

import { MobileUserControls } from "@/components/auth/mobile-user-controls"
import { MobileSiteFooter } from "@/components/layout/site-footer"
import { SiteNavigation } from "@/components/layout/site-navigation"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { landingContent } from "@/lib/content/landing.content"

type MobileSiteMenuProps = {
  onOpenChange: (open: boolean) => void
  open: boolean
  pathname: string | null
}

export function MobileSiteMenu({
  onOpenChange,
  open,
  pathname,
}: MobileSiteMenuProps) {
  const closeMenu = () => onOpenChange(false)

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetTrigger asChild>
        <Button
          aria-label="Открыть меню"
          className="sm:hidden"
          size="icon-lg"
          variant="ghost"
        >
          <Menu aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent className="p-5 sm:hidden" showCloseButton={false}>
        <div className="flex items-center justify-between gap-4 border-b border-[var(--ml-border-aged)] pb-4">
          <SheetTitle className="font-display text-xl tracking-wide">
            Меню
          </SheetTitle>
          <SheetClose asChild>
            <Button aria-label="Закрыть меню" size="icon-lg" variant="ghost">
              <X aria-hidden="true" />
            </Button>
          </SheetClose>
        </div>
        <div className="mt-4 border-b border-[var(--ml-border-aged)] pb-4">
          <MobileUserControls
            onNavigate={closeMenu}
            signInLabel={landingContent.header.signIn}
          />
        </div>
        <div className="mt-4">
          <SiteNavigation
            onNavigate={closeMenu}
            pathname={pathname}
            variant="mobile"
          />
        </div>
        <div className="mt-auto">
          <MobileSiteFooter />
        </div>
      </SheetContent>
    </Sheet>
  )
}
