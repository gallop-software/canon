import noClientBlocks from './rules/no-client-blocks.js'
import noContainerInSection from './rules/no-container-in-section.js'
import preferComponentProps from './rules/prefer-component-props.js'
import preferTypographyComponents from './rules/prefer-typography-components.js'
import preferLayoutComponents from './rules/prefer-layout-components.js'
import backgroundImageRounded from './rules/background-image-rounded.js'

/**
 * All Canon ESLint rules with recommended severity levels
 */
const recommended = {
  'gallop/no-client-blocks': 'warn',
  'gallop/no-container-in-section': 'warn',
  'gallop/prefer-component-props': 'warn',
  'gallop/prefer-typography-components': 'warn',
  'gallop/prefer-layout-components': 'warn',
  'gallop/background-image-rounded': 'warn',
} as const

const plugin = {
  meta: {
    name: 'eslint-plugin-gallop',
    version: '2.3.0',
  },
  rules: {
    'no-client-blocks': noClientBlocks,
    'no-container-in-section': noContainerInSection,
    'prefer-component-props': preferComponentProps,
    'prefer-typography-components': preferTypographyComponents,
    'prefer-layout-components': preferLayoutComponents,
    'background-image-rounded': backgroundImageRounded,
  },
  /**
   * Recommended rule configurations - spread into your ESLint config
   * @example rules: { ...gallop.recommended }
   */
  recommended,
}

export default plugin
