import type { Transition, Variants } from "motion/react";

// One easing curve and a small set of durations, used everywhere, so the
// page's motion reads as one system rather than many unrelated effects.
export const EASE = [0.22, 1, 0.36, 1] as const;

export const quick: Transition = { duration: 0.28, ease: EASE };
export const base: Transition = { duration: 0.6, ease: EASE };

// Sections rise a little and fade in once, as they enter the viewport.
export const rise: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: base },
};

export const viewportOnce = { once: true, amount: 0.25 } as const;
