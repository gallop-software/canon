/**
 * Speedwell template configuration for ESLint flat config
 * Enables all Gallop rules relevant to the Speedwell architecture
 */
const speedwellRules = {
  // Blocks should be server components - extract client logic to components
  'gallop/no-client-blocks': 'warn',

  // Section already provides containment
  'gallop/no-container-in-section': 'warn',

  // Use component props instead of className for style values
  'gallop/prefer-component-props': 'warn',

  // Use Typography components instead of raw p/span tags
  'gallop/prefer-typography-components': 'warn',

  // Use Grid/Columns instead of raw div with grid classes
  'gallop/prefer-layout-components': 'warn',

  // Background images must have rounded="rounded-none"
  'gallop/background-image-rounded': 'warn',
} as const

export default speedwellRules
