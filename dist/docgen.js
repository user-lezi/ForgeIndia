"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const forgeFunctionsURL = "https://raw.githubusercontent.com/tryforge/ForgeScript/dev/metadata/functions.json";
const translationsDir = "./translations";
const outputPath = "./metadata/functions.json";
function loadAllTranslations() {
    const files = fs
        .readdirSync(translationsDir)
        .filter((f) => f.endsWith(".json"));
    const merged = {};
    for (const file of files) {
        const content = fs.readFileSync(path.join(translationsDir, file), "utf-8");
        const json = JSON.parse(content);
        for (const [fn, aliases] of Object.entries(json)) {
            if (!merged[fn])
                merged[fn] = [];
            merged[fn].push(...aliases.filter((alias) => !merged[fn].includes(alias)));
        }
    }
    return merged;
}
(async () => {
    console.log("📦 Fetching functions from ForgeScript repo...");
    const response = await fetch(forgeFunctionsURL);
    if (!response.ok) {
        throw new Error(`Failed to fetch functions: ${response.status} ${response.statusText}`);
    }
    const functionsData = await response.json();
    const allTranslations = loadAllTranslations();
    const metadataWithAliases = functionsData
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
        .filter((entry) => entry !== null);
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(outputPath, JSON.stringify(metadataWithAliases), "utf-8");
    console.log(`✅ Metadata written for ${metadataWithAliases.length} functions to: ${outputPath}`);
})();
//# sourceMappingURL=docgen.js.map