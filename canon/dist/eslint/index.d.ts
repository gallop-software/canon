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
        'background-image-rounded': import("eslint").Rule.RuleModule;
        'no-inline-styles': import("@typescript-eslint/utils/ts-eslint").RuleModule<"noInlineStyles", [], unknown, import("@typescript-eslint/utils/ts-eslint").RuleListener> & {
            name: string;
        };
        'no-arbitrary-colors': import("@typescript-eslint/utils/ts-eslint").RuleModule<"noArbitraryColors", [], unknown, import("@typescript-eslint/utils/ts-eslint").RuleListener> & {
            name: string;
        };
        'no-cross-zone-imports': import("@typescript-eslint/utils/ts-eslint").RuleModule<"blocksImportBlocks" | "componentsImportBlocks" | "runtimeImportScripts", [], unknown, import("@typescript-eslint/utils/ts-eslint").RuleListener> & {
            name: string;
        };
        'no-data-imports': import("@typescript-eslint/utils/ts-eslint").RuleModule<"noDataImports", [], unknown, import("@typescript-eslint/utils/ts-eslint").RuleListener> & {
            name: string;
        };
        'no-native-intersection-observer': import("eslint").Rule.RuleModule;
    };
    /**
     * Recommended rule configurations - spread into your ESLint config
     * @example rules: { ...gallop.recommended }
     */
    recommended: {
        readonly 'gallop/no-client-blocks': "warn";
        readonly 'gallop/no-container-in-section': "warn";
        readonly 'gallop/prefer-component-props': "warn";
        readonly 'gallop/prefer-typography-components': "warn";
        readonly 'gallop/prefer-layout-components': "warn";
        readonly 'gallop/background-image-rounded': "warn";
        readonly 'gallop/no-inline-styles': "warn";
        readonly 'gallop/no-arbitrary-colors': "warn";
        readonly 'gallop/no-cross-zone-imports': "warn";
        readonly 'gallop/no-data-imports': "warn";
        readonly 'gallop/no-native-intersection-observer': "warn";
    };
};
export default plugin;
