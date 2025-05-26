import { FITranslation, ForgeIndiaTranslation } from "../core/typings";
import path from "path";
import fs from "fs/promises";

// URL of the raw ForgeScript functions metadata JSON
const url =
  "https://raw.githubusercontent.com/tryforge/ForgeScript/dev/metadata/functions.json";

/**
 * Fetch all native ForgeScript function names.
 */
async function fetchFunctionNames(): Promise<`$${string}`[]> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
    }
    const json = await res.json();
    // `json` is an array of objects with a `name` property
    const names = json.map((x: any) => x.name);
    return names as `$${string}`[];
  } catch (err: any) {
    throw new Error("Error fetching:" + err.message);
  }
}

/**
 * Load translation JSON for given translation key.
 */
async function loadTranslation(
  translationKey: ForgeIndiaTranslation,
): Promise<Record<`$${string}`, `$${string}`[]>> {
  const filePath = path.resolve(
    __dirname,
    `../../translations/${translationKey}.json`,
  );
  try {
    const content = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(content);
    console.log(
      `Loaded ${Object.keys(parsed).length} translations for ${translationKey}`,
    );
    return parsed;
  } catch (err: any) {
    console.warn(
      `Failed to load translation file for ${translationKey} at ${filePath}: ${err.message}`,
    );
    return {};
  }
}

// ANSI color helpers
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  bold: "\x1b[1m",
};

function progressBar(percent: number, width = 20): string {
  const filled = Math.round((percent / 100) * width);
  const empty = width - filled;
  return "█".repeat(filled) + "░".repeat(empty);
}

(async () => {
  const functionNames = await fetchFunctionNames();
  const totalFunctions = functionNames.length;

  console.log(
    `${colors.bold}Total ForgeScript Functions: ${totalFunctions}${colors.reset}\n`,
  );

  for (const key in ForgeIndiaTranslation) {
    const translationKey =
      ForgeIndiaTranslation[key as keyof typeof ForgeIndiaTranslation];
    const translationData = await loadTranslation(translationKey);

    const translatedCount = functionNames.filter((f) =>
      Object.prototype.hasOwnProperty.call(translationData, f),
    ).length;

    const percent = (translatedCount / totalFunctions) * 100;
    const bar = progressBar(percent, 20);

    console.log(`Translation: ${colors.green}${translationKey}${colors.reset}`);
    console.log(
      `Translated: ${translatedCount} / ${totalFunctions} (${colors.red}${percent.toFixed(2)}%${colors.reset})`,
    );
    console.log(`Coverage:   ${colors.bold}${bar}${colors.reset}`);
    console.log("-".repeat(30));
  }
})();
