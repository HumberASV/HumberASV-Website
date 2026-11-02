/**
 * Telemetry is off unless VITE_ENABLE_TELEMETRY=true: probing the basestation's private IP
 * makes browsers show an "access other devices on your local network" prompt on every page.
 */
export const TELEMETRY_ENABLED = import.meta.env.VITE_ENABLE_TELEMETRY === "true";
