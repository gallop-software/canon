import { ESLintUtils } from '@typescript-eslint/utils';
import { getCanonUrl, getCanonPattern } from '../utils/canon.js';
const RULE_NAME = 'no-container-in-section';
const pattern = getCanonPattern(RULE_NAME);
const createRule = ESLintUtils.RuleCreator(() => getCanonUrl(RULE_NAME));
export default createRule({
    name: RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: pattern?.summary || 'No Container inside Section',
        },
        messages: {
            noContainerInSection: `[Canon ${pattern?.id || '002'}] Container inside Section is redundant. Section already provides max-width containment. Use Section's innerAlign prop or a plain div instead.`,
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        // Track if we're inside a Section component
        let sectionDepth = 0;
        function isJSXElementNamed(node, name) {
            return (node.name.type === 'JSXIdentifier' &&
                node.name.name === name);
        }
        return {
            JSXOpeningElement(node) {
                // Check if entering a Section
                if (isJSXElementNamed(node, 'Section')) {
                    sectionDepth++;
                }
                // Check if we're inside a Section and found a Container
                if (sectionDepth > 0 && isJSXElementNamed(node, 'Container')) {
                    context.report({
                        node,
                        messageId: 'noContainerInSection',
                    });
                }
            },
            JSXClosingElement(node) {
                // Check if leaving a Section
                if (node.name.type === 'JSXIdentifier' &&
                    node.name.name === 'Section') {
                    sectionDepth--;
                }
            },
        };
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm8tY29udGFpbmVyLWluLXNlY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZXNsaW50L3J1bGVzL25vLWNvbnRhaW5lci1pbi1zZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxXQUFXLEVBQVksTUFBTSwwQkFBMEIsQ0FBQTtBQUNoRSxPQUFPLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFBO0FBRWhFLE1BQU0sU0FBUyxHQUFHLHlCQUF5QixDQUFBO0FBQzNDLE1BQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUUxQyxNQUFNLFVBQVUsR0FBRyxXQUFXLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBO0FBSXhFLGVBQWUsVUFBVSxDQUFpQjtJQUN4QyxJQUFJLEVBQUUsU0FBUztJQUNmLElBQUksRUFBRTtRQUNKLElBQUksRUFBRSxZQUFZO1FBQ2xCLElBQUksRUFBRTtZQUNKLFdBQVcsRUFBRSxPQUFPLEVBQUUsT0FBTyxJQUFJLDZCQUE2QjtTQUMvRDtRQUNELFFBQVEsRUFBRTtZQUNSLG9CQUFvQixFQUFFLFVBQVUsT0FBTyxFQUFFLEVBQUUsSUFBSSxLQUFLLGdKQUFnSjtTQUNyTTtRQUNELE1BQU0sRUFBRSxFQUFFO0tBQ1g7SUFDRCxjQUFjLEVBQUUsRUFBRTtJQUNsQixNQUFNLENBQUMsT0FBTztRQUNaLDRDQUE0QztRQUM1QyxJQUFJLFlBQVksR0FBRyxDQUFDLENBQUE7UUFFcEIsU0FBUyxpQkFBaUIsQ0FDeEIsSUFBZ0MsRUFDaEMsSUFBWTtZQUVaLE9BQU8sQ0FDTCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxlQUFlO2dCQUNsQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLENBQ3hCLENBQUE7UUFDSCxDQUFDO1FBRUQsT0FBTztZQUNMLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3BCLDhCQUE4QjtnQkFDOUIsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLEVBQUUsQ0FBQztvQkFDdkMsWUFBWSxFQUFFLENBQUE7Z0JBQ2hCLENBQUM7Z0JBRUQsd0RBQXdEO2dCQUN4RCxJQUFJLFlBQVksR0FBRyxDQUFDLElBQUksaUJBQWlCLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxFQUFFLENBQUM7b0JBQzdELE9BQU8sQ0FBQyxNQUFNLENBQUM7d0JBQ2IsSUFBSTt3QkFDSixTQUFTLEVBQUUsc0JBQXNCO3FCQUNsQyxDQUFDLENBQUE7Z0JBQ0osQ0FBQztZQUNILENBQUM7WUFFRCxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNwQiw2QkFBNkI7Z0JBQzdCLElBQ0UsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssZUFBZTtvQkFDbEMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUyxFQUM1QixDQUFDO29CQUNELFlBQVksRUFBRSxDQUFBO2dCQUNoQixDQUFDO1lBQ0gsQ0FBQztTQUNGLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRVNMaW50VXRpbHMsIFRTRVNUcmVlIH0gZnJvbSAnQHR5cGVzY3JpcHQtZXNsaW50L3V0aWxzJ1xuaW1wb3J0IHsgZ2V0Q2Fub25VcmwsIGdldENhbm9uUGF0dGVybiB9IGZyb20gJy4uL3V0aWxzL2Nhbm9uLmpzJ1xuXG5jb25zdCBSVUxFX05BTUUgPSAnbm8tY29udGFpbmVyLWluLXNlY3Rpb24nXG5jb25zdCBwYXR0ZXJuID0gZ2V0Q2Fub25QYXR0ZXJuKFJVTEVfTkFNRSlcblxuY29uc3QgY3JlYXRlUnVsZSA9IEVTTGludFV0aWxzLlJ1bGVDcmVhdG9yKCgpID0+IGdldENhbm9uVXJsKFJVTEVfTkFNRSkpXG5cbnR5cGUgTWVzc2FnZUlkcyA9ICdub0NvbnRhaW5lckluU2VjdGlvbidcblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlUnVsZTxbXSwgTWVzc2FnZUlkcz4oe1xuICBuYW1lOiBSVUxFX05BTUUsXG4gIG1ldGE6IHtcbiAgICB0eXBlOiAnc3VnZ2VzdGlvbicsXG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246IHBhdHRlcm4/LnN1bW1hcnkgfHwgJ05vIENvbnRhaW5lciBpbnNpZGUgU2VjdGlvbicsXG4gICAgfSxcbiAgICBtZXNzYWdlczoge1xuICAgICAgbm9Db250YWluZXJJblNlY3Rpb246IGBbQ2Fub24gJHtwYXR0ZXJuPy5pZCB8fCAnMDAyJ31dIENvbnRhaW5lciBpbnNpZGUgU2VjdGlvbiBpcyByZWR1bmRhbnQuIFNlY3Rpb24gYWxyZWFkeSBwcm92aWRlcyBtYXgtd2lkdGggY29udGFpbm1lbnQuIFVzZSBTZWN0aW9uJ3MgaW5uZXJBbGlnbiBwcm9wIG9yIGEgcGxhaW4gZGl2IGluc3RlYWQuYCxcbiAgICB9LFxuICAgIHNjaGVtYTogW10sXG4gIH0sXG4gIGRlZmF1bHRPcHRpb25zOiBbXSxcbiAgY3JlYXRlKGNvbnRleHQpIHtcbiAgICAvLyBUcmFjayBpZiB3ZSdyZSBpbnNpZGUgYSBTZWN0aW9uIGNvbXBvbmVudFxuICAgIGxldCBzZWN0aW9uRGVwdGggPSAwXG5cbiAgICBmdW5jdGlvbiBpc0pTWEVsZW1lbnROYW1lZChcbiAgICAgIG5vZGU6IFRTRVNUcmVlLkpTWE9wZW5pbmdFbGVtZW50LFxuICAgICAgbmFtZTogc3RyaW5nXG4gICAgKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBub2RlLm5hbWUudHlwZSA9PT0gJ0pTWElkZW50aWZpZXInICYmXG4gICAgICAgIG5vZGUubmFtZS5uYW1lID09PSBuYW1lXG4gICAgICApXG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIEpTWE9wZW5pbmdFbGVtZW50KG5vZGUpIHtcbiAgICAgICAgLy8gQ2hlY2sgaWYgZW50ZXJpbmcgYSBTZWN0aW9uXG4gICAgICAgIGlmIChpc0pTWEVsZW1lbnROYW1lZChub2RlLCAnU2VjdGlvbicpKSB7XG4gICAgICAgICAgc2VjdGlvbkRlcHRoKytcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENoZWNrIGlmIHdlJ3JlIGluc2lkZSBhIFNlY3Rpb24gYW5kIGZvdW5kIGEgQ29udGFpbmVyXG4gICAgICAgIGlmIChzZWN0aW9uRGVwdGggPiAwICYmIGlzSlNYRWxlbWVudE5hbWVkKG5vZGUsICdDb250YWluZXInKSkge1xuICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICBtZXNzYWdlSWQ6ICdub0NvbnRhaW5lckluU2VjdGlvbicsXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgSlNYQ2xvc2luZ0VsZW1lbnQobm9kZSkge1xuICAgICAgICAvLyBDaGVjayBpZiBsZWF2aW5nIGEgU2VjdGlvblxuICAgICAgICBpZiAoXG4gICAgICAgICAgbm9kZS5uYW1lLnR5cGUgPT09ICdKU1hJZGVudGlmaWVyJyAmJlxuICAgICAgICAgIG5vZGUubmFtZS5uYW1lID09PSAnU2VjdGlvbidcbiAgICAgICAgKSB7XG4gICAgICAgICAgc2VjdGlvbkRlcHRoLS1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9XG4gIH0sXG59KVxuIl19