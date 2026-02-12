import type { CanonTemplateConfig } from '../types/config.js';
/**
 * Load canon.config.json from the current working directory.
 * Returns null if no config file is found.
 */
export declare function loadConfig(cwd?: string): CanonTemplateConfig | null;
