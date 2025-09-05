export declare enum ForgeIndiaTranslation {
    Hinglish = "hinglish"
}
export declare const ForgeIndiaTranslations: readonly [ForgeIndiaTranslation];
export interface IForgeIndiaOptions {
    debug: boolean;
    translation: ForgeIndiaTranslation;
    exclude: `$${string}`[];
}
export interface FunctionTranslationEntry {
    translated: `$${string}`;
    aliases?: `$${string}`[];
    description?: string;
    args?: {
        name: string;
        description?: string;
    }[];
}
export type FunctionsTranslation = Record<`$${string}`, FunctionTranslationEntry>;
export interface ForgeIndiaTranslationJSON {
    functions: FunctionsTranslation;
}
//# sourceMappingURL=typings.d.ts.map