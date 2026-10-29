import { useEffect, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import styles from "./HowItWorks.module.css";
import { EASE, rise, viewportOnce } from "../lib/motion";
import { formatPaise } from "../lib/money";
import { CHECKED_ORDERS, SAMPLE_FILE, SUMMARY } from "../data/sampleSettlement";

function useIsNarrow(query = "(max-width: 880px)") {
  const [narrow, setNarrow] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setNarrow(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return narrow;
}

export function HowItWorks() {
  const narrow = useIsNarrow();
  const preview = CHECKED_ORDERS.slice(2, 5);

  return (
    <section className={styles.section} id="how-it-works" aria-labelledby="how-title">
      <div className="container">
        <motion.div className={styles.head} variants={rise} initial="hidden" whileInView="show" viewport={viewportOnce}>
          <div>
            <span className="eyebrow">How it will work</span>
            <h2 id="how-title">Three steps from settlement file to entries in Tally.</h2>
          </div>
          <p>
            Early access covers Zomato and Swiggy settlement files from day one. You try the whole
            workflow on your own files: upload, review, summary and Tally export.
          </p>
        </motion.div>

        <div className={styles.track}>
          <div className={styles.line} aria-hidden="true">
            <motion.div
              className={styles.lineFill}
              initial={narrow ? { scaleY: 0 } : { scaleX: 0 }}
              whileInView={narrow ? { scaleY: 1 } : { scaleX: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
            />
          </div>

          <ol className={styles.steps}>
            <Step index={0} title="Bring in the report" body="Upload the settlement file exactly as you download it from the partner portal. No platform login needed.">
              <div className={styles.drop}>
                <span className={styles.chip}>▤ {SAMPLE_FILE}</span>
                <span className={styles.muted}>Zomato · Swiggy</span>
              </div>
            </Step>

            <Step
              index={1}
              title="Review only what doesn't match"
              body="Each order is recomputed at the agreed rates and matched against what settled. Matching rows stay out of your way; the rest are flagged with the reason."
            >
              {preview.map((o) => (
                <div key={o.id} className={styles.miniRow}>
                  <span>{o.id}</span>
                  <span className={o.needsReview ? styles.flag : styles.ok}>{o.needsReview ? "Review" : "Matched"}</span>
                </div>
              ))}
              <span className={styles.muted}>Sample rows</span>
            </Step>

            <Step
              index={2}
              title="Summarise, then export to Tally"
              body="A summary the restaurant owner can follow, and — once you've confirmed your ledger names — Tally-ready entries in one click."
            >
              <div className={styles.sumLine}>
                <span>Settled</span>
                <b>{formatPaise(SUMMARY.settledTotal)}</b>
              </div>
              <div className={styles.sumLine}>
                <span>Below expected</span>
                <b>{formatPaise(SUMMARY.differenceTotal)}</b>
              </div>
              <div className={styles.sumLine}>
                <span>Needs a decision</span>
                <b>{SUMMARY.review} order</b>
              </div>
              <span className={styles.tallyChip}>
                <span aria-hidden="true">↧</span> Export to Tally
                <span className={styles.tallyNote}>after you confirm ledger names</span>
              </span>
            </Step>
          </ol>
        </div>
      </div>
    </section>
  );
}

function Step({ index, title, body, children }: { index: number; title: string; body: string; children: ReactNode }) {
  return (
    <motion.li
      className={styles.step}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.15 + index * 0.18 }}
    >
      <span className={styles.badge}>{String(index + 1).padStart(2, "0")}</span>
      <h3>{title}</h3>
      <p>{body}</p>
      <div className={styles.vignette}>{children}</div>
    </motion.li>
  );
}
