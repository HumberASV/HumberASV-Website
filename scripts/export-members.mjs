/**
 * @file export-members.mjs
 *
 * @description
 * Exports the team roster workbook (data/team-members.xlsx) to src/data/team.json,
 * which the Team and Past Teams pages render. Run with `pnpm update:members`.
 *
 * Workbook layout:
 * - "Years" tab: Year | Current | Leads Banner | Team Banner. Exactly one row is Current.
 * - One tab per year, named after the year, with one row per member in display order.
 * Photo and banner cells are file names inside src/assets/team/<year>/.
 */
import ExcelJS from "exceljs";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WORKBOOK = path.join(root, "data", "team-members.xlsx");
const OUTPUT = path.join(root, "src", "data", "team.json");
const PHOTO_DIR = path.join(root, "src", "assets", "team");

const MEMBER_COLUMNS = [
  "Name", "Role", "Section", "Program", "Graduation Year", "Bio", "Skills",
  "LinkedIn", "GitHub", "Email", "Portfolio", "Blog", "Photo",
];
const YEAR_COLUMNS = ["Year", "Current", "Leads Banner", "Team Banner"];

const errors = [];
const warnings = [];

/** Reads a cell as trimmed text, unwrapping hyperlinks, rich text and formulas. */
function text(cell) {
  const v = cell.value;
  if (v == null) return "";
  if (typeof v === "object") {
    if ("hyperlink" in v) return String(v.hyperlink).replace(/^mailto:/i, "").trim();
    if ("result" in v) return String(v.result ?? "").trim();
  }
  return cell.text.trim();
}

function isTrue(cell) {
  const v = cell.value;
  if (typeof v === "boolean") return v;
  return ["true", "yes", "y", "x", "1"].includes(text(cell).toLowerCase());
}

/** Maps header names to column numbers, recording an error for any that are missing. */
function headerMap(sheet, required) {
  const map = {};
  sheet.getRow(1).eachCell((cell, col) => {
    map[text(cell).toLowerCase()] = col;
  });
  for (const name of required) {
    if (!map[name.toLowerCase()]) errors.push(`"${sheet.name}" tab is missing the "${name}" column`);
  }
  return (row, name) => row.getCell(map[name.toLowerCase()] ?? 0);
}

function checkFile(year, file, what) {
  if (file && !fs.existsSync(path.join(PHOTO_DIR, String(year), file))) {
    warnings.push(`${year}: ${what} "${file}" not found in src/assets/team/${year}/`);
  }
}

function readYear(sheet, year) {
  const col = headerMap(sheet, MEMBER_COLUMNS);
  const leads = [];
  const members = [];

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const get = (name) => text(col(row, name));
    const name = get("Name");
    if (!name) return;

    const section = get("Section").toLowerCase();
    if (section !== "leadership" && section !== "team") {
      errors.push(`${year} row ${rowNumber} (${name}): Section must be "Leadership" or "Team"`);
      return;
    }

    const grad = Number.parseInt(get("Graduation Year"), 10);
    const photo = get("Photo");
    checkFile(year, photo, `photo for ${name}`);

    const links = { linkedin: get("LinkedIn"), github: get("GitHub"), email: get("Email") };
    if (get("Portfolio")) links.portfolio = get("Portfolio");
    if (get("Blog")) links.blog = get("Blog");

    const member = {
      // Row-based so ids stay unique across both sections of a year.
      id: rowNumber - 2,
      name,
      role: get("Role"),
      program: get("Program"),
      ...(Number.isFinite(grad) && { graduationYear: grad }),
      bio: get("Bio"),
      skills: get("Skills").split(",").map((s) => s.trim()).filter(Boolean),
      links,
      photo,
    };
    (section === "leadership" ? leads : members).push(member);
  });

  return { leads, members };
}

const workbook = new ExcelJS.Workbook();
await workbook.xlsx.readFile(WORKBOOK);

const yearsSheet = workbook.getWorksheet("Years");
if (!yearsSheet) {
  console.error('error: workbook has no "Years" tab');
  process.exit(1);
}

const yearCol = headerMap(yearsSheet, YEAR_COLUMNS);
const years = [];
const current = [];

yearsSheet.eachRow((row, rowNumber) => {
  if (rowNumber === 1) return;
  const year = Number.parseInt(text(yearCol(row, "Year")), 10);
  if (!Number.isFinite(year)) return;

  const sheet = workbook.getWorksheet(String(year));
  if (!sheet) {
    errors.push(`Years lists ${year} but there is no "${year}" tab`);
    return;
  }
  if (isTrue(yearCol(row, "Current"))) current.push(year);

  const banners = {
    leads: text(yearCol(row, "Leads Banner")),
    team: text(yearCol(row, "Team Banner")),
  };
  checkFile(year, banners.leads, "leads banner");
  checkFile(year, banners.team, "team banner");

  years.push({ year, banners, ...readYear(sheet, year) });
});

if (current.length !== 1) {
  errors.push(
    `exactly one year must be marked Current on the Years tab (found ${current.length ? current.join(", ") : "none"})`,
  );
}

for (const w of warnings) console.warn(`warning: ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  console.error(`\n${OUTPUT} was not updated.`);
  process.exit(1);
}

years.sort((a, b) => b.year - a.year);
fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, JSON.stringify({ currentYear: current[0], years }, null, 2) + "\n");

const summary = years.map((y) => `${y.year} (${y.leads.length + y.members.length})`).join(", ");
console.log(`Exported ${summary} — current: ${current[0]} → ${path.relative(root, OUTPUT)}`);
