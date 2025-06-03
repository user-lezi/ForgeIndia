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
const functionsPath = "src/functions.json";
const translationsPath = "./translations/hinglish.json";
const outputPath = "./metadata/functions.json";
const functionsData = JSON.parse(fs.readFileSync(functionsPath, "utf-8"));
const hinglishTranslations = JSON.parse(fs.readFileSync(translationsPath, "utf-8"));
const metadataWithAliases = functionsData
    .map((func) => {
    const aliases = hinglishTranslations[func.name];
    if (!Array.isArray(aliases) || aliases.length === 0)
        return null;
    const newName = aliases[0];
    return {
        ...func,
        name: newName,
        aliases,
    };
})
    .filter((entry) => entry !== null);
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}
fs.writeFileSync(outputPath, JSON.stringify(metadataWithAliases, null, 2), "utf-8");
console.log(`✅ Metadata written with updated names and Hinglish aliases for ${metadataWithAliases.length} functions at: ${outputPath}`);
//# sourceMappingURL=docgen.js.map