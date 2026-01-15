import noClientBlocks from './rules/no-client-blocks'
import noContainerInSection from './rules/no-container-in-section'
import preferComponentProps from './rules/prefer-component-props'
import preferTypographyComponents from './rules/prefer-typography-components'
import speedwellConfig from './configs/speedwell'
import recommendedConfig from './configs/recommended'

const plugin = {
  meta: {
    name: 'eslint-plugin-gallop',
    version: '0.1.0',
  },
  rules: {
    'no-client-blocks': noClientBlocks,
    'no-container-in-section': noContainerInSection,
    'prefer-component-props': preferComponentProps,
    'prefer-typography-components': preferTypographyComponents,
  },
  configs: {
    speedwell: speedwellConfig,
    recommended: recommendedConfig,
  },
}

export default plugin
