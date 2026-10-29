# Tallio — pre-launch landing page

A waitlist landing page for Tallio (Zomato/Swiggy → Tally payout reconciliation),
built with Vite + React + TypeScript, styled with CSS Modules and no UI
framework. Deploys as a static site; form submissions are captured by
**Netlify Forms** and emailed to you automatically — no backend, no
third-party signup beyond Netlify itself.

## Run it locally

```bash
npm install
npm run dev
```

**The waitlist form will not actually submit anywhere in local dev or on any
host other than Netlify.** Netlify Forms only exists once the site is
deployed there; `npm run dev` will show the "that didn't go through" error
state if you submit it, which is the correct, honest behaviour — it's not a
bug, there's genuinely nowhere for the submission to go yet.

## Deploy to Netlify (one-time setup)

1. Push this folder to a GitHub repo (or run `netlify deploy` from the
   Netlify CLI directly from this folder — either works).
2. In Netlify: **Add new site → Import an existing project**, point it at
   the repo. Build command and publish directory are already set in
   `netlify.toml` (`npm run build` → `dist`), so you shouldn't need to
   change anything in the Netlify UI.
3. Deploy. Netlify's build automatically detects the form (see "How the
   form capture works" below) — no separate step needed to register it.
4. **Turn on email notifications** (this part only you can do, from the
   dashboard, and it's the one manual step in this whole setup):
   `Forms → Submission notifications → Add notification → Email
   notification`, enter your email, save.
5. Submit the live form once yourself to confirm an email actually arrives,
   then check it shows up under **Forms** in the Netlify dashboard too.

Notification emails arrive from `formresponses@netlify.com`; because the
form includes an `email` field, replying to the notification goes to the
person who submitted it, not back to Netlify.

## How the form capture works

Netlify's build only detects forms by parsing the **built static HTML** —
a form rendered by React at runtime is invisible to it. So there are two
copies of the form:

- `index.html` has a hidden, plain-HTML twin of the form (never shown to a
  visitor, never touched by React) so Netlify's build can register it.
- `src/components/WaitlistForm.tsx` is the real, interactive form a visitor
  uses. On submit it POSTs the same field names to Netlify directly via
  `fetch`, following
  [Netlify's own documented pattern](https://docs.netlify.com/manage/forms/setup/).

If you ever add, rename or remove a field in `WaitlistForm.tsx`, make the
same change in the hidden form in `index.html` — the two have to match for
Netlify to accept the submission. A hidden honeypot field (`bot-field`) is
included per
[Netlify's spam-filter docs](https://docs.netlify.com/manage/forms/spam-filters/);
leave it alone.

## Deploying to Vercel instead

Vercel has no equivalent to Netlify Forms, so the form has nowhere to
submit to as built. The smallest change to make it work there: drop in a
free form backend like [Web3Forms](https://web3forms.com) or
[Formspree](https://formspree.io) (both need a one-time, no-password access
key emailed to you) and swap the `fetch("/", …)` call in
`WaitlistForm.tsx` for a POST to that provider's endpoint.

## Project structure

```
index.html              page shell + the hidden static form Netlify detects
src/
  siteConfig.ts          the one place the admin email and form name live
  styles/
    tokens.css           design tokens (colors, type, radii) — light + dark
    global.css           resets and a couple of shared utility classes
  components/
    Hero.tsx
    LedgerExample.tsx    the worked example — figures are computed, not
                          hardcoded separately, so they can't drift apart
    HowItWorks.tsx
    Principles.tsx
    Audience.tsx
    WaitlistForm.tsx     the real form + Netlify AJAX submission
    Footer.tsx
  App.tsx                assembles the sections
  main.tsx
```
