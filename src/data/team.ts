/**
 * @file team.ts
 *
 * @description
 * Team rosters by competition year, generated from data/team-members.xlsx by
 * `pnpm update:members`. Photo file names in the JSON are resolved here to bundled
 * image URLs from src/assets/team/<year>/.
 */
import teamJson from "./team.json";

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  /** Resolved image URL, or "" when the member has no photo. */
  image: string;
  bio: string;
  program: string;
  graduationYear?: number;
  links: {
    linkedin: string;
    github: string;
    email: string;
    portfolio?: string;
    blog?: string;
  };
  skills: string[];
}

export interface TeamYear {
  year: number;
  /** Resolved banner image URLs, or "" when the year has no photo for that banner. */
  banners: { leads: string; team: string };
  leads: TeamMember[];
  members: TeamMember[];
}

/** Shape of team.json as written by scripts/export-members.mjs: photos are file names. */
type RawMember = Omit<TeamMember, "image"> & { photo: string };
interface TeamData {
  currentYear: number;
  years: {
    year: number;
    banners: { leads: string; team: string };
    leads: RawMember[];
    members: RawMember[];
  }[];
}
const teamData: TeamData = teamJson;

// Keyed by "<year>/<file>", e.g. "2026/ian-cameron.jpg".
const photos = Object.fromEntries(
  Object.entries(
    import.meta.glob<string>("../assets/team/*/*.{jpg,jpeg,png,webp}", {
      eager: true,
      query: "?url",
      import: "default",
    }),
  ).map(([file, url]) => [file.replace("../assets/team/", ""), url]),
);

const resolve = (year: number, file: string) => (file ? (photos[`${year}/${file}`] ?? "") : "");

const toMember =
  (year: number) =>
  ({ photo, ...member }: RawMember): TeamMember => ({
    ...member,
    image: resolve(year, photo),
  });

/** Every archived year, newest first. */
export const teamYears: TeamYear[] = teamData.years.map((y) => ({
  year: y.year,
  banners: { leads: resolve(y.year, y.banners.leads), team: resolve(y.year, y.banners.team) },
  leads: y.leads.map(toMember(y.year)),
  members: y.members.map(toMember(y.year)),
}));

export const currentYear = teamData.currentYear;

export const getTeamYear = (year: number) => teamYears.find((y) => y.year === year);

/** The year shown on /team, pinned by the Current column of the workbook's Years tab. */
export const currentTeam = getTeamYear(currentYear)!;
