import { ForgeExtension, ForgeClient } from "@tryforge/forgescript";
import { IForgeIndiaOptions } from "./typings";
export declare class ForgeIndia extends ForgeExtension {
    name: string;
    description: string;
    version: string;
    readonly options: IForgeIndiaOptions;
    constructor(opts?: Partial<IForgeIndiaOptions>);
    init(client: ForgeClient): void;
}
//# sourceMappingURL=ForgeIndia.d.ts.map