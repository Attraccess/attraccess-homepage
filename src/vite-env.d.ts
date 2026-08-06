/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Umami host, e.g. "umami.apps.janjaap.de". Analytics is off when unset. */
  readonly VITE_UMAMI_HOST?: string;
  /** Umami website id (uuid). Analytics is off when unset. */
  readonly VITE_UMAMI_WEBSITE_ID?: string;
  /** renamed script.js, defaults to "script.js" */
  readonly VITE_UMAMI_SCRIPT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
