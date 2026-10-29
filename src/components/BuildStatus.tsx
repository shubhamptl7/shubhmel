import { motion } from "motion/react";
import styles from "./BuildStatus.module.css";
import { BRAND } from "../siteConfig";
import { EASE, rise, viewportOnce } from "../lib/motion";

type Status = "building";

// Kept in step with the product plan. If a status changes, change it here —
// this list is the page's only statement of what exists. Everything below
// is in the early-access build; none of it is live yet.
const ROADMAP: { title: string; detail: string; status: Status }[] = [
  {
    title: "Zomato and Swiggy settlement files",
    detail: "Order rows, deductions, adjustments and the platform's own printed totals, for both platforms.",
    status: "building",
  },
  {
    title: "Order-by-order checks",
    detail: "Commission, GST on commission and TDS recomputed at the agreed rates and compared with what settled.",
    status: "building",
  },
  {
    title: "Settlement summary",
    detail: "What was deducted, what settled, and what still needs a decision.",
    status: "building",
  },
  {
    title: "One-click Tally export",
    detail: "Tally-ready entries, unlocked once you confirm your ledger names. Sales already in your books are never posted again.",
    status: "building",
  },
];

const LABEL: Record<Status, string> = { building: "In early access" };

const RULES = [
  { title: "No guessed numbers", body: "Every figure traces back to a row and column in the file." },
  { title: "No silent rounding", body: "A total that doesn't tie is shown to you, never forced to balance." },
  { title: "No sales posted twice", body: "Sales already in your books are never entered again." },
];

export function BuildStatus() {
  return (
    <section className={styles.section} id="build-status" aria-labelledby="status-title">
      <div className={`container ${styles.grid}`}>
        <motion.div className={styles.heading} variants={rise} initial="hidden" whileInView="show" viewport={viewportOnce}>
          <span className="eyebrow">Where it stands</span>
          <h2 id="status-title">{BRAND} is in development. Here&rsquo;s exactly what that means.</h2>
          <p>
            No customer logos or borrowed numbers — the product is early, and you should know what
            exists before you sign up.
          </p>
        </motion.div>

        <div>
          <ul className={styles.roadmap}>
            {ROADMAP.map((item, i) => (
              <motion.li
                key={item.title}
                className={styles.item}
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.45, ease: EASE, delay: i * 0.05 }}
              >
                <strong>{item.title}</strong>
                <span className={`${styles.pill} ${styles[item.status]}`}>{LABEL[item.status]}</span>
                <p>{item.detail}</p>
              </motion.li>
            ))}
          </ul>

          <div className={styles.rules}>
            {RULES.map((rule) => (
              <div key={rule.title} className={styles.rule}>
                <strong>{rule.title}</strong>
                <span>{rule.body}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
