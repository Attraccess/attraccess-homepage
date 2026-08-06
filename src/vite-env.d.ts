/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Matomo host, e.g. "analytics.attraccess.org". Analytics is off when unset. */
  readonly VITE_MATOMO_HOST?: string;
  /** Matomo site id, defaults to "1" */
  readonly VITE_MATOMO_SITE_ID?: string;
  /** renamed matomo.js, defaults to "not_matomo.js" */
  readonly VITE_MATOMO_SCRIPT?: string;
  /** renamed matomo.php, defaults to "matomo.php" */
  readonly VITE_MATOMO_TRACKER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
