import noClientBlocks from './rules/no-client-blocks.js'
import noContainerInSection from './rules/no-container-in-section.js'
import preferComponentProps from './rules/prefer-component-props.js'
import preferTypographyComponents from './rules/prefer-typography-components.js'
import speedwellConfig from './configs/speedwell.js'
import recommendedConfig from './configs/recommended.js'

const plugin = {
  meta: {
    name: 'eslint-plugin-gallop',
    version: '1.0.1',
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
