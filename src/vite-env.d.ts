/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "true" enables the /connect telemetry dashboard and the basestation probe on load. */
  readonly VITE_ENABLE_TELEMETRY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
