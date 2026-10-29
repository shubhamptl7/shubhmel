import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import styles from "./Faq.module.css";
import { BRAND } from "../siteConfig";
import { EASE, rise, viewportOnce } from "../lib/motion";

const FAQS = [
  {
    q: `Who is ${BRAND} for?`,
    a: "CA and bookkeeping firms that reconcile Zomato and Swiggy payouts for restaurant clients. Restaurant operators who keep their own books can use it for their outlets too.",
  },
  {
    q: "Can I use it today?",
    a: `Not yet — ${BRAND} is in development. Early access covers both Zomato and Swiggy settlement files, and you'll try it on your own files as soon as it opens.`,
  },
  {
    q: "What will I need to provide?",
    a: "The settlement export you already download from the platform's partner portal, and the commission rate in the restaurant's agreement. You won't be asked for anyone's platform login.",
  },
  {
    q: "Is signing up free?",
    a: "Yes. Registering is free, and so is using it during early access. There's no card and no commitment.",
  },
  {
    q: "What happens after I register?",
    a: "We'll email you personally when the first version is ready to try. If you tell us your role, it helps us decide what to build first. That's it — no newsletter.",
  },
  {
    q: "How does the Tally export work?",
    a: "You confirm your ledger names once, per client. After that, each reviewed settlement exports as a Tally import file in one click, and you import it into Tally yourself. Sales already in your books are never posted again.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section className={styles.section} id="faq" aria-labelledby="faq-title">
      <div className={`container ${styles.grid}`}>
        <motion.div className={styles.heading} variants={rise} initial="hidden" whileInView="show" viewport={viewportOnce}>
          <span className="eyebrow">Questions</span>
          <h2 id="faq-title">Before you sign up</h2>
        </motion.div>

        <div className={styles.list}>
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            const panelId = `${baseId}-panel-${i}`;
            const buttonId = `${baseId}-button-${i}`;
            return (
              <div key={item.q} className={styles.item}>
                <h3 style={{ margin: 0 }}>
                  <button
                    id={buttonId}
                    type="button"
                    className={styles.question}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    {item.q}
                    <motion.span
                      className={styles.icon}
                      aria-hidden="true"
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25, ease: EASE }}
                    >
                      +
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className={styles.answerWrap}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                    >
                      <p className={styles.answer}>{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
