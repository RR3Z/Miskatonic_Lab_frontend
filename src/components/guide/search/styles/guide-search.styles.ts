export const guideSearchStyles = {
  dropdown:
    "absolute top-full z-40 mt-2 w-full overflow-hidden rounded-md border border-(--ml-border-aged) bg-[linear-gradient(135deg,rgba(43,37,32,0.98),rgba(29,26,23,0.99))] shadow-[0_18px_50px_rgba(0,0,0,0.46),inset_0_1px_0_rgba(222,209,163,0.07)]",
  result:
    "group block rounded-sm border border-transparent bg-transparent px-3 py-2.5 transition-colors hover:border-(--ml-border-aged) hover:bg-[linear-gradient(90deg,rgba(182,163,103,0.12),transparent_72%)] focus-visible:border-(--ml-accent-brass-strong) focus-visible:bg-(--ml-surface-panel-raised) focus-visible:outline-none",
  scrollArea:
    "max-h-[min(30rem,calc(100svh-5rem))] [&_[data-slot=scroll-area-viewport]]:max-h-[min(30rem,calc(100svh-5rem))] [&_[data-slot=scroll-area-scrollbar]]:w-3 [&_[data-slot=scroll-area-scrollbar]]:border-l [&_[data-slot=scroll-area-scrollbar]]:border-(--ml-border-subtle) [&_[data-slot=scroll-area-scrollbar]]:bg-(--ml-bg-page)/80 [&_[data-slot=scroll-area-thumb]]:bg-(--ml-border-aged) [&_[data-slot=scroll-area-thumb]]:hover:bg-(--ml-accent-brass-strong)",
} as const
