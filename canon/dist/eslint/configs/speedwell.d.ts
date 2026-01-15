/**
 * Speedwell template configuration
 * Enables all Gallop rules relevant to the Speedwell architecture
 */
declare const speedwellConfig: {
    plugins: string[];
    rules: {
        'gallop/no-client-blocks': string;
        'gallop/no-container-in-section': string;
        'gallop/prefer-component-props': string;
    };
};
export default speedwellConfig;
