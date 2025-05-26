import { ForgeIndiaTranslation } from "../core/typings";
import { fetchFunctionNames, loadTranslation } from "./coverage";
import fs from "fs/promises";

(async () => {
  const functionNames = await fetchFunctionNames();
  const totalFunctions = functionNames.length;

  const MarkdownPath = "COVERAGE.md";
  const Markdown = await fs.readFile(MarkdownPath, "utf-8");

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
  const updatedMarkdown = Markdown.replace(
    /:\|\s+(\|[ a-z0-9%.]+){4}\|/i,
    ":|\n" + coverageRows.join("\n"),
  );
  await fs.writeFile(MarkdownPath, updatedMarkdown);

  console.log("✅ Updated coverage data in COVERAGE.md");
})();
