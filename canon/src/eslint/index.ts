import noClientBlocks from './rules/no-client-blocks.js'
import noContainerInSection from './rules/no-container-in-section.js'
import preferComponentProps from './rules/prefer-component-props.js'
import preferTypographyComponents from './rules/prefer-typography-components.js'
import preferLayoutComponents from './rules/prefer-layout-components.js'
import noArbitraryColors from './rules/no-arbitrary-colors.js'
import noCrossZoneImports from './rules/no-cross-zone-imports.js'
import noNativeIntersectionObserver from './rules/no-native-intersection-observer.js'
import noComponentInBlocks from './rules/no-component-in-blocks.js'
import preferListComponents from './rules/prefer-list-components.js'
import noNativeDate from './rules/no-native-date.js'
import blockNamingConvention from './rules/block-naming-convention.js'
import requireCanonSetup from './rules/require-canon-setup.js'

/**
 * All Canon ESLint rules with recommended severity levels
 */
const recommended = {
  'gallop/no-client-blocks': 'warn',
  'gallop/block-naming-convention': 'warn',
  'gallop/no-container-in-section': 'warn',
  'gallop/prefer-component-props': 'warn',
  'gallop/prefer-typography-components': 'warn',
  'gallop/prefer-layout-components': 'warn',
  'gallop/no-arbitrary-colors': 'warn',
  'gallop/no-cross-zone-imports': 'warn',
  'gallop/no-native-intersection-observer': 'warn',
  'gallop/no-component-in-blocks': 'warn',
  'gallop/prefer-list-components': 'warn',
  'gallop/no-native-date': 'warn',
  'gallop/require-canon-setup': 'warn',
} as const

const plugin = {
  meta: {
    name: 'eslint-plugin-gallop',
    version: '2.12.0',
  },
  rules: {
    'no-client-blocks': noClientBlocks,
    'block-naming-convention': blockNamingConvention,
    'no-container-in-section': noContainerInSection,
    'prefer-component-props': preferComponentProps,
    'prefer-typography-components': preferTypographyComponents,
    'prefer-layout-components': preferLayoutComponents,
    'no-arbitrary-colors': noArbitraryColors,
    'no-cross-zone-imports': noCrossZoneImports,
    'no-native-intersection-observer': noNativeIntersectionObserver,
    'no-component-in-blocks': noComponentInBlocks,
    'prefer-list-components': preferListComponents,
    'no-native-date': noNativeDate,
    'require-canon-setup': requireCanonSetup,
  },
  /**
   * Recommended rule configurations - spread into your ESLint config
   * @example rules: { ...gallop.recommended }
   */
  recommended,
}

export default plugin
