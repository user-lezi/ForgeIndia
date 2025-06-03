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

// Build metadata including aliases from hinglish.json if present
const metadataWithAliases: MetadataEntry[] = functionsData
  .map((func) => {
    const aliases = hinglishTranslations[func.name];
    if (!Array.isArray(aliases) || aliases.length === 0) return null;

    return {
      ...func,
      aliases,
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
  `✅ Metadata written with Hinglish aliases for ${metadataWithAliases.length} functions at: ${outputPath}`,
);
