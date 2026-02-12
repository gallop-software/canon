export interface CanonTemplateConfig {
    name: string;
    generatedFiles?: {
        path: string;
        command: string;
        trigger: string;
    }[];
    buildCommands?: {
        script: string;
        description: string;
    }[];
    colorTokens?: {
        surface?: string[];
        text?: string[];
        overlay?: string[];
        accents?: string[];
        allowedRawClasses?: string[];
    };
    components?: {
        name: string;
        props?: string[];
        notes?: string;
    }[];
    state?: {
        library: string;
        file: string;
        readPattern: string;
        writePattern: string;
        properties?: string[];
    };
    rules?: {
        type: 'do' | 'doNot';
        rule: string;
    }[];
    verification?: string[];
}
