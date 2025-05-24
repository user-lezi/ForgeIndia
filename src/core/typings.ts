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
 * Configuration options for the ForgeIndia extension.
 */
export interface IForgeIndiaOptions {
  /** Enables debug logging. */
  debug: boolean;

  /** The translation to be applied to native functions. */
  translation: ForgeIndiaTranslation;
}

/**
 * Represents a mapping of native ForgeScript function names to their
 * translated names and aliases.
 *
 * Each key is a native function name (e.g., `"$sendMessage"`),
 * and each value is an array of translated names:
 * - The first element is the primary translated name (e.g., `"$msgBhej"`)
 * - Subsequent elements are aliases (e.g., `"$sandeshBhej"`, `"$sendMsg"`)
 *
 * Example:
 * ```ts
 * {
 *   "$sendMessage": ["$msgBhej", "$sandeshBhej", "$sendMsg"]
 * }
 * ```
 */
export type FITranslation = Record<`$${string}`, `$${string}`[]>;
