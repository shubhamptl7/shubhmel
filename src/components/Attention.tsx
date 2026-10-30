import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import styles from "./Attention.module.css";
import { EASE, quick, rise, viewportOnce } from "../lib/motion";
import { formatPaise, formatSignedPaise } from "../lib/money";
import { AGREED_COMMISSION_PERCENT, CHECKED_ORDERS } from "../data/sampleSettlement";

type Line = { label: string; value: string; flag?: boolean; tag?: string };
type Case = { key: string; title: string; summary: string; body: string; sampleTitle: string; lines: Line[] };

const flagged = CHECKED_ORDERS.find((o) => o.needsReview) ?? CHECKED_ORDERS[0];
const commissionGap = flagged.settled.commission - flagged.expected.commission;
const gstGap = flagged.settled.gstOnCommission - flagged.expected.gstOnCommission;

// All sample figures are invented and labelled as such; the commission case
// is computed from the same sample order the hero console flags.
const CASES: Case[] = [
  {
    key: "commission",
    title: "Commission different from your agreement",
    summary: "Billed rate differs from the agreement",
    body: `Each order's commission is recomputed at the rate in the restaurant's agreement. If the platform billed a different rate, the order is flagged with both figures, so you can check the agreement before raising it.`,
    sampleTitle: `Order ${flagged.id}`,
    lines: [
      { label: `Commission at ${AGREED_COMMISSION_PERCENT}% (agreed)`, value: `−${formatPaise(flagged.expected.commission)}` },
      { label: `Commission at ${flagged.billedCommissionPercent}% (billed)`, value: `−${formatPaise(flagged.settled.commission)}` },
      { label: "Extra GST on the extra commission", value: formatSignedPaise(-gstGap) },
      { label: "Payout below expected", value: formatSignedPaise(-(commissionGap + gstGap)), flag: true },
    ],
  },
  {
    key: "outside",
    title: "Deductions outside your orders",
    summary: "Ads, supplies, earlier-week adjustments",
    body: "Some deductions don't belong to any order: ad campaigns, supplies bought through the platform, adjustments carried from previous weeks. They're listed on their own, so a supplies purchase is never mistaken for a platform fee.",
    sampleTitle: "This week's settlement",
    lines: [
      { label: "Ads campaign", value: "−₹1,500.00", tag: "expense" },
      { label: "Supplies bought through the platform", value: "−₹2,340.00", tag: "a purchase, not a fee" },
      { label: "Adjustment from an earlier week", value: "+₹180.00", tag: "carried forward" },
    ],
  },
  {
    key: "refunds",
    title: "Refunds worth checking",
    summary: "Shown against the order they belong to",
    body: "Customer refunds, complaint charges and cancellation penalties are shown against the order they came from, so you can confirm them with the restaurant rather than finding them buried in a total.",
    sampleTitle: "Order 7410027763",
    lines: [
      { label: "Order value", value: "₹598.00" },
      { label: "Customer refund (missing item)", value: "−₹240.00", flag: true, tag: "confirm with restaurant" },
    ],
  },
  {
    key: "unsettled",
    title: "Orders whose money hasn't arrived",
    summary: "Carried forward, not marked missing",
    body: "A settlement file can include orders the platform hasn't paid yet. These are kept as pending and matched when a later file settles them — never counted twice, and never reported as missing money.",
    sampleTitle: "Pending settlement",
    lines: [
      { label: "Order 7410211904 · 10 Aug", value: "₹638.00", tag: "pending" },
      { label: "Order 7410245518 · 10 Aug", value: "₹1,112.00", tag: "pending" },
    ],
  },
  {
    key: "totals",
    title: "Totals that don't add up",
    summary: "Shown, never rounded away",
    body: "The rows are added up and compared with the total the platform printed. If they disagree, the difference is shown to you — it is never quietly posted to a rounding line to make the numbers balance.",
    sampleTitle: "Batch check",
    lines: [
      { label: "Sum of order rows", value: "₹82,396.00" },
      { label: "Total printed in the file", value: "₹82,396.37" },
      { label: "Difference to explain", value: "₹0.37", flag: true },
    ],
  },
];

export function Attention() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = CASES[active];

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp" && event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const delta = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
    const next = (active + delta + CASES.length) % CASES.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <section className={styles.section} id="what-it-flags" aria-labelledby="flags-title">
      <div className="container">
        <motion.div className={styles.head} variants={rise} initial="hidden" whileInView="show" viewport={viewportOnce}>
          <span className="eyebrow">What it flags</span>
          <h2 id="flags-title">Every flag comes with the reason and the arithmetic.</h2>
          <p>
            These are the checks being built first. A flag means &ldquo;look at this&rdquo;, not
            &ldquo;the platform got it wrong&rdquo; — you decide what to raise.
          </p>
        </motion.div>

        <div className={styles.layout}>
          <div className={styles.tabs} role="tablist" aria-label="Checks" aria-orientation="vertical" onKeyDown={onKeyDown}>
            {CASES.map((c, i) => (
              <button
                key={c.key}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`flag-tab-${c.key}`}
                aria-selected={i === active}
                aria-controls="flag-panel"
                tabIndex={i === active ? 0 : -1}
                className={styles.tab}
                onClick={() => setActive(i)}
              >
                <span className={styles.tabIndex}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.tabTitle}>{c.title}</span>
                {i === active && (
                  <motion.span
                    layoutId="flag-marker"
                    className={styles.tabMarker}
                    transition={{ duration: 0.35, ease: EASE }}
                    aria-hidden="true"
                  />
                )}
              </button>
            ))}
          </div>

          <div className={styles.panel} role="tabpanel" id="flag-panel" aria-labelledby={`flag-tab-${current.key}`}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={quick}
                style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}
              >
                <div className={styles.panelTop}>
                  <span className="eyebrow">{current.summary}</span>
                  <span className={styles.planned}>Planned check · sample data</span>
                </div>
                <h3>{current.title}</h3>
                <p>{current.body}</p>
                <div className={styles.sample}>
                  <div className={styles.sampleHead}>
                    <span>{current.sampleTitle}</span>
                    <span>Sample</span>
                  </div>
                  {current.lines.map((line) => (
                    <div key={line.label} className={`${styles.line} ${line.flag ? styles.flag : ""}`}>
                      <span>
                        {line.label}
                        {line.tag && <span className={styles.tag}>· {line.tag}</span>}
                      </span>
                      <b>{line.value}</b>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
