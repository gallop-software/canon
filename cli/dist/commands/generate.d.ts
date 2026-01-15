interface GenerateOptions {
    output: string;
    format: 'cursorrules' | 'markdown';
}
export declare function generate(options: GenerateOptions): Promise<void>;
export {};
