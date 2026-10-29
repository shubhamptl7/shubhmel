import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import styles from "./ReconConsole.module.css";
import { BRAND } from "../siteConfig";
import { EASE, quick } from "../lib/motion";
import { formatPaise, formatSignedPaise } from "../lib/money";
import {
  AGREED_COMMISSION_PERCENT,
  CHECKED_ORDERS,
  SAMPLE_FILE,
  SUMMARY,
  type CheckedOrder,
} from "../data/sampleSettlement";

/*
  The hero's product preview: a sample settlement file imports, its order
  rows appear, each row is checked in turn, and the one that doesn't
  reconcile is flagged and opened. Every figure comes from
  data/sampleSettlement.ts (integer paise), so nothing on screen is a
  number that doesn't add up.

  Steps: 0 importing · 1 rows read · 2..n+1 checking row (step-2) · n+2 done.
  With reduced motion the preview starts at the final state.
*/
const COUNT = CHECKED_ORDERS.length;
const FINAL_STEP = COUNT + 2;
const FIRST_REVIEW = Math.max(0, CHECKED_ORDERS.findIndex((o) => o.needsReview));

function delayFor(step: number): number {
  if (step === 0) return 1300; // the import
  if (step === 1) return 450; // rows land, then checking begins
  return 340; // each row's check
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function ReconConsole() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [reduced] = useState(prefersReducedMotion);
  const [step, setStep] = useState(() => (prefersReducedMotion() ? FINAL_STEP : 0));
  const [selected, setSelected] = useState(FIRST_REVIEW);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!inView || step >= FINAL_STEP) return;
    const timer = window.setTimeout(() => setStep((s) => s + 1), delayFor(step) + (run === 0 && step === 0 ? 500 : 0));
    return () => window.clearTimeout(timer);
  }, [inView, step, run]);

  const done = step >= FINAL_STEP;
  const rowsVisible = step >= 1;
  const resolvedCount = Math.max(0, Math.min(COUNT, step - 1));

  function replay() {
    setSelected(FIRST_REVIEW);
    setRun((r) => r + 1);
    setStep(0);
  }

  const order = CHECKED_ORDERS[selected];

  return (
    <div ref={ref} className={styles.console} aria-label={`${BRAND} settlement review preview with sample data`}>
      <div className={styles.chrome}>
        <div className={styles.dots} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <span className={styles.chromeTitle}>{BRAND} · Settlement review</span>
        <span className={styles.sampleBadge}>Sample data</span>
      </div>

      <div className={styles.file}>
        <div className={styles.fileIcon} aria-hidden="true">
          XLSX
        </div>
        <div className={styles.fileText}>
          <span className={styles.fileName}>{SAMPLE_FILE}</span>
          <span className={styles.fileStatus} aria-live="polite">
            {step === 0
              ? "Reading settlement file…"
              : done
                ? `${COUNT} orders read · ${SUMMARY.matched} matched · ${SUMMARY.review} to review`
                : `${COUNT} orders read · checking against the agreement`}
          </span>
        </div>
      </div>
      <div className={styles.progress} aria-hidden="true">
        <motion.div
          key={run}
          className={styles.progressBar}
          initial={{ scaleX: reduced ? 1 : 0 }}
          animate={{ scaleX: step === 0 && inView ? 1 : step === 0 ? 0 : 1 }}
          transition={{ duration: reduced ? 0 : 1.2, ease: EASE }}
        />
      </div>

      <div className={styles.tableHead} aria-hidden="true">
        <span>Order</span>
        <span className={`${styles.num} ${styles.hideNarrow}`}>Expected</span>
        <span className={styles.num}>Settled</span>
        <span className={styles.num}>Status</span>
      </div>

      <ul className={styles.list} aria-label="Sample orders">
        {CHECKED_ORDERS.map((o, index) => {
          const resolved = index < resolvedCount;
          const status: "pending" | "matched" | "review" = !resolved
            ? "pending"
            : o.needsReview
              ? "review"
              : "matched";
          const isSelected = done && index === selected;
          return (
            <motion.li
              key={`${run}-${o.id}`}
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={rowsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
              transition={{ ...quick, delay: reduced ? 0 : index * 0.05 }}
            >
              <button
                type="button"
                className={`${styles.row} ${isSelected ? styles.selected : ""} ${o.needsReview && resolved ? styles.flagged : ""}`}
                onClick={() => done && setSelected(index)}
                aria-pressed={isSelected}
                aria-label={`Order ${o.id}, ${o.date}, settled ${formatPaise(o.settled.payout)}, ${status === "review" ? "needs review" : status}`}
                tabIndex={done ? 0 : -1}
              >
                <span className={styles.orderCell}>
                  <span className={styles.orderId}>{o.id}</span>
                  <span className={styles.orderDate}>{o.date}</span>
                </span>
                <span className={`${styles.amount} ${styles.hideNarrow}`}>{formatPaise(o.expected.payout)}</span>
                <span className={styles.amount}>{formatPaise(o.settled.payout)}</span>
                <StatusChip status={status} />
              </button>
            </motion.li>
          );
        })}
      </ul>

      <motion.div
        className={styles.summary}
        initial={false}
        animate={{ opacity: done ? 1 : 0.35 }}
        transition={quick}
      >
        <span className={styles.summaryItem}>
          <b>{done ? SUMMARY.orders : resolvedCount}</b>checked
        </span>
        <span className={styles.summaryItem}>
          <b>{done ? SUMMARY.matched : CHECKED_ORDERS.slice(0, resolvedCount).filter((o) => !o.needsReview).length}</b>
          matched
        </span>
        <span className={`${styles.summaryItem} ${styles.reviewCount}`}>
          <b>{done ? SUMMARY.review : CHECKED_ORDERS.slice(0, resolvedCount).filter((o) => o.needsReview).length}</b>
          to review
        </span>
        <span className={styles.summaryDiff}>
          Paid below expected
          <b>{done ? formatPaise(SUMMARY.differenceTotal) : "—"}</b>
        </span>
      </motion.div>

      <AnimatePresence mode="wait" initial={false}>
        {done && (
          <motion.div
            key={`${run}-${selected}`}
            className={styles.detail}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={quick}
          >
            <Detail order={order} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.footer}>
        <span>Illustrative figures — not a real restaurant's data.</span>
        {done && !reduced && (
          <button type="button" className={styles.replay} onClick={replay}>
            Replay
          </button>
        )}
      </div>
    </div>
  );
}

function StatusChip({ status }: { status: "pending" | "matched" | "review" }) {
  if (status === "pending") {
    return (
      <span className={`${styles.status} ${styles.pending}`}>
        <span className={styles.pulseDot} aria-hidden="true" />
        Checking
      </span>
    );
  }
  if (status === "matched") {
    return <span className={`${styles.status} ${styles.matched}`}>✓ Matched</span>;
  }
  return <span className={`${styles.status} ${styles.review}`}>● Review</span>;
}

function Detail({ order }: { order: CheckedOrder }) {
  const rows: { label: string; expected: number; settled: number; negative?: boolean }[] = [
    { label: "Order value", expected: order.expected.orderValue, settled: order.settled.orderValue },
    {
      label: `Commission (${AGREED_COMMISSION_PERCENT}% agreed${
        order.billedCommissionPercent !== AGREED_COMMISSION_PERCENT ? ` · ${order.billedCommissionPercent}% billed` : ""
      })`,
      expected: order.expected.commission,
      settled: order.settled.commission,
      negative: true,
    },
    { label: "GST on commission", expected: order.expected.gstOnCommission, settled: order.settled.gstOnCommission, negative: true },
    { label: "Payment gateway fee", expected: order.expected.gateway, settled: order.settled.gateway, negative: true },
    { label: "TDS", expected: order.expected.tds, settled: order.settled.tds, negative: true },
  ];

  return (
    <>
      <div className={styles.detailHead}>
        <span className={styles.detailTitle}>
          Order <span className="mono">{order.id}</span>
        </span>
        <span className={styles.detailNote}>
          {order.needsReview
            ? "Flagged for you to check against the agreement — not assumed to be an error."
            : "Every component matches the agreed rates."}
        </span>
      </div>
      <table className={styles.breakdown}>
        <thead>
          <tr>
            <th scope="col">Component</th>
            <th scope="col">Expected</th>
            <th scope="col">Settled</th>
            <th scope="col">Difference</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const diff = r.negative ? r.settled - r.expected : r.expected - r.settled;
            return (
              <tr key={r.label} className={diff !== 0 ? styles.differs : undefined}>
                <td>{r.label}</td>
                <td data-label="Expected">{r.negative ? `−${formatPaise(r.expected)}` : formatPaise(r.expected)}</td>
                <td data-label="Settled">{r.negative ? `−${formatPaise(r.settled)}` : formatPaise(r.settled)}</td>
                <td data-label="Difference">{diff === 0 ? "—" : formatSignedPaise(-diff)}</td>
              </tr>
            );
          })}
          <tr className={`${styles.total} ${order.difference !== 0 ? styles.differs : ""}`}>
            <td>Payout</td>
            <td data-label="Expected">{formatPaise(order.expected.payout)}</td>
            <td data-label="Settled">{formatPaise(order.settled.payout)}</td>
            <td data-label="Difference">{order.difference === 0 ? "—" : formatSignedPaise(-order.difference)}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
