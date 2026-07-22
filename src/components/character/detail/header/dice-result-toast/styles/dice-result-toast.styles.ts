import type { CharacteristicCheckOutcome } from "@/lib/dice/characteristic-check"

export type DiceToastStyle = {
  accent: string
  borderColor: string
  closeButton: string
  muted: string
  ring: string
  toast: string
}

export const diceToastStyles: Record<
  CharacteristicCheckOutcome,
  DiceToastStyle
> = {
  critical_success: {
    accent: "text-[#ead99b]",
    borderColor: "#b6a367",
    closeButton: "bg-[#29251d]! text-[#ead99b]! hover:bg-[#383120]!",
    muted: "text-[#b7aa81]",
    ring: "border-[#b6a367]",
    toast:
      "border-[#b6a367]! bg-[linear-gradient(135deg,#3a3221,#211d18)]! shadow-[0_20px_48px_rgba(0,0,0,0.72)]!",
  },
  extreme_success: {
    accent: "text-[#d7cfae]",
    borderColor: "#9e9a75",
    closeButton: "bg-[#28261f]! text-[#d7cfae]! hover:bg-[#363329]!",
    muted: "text-[#aaa38c]",
    ring: "border-[#9e9a75]",
    toast:
      "border-[#9e9a75]! bg-[linear-gradient(135deg,#332f24,#211d18)]! shadow-[0_20px_48px_rgba(0,0,0,0.72)]!",
  },
  failure: {
    accent: "text-[#e2bfaa]",
    borderColor: "#9a6449",
    closeButton: "bg-[#2c211b]! text-[#e2bfaa]! hover:bg-[#3a2920]!",
    muted: "text-[#b49786]",
    ring: "border-[#9a6449]",
    toast:
      "border-[#9a6449]! bg-[linear-gradient(135deg,#35251e,#211d18)]! shadow-[0_20px_48px_rgba(0,0,0,0.72)]!",
  },
  fumble: {
    accent: "text-[#e7c0bc]",
    borderColor: "#8b211f",
    closeButton: "bg-[#301b1b]! text-[#e7c0bc]! hover:bg-[#422321]!",
    muted: "text-[#bc9490]",
    ring: "border-[#8b211f]",
    toast:
      "border-[#8b211f]! bg-[linear-gradient(135deg,#372020,#211d18)]! shadow-[0_20px_48px_rgba(0,0,0,0.74)]!",
  },
  hard_success: {
    accent: "text-[#c9d9c5]",
    borderColor: "#71846c",
    closeButton: "bg-[#202820]! text-[#c9d9c5]! hover:bg-[#2b352a]!",
    muted: "text-[#9da99a]",
    ring: "border-[#71846c]",
    toast:
      "border-[#71846c]! bg-[linear-gradient(135deg,#283027,#211d18)]! shadow-[0_20px_48px_rgba(0,0,0,0.72)]!",
  },
  regular_success: {
    accent: "text-[#c2d8c0]",
    borderColor: "#537653",
    closeButton: "bg-[#1d281e]! text-[#c2d8c0]! hover:bg-[#29352a]!",
    muted: "text-[#95a894]",
    ring: "border-[#537653]",
    toast:
      "border-[#537653]! bg-[linear-gradient(135deg,#263026,#211d18)]! shadow-[0_20px_48px_rgba(0,0,0,0.72)]!",
  },
}
