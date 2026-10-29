import styles from "./Footer.module.css";
import { BRAND, CONTACT_EMAIL } from "../siteConfig";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <strong>{BRAND}</strong>
          <span>Restaurant payout reconciliation for CA firms. In development.</span>
        </div>
        <ul className={styles.links}>
          <li>
            <a href="#how-it-works">How it works</a>
          </li>
          <li>
            <a href="#what-it-flags">What it flags</a>
          </li>
          <li>
            <a href="#faq">FAQ</a>
          </li>
          <li>
            <a href="#early-access">Get free early access</a>
          </li>
        </ul>
        <p className={styles.contact}>
          Questions? <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </div>
    </footer>
  );
}
