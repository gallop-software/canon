/**
 * Recommended configuration for ESLint flat config
 * A sensible default for any Gallop-based template
 */
const recommendedRules = {
  // Blocks should be server components
  'gallop/no-client-blocks': 'warn',

  // Section already provides containment
  'gallop/no-container-in-section': 'warn',

  // Use component props instead of className for style values
  'gallop/prefer-component-props': 'warn',

  // Use Typography components instead of raw p/span tags
  'gallop/prefer-typography-components': 'warn',

  // Use Grid/Columns instead of raw div with grid classes
  'gallop/prefer-layout-components': 'warn',

  // Use defined color tokens, not arbitrary colors
  'gallop/no-arbitrary-colors': 'warn',

  // Enforce import boundaries between Canon zones
  'gallop/no-cross-zone-imports': 'warn',

  // Prevent runtime code from importing _data/ directly
  'gallop/no-data-imports': 'warn',
} as const

export default recommendedRules
