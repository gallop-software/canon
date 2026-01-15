/**
 * Recommended configuration
 * A sensible default for any Gallop-based template
 */
declare const recommendedConfig: {
    plugins: string[];
    rules: {
        'gallop/no-client-blocks': string;
        'gallop/no-container-in-section': string;
        'gallop/prefer-component-props': string;
    };
};
export default recommendedConfig;
