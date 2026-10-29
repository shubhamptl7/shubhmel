import { motion } from "motion/react";
import styles from "./EarlyAccess.module.css";
import { BRAND } from "../siteConfig";
import { EASE, viewportOnce } from "../lib/motion";
import { SignupForm } from "./SignupForm";

const BENEFITS = [
  `Free access while ${BRAND} is in early access.`,
  "Try each part on your own settlement files as it becomes ready.",
  "A direct line to the people building it — your files shape what gets checked first.",
];

export function EarlyAccess() {
  return (
    <section className={styles.section} id="early-access" aria-labelledby="early-title">
      <div className="container">
        <motion.div
          className={styles.panel}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className={styles.copy}>
            <span className="eyebrow">Free early access</span>
            <h2 id="early-title">Get free early access to {BRAND}.</h2>
            <p>Be one of the first firms to reconcile with it — no card, no cost while it&rsquo;s in early access.</p>
            <ul className={styles.benefits}>
              {BENEFITS.map((b) => (
                <li key={b}>
                  <span aria-hidden="true">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <p className={styles.next}>
              <strong>What happens next:</strong> we&rsquo;ll email you personally when the first
              version is ready to try. No newsletter, no sales calls you didn&rsquo;t ask for.
            </p>
          </div>

          <div className={styles.formSide}>
            <h3>Register free with your work email</h3>
            <SignupForm source="closing" tone="dark" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
