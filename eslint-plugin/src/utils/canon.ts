import { patterns, type Pattern } from '@gallop/canon'

// Build a lookup map from rule name to pattern
const ruleToPatternMap = new Map<string, Pattern>()
for (const pattern of patterns) {
  if (pattern.rule) {
    ruleToPatternMap.set(pattern.rule, pattern)
  }
}

/**
 * Get Canon pattern info for an ESLint rule
 */
export function getCanonPattern(ruleName: string): Pattern | undefined {
  return ruleToPatternMap.get(`gallop/${ruleName}`)
}

/**
 * Format a message with Canon pattern prefix
 */
export function formatCanonMessage(ruleName: string, message: string): string {
  const pattern = getCanonPattern(ruleName)
  if (pattern) {
    return `[Canon ${pattern.id}] ${message}`
  }
  return message
}

/**
 * Get Canon docs metadata for a rule
 */
export function getCanonDocs(ruleName: string) {
  const pattern = getCanonPattern(ruleName)
  if (!pattern) return {}
  
  return {
    canon: {
      pattern: pattern.id,
      title: pattern.title,
      url: `https://github.com/gallop-software/canon/blob/main/${pattern.file}`,
    },
  }
}

/**
 * Create a URL for the Canon pattern docs
 */
export function getCanonUrl(ruleName: string): string {
  const pattern = getCanonPattern(ruleName)
  if (pattern) {
    return `https://github.com/gallop-software/canon/blob/main/${pattern.file}`
  }
  return `https://github.com/gallop-software/canon`
}
