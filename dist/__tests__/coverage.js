"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchFunctions = fetchFunctions;
exports.fetchFunctionNames = fetchFunctionNames;
exports.loadTranslation = loadTranslation;
const typings_1 = require("../core/typings");
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
let done = false;
let functionsCache = null;
const url = "https://raw.githubusercontent.com/tryforge/ForgeScript/dev/metadata/functions.json";
const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    bold: "\x1b[1m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
};
async function fetchFunctions() {
    try {
        if (functionsCache)
            return functionsCache;
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }
        const json = await res.json();
        return (functionsCache = json);
    }
    catch (err) {
        throw new Error("Error fetching: " + err.message);
    }
}
async function fetchFunctionNames() {
    return (await fetchFunctions()).map((x) => x.name);
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
    if (done)
        return;
    done = true;
    const functionNames = await fetchFunctionNames();
    const totalFunctions = functionNames.length;
    console.log(`\n${colors.bold}📜 Total ForgeScript functions: ${totalFunctions}${colors.reset}\n`);
    for (const key in typings_1.ForgeIndiaTranslation) {
        const translationKey = typings_1.ForgeIndiaTranslation[key];
        const translationData = await loadTranslation(translationKey);
        let translatedCount = 0;
        let line = 0;
        let fn;
        const allAliases = new Set();
        const aliasToOriginal = {};
        const lowerCaseMap = new Map();
        for (fn in translationData) {
            line++;
            if (functionNames.includes(fn)) {
                translatedCount++;
            }
            else {
                console.log(`${colors.red}❌ [Line ${line}] Unknown ForgeScript function: ${fn}${colors.reset}`);
                const suggestions = findTopSuggestions(fn, functionNames);
                if (suggestions.length) {
                    console.log(`   🤔 Did you mean: ${colors.green}${suggestions.join(", ")}${colors.reset}?`);
                }
            }
            const aliases = translationData[fn];
            for (const alias of aliases) {
                if (functionNames.includes(alias)) {
                    console.warn(`${colors.red}⚠️ Alias '${alias}' for '${colors.bold}${fn}${colors.reset}${colors.red}' in '${translationKey}' conflicts with native ForgeScript function.${colors.reset}`);
                }
                if (allAliases.has(alias)) {
                    const original = aliasToOriginal[alias];
                    console.warn(`${colors.yellow}⚠️ Duplicate alias '${alias}' of '${colors.bold}${fn}${colors.reset}${colors.yellow}' found in '${translationKey}'`);
                    console.warn(`   → Already used for: ${original}${colors.reset}`);
                }
                else {
                    allAliases.add(alias);
                    aliasToOriginal[alias] = fn;
                }
                const lower = alias.toLowerCase();
                if (lowerCaseMap.has(lower) && lowerCaseMap.get(lower) !== alias) {
                    console.warn(`${colors.magenta}⚠️ Case conflict: '${alias}' vs '${lowerCaseMap.get(lower)}' in '${translationKey}'${colors.reset}`);
                }
                else {
                    lowerCaseMap.set(lower, alias);
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
function levenshtein(a, b) {
    const matrix = [];
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
            }
            else {
                matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + 1);
            }
        }
    }
    return matrix[b.length][a.length];
}
function findTopSuggestions(input, candidates, max = 3) {
    return candidates
        .map((c) => ({ word: c, dist: levenshtein(input, c) }))
        .sort((a, b) => a.dist - b.dist)
        .slice(0, max)
        .filter((x) => x.dist <= 3)
        .map((x) => x.word);
}
//# sourceMappingURL=coverage.js.map