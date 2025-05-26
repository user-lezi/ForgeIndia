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

  /**
   * A list of **original ForgeScript function names** to exclude from translation.
   *
   * These are the unlocalized/native function names (e.g., `$sendMessage`),
   * and any functions listed here will not be translated or registered.
   *
   * Example:
   * ```ts
   * exclude: ["$sendMessage", "$randomText"]
   * ```
   */
  exclude: `$${string}`[];
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
