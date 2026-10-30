import { motion } from "motion/react";
import styles from "./Hero.module.css";
import { BRAND } from "../siteConfig";
import { EASE } from "../lib/motion";
import { SignupForm } from "./SignupForm";
import { ReconConsole } from "./ReconConsole";

// Entrance: the message first, then the form, then the product — each a
// short fade-and-rise so nothing blocks reading or typing for long.
const enter = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: EASE, delay },
});

export function Hero() {
  return (
    <section className={styles.hero} id="top">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <motion.p className={styles.kicker} {...enter(0)}>
            <span className={styles.kickerTag}>Free early access</span>
            <span className={styles.kickerRule} aria-hidden="true" />
            <span className={styles.kickerFor}>For restaurant owners &amp; their accountants</span>
          </motion.p>

          <motion.h1 className={styles.headline} {...enter(0.06)}>
            Make sure Zomato and Swiggy <em>paid you</em> correctly.
          </motion.h1>

          <motion.p className={styles.lede} {...enter(0.12)}>
            Upload your Zomato and Swiggy payout reports. {BRAND} will recheck every commission, tax and
            deduction against your agreed rates, and show you only what doesn&rsquo;t match.
          </motion.p>

          <motion.div className={styles.signup} {...enter(0.18)}>
            <SignupForm source="hero" />
          </motion.div>

          <motion.a href="#how-it-works" className={styles.secondary} {...enter(0.24)}>
            See how it works <span aria-hidden="true">↓</span>
          </motion.a>
        </div>

        <motion.div
          className={styles.preview}
          initial={{ opacity: 0, y: 24, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
        >
          <ReconConsole />
        </motion.div>
      </div>
    </section>
  );
}
