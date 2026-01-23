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
export default createRule({
    name: RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: pattern?.summary || 'Block export names must match filename pattern',
        },
        messages: {
            blockNamingMismatch: `[Canon ${pattern?.id || '006'}] Block export "{{actual}}" should be "{{expected}}" to match the filename "{{filename}}". See: ${pattern?.title || 'Block Naming'} pattern.`,
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
                        context.report({
                            node: node.declaration.id,
                            messageId: 'blockNamingMismatch',
                            data: {
                                actual: actualName,
                                expected: expectedName,
                                filename: blockFilename,
                            },
                        });
                    }
                }
            },
        };
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxvY2stbmFtaW5nLWNvbnZlbnRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZXNsaW50L3J1bGVzL2Jsb2NrLW5hbWluZy1jb252ZW50aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQTtBQUN0RCxPQUFPLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFBO0FBRWhFLE1BQU0sU0FBUyxHQUFHLHlCQUF5QixDQUFBO0FBQzNDLE1BQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUUxQyxNQUFNLFVBQVUsR0FBRyxXQUFXLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBO0FBSXhFOzs7R0FHRztBQUNILFNBQVMsb0JBQW9CLENBQUMsUUFBZ0I7SUFDNUMsd0NBQXdDO0lBQ3hDLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFBO0lBRWhELHlDQUF5QztJQUN6QyxPQUFPLFFBQVE7U0FDWixLQUFLLENBQUMsR0FBRyxDQUFDO1NBQ1YsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDWix1Q0FBdUM7UUFDdkMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDckQsQ0FBQyxDQUFDO1NBQ0QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQ2IsQ0FBQztBQUVELGVBQWUsVUFBVSxDQUFpQjtJQUN4QyxJQUFJLEVBQUUsU0FBUztJQUNmLElBQUksRUFBRTtRQUNKLElBQUksRUFBRSxZQUFZO1FBQ2xCLElBQUksRUFBRTtZQUNKLFdBQVcsRUFBRSxPQUFPLEVBQUUsT0FBTyxJQUFJLGdEQUFnRDtTQUNsRjtRQUNELFFBQVEsRUFBRTtZQUNSLG1CQUFtQixFQUFFLFVBQVUsT0FBTyxFQUFFLEVBQUUsSUFBSSxLQUFLLG1HQUFtRyxPQUFPLEVBQUUsS0FBSyxJQUFJLGNBQWMsV0FBVztTQUNsTTtRQUNELE1BQU0sRUFBRSxFQUFFO0tBQ1g7SUFDRCxjQUFjLEVBQUUsRUFBRTtJQUNsQixNQUFNLENBQUMsT0FBTztRQUNaLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFBO1FBRTFELGtDQUFrQztRQUNsQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQztZQUN2RSxPQUFPLEVBQUUsQ0FBQTtRQUNYLENBQUM7UUFFRCxpREFBaUQ7UUFDakQsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO1FBQ2hELElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNYLE9BQU8sRUFBRSxDQUFBO1FBQ1gsQ0FBQztRQUVELE1BQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUM5QixNQUFNLFlBQVksR0FBRyxvQkFBb0IsQ0FBQyxhQUFhLENBQUMsQ0FBQTtRQUV4RCxPQUFPO1lBQ0wsNkNBQTZDO1lBQzdDLHdCQUF3QixDQUFDLElBQUk7Z0JBQzNCLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEtBQUsscUJBQXFCLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsQ0FBQztvQkFDM0UsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFBO29CQUMzQyxJQUFJLFVBQVUsS0FBSyxZQUFZLEVBQUUsQ0FBQzt3QkFDaEMsT0FBTyxDQUFDLE1BQU0sQ0FBQzs0QkFDYixJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFOzRCQUN6QixTQUFTLEVBQUUscUJBQXFCOzRCQUNoQyxJQUFJLEVBQUU7Z0NBQ0osTUFBTSxFQUFFLFVBQVU7Z0NBQ2xCLFFBQVEsRUFBRSxZQUFZO2dDQUN0QixRQUFRLEVBQUUsYUFBYTs2QkFDeEI7eUJBQ0YsQ0FBQyxDQUFBO29CQUNKLENBQUM7Z0JBQ0gsQ0FBQztZQUNILENBQUM7U0FDRixDQUFBO0lBQ0gsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVTTGludFV0aWxzIH0gZnJvbSAnQHR5cGVzY3JpcHQtZXNsaW50L3V0aWxzJ1xuaW1wb3J0IHsgZ2V0Q2Fub25VcmwsIGdldENhbm9uUGF0dGVybiB9IGZyb20gJy4uL3V0aWxzL2Nhbm9uLmpzJ1xuXG5jb25zdCBSVUxFX05BTUUgPSAnYmxvY2stbmFtaW5nLWNvbnZlbnRpb24nXG5jb25zdCBwYXR0ZXJuID0gZ2V0Q2Fub25QYXR0ZXJuKFJVTEVfTkFNRSlcblxuY29uc3QgY3JlYXRlUnVsZSA9IEVTTGludFV0aWxzLlJ1bGVDcmVhdG9yKCgpID0+IGdldENhbm9uVXJsKFJVTEVfTkFNRSkpXG5cbnR5cGUgTWVzc2FnZUlkcyA9ICdibG9ja05hbWluZ01pc21hdGNoJ1xuXG4vKipcbiAqIENvbnZlcnRzIGEgYmxvY2sgZmlsZW5hbWUgdG8gaXRzIGV4cGVjdGVkIFBhc2NhbENhc2UgZXhwb3J0IG5hbWVcbiAqIGUuZy4sIFwiaGVyby01XCIgLT4gXCJIZXJvNVwiLCBcInNlY3Rpb24tMTBcIiAtPiBcIlNlY3Rpb24xMFwiLCBcImNvbnRlbnQtMzlcIiAtPiBcIkNvbnRlbnQzOVwiXG4gKi9cbmZ1bmN0aW9uIGZpbGVuYW1lVG9QYXNjYWxDYXNlKGZpbGVuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAvLyBSZW1vdmUgZXh0ZW5zaW9uIGFuZCBzcGxpdCBieSBoeXBoZW5zXG4gIGNvbnN0IGJhc2VOYW1lID0gZmlsZW5hbWUucmVwbGFjZSgvXFwudHN4PyQvLCAnJylcbiAgXG4gIC8vIFNwbGl0IGJ5IGh5cGhlbnMgYW5kIGNvbnZlcnQgZWFjaCBwYXJ0XG4gIHJldHVybiBiYXNlTmFtZVxuICAgIC5zcGxpdCgnLScpXG4gICAgLm1hcCgocGFydCkgPT4ge1xuICAgICAgLy8gQ2FwaXRhbGl6ZSBmaXJzdCBsZXR0ZXIgb2YgZWFjaCBwYXJ0XG4gICAgICByZXR1cm4gcGFydC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHBhcnQuc2xpY2UoMSlcbiAgICB9KVxuICAgIC5qb2luKCcnKVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVSdWxlPFtdLCBNZXNzYWdlSWRzPih7XG4gIG5hbWU6IFJVTEVfTkFNRSxcbiAgbWV0YToge1xuICAgIHR5cGU6ICdzdWdnZXN0aW9uJyxcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjogcGF0dGVybj8uc3VtbWFyeSB8fCAnQmxvY2sgZXhwb3J0IG5hbWVzIG11c3QgbWF0Y2ggZmlsZW5hbWUgcGF0dGVybicsXG4gICAgfSxcbiAgICBtZXNzYWdlczoge1xuICAgICAgYmxvY2tOYW1pbmdNaXNtYXRjaDogYFtDYW5vbiAke3BhdHRlcm4/LmlkIHx8ICcwMDYnfV0gQmxvY2sgZXhwb3J0IFwie3thY3R1YWx9fVwiIHNob3VsZCBiZSBcInt7ZXhwZWN0ZWR9fVwiIHRvIG1hdGNoIHRoZSBmaWxlbmFtZSBcInt7ZmlsZW5hbWV9fVwiLiBTZWU6ICR7cGF0dGVybj8udGl0bGUgfHwgJ0Jsb2NrIE5hbWluZyd9IHBhdHRlcm4uYCxcbiAgICB9LFxuICAgIHNjaGVtYTogW10sXG4gIH0sXG4gIGRlZmF1bHRPcHRpb25zOiBbXSxcbiAgY3JlYXRlKGNvbnRleHQpIHtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGNvbnRleHQuZmlsZW5hbWUgfHwgY29udGV4dC5nZXRGaWxlbmFtZSgpXG5cbiAgICAvLyBPbmx5IGNoZWNrIGZpbGVzIGluIHNyYy9ibG9ja3MvXG4gICAgaWYgKCFmaWxlbmFtZS5pbmNsdWRlcygnL2Jsb2Nrcy8nKSAmJiAhZmlsZW5hbWUuaW5jbHVkZXMoJ1xcXFxibG9ja3NcXFxcJykpIHtcbiAgICAgIHJldHVybiB7fVxuICAgIH1cblxuICAgIC8vIEV4dHJhY3QganVzdCB0aGUgZmlsZW5hbWUgKGUuZy4sIFwiaGVyby01LnRzeFwiKVxuICAgIGNvbnN0IG1hdGNoID0gZmlsZW5hbWUubWF0Y2goLyhbXi9cXFxcXStcXC50c3g/KSQvKVxuICAgIGlmICghbWF0Y2gpIHtcbiAgICAgIHJldHVybiB7fVxuICAgIH1cblxuICAgIGNvbnN0IGJsb2NrRmlsZW5hbWUgPSBtYXRjaFsxXVxuICAgIGNvbnN0IGV4cGVjdGVkTmFtZSA9IGZpbGVuYW1lVG9QYXNjYWxDYXNlKGJsb2NrRmlsZW5hbWUpXG5cbiAgICByZXR1cm4ge1xuICAgICAgLy8gQ2hlY2sgZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGVjbGFyYXRpb25zXG4gICAgICBFeHBvcnREZWZhdWx0RGVjbGFyYXRpb24obm9kZSkge1xuICAgICAgICBpZiAobm9kZS5kZWNsYXJhdGlvbi50eXBlID09PSAnRnVuY3Rpb25EZWNsYXJhdGlvbicgJiYgbm9kZS5kZWNsYXJhdGlvbi5pZCkge1xuICAgICAgICAgIGNvbnN0IGFjdHVhbE5hbWUgPSBub2RlLmRlY2xhcmF0aW9uLmlkLm5hbWVcbiAgICAgICAgICBpZiAoYWN0dWFsTmFtZSAhPT0gZXhwZWN0ZWROYW1lKSB7XG4gICAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICAgIG5vZGU6IG5vZGUuZGVjbGFyYXRpb24uaWQsXG4gICAgICAgICAgICAgIG1lc3NhZ2VJZDogJ2Jsb2NrTmFtaW5nTWlzbWF0Y2gnLFxuICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgYWN0dWFsOiBhY3R1YWxOYW1lLFxuICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBleHBlY3RlZE5hbWUsXG4gICAgICAgICAgICAgICAgZmlsZW5hbWU6IGJsb2NrRmlsZW5hbWUsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9XG4gIH0sXG59KVxuIl19