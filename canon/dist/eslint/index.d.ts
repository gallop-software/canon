declare const plugin: {
    meta: {
        name: string;
        version: string;
    };
    rules: {
        'no-client-blocks': import("@typescript-eslint/utils/ts-eslint").RuleModule<"noClientBlocks", [], unknown, import("@typescript-eslint/utils/ts-eslint").RuleListener> & {
            name: string;
        };
        'block-naming-convention': import("@typescript-eslint/utils/ts-eslint").RuleModule<"blockNamingMismatch" | "blockNamingNoNumber", [], unknown, import("@typescript-eslint/utils/ts-eslint").RuleListener> & {
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
        'no-arbitrary-colors': import("@typescript-eslint/utils/ts-eslint").RuleModule<"noArbitraryColors", [], unknown, import("@typescript-eslint/utils/ts-eslint").RuleListener> & {
            name: string;
        };
        'no-raw-colors': import("eslint").Rule.RuleModule;
        'no-cross-zone-imports': import("@typescript-eslint/utils/ts-eslint").RuleModule<"blocksImportBlocks" | "componentsImportBlocks" | "runtimeImportScripts", [], unknown, import("@typescript-eslint/utils/ts-eslint").RuleListener> & {
            name: string;
        };
        'no-native-intersection-observer': import("eslint").Rule.RuleModule;
        'no-component-in-blocks': import("eslint").Rule.RuleModule;
        'prefer-list-components': import("eslint").Rule.RuleModule;
        'no-native-date': import("eslint").Rule.RuleModule;
        'require-canon-setup': import("eslint").Rule.RuleModule;
        'no-classnames-package': import("eslint").Rule.RuleModule;
        'prefer-alias-imports': import("eslint").Rule.RuleModule;
        'no-inline-svg': import("eslint").Rule.RuleModule;
    };
    /**
     * Recommended rule configurations - spread into your ESLint config
     * @example rules: { ...gallop.recommended }
     */
    recommended: {
        readonly 'gallop/no-client-blocks': "warn";
        readonly 'gallop/block-naming-convention': "warn";
        readonly 'gallop/no-container-in-section': "warn";
        readonly 'gallop/prefer-component-props': "warn";
        readonly 'gallop/prefer-typography-components': "warn";
        readonly 'gallop/prefer-layout-components': "warn";
        readonly 'gallop/no-arbitrary-colors': "warn";
        readonly 'gallop/no-raw-colors': "warn";
        readonly 'gallop/no-cross-zone-imports': "warn";
        readonly 'gallop/no-native-intersection-observer': "warn";
        readonly 'gallop/no-component-in-blocks': "warn";
        readonly 'gallop/prefer-list-components': "warn";
        readonly 'gallop/no-native-date': "warn";
        readonly 'gallop/require-canon-setup': "warn";
        readonly 'gallop/no-classnames-package': "warn";
        readonly 'gallop/prefer-alias-imports': "warn";
        readonly 'gallop/no-inline-svg': "warn";
    };
};
export default plugin;
