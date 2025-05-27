import { FITranslation, ForgeIndiaTranslation } from "../core/typings";
import { INativeFunction } from "@tryforge/forgescript";
export declare function fetchFunctions(): Promise<(INativeFunction<any> & {
    category: string;
})[]>;
export declare function fetchFunctionNames(): Promise<`$${string}`[]>;
export declare function loadTranslation(translationKey: ForgeIndiaTranslation): Promise<FITranslation>;
//# sourceMappingURL=coverage.d.ts.map