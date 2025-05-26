"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typings_1 = require("../core/typings");
const coverage_1 = require("./coverage");
const promises_1 = __importDefault(require("fs/promises"));
(async () => {
    const functionNames = await (0, coverage_1.fetchFunctionNames)();
    const totalFunctions = functionNames.length;
    const QueryLine = "## Coverage Summary";
    const MarkdownPath = "COVERAGE.md";
    const Markdown = await promises_1.default.readFile(MarkdownPath, "utf-8");
    const MarkdownLines = Markdown.split("\n");
    const QueryLineIndex = MarkdownLines.indexOf(QueryLine);
    const DataStartIndex = MarkdownLines.findIndex((line, index) => index > QueryLineIndex && line.startsWith("|--")) + 1;
    const coverageRows = [];
    for (const key in typings_1.ForgeIndiaTranslation) {
        const translationKey = typings_1.ForgeIndiaTranslation[key];
        const translationData = await (0, coverage_1.loadTranslation)(translationKey);
        const translatedCount = Object.keys(translationData).filter((func) => functionNames.includes(func)).length;
        const percent = ((translatedCount / totalFunctions) * 100).toFixed(2);
        coverageRows.push(`| ${translationKey} | ${translatedCount} | ${totalFunctions} | ${percent}% |`);
    }
    const before = MarkdownLines.slice(0, DataStartIndex);
    const after = MarkdownLines.slice(MarkdownLines.findIndex((line, idx) => idx > DataStartIndex && !line.startsWith("|")));
    const updatedMarkdown = [...before, ...coverageRows, "", ...after].join("\n");
    await promises_1.default.writeFile(MarkdownPath, updatedMarkdown);
    console.log("✅ Updated coverage data in COVERAGE.md");
})();
//# sourceMappingURL=coverage.md.js.map