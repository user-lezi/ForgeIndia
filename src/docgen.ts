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

interface HinglishMap {
  [key: string]: string[];
}

interface MetadataEntry extends FunctionDef {
  aliases: string[];
}

const functionsPath = "src/functions.json";
const translationsPath = "./translations/hinglish.json";
const outputPath = "./metadata/functions.json";

// Load files
const functionsData: FunctionDef[] = JSON.parse(
  fs.readFileSync(functionsPath, "utf-8"),
);
const hinglishTranslations: HinglishMap = JSON.parse(
  fs.readFileSync(translationsPath, "utf-8"),
);

// Build metadata with first translation as name and rest as aliases
const metadataWithAliases: MetadataEntry[] = functionsData
  .map((func) => {
    const translations = hinglishTranslations[func.name];
    if (!Array.isArray(translations) || translations.length === 0) return null;

    const [translatedName, ...aliasList] = translations;

    return {
      ...func,
      name: translatedName,
      aliases: aliasList,
    };
  })
  .filter((entry): entry is MetadataEntry => entry !== null);

// Ensure output directory exists
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write output
fs.writeFileSync(
  outputPath,
  JSON.stringify(metadataWithAliases, null, 2),
  "utf-8",
);

console.log(
  `✅ Metadata written with translated names and aliases for ${metadataWithAliases.length} functions at: ${outputPath}`,
);
