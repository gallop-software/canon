/**
 * Recommended configuration
 * A sensible default for any Gallop-based template
 */
const recommendedConfig = {
  plugins: ['gallop'],
  rules: {
    // Core rules that apply to most templates
    'gallop/no-client-blocks': 'warn',
    'gallop/no-container-in-section': 'warn',
    'gallop/prefer-component-props': 'warn',
  },
}

export default recommendedConfig
