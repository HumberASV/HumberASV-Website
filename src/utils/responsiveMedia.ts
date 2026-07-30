// Helpers for media resized to the MUI breakpoint widths (320/600/900/1200)
// stored under public/ as <base>_SmallPhone/_Phone/_Tablet/_Desktop.webp

const BREAKPOINT_SUFFIXES = [
  ["SmallPhone", 320],
  ["Phone", 600],
  ["Tablet", 900],
  ["Desktop", 1200],
] as const;

const responsiveSrcSet = (dir: string, base: string): string =>
  BREAKPOINT_SUFFIXES.map(([suffix, width]) => `${dir}/${base}_${suffix}.webp ${width}w`).join(", ");

export const photoSrc = (base: string): string => `/cards/photos/${base}_Phone.webp`;
export const photoSrcSet = (base: string): string => responsiveSrcSet("/cards/photos", base);

export const cutOutSrc = (base: string): string => `/cards/cut-outs/${base}_Phone.webp`;
export const cutOutSrcSet = (base: string): string => responsiveSrcSet("/cards/cut-outs", base);
