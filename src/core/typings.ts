/**
 * Supported translation options for ForgeIndia.
 */
export enum ForgeIndiaTranslation {
  /**
   * Hinglish translation.
   *
   * Example: `$sendMessage` becomes `$msgBhej`
   */
  Hinglish = "hinglish",
}

/**
 * Array of available ForgeIndiaTranslation enum values.
 */
export const ForgeIndiaTranslations = [ForgeIndiaTranslation.Hinglish] as const;

/**
 * Configuration options for the ForgeIndia extension.
 */
export interface IForgeIndiaOptions {
  /** Enables debug logging. */
  debug: boolean;

  /** The translation to apply to native ForgeScript functions. */
  translation: ForgeIndiaTranslation;

  /**
   * A list of **original ForgeScript function names** to exclude from translation.
   *
   * These are the unlocalized/native function names (e.g., `$sendMessage`).
   * Any functions listed here will not be translated or registered.
   *
   * Example:
   * ```ts
   * exclude: ["$sendMessage", "$randomText"]
   * ```
   */
  exclude: `$${string}`[];
}

/**
 * Represents metadata for a translated ForgeScript function.
 *
 * Each key is a native function name (e.g., `"$sendMessage"`).
 */
export interface FunctionTranslationEntry {
  /** Primary translated function name. */
  translated: `$${string}`;

  /** Optional aliases for the function. */
  aliases?: `$${string}`[];

  /** Hinglish description of what this function does. */
  description?: string;

  /** Arguments this function takes. */
  args?: {
    /** Hinglish argument name. */
    name: string;

    /** Hinglish description of the argument. */
    description?: string;
  }[];
}

/**
 * Complete ForgeIndia function translation mapping.
 *
 * Example:
 * ```ts
 * {
 *   "$sendMessage": {
 *     translated: "$sandeshBhej",
 *     aliases: ["$msgBhej", "$messageBhej"],
 *     description: "Channel me message bhejo",
 *     args: [
 *       { name: "channelKaID", description: "Kis channel me bhejna hai" },
 *       { name: "sandesh", description: "Jo likhna hai" },
 *       { name: "bhejiMsgKaIDDu", description: "Agar bheji gayi msg ka ID chahiye toh" }
 *     ]
 *   }
 * }
 * ```
 */
export type FunctionsTranslation = Record<
  `$${string}`,
  FunctionTranslationEntry
>;

/**
 * Root schema for a ForgeIndia translation JSON file.
 */
export interface ForgeIndiaTranslationJSON {
  functions: FunctionsTranslation;
}
