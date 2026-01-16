interface ValidateOptions {
    strict: boolean;
    json: boolean;
}
/**
 * Validate project structure
 */
export declare function validate(projectPath: string, options: ValidateOptions): Promise<void>;
export {};
