declare const plugin: {
    meta: {
        name: string;
        version: string;
    };
    rules: {
        'no-client-blocks': import("@typescript-eslint/utils/ts-eslint").RuleModule<"noClientBlocks", [], unknown, import("@typescript-eslint/utils/ts-eslint").RuleListener> & {
            name: string;
        };
        'no-container-in-section': import("@typescript-eslint/utils/ts-eslint").RuleModule<"noContainerInSection", [], unknown, import("@typescript-eslint/utils/ts-eslint").RuleListener> & {
            name: string;
        };
        'prefer-component-props': import("@typescript-eslint/utils/ts-eslint").RuleModule<"preferComponentProps", [], unknown, import("@typescript-eslint/utils/ts-eslint").RuleListener> & {
            name: string;
        };
        'prefer-typography-components': import("eslint").Rule.RuleModule;
        'prefer-layout-components': import("eslint").Rule.RuleModule;
    };
    configs: {
        speedwell: {
            plugins: string[];
            rules: {
                'gallop/no-client-blocks': string;
                'gallop/no-container-in-section': string;
                'gallop/prefer-component-props': string;
                'gallop/prefer-layout-components': string;
            };
        };
        recommended: {
            plugins: string[];
            rules: {
                'gallop/no-client-blocks': string;
                'gallop/no-container-in-section': string;
                'gallop/prefer-component-props': string;
                'gallop/prefer-layout-components': string;
            };
        };
    };
};
export default plugin;
