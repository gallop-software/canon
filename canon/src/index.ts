/**
 * @gallop/canon
 *
 * Gallop Enterprise Architecture Canon
 * Versioned, AI-compatible, auditable web architecture patterns
 */

import schema from '../schema.json'

// Types
export interface Pattern {
  id: string
  title: string
  file: string
  category: PatternCategory
  status: 'stable' | 'proposed' | 'deprecated'
  enforcement: 'eslint' | 'documentation' | 'ci'
  rule: string | null
  summary: string
}

export interface Category {
  id: string
  name: string
  description: string
}

export interface Guarantee {
  id: string
  name: string
  since: string
  status: 'stable' | 'proposed' | 'deprecated'
  patterns: string[]
}

export type PatternCategory =
  | 'rendering'
  | 'layout'
  | 'typography'
  | 'structure'
  | 'styling'
  | 'components'
  | 'seo'

export interface CanonSchema {
  name: string
  version: string
  description: string
  categories: Category[]
  patterns: Pattern[]
  guarantees: Guarantee[]
}

// Export the full schema
export const canon: CanonSchema = schema as CanonSchema

// Export version
export const version = schema.version

// Export patterns array
export const patterns: Pattern[] = schema.patterns as Pattern[]

// Export categories array
export const categories: Category[] = schema.categories

// Export guarantees array
export const guarantees: Guarantee[] = schema.guarantees as Guarantee[]

/**
 * Get a pattern by ID
 * @param id - Pattern ID (e.g., "001", "002")
 * @returns Pattern object or undefined if not found
 */
export function getPattern(id: string): Pattern | undefined {
  return patterns.find((p) => p.id === id)
}

/**
 * Get all patterns in a category
 * @param category - Category ID (e.g., "rendering", "typography")
 * @returns Array of patterns in that category
 */
export function getPatternsByCategory(category: PatternCategory): Pattern[] {
  return patterns.filter((p) => p.category === category)
}

/**
 * Get all patterns enforced by ESLint
 * @returns Array of ESLint-enforced patterns
 */
export function getEnforcedPatterns(): Pattern[] {
  return patterns.filter((p) => p.enforcement === 'eslint')
}

/**
 * Get all patterns with a specific ESLint rule
 * @param rule - ESLint rule name (e.g., "gallop/no-client-blocks")
 * @returns Array of patterns using that rule
 */
export function getPatternsByRule(rule: string): Pattern[] {
  return patterns.filter((p) => p.rule === rule)
}

/**
 * Get a guarantee by ID
 * @param id - Guarantee ID (e.g., "SEO_STABLE")
 * @returns Guarantee object or undefined if not found
 */
export function getGuarantee(id: string): Guarantee | undefined {
  return guarantees.find((g) => g.id === id)
}

/**
 * Get all patterns associated with a guarantee
 * @param guaranteeId - Guarantee ID (e.g., "SEO_STABLE")
 * @returns Array of patterns that support this guarantee
 */
export function getPatternsForGuarantee(guaranteeId: string): Pattern[] {
  const guarantee = getGuarantee(guaranteeId)
  if (!guarantee) return []
  return patterns.filter((p) => guarantee.patterns.includes(p.id))
}

/**
 * Check if a pattern ID is valid
 * @param id - Pattern ID to check
 * @returns true if valid, false otherwise
 */
export function isValidPattern(id: string): boolean {
  return patterns.some((p) => p.id === id)
}

/**
 * Get pattern count by enforcement type
 * @returns Object with counts per enforcement type
 */
export function getEnforcementStats(): Record<string, number> {
  const stats: Record<string, number> = {}
  for (const pattern of patterns) {
    stats[pattern.enforcement] = (stats[pattern.enforcement] || 0) + 1
  }
  return stats
}

// Default export
export default {
  version,
  patterns,
  categories,
  guarantees,
  getPattern,
  getPatternsByCategory,
  getEnforcedPatterns,
  getPatternsByRule,
  getGuarantee,
  getPatternsForGuarantee,
  isValidPattern,
  getEnforcementStats,
}
