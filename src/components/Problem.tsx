import { motion } from "motion/react";
import styles from "./Problem.module.css";
import { EASE, rise, viewportOnce } from "../lib/motion";

const TASKS = [
  {
    label: "Download",
    title: "A settlement report per platform, per client",
    body: "Weekly files from Zomato and Swiggy, each with its own columns, sheets and ways of showing a deduction.",
  },
  {
    label: "Line up",
    title: "Order rows against what reached the bank",
    body: "One lump payout, built from hundreds of orders. Matching them back by hand is spreadsheet work.",
  },
  {
    label: "Recompute",
    title: "Commission, GST on commission and TDS",
    body: "Checking that each was applied the way the restaurant's agreement says — row by row, with a calculator open.",
  },
  {
    label: "Find",
    title: "The charges that sit outside the order rows",
    body: "Ads, supplies bought through the platform, refunds and adjustments from earlier weeks, all netted out of the same payout.",
  },
  {
    label: "Explain",
    title: "The month, to an owner who wants one number",
    body: "Turning all of it into something the restaurant can read, and something you can actually enter in Tally.",
  },
];

// Four settlement files, fanning out as the section scrolls in: the same
// job, multiplied by every client you handle.
const SHEETS = [
  "zomato_settlement_01-07_Sep.xlsx",
  "swiggy_annexure_01-07_Sep.xlsx",
  "zomato_settlement_08-14_Sep.xlsx",
  "swiggy_annexure_08-14_Sep.xlsx",
];

export function Problem() {
  return (
    <section className={styles.section} aria-labelledby="problem-title">
      <div className={`container ${styles.grid}`}>
        <motion.div className={styles.heading} variants={rise} initial="hidden" whileInView="show" viewport={viewportOnce}>
          <span className="eyebrow">The work today</span>
          <h2 id="problem-title">The same reconciliation, again, for every restaurant client.</h2>
          <p>
            None of it is hard. All of it is slow, and a small difference on one order is easy to
            miss when it sits among a few hundred that are fine.
          </p>
          <div className={styles.stack} aria-hidden="true">
            {SHEETS.map((name, i) => (
              <motion.div
                key={name}
                className={styles.sheet}
                style={{ zIndex: SHEETS.length - i }}
                initial={{ x: 0, y: 0, rotate: 0 }}
                whileInView={{ x: i * 18, y: i * 16, rotate: i * -0.8 }}
                viewport={viewportOnce}
                transition={{ duration: 0.7, ease: EASE, delay: 0.15 + i * 0.06 }}
              >
                <i />
                <span className={styles.sheetName}>{name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div>
          <ol className={styles.tasks}>
            {TASKS.map((task, i) => (
              <motion.li
                key={task.label}
                className={styles.task}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, ease: EASE, delay: i * 0.04 }}
              >
                <span className={styles.taskLabel}>{task.label}</span>
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.body}</p>
                </div>
              </motion.li>
            ))}
          </ol>
          <p className={styles.repeat}>
            <span className={styles.repeatIcon} aria-hidden="true">
              ↻
            </span>
            Then open the next client&rsquo;s file and start again.
          </p>
        </div>
      </div>
    </section>
  );
}
