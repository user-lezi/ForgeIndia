import * as fs from "fs";
import * as path from "path";

interface FunctionDef {
  name: string;
  version?: string;
  aliases: string[];
  description?: string;
  unwrap?: boolean;
  category?: string;
  [key: string]: any;
}
export type FITranslation = Record<string, string[]>;

interface MetadataEntry extends FunctionDef {
  aliases: string[];
}

// Constants
const forgeFunctionsURL =
  "https://raw.githubusercontent.com/tryforge/ForgeScript/dev/metadata/functions.json";
const translationsDir = "./translations";
const outputPath = "./metadata/functions.json";

// Utility to load and merge all translation files
function loadAllTranslations(): FITranslation {
  const files = fs
    .readdirSync(translationsDir)
    .filter((f) => f.endsWith(".json"));
  const merged: FITranslation = {};

  for (const file of files) {
    const content = fs.readFileSync(path.join(translationsDir, file), "utf-8");
    const json = JSON.parse(content) as FITranslation;

    for (const [fn, aliases] of Object.entries(json)) {
      if (!merged[fn]) merged[fn] = [];
      merged[fn].push(
        ...aliases.filter((alias) => !merged[fn].includes(alias)),
      );
    }
  }

  return merged;
}

// Main async function
(async () => {
  console.log("📦 Fetching functions from ForgeScript repo...");
  const response = await fetch(forgeFunctionsURL);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch functions: ${response.status} ${response.statusText}`,
    );
  }

  const functionsData: FunctionDef[] = await response.json();
  const allTranslations = loadAllTranslations();

  const metadataWithAliases: MetadataEntry[] = functionsData
    .map((func) => {
      const translations = allTranslations[func.name];
      if (!Array.isArray(translations) || translations.length === 0)
        return null;

      const [translatedName, ...aliasList] = translations;

      return {
        ...func,
        name: translatedName,
        aliases: aliasList,
      };
    })
    .filter((entry): entry is MetadataEntry => entry !== null);

  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(metadataWithAliases), "utf-8");

  console.log(
    `✅ Metadata written for ${metadataWithAliases.length} functions to: ${outputPath}`,
  );
})();
