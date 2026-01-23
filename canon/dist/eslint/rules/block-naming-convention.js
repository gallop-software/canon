import { ESLintUtils } from '@typescript-eslint/utils';
import { getCanonUrl, getCanonPattern } from '../utils/canon.js';
const RULE_NAME = 'block-naming-convention';
const pattern = getCanonPattern(RULE_NAME);
const createRule = ESLintUtils.RuleCreator(() => getCanonUrl(RULE_NAME));
/**
 * Converts a block filename to its expected PascalCase export name
 * e.g., "hero-5" -> "Hero5", "section-10" -> "Section10", "content-39" -> "Content39"
 */
function filenameToPascalCase(filename) {
    // Remove extension and split by hyphens
    const baseName = filename.replace(/\.tsx?$/, '');
    // Split by hyphens and convert each part
    return baseName
        .split('-')
        .map((part) => {
        // Capitalize first letter of each part
        return part.charAt(0).toUpperCase() + part.slice(1);
    })
        .join('');
}
/**
 * Converts a PascalCase export name to kebab-case filename
 * e.g., "Content" -> "content", "Hero5" -> "hero-5", "CallToAction1" -> "call-to-action-1"
 */
function pascalCaseToFilename(name) {
    return name
        // Insert hyphen before uppercase letters (but not at start)
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        // Insert hyphen before numbers
        .replace(/([a-zA-Z])(\d)/g, '$1-$2')
        .toLowerCase();
}
/**
 * Check if a name ends with a number
 */
function hasTrailingNumber(name) {
    return /\d+$/.test(name);
}
export default createRule({
    name: RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: pattern?.summary || 'Block export names must match filename pattern',
        },
        messages: {
            blockNamingMismatch: `[Canon ${pattern?.id || '006'}] Block export "{{actual}}" should be "{{expected}}" to match the filename "{{filename}}". Or rename the file to "{{suggestedFilename}}.tsx". See: ${pattern?.title || 'Block Naming'} pattern.`,
            blockNamingNoNumber: `[Canon ${pattern?.id || '006'}] Block export "{{actual}}" must end with a number (e.g., "{{actual}}1"). Rename to "{{suggested}}" or rename file to "{{suggestedFilename}}-{n}.tsx". See: ${pattern?.title || 'Block Naming'} pattern.`,
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        const filename = context.filename || context.getFilename();
        // Only check files in src/blocks/
        if (!filename.includes('/blocks/') && !filename.includes('\\blocks\\')) {
            return {};
        }
        // Extract just the filename (e.g., "hero-5.tsx")
        const match = filename.match(/([^/\\]+\.tsx?)$/);
        if (!match) {
            return {};
        }
        const blockFilename = match[1];
        const expectedName = filenameToPascalCase(blockFilename);
        return {
            // Check export default function declarations
            ExportDefaultDeclaration(node) {
                if (node.declaration.type === 'FunctionDeclaration' && node.declaration.id) {
                    const actualName = node.declaration.id.name;
                    if (actualName !== expectedName) {
                        // Check if the export name has a trailing number
                        if (!hasTrailingNumber(actualName)) {
                            // No number - suggest adding one
                            const suggestedFilename = pascalCaseToFilename(actualName);
                            context.report({
                                node: node.declaration.id,
                                messageId: 'blockNamingNoNumber',
                                data: {
                                    actual: actualName,
                                    suggested: `${actualName}1`,
                                    suggestedFilename,
                                },
                            });
                        }
                        else {
                            // Has number but doesn't match filename
                            const suggestedFilename = pascalCaseToFilename(actualName);
                            context.report({
                                node: node.declaration.id,
                                messageId: 'blockNamingMismatch',
                                data: {
                                    actual: actualName,
                                    expected: expectedName,
                                    filename: blockFilename,
                                    suggestedFilename,
                                },
                            });
                        }
                    }
                }
            },
        };
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxvY2stbmFtaW5nLWNvbnZlbnRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZXNsaW50L3J1bGVzL2Jsb2NrLW5hbWluZy1jb252ZW50aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQTtBQUN0RCxPQUFPLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFBO0FBRWhFLE1BQU0sU0FBUyxHQUFHLHlCQUF5QixDQUFBO0FBQzNDLE1BQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUUxQyxNQUFNLFVBQVUsR0FBRyxXQUFXLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBO0FBSXhFOzs7R0FHRztBQUNILFNBQVMsb0JBQW9CLENBQUMsUUFBZ0I7SUFDNUMsd0NBQXdDO0lBQ3hDLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFBO0lBRWhELHlDQUF5QztJQUN6QyxPQUFPLFFBQVE7U0FDWixLQUFLLENBQUMsR0FBRyxDQUFDO1NBQ1YsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDWix1Q0FBdUM7UUFDdkMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDckQsQ0FBQyxDQUFDO1NBQ0QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQ2IsQ0FBQztBQUVEOzs7R0FHRztBQUNILFNBQVMsb0JBQW9CLENBQUMsSUFBWTtJQUN4QyxPQUFPLElBQUk7UUFDVCw0REFBNEQ7U0FDM0QsT0FBTyxDQUFDLGlCQUFpQixFQUFFLE9BQU8sQ0FBQztRQUNwQywr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dEIsUUFBUSxFQUFFLGFBQWE7b0NBQ3ZCLGlCQUFpQjtpQ0FDbEI7NkJBQ0YsQ0FBQyxDQUFBO3dCQUNKLENBQUM7b0JBQ0gsQ0FBQztnQkFDSCxDQUFDO1lBQ0gsQ0FBQztTQUNGLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRVNMaW50VXRpbHMgfSBmcm9tICdAdHlwZXNjcmlwdC1lc2xpbnQvdXRpbHMnXG5pbXBvcnQgeyBnZXRDYW5vblVybCwgZ2V0Q2Fub25QYXR0ZXJuIH0gZnJvbSAnLi4vdXRpbHMvY2Fub24uanMnXG5cbmNvbnN0IFJVTEVfTkFNRSA9ICdibG9jay1uYW1pbmctY29udmVudGlvbidcbmNvbnN0IHBhdHRlcm4gPSBnZXRDYW5vblBhdHRlcm4oUlVMRV9OQU1FKVxuXG5jb25zdCBjcmVhdGVSdWxlID0gRVNMaW50VXRpbHMuUnVsZUNyZWF0b3IoKCkgPT4gZ2V0Q2Fub25VcmwoUlVMRV9OQU1FKSlcblxudHlwZSBNZXNzYWdlSWRzID0gJ2Jsb2NrTmFtaW5nTWlzbWF0Y2gnIHwgJ2Jsb2NrTmFtaW5nTm9OdW1iZXInXG5cbi8qKlxuICogQ29udmVydHMgYSBibG9jayBmaWxlbmFtZSB0byBpdHMgZXhwZWN0ZWQgUGFzY2FsQ2FzZSBleHBvcnQgbmFtZVxuICogZS5nLiwgXCJoZXJvLTVcIiAtPiBcIkhlcm81XCIsIFwic2VjdGlvbi0xMFwiIC0+IFwiU2VjdGlvbjEwXCIsIFwiY29udGVudC0zOVwiIC0+IFwiQ29udGVudDM5XCJcbiAqL1xuZnVuY3Rpb24gZmlsZW5hbWVUb1Bhc2NhbENhc2UoZmlsZW5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIC8vIFJlbW92ZSBleHRlbnNpb24gYW5kIHNwbGl0IGJ5IGh5cGhlbnNcbiAgY29uc3QgYmFzZU5hbWUgPSBmaWxlbmFtZS5yZXBsYWNlKC9cXC50c3g/JC8sICcnKVxuICBcbiAgLy8gU3BsaXQgYnkgaHlwaGVucyBhbmQgY29udmVydCBlYWNoIHBhcnRcbiAgcmV0dXJuIGJhc2VOYW1lXG4gICAgLnNwbGl0KCctJylcbiAgICAubWFwKChwYXJ0KSA9PiB7XG4gICAgICAvLyBDYXBpdGFsaXplIGZpcnN0IGxldHRlciBvZiBlYWNoIHBhcnRcbiAgICAgIHJldHVybiBwYXJ0LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcGFydC5zbGljZSgxKVxuICAgIH0pXG4gICAgLmpvaW4oJycpXG59XG5cbi8qKlxuICogQ29udmVydHMgYSBQYXNjYWxDYXNlIGV4cG9ydCBuYW1lIHRvIGtlYmFiLWNhc2UgZmlsZW5hbWVcbiAqIGUuZy4sIFwiQ29udGVudFwiIC0+IFwiY29udGVudFwiLCBcIkhlcm81XCIgLT4gXCJoZXJvLTVcIiwgXCJDYWxsVG9BY3Rpb24xXCIgLT4gXCJjYWxsLXRvLWFjdGlvbi0xXCJcbiAqL1xuZnVuY3Rpb24gcGFzY2FsQ2FzZVRvRmlsZW5hbWUobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIG5hbWVcbiAgICAvLyBJbnNlcnQgaHlwaGVuIGJlZm9yZSB1cHBlcmNhc2UgbGV0dGVycyAoYnV0IG5vdCBhdCBzdGFydClcbiAgICAucmVwbGFjZSgvKFthLXpdKShbQS1aXSkvZywgJyQxLSQyJylcbiAgICAvLyBJbnNlcnQgaHlwaGVuIGJlZm9yZSBudW1iZXJzXG4gICAgLnJlcGxhY2UoLyhbYS16QS1aXSkoXFxkKS9nLCAnJDEtJDInKVxuICAgIC50b0xvd2VyQ2FzZSgpXG59XG5cbi8qKlxuICogQ2hlY2sgaWYgYSBuYW1lIGVuZHMgd2l0aCBhIG51bWJlclxuICovXG5mdW5jdGlvbiBoYXNUcmFpbGluZ051bWJlcihuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIC9cXGQrJC8udGVzdChuYW1lKVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVSdWxlPFtdLCBNZXNzYWdlSWRzPih7XG4gIG5hbWU6IFJVTEVfTkFNRSxcbiAgbWV0YToge1xuICAgIHR5cGU6ICdzdWdnZXN0aW9uJyxcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjogcGF0dGVybj8uc3VtbWFyeSB8fCAnQmxvY2sgZXhwb3J0IG5hbWVzIG11c3QgbWF0Y2ggZmlsZW5hbWUgcGF0dGVybicsXG4gICAgfSxcbiAgICBtZXNzYWdlczoge1xuICAgICAgYmxvY2tOYW1pbmdNaXNtYXRjaDogYFtDYW5vbiAke3BhdHRlcm4/LmlkIHx8ICcwMDYnfV0gQmxvY2sgZXhwb3J0IFwie3thY3R1YWx9fVwiIHNob3VsZCBiZSBcInt7ZXhwZWN0ZWR9fVwiIHRvIG1hdGNoIHRoZSBmaWxlbmFtZSBcInt7ZmlsZW5hbWV9fVwiLiBPciByZW5hbWUgdGhlIGZpbGUgdG8gXCJ7e3N1Z2dlc3RlZEZpbGVuYW1lfX0udHN4XCIuIFNlZTogJHtwYXR0ZXJuPy50aXRsZSB8fCAnQmxvY2sgTmFtaW5nJ30gcGF0dGVybi5gLFxuICAgICAgYmxvY2tOYW1pbmdOb051bWJlcjogYFtDYW5vbiAke3BhdHRlcm4/LmlkIHx8ICcwMDYnfV0gQmxvY2sgZXhwb3J0IFwie3thY3R1YWx9fVwiIG11c3QgZW5kIHdpdGggYSBudW1iZXIgKGUuZy4sIFwie3thY3R1YWx9fTFcIikuIFJlbmFtZSB0byBcInt7c3VnZ2VzdGVkfX1cIiBvciByZW5hbWUgZmlsZSB0byBcInt7c3VnZ2VzdGVkRmlsZW5hbWV9fS17bn0udHN4XCIuIFNlZTogJHtwYXR0ZXJuPy50aXRsZSB8fCAnQmxvY2sgTmFtaW5nJ30gcGF0dGVybi5gLFxuICAgIH0sXG4gICAgc2NoZW1hOiBbXSxcbiAgfSxcbiAgZGVmYXVsdE9wdGlvbnM6IFtdLFxuICBjcmVhdGUoY29udGV4dCkge1xuICAgIGNvbnN0IGZpbGVuYW1lID0gY29udGV4dC5maWxlbmFtZSB8fCBjb250ZXh0LmdldEZpbGVuYW1lKClcblxuICAgIC8vIE9ubHkgY2hlY2sgZmlsZXMgaW4gc3JjL2Jsb2Nrcy9cbiAgICBpZiAoIWZpbGVuYW1lLmluY2x1ZGVzKCcvYmxvY2tzLycpICYmICFmaWxlbmFtZS5pbmNsdWRlcygnXFxcXGJsb2Nrc1xcXFwnKSkge1xuICAgICAgcmV0dXJuIHt9XG4gICAgfVxuXG4gICAgLy8gRXh0cmFjdCBqdXN0IHRoZSBmaWxlbmFtZSAoZS5nLiwgXCJoZXJvLTUudHN4XCIpXG4gICAgY29uc3QgbWF0Y2ggPSBmaWxlbmFtZS5tYXRjaCgvKFteL1xcXFxdK1xcLnRzeD8pJC8pXG4gICAgaWYgKCFtYXRjaCkge1xuICAgICAgcmV0dXJuIHt9XG4gICAgfVxuXG4gICAgY29uc3QgYmxvY2tGaWxlbmFtZSA9IG1hdGNoWzFdXG4gICAgY29uc3QgZXhwZWN0ZWROYW1lID0gZmlsZW5hbWVUb1Bhc2NhbENhc2UoYmxvY2tGaWxlbmFtZSlcblxuICAgIHJldHVybiB7XG4gICAgICAvLyBDaGVjayBleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkZWNsYXJhdGlvbnNcbiAgICAgIEV4cG9ydERlZmF1bHREZWNsYXJhdGlvbihub2RlKSB7XG4gICAgICAgIGlmIChub2RlLmRlY2xhcmF0aW9uLnR5cGUgPT09ICdGdW5jdGlvbkRlY2xhcmF0aW9uJyAmJiBub2RlLmRlY2xhcmF0aW9uLmlkKSB7XG4gICAgICAgICAgY29uc3QgYWN0dWFsTmFtZSA9IG5vZGUuZGVjbGFyYXRpb24uaWQubmFtZVxuICAgICAgICAgIFxuICAgICAgICAgIGlmIChhY3R1YWxOYW1lICE9PSBleHBlY3RlZE5hbWUpIHtcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBleHBvcnQgbmFtZSBoYXMgYSB0cmFpbGluZyBudW1iZXJcbiAgICAgICAgICAgIGlmICghaGFzVHJhaWxpbmdOdW1iZXIoYWN0dWFsTmFtZSkpIHtcbiAgICAgICAgICAgICAgLy8gTm8gbnVtYmVyIC0gc3VnZ2VzdCBhZGRpbmcgb25lXG4gICAgICAgICAgICAgIGNvbnN0IHN1Z2dlc3RlZEZpbGVuYW1lID0gcGFzY2FsQ2FzZVRvRmlsZW5hbWUoYWN0dWFsTmFtZSlcbiAgICAgICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgICAgIG5vZGU6IG5vZGUuZGVjbGFyYXRpb24uaWQsXG4gICAgICAgICAgICAgICAgbWVzc2FnZUlkOiAnYmxvY2tOYW1pbmdOb051bWJlcicsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgYWN0dWFsOiBhY3R1YWxOYW1lLFxuICAgICAgICAgICAgICAgICAgc3VnZ2VzdGVkOiBgJHthY3R1YWxOYW1lfTFgLFxuICAgICAgICAgICAgICAgICAgc3VnZ2VzdGVkRmlsZW5hbWUsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIEhhcyBudW1iZXIgYnV0IGRvZXNuJ3QgbWF0Y2ggZmlsZW5hbWVcbiAgICAgICAgICAgICAgY29uc3Qgc3VnZ2VzdGVkRmlsZW5hbWUgPSBwYXNjYWxDYXNlVG9GaWxlbmFtZShhY3R1YWxOYW1lKVxuICAgICAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICAgICAgbm9kZTogbm9kZS5kZWNsYXJhdGlvbi5pZCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlSWQ6ICdibG9ja05hbWluZ01pc21hdGNoJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICBhY3R1YWw6IGFjdHVhbE5hbWUsXG4gICAgICAgICAgICAgICAgICBleHBlY3RlZDogZXhwZWN0ZWROYW1lLFxuICAgICAgICAgICAgICAgICAgZmlsZW5hbWU6IGJsb2NrRmlsZW5hbWUsXG4gICAgICAgICAgICAgICAgICBzdWdnZXN0ZWRGaWxlbmFtZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9XG4gIH0sXG59KVxuIl19