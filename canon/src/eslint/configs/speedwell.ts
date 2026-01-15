/**
 * Speedwell template configuration
 * Enables all Gallop rules relevant to the Speedwell architecture
 */
const speedwellConfig = {
  plugins: ['gallop'],
  rules: {
    // Blocks should be server components - extract client logic to components
    'gallop/no-client-blocks': 'warn',

    // Section already provides containment
    'gallop/no-container-in-section': 'warn',

    // Use component props instead of className for style values
    'gallop/prefer-component-props': 'warn',

    // Use Grid/Columns instead of raw div with grid classes
    'gallop/prefer-layout-components': 'warn',
  },
}

export default speedwellConfig
