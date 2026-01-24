/**
 * Recommended configuration for ESLint flat config
 * A sensible default for any Gallop-based template
 */
declare const recommendedRules: {
    readonly 'gallop/no-client-blocks': "warn";
    readonly 'gallop/no-container-in-section': "warn";
    readonly 'gallop/prefer-component-props': "warn";
    readonly 'gallop/prefer-typography-components': "warn";
    readonly 'gallop/prefer-layout-components': "warn";
    readonly 'gallop/background-image-rounded': "warn";
    readonly 'gallop/no-arbitrary-colors': "warn";
    readonly 'gallop/no-cross-zone-imports': "warn";
    readonly 'gallop/no-data-imports': "warn";
};
export default recommendedRules;
