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
  yellow: "\x1b[33m",
  bold: "\x1b[1m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
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
    const allAliases = new Set<string>();
    const aliasToOriginal: Record<string, string> = {};
    const lowerCaseMap = new Map<string, string>(); // For case sensitivity check

    for (fn in translationData) {
      line++;
      if (functionNames.includes(fn)) {
        translatedCount++;
      } else {
        console.log(
          `${colors.red}❌ [Line ${line}] Unknown ForgeScript function: ${fn}${colors.reset}`,
        );
        const suggestions = findTopSuggestions(fn, functionNames);
        if (suggestions.length) {
          console.log(
            `   🤔 Did you mean: ${colors.green}${suggestions.join(", ")}${colors.reset}?`,
          );
        }
      }

      const aliases = translationData[fn];
      for (const alias of aliases) {
        // Native conflict check
        if (functionNames.includes(alias)) {
          console.warn(
            `${colors.red}⚠️ Alias '${alias}' for '${colors.bold}${fn}${colors.reset}${colors.red}' in '${translationKey}' conflicts with native ForgeScript function.${colors.reset}`,
          );
        }

        // Duplicate alias check
        if (allAliases.has(alias)) {
          const original = aliasToOriginal[alias];
          console.warn(
            `${colors.yellow}⚠️ Duplicate alias '${alias}' of '${colors.bold}${fn}${colors.reset}${colors.yellow}' found in '${translationKey}'`,
          );
          console.warn(`   → Already used for: ${original}${colors.reset}`);
        } else {
          allAliases.add(alias);
          aliasToOriginal[alias] = fn;
        }

        // Case conflict check
        const lower = alias.toLowerCase();
        if (lowerCaseMap.has(lower) && lowerCaseMap.get(lower) !== alias) {
          console.warn(
            `${colors.magenta}⚠️ Case conflict: '${alias}' vs '${lowerCaseMap.get(lower)}' in '${translationKey}'${colors.reset}`,
          );
        } else {
          lowerCaseMap.set(lower, alias);
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

function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // deletion
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j - 1] + 1, // substitution
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function findTopSuggestions(
  input: string,
  candidates: string[],
  max = 3,
): string[] {
  return candidates
    .map((c) => ({ word: c, dist: levenshtein(input, c) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, max)
    .filter((x) => x.dist <= 3) // only keep relevant suggestions
    .map((x) => x.word);
}
