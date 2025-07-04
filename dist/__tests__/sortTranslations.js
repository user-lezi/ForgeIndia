"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const typings_1 = require("../core/typings");
const coverage_1 = require("./coverage");
(async () => {
    const functions = await (0, coverage_1.fetchFunctions)();
    const functionCategoryMap = new Map();
    const translationsJSON = [];
    functionCategoryMap.set("unknown", []);
    for (const key in typings_1.ForgeIndiaTranslation) {
        const translationKey = typings_1.ForgeIndiaTranslation[key];
        const translationData = await (0, coverage_1.loadTranslation)(translationKey);
        for (const nativeName of Object.keys(translationData)) {
            let native = functions.find((x) => x.name == nativeName);
            if (native) {
                let category = native.category;
                if (!functionCategoryMap.has(category))
                    functionCategoryMap.set(category, []);
                functionCategoryMap.get(category).push(native.name);
            }
            else {
                functionCategoryMap.get("unknown").push(nativeName);
            }
        }
        translationsJSON.push("{");
        functionCategoryMap.forEach((funcs, category) => {
            funcs.sort().forEach((func) => {
                translationsJSON.push(`\t"${func}": ["${translationData[func].shift()}"${translationData[func].length ? `, "${translationData[func].sort().join('", "')}"` : ""}],`);
            });
            translationsJSON.push("\t");
            console.log(`\tSorted ${funcs.length} functions with category '${category}'`);
        });
        translationsJSON.pop();
        translationsJSON[translationsJSON.length - 1] = translationsJSON[translationsJSON.length - 1].slice(0, -1);
        translationsJSON.push("}");
        (0, fs_1.writeFileSync)(`translations/${key}.json`, translationsJSON.join("\n"));
    }
})();
//# sourceMappingURL=sortTranslations.js.map