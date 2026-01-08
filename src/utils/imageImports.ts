// Create a new file: utils/imageImports.ts
interface ImageMap {
  [key: string]: string;
}

// Explicitly define all image imports with proper typing
export const imageImports: ImageMap = {
  // Team Leads
  "Ian Cameron - Team Principal.jpg":
    "/src/assets/Ian Cameron - Team Principal.jpg",
  "Dylan Turkson - Media Lead.jpg":
    "/src/assets/Dylan Turkson - Media Lead.jpg",
  "Emiliano Roriguez Flores - Electrical Lead.jpg":
    "/src/assets/Emiliano Roriguez Flores - Electrical Lead.jpg",
  "Amelia Soon - Software Lead.jpg":
    "/src/assets/Amelia Soon - Software Lead.jpg",
  "Harihara Raakulan - Mechanical Lead.jpg":
    "/src/assets/Harihara Raakulan - Mechanical Lead.jpg",

  // Team Members
  "Andrew Paley - Electrical.jpg": "/src/assets/Electrical - Andrew Paley.jpg",
  "Evan Sigl - Mechanical.jpg": "/src/assets/Mechanical - Evan Sigl.jpg",
  "Jabari Lira Leon - Mechanical.jpg":
    "/src/assets/Mechanical - Jabari Lira Leon.jpg",
  "Jordan Estrada - Mechanical.jpg":
    "/src/assets/Mechanical - Jordan Estrada.jpg",
  "Muhammad Desai - Media.jpg": "/src/assets/Media - Muhammad Desai.jpg",
  "Vinh Le - Media.jpg": "/src/assets/Media - Vinh Le.jpg",
  "Carson Fujita - Software.jpg": "/src/assets/Software - Carson Fujita.jpg",
  "Kunal Reddy - Software.jpg": "/src/assets/Software - Kunal Reddy.jpg",
  "Uday Chahal - Software.jpg": "/src/assets/Software - Uday Chahal.jpg",
} as const;

export type ImageKey = keyof typeof imageImports;

export const getImagePath = (key: ImageKey): string => {
  return imageImports[key];
};
