import { motion } from "motion/react";
import styles from "./Audience.module.css";
import { EASE, viewportOnce } from "../lib/motion";

const CARDS = [
  {
    key: "owner",
    eyebrow: "I own a restaurant",
    title: "Make sure you receive the right money.",
    body: "Zomato and Swiggy pay you one lump sum after deducting commission, taxes and charges. Shubhmel is being built to show you where each deduction came from and which ones don't match your agreement.",
    points: [
      "See what was deducted from each payout, in plain terms",
      "Spot a billed rate that differs from your agreement",
      "Know which orders haven't been settled yet",
    ],
    cta: "Get free early access as a restaurant owner",
  },
  {
    key: "ca",
    eyebrow: "I manage accounts for restaurants",
    title: "Check many clients' settlements without the hours.",
    body: "If you reconcile Zomato and Swiggy payouts for several restaurants every month, this is being built around your week.",
    points: [
      "Every client's files in one place, by outlet and week",
      "Only the rows that need a decision, each with the working",
      "A summary to send, and one-click Tally export once your ledger names are confirmed",
    ],
    cta: "Get free early access as an accountant",
  },
];

export function Audience() {
  return (
    <section className={styles.section} aria-labelledby="audience-title">
      <div className="container">
        <h2 id="audience-title" className="sr-only">
          Who Shubhmel is for
        </h2>
        <div className={styles.grid}>
          {CARDS.map((card, i) => (
            <motion.div
              key={card.key}
              className={styles.card}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.1 }}
            >
              <span className="eyebrow">{card.eyebrow}</span>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
              <ul className={styles.points}>
                {card.points.map((p) => (
                  <li key={p}>
                    <span className={styles.tick} aria-hidden="true">
                      ✓
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <a href="#early-access" className={styles.link}>
                {card.cta} →
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
