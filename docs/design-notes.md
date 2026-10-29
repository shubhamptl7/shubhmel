# Shubhmel landing page — research memo and design decisions

Written 2026-10-29, before the redesign. Sources were opened and read in
this session; screenshots were taken with headless Chrome. ramp.com and
mercury.com did not render headlessly (likely bot protection), so they are
not used as evidence here.

## What was inspected

| Page | What it showed |
|---|---|
| menumetrics.in (home) | Dark charcoal + orange. Hero "Every brand's month, reconciled by the time you open it." Leads with restaurant operators ("For restaurant operators" badge); advisors are a secondary path ("I advise restaurants"). Never mentions accountants or Tally. Sample-labelled portfolio card in the hero. Trust: "We never sell your data", "No platform logins needed". CTA "Request access" + "Check a settlement free". |
| menumetrics.in/features/payout-reconciliation | "Every Swiggy and Zomato payout, rebuilt from the file". Explains reconciliation as a per-order equation; findings become claims to raise with the platform. No quantified claims. 4-step workflow on a vertical numbered line. |
| petpooja.com online-order reconciliation | White + red. "Online Order Reconciliation" — an add-on that compares aggregator payouts with Petpooja POS data. Problem framed as "Your sales said one thing. The payout said another." CTA "Take a demo". Audience is restaurant owners and their staff. |
| digits.com | Light pastel, large device mockup, "Accounting software — that works for you." Speaks to "business owners and accountants". Heavy social proof (logos, testimonial) — none of which an early product can honestly use. |
| attio.com | Very restrained light page: one big headline, two buttons, then a large real product window. Credibility comes from the product UI itself. |
| launchscaler.com / lighthouse.build waitlist guides | State the job and the person in the headline; show the real product (or a faithful preview); one email field; say exactly what joining gets you and what happens next; no fake counts; keep the FAQ short. |
| motion.dev React docs | `motion` package, `import { motion } from "motion/react"`; `initial` / `animate` / `whileInView` / `whileHover` / `whileTap`; `AnimatePresence` for exit; `MotionConfig reducedMotion="user"`; `useReducedMotion`. |
| W3C WCAG 2.2 SC 2.3.3 | Interaction-triggered motion must be disableable unless essential; honour `prefers-reduced-motion`; avoid non-essential parallax. |

## Decisions

1. **Audience and goal.** Primary: CA and bookkeeping firms that handle
   several restaurant clients. Secondary: restaurant operators. Goal: free
   early-access registration (email, optional role).
2. **Positioning.** The competitors speak to the restaurant owner. Nobody
   checked speaks to the accountant who does this for many clients and
   ends up in Tally. Shubhmel is positioned as the reconciliation desk for
   CA firms: check each settlement file, see only what needs review, hand
   the client a summary, export to Tally. Scope set by the owner
   (2026-10-29): early access covers Zomato *and* Swiggy, with one-click
   Tally export once the user confirms their ledger names. Everything is
   presented as *in development / in early access* — none of it is built
   yet, so nothing is advertised as live.
3. **Visual direction.** MenuMetrics owns dark charcoal + orange; Petpooja
   owns white + red; Digits owns pastel. Shubhmel uses a warm stone
   "ledger paper" surface, deep ink type, one ledger-green accent that
   also *means* "matched", and turmeric amber that means "needs review".
   One dark ink band gives the page rhythm. Typography: Schibsted Grotesk
   (editorial grotesk) and IBM Plex Mono for every rupee figure.
4. **Sections.** Nav · hero with inline signup and a live reconciliation
   preview · the problem (the accountant's week) · how it works (3 steps,
   dark band) · what it flags (interactive, labelled "planned check") ·
   who it's for (CA firms first) · where the build stands (honest status)
   · early access · FAQ · footer.
5. **Product visualization.** A working console component, not a
   screenshot: a sample settlement file imports, order rows appear, each
   row is checked, one row is flagged for review, and its breakdown shows
   the difference. All figures are computed from the same sample data in
   integer paise so the arithmetic is exact, and the panel is labelled
   "Sample data".
6. **Motion.** Sequenced hero entrance; the console's import → check →
   flag sequence; restrained section reveals; tab and accordion
   transitions; button press feedback. `MotionConfig reducedMotion="user"`
   plus a reduced-motion path that shows the console's final state
   immediately.
7. **Different from competitors.** Accountant-first and multi-client;
   honest build status instead of borrowed social proof; "flag for review"
   language instead of promising recovered money.
