import { motion } from "motion/react";
import styles from "./Audience.module.css";
import { EASE, viewportOnce } from "../lib/motion";

const POINTS = [
  {
    title: "Every restaurant client's files in one place",
    body: "Each settlement filed under the right client and outlet, week after week.",
  },
  {
    title: "Only the rows that need a decision",
    body: "Matching orders stay out of the way. Flags come with the reason and the working.",
  },
  {
    title: "A summary to send, and one-click Tally export",
    body: "Confirm your ledger names once, then export Tally-ready entries for each settlement in one click.",
  },
];

export function Audience() {
  return (
    <section className={styles.section} aria-labelledby="audience-title">
      <div className={`container ${styles.grid}`}>
        <motion.div
          className={styles.primary}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <span className="eyebrow">Built first for</span>
          <h2 id="audience-title">CA and bookkeeping firms that handle restaurant clients.</h2>
          <p>
            If you reconcile Zomato and Swiggy payouts for several restaurants every month, this is
            being built around your week.
          </p>
          <ul className={styles.points}>
            {POINTS.map((p) => (
              <li key={p.title}>
                <span className={styles.tick} aria-hidden="true">
                  ✓
                </span>
                <div>
                  <strong>{p.title}</strong>
                  <span>{p.body}</span>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className={styles.secondary}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
        >
          <span className="eyebrow">Also useful for</span>
          <h3>Restaurant operators who check their own payouts</h3>
          <p>
            Run a restaurant or cloud kitchen and keep your own books? The same review works for your
            outlets. If your accountant does the books, they&rsquo;re the person to send this page to.
          </p>
          <a href="#early-access" className={styles.link}>
            Get free early access as an operator →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
