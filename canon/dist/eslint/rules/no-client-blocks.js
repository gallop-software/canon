import { ESLintUtils } from '@typescript-eslint/utils';
import { getCanonUrl, getCanonPattern } from '../utils/canon.js';
const RULE_NAME = 'no-client-blocks';
const pattern = getCanonPattern(RULE_NAME);
const createRule = ESLintUtils.RuleCreator(() => getCanonUrl(RULE_NAME));
export default createRule({
    name: RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: pattern?.summary || 'Blocks must be server components',
        },
        messages: {
            noClientBlocks: `[Canon ${pattern?.id || '001'}] Block "{{blockName}}" uses 'use client'. Extract hooks and client-side logic into a component in src/components/, then import it here. See: ${pattern?.title || 'Server-First Blocks'} pattern.`,
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
        return {
            // Check for 'use client' directive at the top of the file
            ExpressionStatement(node) {
                if (node.expression.type === 'Literal' &&
                    node.expression.value === 'use client') {
                    // Extract block name from filename
                    const match = filename.match(/([^/\\]+)\.tsx?$/);
                    const blockName = match ? match[1] : 'unknown';
                    context.report({
                        node,
                        messageId: 'noClientBlocks',
                        data: {
                            blockName,
                        },
                    });
                }
            },
        };
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm8tY2xpZW50LWJsb2Nrcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lc2xpbnQvcnVsZXMvbm8tY2xpZW50LWJsb2Nrcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sMEJBQTBCLENBQUE7QUFDdEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQTtBQUVoRSxNQUFNLFNBQVMsR0FBRyxrQkFBa0IsQ0FBQTtBQUNwQyxNQUFNLE9BQU8sR0FBRyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUE7QUFFMUMsTUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQTtBQUl4RSxlQUFlLFVBQVUsQ0FBaUI7SUFDeEMsSUFBSSxFQUFFLFNBQVM7SUFDZixJQUFJLEVBQUU7UUFDSixJQUFJLEVBQUUsWUFBWTtRQUNsQixJQUFJLEVBQUU7WUFDSixXQUFXLEVBQUUsT0FBTyxFQUFFLE9BQU8sSUFBSSxrQ0FBa0M7U0FDcEU7UUFDRCxRQUFRLEVBQUU7WUFDUixjQUFjLEVBQUUsVUFBVSxPQUFPLEVBQUUsRUFBRSxJQUFJLEtBQUssaUpBQWlKLE9BQU8sRUFBRSxLQUFLLElBQUkscUJBQXFCLFdBQVc7U0FDbFA7UUFDRCxNQUFNLEVBQUUsRUFBRTtLQUNYO0lBQ0QsY0FBYyxFQUFFLEVBQUU7SUFDbEIsTUFBTSxDQUFDLE9BQU87UUFDWixNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxJQUFJLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQTtRQUUxRCw4Q0FBOEM7UUFDOUMsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQztZQUMvRCxRQUFRLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUE7UUFDdkYsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ2pCLE9BQU8sRUFBRSxDQUFBO1FBQ1gsQ0FBQztRQUVELE9BQU87WUFDTCwwREFBMEQ7WUFDMUQsbUJBQW1CLENBQUMsSUFBSTtnQkFDdEIsSUFDRSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksS0FBSyxTQUFTO29CQUNsQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssS0FBSyxZQUFZLEVBQ3RDLENBQUM7b0JBQ0QsbUNBQW1DO29CQUNuQyxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUE7b0JBQ2hELE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUE7b0JBRTlDLE9BQU8sQ0FBQyxNQUFNLENBQUM7d0JBQ2IsSUFBSTt3QkFDSixTQUFTLEVBQUUsZ0JBQWdCO3dCQUMzQixJQUFJLEVBQUU7NEJBQ0osU0FBUzt5QkFDVjtxQkFDRixDQUFDLENBQUE7Z0JBQ0osQ0FBQztZQUNILENBQUM7U0FDRixDQUFBO0lBQ0gsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVTTGludFV0aWxzIH0gZnJvbSAnQHR5cGVzY3JpcHQtZXNsaW50L3V0aWxzJ1xuaW1wb3J0IHsgZ2V0Q2Fub25VcmwsIGdldENhbm9uUGF0dGVybiB9IGZyb20gJy4uL3V0aWxzL2Nhbm9uLmpzJ1xuXG5jb25zdCBSVUxFX05BTUUgPSAnbm8tY2xpZW50LWJsb2NrcydcbmNvbnN0IHBhdHRlcm4gPSBnZXRDYW5vblBhdHRlcm4oUlVMRV9OQU1FKVxuXG5jb25zdCBjcmVhdGVSdWxlID0gRVNMaW50VXRpbHMuUnVsZUNyZWF0b3IoKCkgPT4gZ2V0Q2Fub25VcmwoUlVMRV9OQU1FKSlcblxudHlwZSBNZXNzYWdlSWRzID0gJ25vQ2xpZW50QmxvY2tzJ1xuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVSdWxlPFtdLCBNZXNzYWdlSWRzPih7XG4gIG5hbWU6IFJVTEVfTkFNRSxcbiAgbWV0YToge1xuICAgIHR5cGU6ICdzdWdnZXN0aW9uJyxcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjogcGF0dGVybj8uc3VtbWFyeSB8fCAnQmxvY2tzIG11c3QgYmUgc2VydmVyIGNvbXBvbmVudHMnLFxuICAgIH0sXG4gICAgbWVzc2FnZXM6IHtcbiAgICAgIG5vQ2xpZW50QmxvY2tzOiBgW0Nhbm9uICR7cGF0dGVybj8uaWQgfHwgJzAwMSd9XSBCbG9jayBcInt7YmxvY2tOYW1lfX1cIiB1c2VzICd1c2UgY2xpZW50Jy4gRXh0cmFjdCBob29rcyBhbmQgY2xpZW50LXNpZGUgbG9naWMgaW50byBhIGNvbXBvbmVudCBpbiBzcmMvY29tcG9uZW50cy8sIHRoZW4gaW1wb3J0IGl0IGhlcmUuIFNlZTogJHtwYXR0ZXJuPy50aXRsZSB8fCAnU2VydmVyLUZpcnN0IEJsb2Nrcyd9IHBhdHRlcm4uYCxcbiAgICB9LFxuICAgIHNjaGVtYTogW10sXG4gIH0sXG4gIGRlZmF1bHRPcHRpb25zOiBbXSxcbiAgY3JlYXRlKGNvbnRleHQpIHtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGNvbnRleHQuZmlsZW5hbWUgfHwgY29udGV4dC5nZXRGaWxlbmFtZSgpXG5cbiAgICAvLyBPbmx5IGNoZWNrIGZpbGVzIGluIHNyYy9ibG9ja3MvIG9yIF9ibG9ja3MvXG4gICAgY29uc3QgaXNCbG9ja0ZpbGUgPSBmaWxlbmFtZS5pbmNsdWRlcygnL2Jsb2Nrcy8nKSB8fCBmaWxlbmFtZS5pbmNsdWRlcygnL19ibG9ja3MvJykgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lLmluY2x1ZGVzKCdcXFxcYmxvY2tzXFxcXCcpIHx8IGZpbGVuYW1lLmluY2x1ZGVzKCdcXFxcX2Jsb2Nrc1xcXFwnKVxuICAgIGlmICghaXNCbG9ja0ZpbGUpIHtcbiAgICAgIHJldHVybiB7fVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAvLyBDaGVjayBmb3IgJ3VzZSBjbGllbnQnIGRpcmVjdGl2ZSBhdCB0aGUgdG9wIG9mIHRoZSBmaWxlXG4gICAgICBFeHByZXNzaW9uU3RhdGVtZW50KG5vZGUpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIG5vZGUuZXhwcmVzc2lvbi50eXBlID09PSAnTGl0ZXJhbCcgJiZcbiAgICAgICAgICBub2RlLmV4cHJlc3Npb24udmFsdWUgPT09ICd1c2UgY2xpZW50J1xuICAgICAgICApIHtcbiAgICAgICAgICAvLyBFeHRyYWN0IGJsb2NrIG5hbWUgZnJvbSBmaWxlbmFtZVxuICAgICAgICAgIGNvbnN0IG1hdGNoID0gZmlsZW5hbWUubWF0Y2goLyhbXi9cXFxcXSspXFwudHN4PyQvKVxuICAgICAgICAgIGNvbnN0IGJsb2NrTmFtZSA9IG1hdGNoID8gbWF0Y2hbMV0gOiAndW5rbm93bidcblxuICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICBtZXNzYWdlSWQ6ICdub0NsaWVudEJsb2NrcycsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIGJsb2NrTmFtZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9XG4gIH0sXG59KVxuIl19