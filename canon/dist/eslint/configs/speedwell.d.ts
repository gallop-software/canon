/**
 * Speedwell template configuration for ESLint flat config
 * Enables all Gallop rules relevant to the Speedwell architecture
 */
declare const speedwellRules: {
    readonly 'gallop/no-client-blocks': "warn";
    readonly 'gallop/no-container-in-section': "warn";
    readonly 'gallop/prefer-component-props': "warn";
    readonly 'gallop/prefer-typography-components': "warn";
    readonly 'gallop/prefer-layout-components': "warn";
    readonly 'gallop/background-image-rounded': "warn";
};
export default speedwellRules;
