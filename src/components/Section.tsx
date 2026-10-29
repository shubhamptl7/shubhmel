import type { ReactNode } from "react";
import { motion } from "motion/react";
import { rise, viewportOnce } from "../lib/motion";

type HeadingProps = {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  className?: string;
};

/** The shared section heading: eyebrow, title, optional intro, one reveal. */
export function SectionHeading({ eyebrow, title, intro, className }: HeadingProps) {
  return (
    <motion.div className={className} variants={rise} initial="hidden" whileInView="show" viewport={viewportOnce}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {intro && <p>{intro}</p>}
    </motion.div>
  );
}
