"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typings_1 = require("../core/typings");
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const url = "https://raw.githubusercontent.com/tryforge/ForgeScript/dev/metadata/functions.json";
const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    bold: "\x1b[1m",
};
async function fetchFunctionNames() {
    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }
        const json = await res.json();
        return json.map((x) => x.name);
    }
    catch (err) {
        throw new Error("Error fetching: " + err.message);
    }
}
async function loadTranslation(translationKey) {
    const filePath = path_1.default.resolve(__dirname, `../../translations/${translationKey}.json`);
    try {
        const content = await promises_1.default.readFile(filePath, "utf-8");
        const parsed = JSON.parse(content);
        console.log(`${colors.green}✅ Loaded ${Object.keys(parsed).length} translations for '${translationKey}'${colors.reset}`);
        return parsed;
    }
    catch (err) {
        console.warn(`${colors.red}⚠️ Failed to load '${translationKey}' at ${filePath}${colors.reset}`);
        console.warn(`   Reason: ${err.message}\n`);
        return {};
    }
}
function progressBar(percent, width = 40) {
    const filled = Math.round((percent / 100) * width);
    const empty = width - filled;
    return colors.green + "█".repeat(filled) + colors.reset + "░".repeat(empty);
}
(async () => {
    const functionNames = await fetchFunctionNames();
    const totalFunctions = functionNames.length;
    console.log(`\n${colors.bold}📜 Total ForgeScript functions: ${totalFunctions}${colors.reset}\n`);
    for (const key in typings_1.ForgeIndiaTranslation) {
        const translationKey = typings_1.ForgeIndiaTranslation[key];
        const translationData = await loadTranslation(translationKey);
        let translatedCount = 0;
        let line = 0;
        let fn;
        for (fn in translationData) {
            line++;
            if (functionNames.includes(fn)) {
                translatedCount++;
            }
            else {
                console.log(`${colors.red}❌ [Line ${line}] Unknown ForgeScript function: ${fn}${colors.reset}`);
                const suggestion = functionNames.find((f) => f.toLowerCase() === fn.toLowerCase());
                if (suggestion) {
                    console.log(`   🤔 Did you mean: ${colors.green}${suggestion}${colors.reset}?`);
                }
            }
        }
        const percent = (translatedCount / totalFunctions) * 100;
        const bar = progressBar(percent);
        console.log(`${colors.bold}🈯 Translation: ${colors.green}${translationKey}${colors.reset}`);
        console.log(`   Translated : ${translatedCount} / ${totalFunctions}`);
        console.log(`   Coverage   : ${colors.red}${percent.toFixed(2)}%${colors.reset}`);
        console.log(`   Progress   : ${bar}`);
        console.log("-".repeat(50));
    }
})();
//# sourceMappingURL=coverage.js.map