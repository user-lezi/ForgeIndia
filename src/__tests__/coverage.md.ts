import { ForgeIndiaTranslation } from "../core/typings";
import { fetchFunctionNames, loadTranslation } from "./coverage";
import fs from "fs/promises";

(async () => {
  const functionNames = await fetchFunctionNames();
  const totalFunctions = functionNames.length;

  const QueryLine = "## Coverage Summary";
  const MarkdownPath = "COVERAGE.md";
  const Markdown = await fs.readFile(MarkdownPath, "utf-8");
  const MarkdownLines = Markdown.split("\n");

  const QueryLineIndex = MarkdownLines.indexOf(QueryLine);
  const DataStartIndex =
    MarkdownLines.findIndex(
      (line, index) => index > QueryLineIndex && line.startsWith("|--"),
    ) + 1;

  const coverageRows: string[] = [];

  for (const key in ForgeIndiaTranslation) {
    const translationKey =
      ForgeIndiaTranslation[key as keyof typeof ForgeIndiaTranslation];
    const translationData = await loadTranslation(translationKey);
    const translatedCount = Object.keys(translationData).filter((func) =>
      functionNames.includes(func as `$${string}`),
    ).length;

    const percent = ((translatedCount / totalFunctions) * 100).toFixed(2);
    coverageRows.push(
      `| ${translationKey} | ${translatedCount} | ${totalFunctions} | ${percent}% |`,
    );
  }
  const before = MarkdownLines.slice(0, DataStartIndex);
  const after = MarkdownLines.slice(
    MarkdownLines.findIndex(
      (line, idx) => idx > DataStartIndex && !line.startsWith("|"),
    ),
  );

  const updatedMarkdown = [...before, ...coverageRows, "", ...after].join("\n");
  await fs.writeFile(MarkdownPath, updatedMarkdown);

  console.log("✅ Updated coverage data in COVERAGE.md");
})();
