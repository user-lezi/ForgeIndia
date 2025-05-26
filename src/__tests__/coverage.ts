import { FITranslation, ForgeIndiaTranslation } from "../core/typings";
import path from "path";
import fs from "fs/promises";

// URL of the raw ForgeScript functions metadata JSON
const url =
  "https://raw.githubusercontent.com/tryforge/ForgeScript/dev/metadata/functions.json";

// ANSI color helpers
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  bold: "\x1b[1m",
};

/**
 * Fetch all native ForgeScript function names.
 */
export async function fetchFunctionNames(): Promise<`$${string}`[]> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
    }
    const json = await res.json();
    return json.map((x: any) => x.name) as `$${string}`[];
  } catch (err: any) {
    throw new Error("Error fetching: " + err.message);
  }
}

/**
 * Load translation JSON for a given translation key.
 */
export async function loadTranslation(
  translationKey: ForgeIndiaTranslation,
): Promise<FITranslation> {
  const filePath = path.resolve(
    __dirname,
    `../../translations/${translationKey}.json`,
  );
  try {
    const content = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(content);
    console.log(
      `${colors.green}✅ Loaded ${Object.keys(parsed).length} translations for '${translationKey}'${colors.reset}`,
    );
    return parsed;
  } catch (err: any) {
    console.warn(
      `${colors.red}⚠️ Failed to load '${translationKey}' at ${filePath}${colors.reset}`,
    );
    console.warn(`   Reason: ${err.message}\n`);
    return {};
  }
}

/**
 * Create a progress bar string.
 */
function progressBar(percent: number, width = 40): string {
  const filled = Math.round((percent / 100) * width);
  const empty = width - filled;
  return colors.green + "█".repeat(filled) + colors.reset + "░".repeat(empty);
}

(async () => {
  const functionNames = await fetchFunctionNames();
  const totalFunctions = functionNames.length;

  console.log(
    `\n${colors.bold}📜 Total ForgeScript functions: ${totalFunctions}${colors.reset}\n`,
  );

  for (const key in ForgeIndiaTranslation) {
    const translationKey =
      ForgeIndiaTranslation[key as keyof typeof ForgeIndiaTranslation];
    const translationData = await loadTranslation(translationKey);

    let translatedCount = 0;
    let line = 0;
    let fn: `$${string}`;

    for (fn in translationData) {
      line++;
      if (functionNames.includes(fn)) {
        translatedCount++;
      } else {
        console.log(
          `${colors.red}❌ [Line ${line}] Unknown ForgeScript function: ${fn}${colors.reset}`,
        );
        const suggestion = functionNames.find(
          (f) => f.toLowerCase() === fn.toLowerCase(),
        );
        if (suggestion) {
          console.log(
            `   🤔 Did you mean: ${colors.green}${suggestion}${colors.reset}?`,
          );
        }
      }
    }

    const percent = (translatedCount / totalFunctions) * 100;
    const bar = progressBar(percent);

    console.log(
      `${colors.bold}🈯 Translation: ${colors.green}${translationKey}${colors.reset}`,
    );
    console.log(`   Translated : ${translatedCount} / ${totalFunctions}`);
    console.log(
      `   Coverage   : ${colors.red}${percent.toFixed(2)}%${colors.reset}`,
    );
    console.log(`   Progress   : ${bar}`);
    console.log("-".repeat(50));
  }
})();
