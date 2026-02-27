import { ESLintUtils } from '@typescript-eslint/utils';
import { getCanonUrl, getCanonPattern } from '../utils/canon.js';
const RULE_NAME = 'block-naming-convention';
const pattern = getCanonPattern(RULE_NAME);
const createRule = ESLintUtils.RuleCreator(() => getCanonUrl(RULE_NAME));
/**
 * Check if file is in a co-located _blocks/ directory (new structure)
 * In _blocks/, files like hero.tsx (no number) are valid
 */
function isColocatedBlock(filename) {
    return filename.includes('/_blocks/') || filename.includes('\\_blocks\\');
}
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
        // Only check files in src/blocks/ or _blocks/
        const isBlockFile = filename.includes('/blocks/') || filename.includes('/_blocks/') ||
            filename.includes('\\blocks\\') || filename.includes('\\_blocks\\');
        if (!isBlockFile) {
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
                        // In co-located _blocks/, names without numbers are valid
                        // Only flag missing numbers in the legacy src/blocks/ directory
                        if (!hasTrailingNumber(actualName) && !isColocatedBlock(filename)) {
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
                        else if (actualName !== expectedName) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxvY2stbmFtaW5nLWNvbnZlbnRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZXNsaW50L3J1bGVzL2Jsb2NrLW5hbWluZy1jb252ZW50aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQTtBQUN0RCxPQUFPLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFBO0FBRWhFLE1BQU0sU0FBUyxHQUFHLHlCQUF5QixDQUFBO0FBQzNDLE1BQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUUxQyxNQUFNLFVBQVUsR0FBRyxXQUFXLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBO0FBSXhFOzs7R0FHRztBQUNILFNBQVMsZ0JBQWdCLENBQUMsUUFBZ0I7SUFDeEMsT0FBTyxRQUFRLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUE7QUFDM0UsQ0FBQztBQUVEOzs7R0FHRztBQUNILFNBQVMsb0JBQW9CLENBQUMsUUFBZ0I7SUFDNUMsd0NBQXdDO0lBQ3hDLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFBO0lBRWhELHlDQUF5QztJQUN6QyxPQUFPLFFBQVE7U0FDWixLQUFLLENBQUMsR0FBRyxDQUFDO1NBQ1YsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDWix1Q0FBdUM7UUFDdkMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDckQsQ0FBQyxDQUFDO1NBQ0QsSUFBSSxDQUFDLEVBQUUs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M0IsaUJBQWlCO2lDQUNsQjs2QkFDRixDQUFDLENBQUE7d0JBQ0osQ0FBQzs2QkFBTSxJQUFJLFVBQVUsS0FBSyxZQUFZLEVBQUUsQ0FBQzs0QkFDdkMsd0NBQXdDOzRCQUN4QyxNQUFNLGlCQUFpQixHQUFHLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFBOzRCQUMxRCxPQUFPLENBQUMsTUFBTSxDQUFDO2dDQUNiLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUU7Z0NBQ3pCLFNBQVMsRUFBRSxxQkFBcUI7Z0NBQ2hDLElBQUksRUFBRTtvQ0FDSixNQUFNLEVBQUUsVUFBVTtvQ0FDbEIsUUFBUSxFQUFFLFlBQVk7b0NBQ3RCLFFBQVEsRUFBRSxhQUFhO29DQUN2QixpQkFBaUI7aUNBQ2xCOzZCQUNGLENBQUMsQ0FBQTt3QkFDSixDQUFDO29CQUNILENBQUM7Z0JBQ0gsQ0FBQztZQUNILENBQUM7U0FDRixDQUFBO0lBQ0gsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVTTGludFV0aWxzIH0gZnJvbSAnQHR5cGVzY3JpcHQtZXNsaW50L3V0aWxzJ1xuaW1wb3J0IHsgZ2V0Q2Fub25VcmwsIGdldENhbm9uUGF0dGVybiB9IGZyb20gJy4uL3V0aWxzL2Nhbm9uLmpzJ1xuXG5jb25zdCBSVUxFX05BTUUgPSAnYmxvY2stbmFtaW5nLWNvbnZlbnRpb24nXG5jb25zdCBwYXR0ZXJuID0gZ2V0Q2Fub25QYXR0ZXJuKFJVTEVfTkFNRSlcblxuY29uc3QgY3JlYXRlUnVsZSA9IEVTTGludFV0aWxzLlJ1bGVDcmVhdG9yKCgpID0+IGdldENhbm9uVXJsKFJVTEVfTkFNRSkpXG5cbnR5cGUgTWVzc2FnZUlkcyA9ICdibG9ja05hbWluZ01pc21hdGNoJyB8ICdibG9ja05hbWluZ05vTnVtYmVyJ1xuXG4vKipcbiAqIENoZWNrIGlmIGZpbGUgaXMgaW4gYSBjby1sb2NhdGVkIF9ibG9ja3MvIGRpcmVjdG9yeSAobmV3IHN0cnVjdHVyZSlcbiAqIEluIF9ibG9ja3MvLCBmaWxlcyBsaWtlIGhlcm8udHN4IChubyBudW1iZXIpIGFyZSB2YWxpZFxuICovXG5mdW5jdGlvbiBpc0NvbG9jYXRlZEJsb2NrKGZpbGVuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIGZpbGVuYW1lLmluY2x1ZGVzKCcvX2Jsb2Nrcy8nKSB8fCBmaWxlbmFtZS5pbmNsdWRlcygnXFxcXF9ibG9ja3NcXFxcJylcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBhIGJsb2NrIGZpbGVuYW1lIHRvIGl0cyBleHBlY3RlZCBQYXNjYWxDYXNlIGV4cG9ydCBuYW1lXG4gKiBlLmcuLCBcImhlcm8tNVwiIC0+IFwiSGVybzVcIiwgXCJzZWN0aW9uLTEwXCIgLT4gXCJTZWN0aW9uMTBcIiwgXCJjb250ZW50LTM5XCIgLT4gXCJDb250ZW50MzlcIlxuICovXG5mdW5jdGlvbiBmaWxlbmFtZVRvUGFzY2FsQ2FzZShmaWxlbmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgLy8gUmVtb3ZlIGV4dGVuc2lvbiBhbmQgc3BsaXQgYnkgaHlwaGVuc1xuICBjb25zdCBiYXNlTmFtZSA9IGZpbGVuYW1lLnJlcGxhY2UoL1xcLnRzeD8kLywgJycpXG4gIFxuICAvLyBTcGxpdCBieSBoeXBoZW5zIGFuZCBjb252ZXJ0IGVhY2ggcGFydFxuICByZXR1cm4gYmFzZU5hbWVcbiAgICAuc3BsaXQoJy0nKVxuICAgIC5tYXAoKHBhcnQpID0+IHtcbiAgICAgIC8vIENhcGl0YWxpemUgZmlyc3QgbGV0dGVyIG9mIGVhY2ggcGFydFxuICAgICAgcmV0dXJuIHBhcnQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBwYXJ0LnNsaWNlKDEpXG4gICAgfSlcbiAgICAuam9pbignJylcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBhIFBhc2NhbENhc2UgZXhwb3J0IG5hbWUgdG8ga2ViYWItY2FzZSBmaWxlbmFtZVxuICogZS5nLiwgXCJDb250ZW50XCIgLT4gXCJjb250ZW50XCIsIFwiSGVybzVcIiAtPiBcImhlcm8tNVwiLCBcIkNhbGxUb0FjdGlvbjFcIiAtPiBcImNhbGwtdG8tYWN0aW9uLTFcIlxuICovXG5mdW5jdGlvbiBwYXNjYWxDYXNlVG9GaWxlbmFtZShuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gbmFtZVxuICAgIC8vIEluc2VydCBoeXBoZW4gYmVmb3JlIHVwcGVyY2FzZSBsZXR0ZXJzIChidXQgbm90IGF0IHN0YXJ0KVxuICAgIC5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCAnJDEtJDInKVxuICAgIC8vIEluc2VydCBoeXBoZW4gYmVmb3JlIG51bWJlcnNcbiAgICAucmVwbGFjZSgvKFthLXpBLVpdKShcXGQpL2csICckMS0kMicpXG4gICAgLnRvTG93ZXJDYXNlKClcbn1cblxuLyoqXG4gKiBDaGVjayBpZiBhIG5hbWUgZW5kcyB3aXRoIGEgbnVtYmVyXG4gKi9cbmZ1bmN0aW9uIGhhc1RyYWlsaW5nTnVtYmVyKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gL1xcZCskLy50ZXN0KG5hbWUpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVJ1bGU8W10sIE1lc3NhZ2VJZHM+KHtcbiAgbmFtZTogUlVMRV9OQU1FLFxuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiBwYXR0ZXJuPy5zdW1tYXJ5IHx8ICdCbG9jayBleHBvcnQgbmFtZXMgbXVzdCBtYXRjaCBmaWxlbmFtZSBwYXR0ZXJuJyxcbiAgICB9LFxuICAgIG1lc3NhZ2VzOiB7XG4gICAgICBibG9ja05hbWluZ01pc21hdGNoOiBgW0Nhbm9uICR7cGF0dGVybj8uaWQgfHwgJzAwNid9XSBCbG9jayBleHBvcnQgXCJ7e2FjdHVhbH19XCIgc2hvdWxkIGJlIFwie3tleHBlY3RlZH19XCIgdG8gbWF0Y2ggdGhlIGZpbGVuYW1lIFwie3tmaWxlbmFtZX19XCIuIE9yIHJlbmFtZSB0aGUgZmlsZSB0byBcInt7c3VnZ2VzdGVkRmlsZW5hbWV9fS50c3hcIi4gU2VlOiAke3BhdHRlcm4/LnRpdGxlIHx8ICdCbG9jayBOYW1pbmcnfSBwYXR0ZXJuLmAsXG4gICAgICBibG9ja05hbWluZ05vTnVtYmVyOiBgW0Nhbm9uICR7cGF0dGVybj8uaWQgfHwgJzAwNid9XSBCbG9jayBleHBvcnQgXCJ7e2FjdHVhbH19XCIgbXVzdCBlbmQgd2l0aCBhIG51bWJlciAoZS5nLiwgXCJ7e2FjdHVhbH19MVwiKS4gUmVuYW1lIHRvIFwie3tzdWdnZXN0ZWR9fVwiIG9yIHJlbmFtZSBmaWxlIHRvIFwie3tzdWdnZXN0ZWRGaWxlbmFtZX19LXtufS50c3hcIi4gU2VlOiAke3BhdHRlcm4/LnRpdGxlIHx8ICdCbG9jayBOYW1pbmcnfSBwYXR0ZXJuLmAsXG4gICAgfSxcbiAgICBzY2hlbWE6IFtdLFxuICB9LFxuICBkZWZhdWx0T3B0aW9uczogW10sXG4gIGNyZWF0ZShjb250ZXh0KSB7XG4gICAgY29uc3QgZmlsZW5hbWUgPSBjb250ZXh0LmZpbGVuYW1lIHx8IGNvbnRleHQuZ2V0RmlsZW5hbWUoKVxuXG4gICAgLy8gT25seSBjaGVjayBmaWxlcyBpbiBzcmMvYmxvY2tzLyBvciBfYmxvY2tzL1xuICAgIGNvbnN0IGlzQmxvY2tGaWxlID0gZmlsZW5hbWUuaW5jbHVkZXMoJy9ibG9ja3MvJykgfHwgZmlsZW5hbWUuaW5jbHVkZXMoJy9fYmxvY2tzLycpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZS5pbmNsdWRlcygnXFxcXGJsb2Nrc1xcXFwnKSB8fCBmaWxlbmFtZS5pbmNsdWRlcygnXFxcXF9ibG9ja3NcXFxcJylcbiAgICBpZiAoIWlzQmxvY2tGaWxlKSB7XG4gICAgICByZXR1cm4ge31cbiAgICB9XG5cbiAgICAvLyBFeHRyYWN0IGp1c3QgdGhlIGZpbGVuYW1lIChlLmcuLCBcImhlcm8tNS50c3hcIilcbiAgICBjb25zdCBtYXRjaCA9IGZpbGVuYW1lLm1hdGNoKC8oW14vXFxcXF0rXFwudHN4PykkLylcbiAgICBpZiAoIW1hdGNoKSB7XG4gICAgICByZXR1cm4ge31cbiAgICB9XG5cbiAgICBjb25zdCBibG9ja0ZpbGVuYW1lID0gbWF0Y2hbMV1cbiAgICBjb25zdCBleHBlY3RlZE5hbWUgPSBmaWxlbmFtZVRvUGFzY2FsQ2FzZShibG9ja0ZpbGVuYW1lKVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIC8vIENoZWNrIGV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRlY2xhcmF0aW9uc1xuICAgICAgRXhwb3J0RGVmYXVsdERlY2xhcmF0aW9uKG5vZGUpIHtcbiAgICAgICAgaWYgKG5vZGUuZGVjbGFyYXRpb24udHlwZSA9PT0gJ0Z1bmN0aW9uRGVjbGFyYXRpb24nICYmIG5vZGUuZGVjbGFyYXRpb24uaWQpIHtcbiAgICAgICAgICBjb25zdCBhY3R1YWxOYW1lID0gbm9kZS5kZWNsYXJhdGlvbi5pZC5uYW1lXG4gICAgICAgICAgXG4gICAgICAgICAgaWYgKGFjdHVhbE5hbWUgIT09IGV4cGVjdGVkTmFtZSkge1xuICAgICAgICAgICAgLy8gSW4gY28tbG9jYXRlZCBfYmxvY2tzLywgbmFtZXMgd2l0aG91dCBudW1iZXJzIGFyZSB2YWxpZFxuICAgICAgICAgICAgLy8gT25seSBmbGFnIG1pc3NpbmcgbnVtYmVycyBpbiB0aGUgbGVnYWN5IHNyYy9ibG9ja3MvIGRpcmVjdG9yeVxuICAgICAgICAgICAgaWYgKCFoYXNUcmFpbGluZ051bWJlcihhY3R1YWxOYW1lKSAmJiAhaXNDb2xvY2F0ZWRCbG9jayhmaWxlbmFtZSkpIHtcbiAgICAgICAgICAgICAgLy8gTm8gbnVtYmVyIC0gc3VnZ2VzdCBhZGRpbmcgb25lXG4gICAgICAgICAgICAgIGNvbnN0IHN1Z2dlc3RlZEZpbGVuYW1lID0gcGFzY2FsQ2FzZVRvRmlsZW5hbWUoYWN0dWFsTmFtZSlcbiAgICAgICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgICAgIG5vZGU6IG5vZGUuZGVjbGFyYXRpb24uaWQsXG4gICAgICAgICAgICAgICAgbWVzc2FnZUlkOiAnYmxvY2tOYW1pbmdOb051bWJlcicsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgYWN0dWFsOiBhY3R1YWxOYW1lLFxuICAgICAgICAgICAgICAgICAgc3VnZ2VzdGVkOiBgJHthY3R1YWxOYW1lfTFgLFxuICAgICAgICAgICAgICAgICAgc3VnZ2VzdGVkRmlsZW5hbWUsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYWN0dWFsTmFtZSAhPT0gZXhwZWN0ZWROYW1lKSB7XG4gICAgICAgICAgICAgIC8vIEhhcyBudW1iZXIgYnV0IGRvZXNuJ3QgbWF0Y2ggZmlsZW5hbWVcbiAgICAgICAgICAgICAgY29uc3Qgc3VnZ2VzdGVkRmlsZW5hbWUgPSBwYXNjYWxDYXNlVG9GaWxlbmFtZShhY3R1YWxOYW1lKVxuICAgICAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICAgICAgbm9kZTogbm9kZS5kZWNsYXJhdGlvbi5pZCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlSWQ6ICdibG9ja05hbWluZ01pc21hdGNoJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICBhY3R1YWw6IGFjdHVhbE5hbWUsXG4gICAgICAgICAgICAgICAgICBleHBlY3RlZDogZXhwZWN0ZWROYW1lLFxuICAgICAgICAgICAgICAgICAgZmlsZW5hbWU6IGJsb2NrRmlsZW5hbWUsXG4gICAgICAgICAgICAgICAgICBzdWdnZXN0ZWRGaWxlbmFtZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9XG4gIH0sXG59KVxuIl19