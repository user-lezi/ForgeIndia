import {
  ForgeExtension,
  ForgeClient,
  FunctionManager,
  NativeFunction,
  Logger,
} from "@tryforge/forgescript";
import { existsSync } from "fs";
import path from "path";
import {
  IForgeIndiaOptions,
  ForgeIndiaTranslation,
  FITranslation,
} from "./typings";

/**
 * ForgeIndia extension for ForgeScript.
 */
export class ForgeIndia extends ForgeExtension {
  /** Extension name. */
  public name: string = "ForgeIndia";

  /** Extension description from package.json. */
  public description: string = require("../../package.json").description;

  /** Extension version from package.json. */
  public version: string = require("../../package.json").version;

  /** Configuration options for the extension. */
  public readonly options: IForgeIndiaOptions;

  /**
   * Constructs the ForgeIndia extension.
   * @param opts - Partial configuration options.
   */
  public constructor(opts: Partial<IForgeIndiaOptions> = {}) {
    super();
    this.options = {
      debug: Boolean(opts.debug),
      translation: opts.translation ?? ForgeIndiaTranslation.Hinglish,
    };
  }

  /**
   * Initializes the ForgeIndia extension.
   * @param client - The ForgeClient instance.
   */
  public init(client: ForgeClient): void {
    // Determine path of requested translation file
    let translationFilePath = path.resolve(
      __dirname,
      `../../translations/${this.options.translation}.json`,
    );

    // If file doesn't exist, warn and fallback to default
    if (!existsSync(translationFilePath)) {
      // @ts-ignore - Accessing private Logger method
      Logger.log(
        -1,
        0,
        `Translation '${this.options.translation}' not found. Falling back to default: '${ForgeIndiaTranslation.Hinglish}'.`,
      );

      this.options.translation = ForgeIndiaTranslation.Hinglish;
      translationFilePath = path.resolve(
        __dirname,
        `../../translations/${this.options.translation}.json`,
      );
    }

    // Check if any functions are already loaded
    // @ts-ignore - Accessing private property for necessary check
    if (FunctionManager.Functions.size > 0) {
      const extensions = client.options.extensions!;
      const forgeIndiaIndex = extensions.findIndex(
        (ext) => ext.name === this.name,
      );

      // Determine the maximum extension name length for alignment
      const maxNameLength = Math.max(
        ...extensions.map((ext) => ext.name.length),
      );

      // Build visual representation
      const extensionList = extensions
        .map((ext, index) => {
          const paddedName = ext.name.padEnd(maxNameLength, " ");
          if (index === forgeIndiaIndex) {
            return `    ${paddedName}  ← Move to top`;
          }
          return `    ${paddedName}`;
        })
        .join("\n");

      // @ts-ignore - Accessing private logging method for consistent logging format
      Logger.log(
        -1,
        0,
        `ForgeIndia should be loaded before other extensions:\n${extensionList}`,
      );
    }

    // Load native functions and translations
    FunctionManager.loadNative();
    const translations: FITranslation = require(translationFilePath);
    const translatedNativeFunctions: NativeFunction[] = [];

    // Map translations to native functions
    for (const [
      functionName,
      [translatedName, ...translatedAliases],
    ] of Object.entries(translations)) {
      const nativeFunc = FunctionManager.get(functionName);
      if (nativeFunc) {
        translatedNativeFunctions.push(
          new NativeFunction({
            ...nativeFunc.data,
            name: translatedName,
            aliases: [...(nativeFunc.data.aliases ?? []), ...translatedAliases],
          } as any),
        );
      }
    }

    // Clear and add functions
    // @ts-ignore - Accessing private property for function management
    FunctionManager.Functions.clear(); // Wiping out the previous extension's functions. Pro tip: load ForgeIndia first next time. I mean, INDIA ON TOP🔥🔥🔥
    FunctionManager.addMany(...translatedNativeFunctions);

    if (this.options.debug) {
      // @ts-ignore - Accessing private logging method for consistent logging format
      Logger.log(
        -1,
        2,
        `Loaded ${translatedNativeFunctions.length} function translations.`,
      );
    }
  }
}
