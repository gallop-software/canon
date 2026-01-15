import { type Pattern } from '@gallop/canon';
/**
 * Get Canon pattern info for an ESLint rule
 */
export declare function getCanonPattern(ruleName: string): Pattern | undefined;
/**
 * Format a message with Canon pattern prefix
 */
export declare function formatCanonMessage(ruleName: string, message: string): string;
/**
 * Get Canon docs metadata for a rule
 */
export declare function getCanonDocs(ruleName: string): {
    canon?: undefined;
} | {
    canon: {
        pattern: string;
        title: string;
        url: string;
    };
};
/**
 * Create a URL for the Canon pattern docs
 */
export declare function getCanonUrl(ruleName: string): string;
