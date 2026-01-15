/**
 * @gallop/canon
 *
 * Gallop Enterprise Architecture Canon
 * Versioned, AI-compatible, auditable web architecture patterns
 */
export interface Pattern {
    id: string;
    title: string;
    file: string;
    category: PatternCategory;
    status: 'stable' | 'proposed' | 'deprecated';
    enforcement: 'eslint' | 'documentation' | 'ci';
    rule: string | null;
    summary: string;
}
export interface Category {
    id: string;
    name: string;
    description: string;
}
export interface Guarantee {
    id: string;
    name: string;
    since: string;
    status: 'stable' | 'proposed' | 'deprecated';
    patterns: string[];
}
export type PatternCategory = 'rendering' | 'layout' | 'typography' | 'structure' | 'styling' | 'components' | 'seo';
export interface CanonSchema {
    name: string;
    version: string;
    description: string;
    categories: Category[];
    patterns: Pattern[];
    guarantees: Guarantee[];
}
export declare const canon: CanonSchema;
export declare const version: string;
export declare const patterns: Pattern[];
export declare const categories: Category[];
export declare const guarantees: Guarantee[];
/**
 * Get a pattern by ID
 * @param id - Pattern ID (e.g., "001", "002")
 * @returns Pattern object or undefined if not found
 */
export declare function getPattern(id: string): Pattern | undefined;
/**
 * Get all patterns in a category
 * @param category - Category ID (e.g., "rendering", "typography")
 * @returns Array of patterns in that category
 */
export declare function getPatternsByCategory(category: PatternCategory): Pattern[];
/**
 * Get all patterns enforced by ESLint
 * @returns Array of ESLint-enforced patterns
 */
export declare function getEnforcedPatterns(): Pattern[];
/**
 * Get all patterns with a specific ESLint rule
 * @param rule - ESLint rule name (e.g., "gallop/no-client-blocks")
 * @returns Array of patterns using that rule
 */
export declare function getPatternsByRule(rule: string): Pattern[];
/**
 * Get a guarantee by ID
 * @param id - Guarantee ID (e.g., "SEO_STABLE")
 * @returns Guarantee object or undefined if not found
 */
export declare function getGuarantee(id: string): Guarantee | undefined;
/**
 * Get all patterns associated with a guarantee
 * @param guaranteeId - Guarantee ID (e.g., "SEO_STABLE")
 * @returns Array of patterns that support this guarantee
 */
export declare function getPatternsForGuarantee(guaranteeId: string): Pattern[];
/**
 * Check if a pattern ID is valid
 * @param id - Pattern ID to check
 * @returns true if valid, false otherwise
 */
export declare function isValidPattern(id: string): boolean;
/**
 * Get pattern count by enforcement type
 * @returns Object with counts per enforcement type
 */
export declare function getEnforcementStats(): Record<string, number>;
declare const _default: {
    version: string;
    patterns: Pattern[];
    categories: Category[];
    guarantees: Guarantee[];
    getPattern: typeof getPattern;
    getPatternsByCategory: typeof getPatternsByCategory;
    getEnforcedPatterns: typeof getEnforcedPatterns;
    getPatternsByRule: typeof getPatternsByRule;
    getGuarantee: typeof getGuarantee;
    getPatternsForGuarantee: typeof getPatternsForGuarantee;
    isValidPattern: typeof isValidPattern;
    getEnforcementStats: typeof getEnforcementStats;
};
export default _default;
