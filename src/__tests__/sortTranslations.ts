import { writeFileSync } from "fs";
import { ForgeIndiaTranslation } from "../core/typings";
import { fetchFunctions, loadTranslation } from "./coverage";

(async () => {
  const functions = await fetchFunctions();
  const functionCategoryMap = new Map<string, `$${string}`[]>();
  const translationsJSON: string[] = [];

  for (const key in ForgeIndiaTranslation) {
    const translationKey =
      ForgeIndiaTranslation[key as keyof typeof ForgeIndiaTranslation];
    const translationData = await loadTranslation(translationKey);

    for (const nativeName of Object.keys(translationData)) {
      let native = functions.find((x) => x.name == nativeName);
      if (native) {
        let category = native.category;
        if (!functionCategoryMap.has(category))
          functionCategoryMap.set(category, []);
        functionCategoryMap.get(category)!.push(native.name);
      }
    }

    translationsJSON.push("{");
    functionCategoryMap.forEach((funcs, category) => {
      funcs.sort().forEach((func) => {
        translationsJSON.push(
          `\t"${func}": ["${translationData[func].shift()}"${translationData[func].length ? `, "${translationData[func].sort().join('", "')}"` : ""}],`,
        );
      });
      translationsJSON.push("\t");
      console.log(
        `\tSorted ${funcs.length} functions with category '${category}'`,
      );
    });
    translationsJSON.pop();
    translationsJSON[translationsJSON.length - 1] = translationsJSON[
      translationsJSON.length - 1
    ].slice(0, -1);
    translationsJSON.push("}");

    writeFileSync(`translations/${key}.json`, translationsJSON.join("\n"));
  }
})();
