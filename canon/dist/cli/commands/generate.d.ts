type OutputFormat = 'cursorrules' | 'claude' | 'copilot';
interface GenerateOptions {
    output: string;
    format: OutputFormat;
}
export declare function generate(options: GenerateOptions): Promise<void>;
export {};
