export declare enum ForgeIndiaTranslation {
    Hinglish = "hinglish"
}
export interface IForgeIndiaOptions {
    debug: boolean;
    translation: ForgeIndiaTranslation;
    exclude: `$${string}`[];
}
export type FITranslation = Record<`$${string}`, `$${string}`[]>;
//# sourceMappingURL=typings.d.ts.map