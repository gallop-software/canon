interface AuditOptions {
    strict: boolean;
    json: boolean;
    fix: boolean;
}
export declare function audit(path: string, options: AuditOptions): Promise<void>;
export {};
