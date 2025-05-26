"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typings_1 = require("../core/typings");
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const url = "https://raw.githubusercontent.com/tryforge/ForgeScript/dev/metadata/functions.json";
async function fetchFunctionNames() {
    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }
        const json = await res.json();
        const names = json.map((x) => x.name);
        return names;
    }
    catch (err) {
        throw new Error("Error fetching:" + err.message);
    }
}
async function loadTranslation(translationKey) {
    const filePath = path_1.default.resolve(__dirname, `../../translations/${translationKey}.json`);
    try {
        const content = await promises_1.default.readFile(filePath, "utf-8");
        const parsed = JSON.parse(content);
        console.log(`Loaded ${Object.keys(parsed).length} translations for ${translationKey}`);
        return parsed;
    }
    catch (err) {
        console.warn(`Failed to load translation file for ${translationKey} at ${filePath}: ${err.message}`);
        return {};
    }
}
const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    bold: "\x1b[1m",
};
function progressBar(percent, width = 20) {
    const filled = Math.round((percent / 100) * width);
    const empty = width - filled;
    return "█".repeat(filled) + "░".repeat(empty);
}
(async () => {
    const functionNames = await fetchFunctionNames();
    const totalFunctions = functionNames.length;
    console.log(`${colors.bold}Total ForgeScript Functions: ${totalFunctions}${colors.reset}\n`);
    for (const key in typings_1.ForgeIndiaTranslation) {
        const translationKey = typings_1.ForgeIndiaTranslation[key];
        const translationData = await loadTranslation(translationKey);
        const translatedCount = functionNames.filter((f) => Object.prototype.hasOwnProperty.call(translationData, f)).length;
        const percent = (translatedCount / totalFunctions) * 100;
        const bar = progressBar(percent, 20);
        console.log(`Translation: ${colors.green}${translationKey}${colors.reset}`);
        console.log(`Translated: ${translatedCount} / ${totalFunctions} (${colors.red}${percent.toFixed(2)}%${colors.reset})`);
        console.log(`Coverage:   ${colors.bold}${bar}${colors.reset}`);
        console.log("-".repeat(30));
    }
})();
//# sourceMappingURL=coverage.js.map