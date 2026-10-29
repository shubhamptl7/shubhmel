import { useId, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import styles from "./SignupForm.module.css";
import { CONTACT_EMAIL } from "../siteConfig";
import { quick } from "../lib/motion";
import { registerForEarlyAccess, validateEmail, type Role } from "../lib/signup";

type Props = {
  /** Recorded with the registration, so you can see which form converted. */
  source: "hero" | "closing";
  tone?: "light" | "dark";
};

type State =
  | { phase: "idle" }
  | { phase: "submitting" }
  | { phase: "ok" }
  | { phase: "duplicate" }
  | { phase: "not-connected" }
  | { phase: "error" };

const ROLES: { value: Role; label: string }[] = [
  { value: "ca_firm", label: "CA / accountant" },
  { value: "restaurant_operator", label: "Restaurant operator" },
  { value: "other", label: "Other" },
];

export function SignupForm({ source, tone = "light" }: Props) {
  const uid = useId();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("");
  const [botField, setBotField] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [state, setState] = useState<State>({ phase: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const problem = validateEmail(email);
    setFieldError(problem);
    if (problem) return;

    setState({ phase: "submitting" });
    const outcome = await registerForEarlyAccess({ email, role, source, botField });
    setState({ phase: outcome.kind });
  }

  const done = state.phase === "ok" || state.phase === "duplicate";
  const emailId = `${uid}-email`;
  const helpId = `${uid}-help`;
  const errorId = `${uid}-error`;

  return (
    <div className={`${tone === "dark" ? styles.onDark : ""}`}>
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.div
            key="done"
            className={`${styles.result} ${styles.ok}`}
            role="status"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={quick}
          >
            <span className={styles.resultIcon} aria-hidden="true">
              ✓
            </span>
            <div>
              <strong>{state.phase === "ok" ? "You're registered for early access." : "You're already registered."}</strong>
              <p>
                {state.phase === "ok"
                  ? "We'll email you personally when the first version is ready to try with your own settlement file."
                  : "This address is already on the early-access list from this browser — nothing more to do."}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            className={styles.form}
            onSubmit={handleSubmit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -6 }}
            transition={quick}
          >
            <label htmlFor={emailId} className="sr-only">
              Work email
            </label>
            <div className={`${styles.row} ${fieldError ? styles.invalid : ""}`}>
              <input
                id={emailId}
                className={styles.email}
                type="email"
                name="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@yourfirm.in"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldError) setFieldError(null);
                }}
                aria-invalid={fieldError ? true : undefined}
                aria-describedby={fieldError ? errorId : helpId}
              />
              <motion.button
                type="submit"
                className={styles.submit}
                disabled={state.phase === "submitting"}
                whileTap={{ scale: 0.97 }}
              >
                {state.phase === "submitting" && <span className={styles.spinner} aria-hidden="true" />}
                {state.phase === "submitting" ? "Registering…" : "Get free early access"}
              </motion.button>
            </div>

            <div className={styles.honeypot} aria-hidden="true">
              <label>
                Leave this empty
                <input
                  type="text"
                  name="bot-field"
                  tabIndex={-1}
                  autoComplete="off"
                  value={botField}
                  onChange={(e) => setBotField(e.target.value)}
                />
              </label>
            </div>

            <div className={styles.meta}>
              <fieldset className={styles.roleGroup}>
                <legend>I'm a</legend>
                {ROLES.map((option) => (
                  <label key={option.value} className={styles.roleOption}>
                    <input
                      type="radio"
                      name={`${uid}-role`}
                      value={option.value}
                      checked={role === option.value}
                      onChange={() => setRole(option.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </fieldset>
            </div>

            {fieldError ? (
              <p id={errorId} className={styles.error} role="alert">
                {fieldError}
              </p>
            ) : (
              <p id={helpId} className={styles.help}>
                Free early access — no card, no cost. Role is optional.
              </p>
            )}

            {state.phase === "not-connected" && (
              <div className={`${styles.result} ${styles.warn}`} role="alert">
                <span className={styles.resultIcon} aria-hidden="true">
                  !
                </span>
                <div>
                  <strong>Signup isn't connected on this copy of the site.</strong>
                  <p>
                    Nothing was saved. Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and
                    we'll add you by hand.
                  </p>
                </div>
              </div>
            )}

            {state.phase === "error" && (
              <div className={`${styles.result} ${styles.warn}`} role="alert">
                <span className={styles.resultIcon} aria-hidden="true">
                  !
                </span>
                <div>
                  <strong>That didn't go through, so you're not registered yet.</strong>
                  <p>
                    Try again in a moment, or email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                  </p>
                </div>
              </div>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
