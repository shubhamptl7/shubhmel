/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "netlify" on Netlify builds (set in netlify.toml); unset everywhere else. */
  readonly VITE_SIGNUP_PROVIDER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
