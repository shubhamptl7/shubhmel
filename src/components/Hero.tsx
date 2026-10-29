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
          <motion.span className={styles.announce} {...enter(0)}>
            <span className={styles.announceTag}>Free early access</span>
            Being built for CA firms with restaurant clients
          </motion.span>

          <motion.h1 className={styles.headline} {...enter(0.06)}>
            Check every Zomato and Swiggy payout <em>without</em> checking every row.
          </motion.h1>

          <motion.p className={styles.lede} {...enter(0.12)}>
            {BRAND} will read your Zomato and Swiggy settlement files, work out what each order should
            have paid at the agreed rates, and match it against what actually settled. You see only
            the rows that need a look, then export Tally-ready entries in one click.
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
