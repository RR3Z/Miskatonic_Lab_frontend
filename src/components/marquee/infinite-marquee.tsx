"use client";

import { motion, useReducedMotion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils/cn.util";

const defaultDurationSeconds = 26;

type InfiniteMarqueeProps = {
  "aria-label": string;
  className?: string;
  durationSeconds?: number;
  itemClassName?: string;
  items: readonly string[];
  separator?: React.ReactNode;
  trackClassName?: string;
  repeatCount?: number;
};

function MarqueeGroup({
  idPrefix,
  itemClassName,
  items,
  separator,
}: {
  idPrefix: string;
  itemClassName?: string;
  items: readonly string[];
  separator: React.ReactNode;
}) {
  const itemsWithIds = React.useMemo(() => {
    return items.map((item, index) => ({
      id: `${idPrefix}-item-${index}`,
      value: item,
    }));
  }, [items, idPrefix]);

  return (
    <div className="flex shrink-0 items-center">
      {itemsWithIds.map((itemObj) => (
        <div className="flex items-center pr-4" key={itemObj.id}>
          <span className={cn("whitespace-nowrap", itemClassName)}>
            {itemObj.value}
          </span>
          <span className="pl-4">{separator}</span>
        </div>
      ))}
    </div>
  );
}

export function InfiniteMarquee({
  "aria-label": ariaLabel,
  className,
  durationSeconds = defaultDurationSeconds,
  itemClassName,
  items,
  separator = (
    <span aria-hidden="true" className="text-current">
      ·
    </span>
  ),
  trackClassName,
  repeatCount = 4,
}: InfiniteMarqueeProps) {
  const shouldReduceMotion = useReducedMotion();

  const componentId = React.useId();
  const groupIds = React.useMemo(() => {
    return Array.from({ length: repeatCount }).map(
      (_, index) => `marquee-group-${componentId}-${index}`,
    );
  }, [repeatCount, componentId]);

  return (
    <section
      aria-label={ariaLabel}
      className={cn("w-full overflow-hidden", className)}
    >
      <motion.div
        animate={shouldReduceMotion ? { x: "0%" } : { x: "-50%" }}
        className={cn("flex w-max items-center", trackClassName)}
        data-testid="infinite-marquee-track"
        initial={{ x: "0%" }}
        transition={
          shouldReduceMotion
            ? undefined
            : {
                duration: durationSeconds,
                ease: "linear",
                repeat: Number.POSITIVE_INFINITY,
              }
        }
      >
        {groupIds.map((groupId) => (
          <MarqueeGroup
            key={groupId}
            idPrefix={groupId}
            itemClassName={itemClassName}
            items={items}
            separator={separator}
          />
        ))}
      </motion.div>
    </section>
  );
}
