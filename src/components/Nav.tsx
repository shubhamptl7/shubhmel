import { useEffect, useState } from "react";
import { motion } from "motion/react";
import styles from "./Nav.module.css";
import { BRAND } from "../siteConfig";

const LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#what-it-flags", label: "What it flags" },
  { href: "#build-status", label: "Status" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(() => window.scrollY > 8);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
      <nav className={`container ${styles.inner}`} aria-label="Main">
        <a href="#top" className={styles.wordmark} aria-label={`${BRAND} home`}>
          <span className={styles.mark} aria-hidden="true">
            <span />
          </span>
          {BRAND}
        </a>
        <ul className={styles.links}>
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
        <motion.a href="#early-access" className={styles.cta} whileTap={{ scale: 0.97 }}>
          Get free early access
        </motion.a>
      </nav>
    </header>
  );
}
