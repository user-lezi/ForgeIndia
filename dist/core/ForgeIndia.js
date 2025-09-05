"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeIndia = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const typings_1 = require("./typings");
class ForgeIndia extends forgescript_1.ForgeExtension {
    name = "ForgeIndia";
    description = require("../../package.json").description;
    version = require("../../package.json").version;
    options;
    constructor(opts = {}) {
        super();
        const exclude = (opts.exclude ?? []).map((name) => {
            const normalized = name.startsWith("$") ? name : `$${name}`;
            return normalized.toLowerCase();
        });
        this.options = {
            debug: Boolean(opts.debug),
            translation: opts.translation ?? typings_1.ForgeIndiaTranslation.Hinglish,
            exclude,
        };
    }
    init(client) {
        let translationFilePath = path_1.default.resolve(__dirname, `../../translations/${this.options.translation}.json`);
        if (!(0, fs_1.existsSync)(translationFilePath)) {
            forgescript_1.Logger.log(-1, 0, `Translation '${this.options.translation}' not found. Falling back to default: '${typings_1.ForgeIndiaTranslation.Hinglish}'.`);
            this.options.translation = typings_1.ForgeIndiaTranslation.Hinglish;
            translationFilePath = path_1.default.resolve(__dirname, `../../translations/${this.options.translation}.json`);
        }
        if (forgescript_1.FunctionManager.Functions.size > 0) {
            const extensions = client.options.extensions;
            const forgeIndiaIndex = extensions.findIndex((ext) => ext.name === this.name);
            const maxNameLength = Math.max(...extensions.map((ext) => ext.name.length));
            const extensionList = extensions
                .map((ext, index) => {
                const paddedName = ext.name.padEnd(maxNameLength, " ");
                if (index === forgeIndiaIndex) {
                    return `    ${paddedName}  ← Move to top`;
                }
                return `    ${paddedName}`;
            })
                .join("\n");
            forgescript_1.Logger.log(-1, 0, `ForgeIndia should be loaded before other extensions:\n${extensionList}`);
        }
        forgescript_1.FunctionManager.loadNative();
        const translations = require(translationFilePath);
        const translatedNativeFunctions = [];
        for (const [functionName, functionData] of Object.entries(translations.functions)) {
            const nativeFunc = forgescript_1.FunctionManager.get(functionName);
            if (nativeFunc &&
                !this.options.exclude.includes(nativeFunc.name.toLowerCase())) {
                if (functionData.description)
                    nativeFunc.data.description = functionData.description;
                if (functionData.args &&
                    functionData.args.length &&
                    nativeFunc.data.args &&
                    nativeFunc.data.args.length)
                    nativeFunc.data.args = nativeFunc.data.args.map((arg, index) => {
                        let translatedArg = functionData.args[index];
                        if (translatedArg) {
                            arg.name = translatedArg.name;
                            if (translatedArg.description)
                                arg.description = translatedArg.description;
                        }
                        return arg;
                    });
                translatedNativeFunctions.push(new forgescript_1.NativeFunction({
                    ...nativeFunc.data,
                    name: functionData.translated,
                    aliases: functionData.aliases ?? [],
                }));
            }
        }
        forgescript_1.FunctionManager.Functions.clear();
        forgescript_1.FunctionManager.addMany(...translatedNativeFunctions);
        if (this.options.debug) {
            forgescript_1.Logger.log(-1, 2, `Loaded ${translatedNativeFunctions.length} function translations.`);
        }
    }
}
exports.ForgeIndia = ForgeIndia;
//# sourceMappingURL=ForgeIndia.js.map