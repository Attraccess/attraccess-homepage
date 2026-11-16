/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Umami host, e.g. `umami.example.org`. Analytics stays off when unset. */
  readonly VITE_UMAMI_HOST?: string;
  /** Umami website id. Analytics stays off when unset. */
  readonly VITE_UMAMI_WEBSITE_ID?: string;
  /** Renamed tracker script on the Umami instance (default `script.js`). */
  readonly VITE_UMAMI_SCRIPT?: string;
}
