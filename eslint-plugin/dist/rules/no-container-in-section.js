"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@typescript-eslint/utils");
const canon_1 = require("../utils/canon");
const RULE_NAME = 'no-container-in-section';
const pattern = (0, canon_1.getCanonPattern)(RULE_NAME);
const createRule = utils_1.ESLintUtils.RuleCreator(() => (0, canon_1.getCanonUrl)(RULE_NAME));
exports.default = createRule({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm8tY29udGFpbmVyLWluLXNlY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcnVsZXMvbm8tY29udGFpbmVyLWluLXNlY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBZ0U7QUFDaEUsMENBQTZEO0FBRTdELE1BQU0sU0FBUyxHQUFHLHlCQUF5QixDQUFBO0FBQzNDLE1BQU0sT0FBTyxHQUFHLElBQUEsdUJBQWUsRUFBQyxTQUFTLENBQUMsQ0FBQTtBQUUxQyxNQUFNLFVBQVUsR0FBRyxtQkFBVyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFBLG1CQUFXLEVBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQTtBQUl4RSxrQkFBZSxVQUFVLENBQWlCO0lBQ3hDLElBQUksRUFBRSxTQUFTO0lBQ2YsSUFBSSxFQUFFO1FBQ0osSUFBSSxFQUFFLFlBQVk7UUFDbEIsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFLE9BQU8sRUFBRSxPQUFPLElBQUksNkJBQTZCO1NBQy9EO1FBQ0QsUUFBUSxFQUFFO1lBQ1Isb0JBQW9CLEVBQUUsVUFBVSxPQUFPLEVBQUUsRUFBRSxJQUFJLEtBQUssZ0pBQWdKO1NBQ3JNO1FBQ0QsTUFBTSxFQUFFLEVBQUU7S0FDWDtJQUNELGNBQWMsRUFBRSxFQUFFO0lBQ2xCLE1BQU0sQ0FBQyxPQUFPO1FBQ1osNENBQTRDO1FBQzVDLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQTtRQUVwQixTQUFTLGlCQUFpQixDQUN4QixJQUFnQyxFQUNoQyxJQUFZO1lBRVosT0FBTyxDQUNMLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLGVBQWU7Z0JBQ2xDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksQ0FDeEIsQ0FBQTtRQUNILENBQUM7UUFFRCxPQUFPO1lBQ0wsaUJBQWlCLENBQUMsSUFBSTtnQkFDcEIsOEJBQThCO2dCQUM5QixJQUFJLGlCQUFpQixDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsRUFBRSxDQUFDO29CQUN2QyxZQUFZLEVBQUUsQ0FBQTtnQkFDaEIsQ0FBQztnQkFFRCx3REFBd0Q7Z0JBQ3hELElBQUksWUFBWSxHQUFHLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLEVBQUUsQ0FBQztvQkFDN0QsT0FBTyxDQUFDLE1BQU0sQ0FBQzt3QkFDYixJQUFJO3dCQUNKLFNBQVMsRUFBRSxzQkFBc0I7cUJBQ2xDLENBQUMsQ0FBQTtnQkFDSixDQUFDO1lBQ0gsQ0FBQztZQUVELGlCQUFpQixDQUFDLElBQUk7Z0JBQ3BCLDZCQUE2QjtnQkFDN0IsSUFDRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxlQUFlO29CQUNsQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxTQUFTLEVBQzVCLENBQUM7b0JBQ0QsWUFBWSxFQUFFLENBQUE7Z0JBQ2hCLENBQUM7WUFDSCxDQUFDO1NBQ0YsQ0FBQTtJQUNILENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFU0xpbnRVdGlscywgVFNFU1RyZWUgfSBmcm9tICdAdHlwZXNjcmlwdC1lc2xpbnQvdXRpbHMnXG5pbXBvcnQgeyBnZXRDYW5vblVybCwgZ2V0Q2Fub25QYXR0ZXJuIH0gZnJvbSAnLi4vdXRpbHMvY2Fub24nXG5cbmNvbnN0IFJVTEVfTkFNRSA9ICduby1jb250YWluZXItaW4tc2VjdGlvbidcbmNvbnN0IHBhdHRlcm4gPSBnZXRDYW5vblBhdHRlcm4oUlVMRV9OQU1FKVxuXG5jb25zdCBjcmVhdGVSdWxlID0gRVNMaW50VXRpbHMuUnVsZUNyZWF0b3IoKCkgPT4gZ2V0Q2Fub25VcmwoUlVMRV9OQU1FKSlcblxudHlwZSBNZXNzYWdlSWRzID0gJ25vQ29udGFpbmVySW5TZWN0aW9uJ1xuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVSdWxlPFtdLCBNZXNzYWdlSWRzPih7XG4gIG5hbWU6IFJVTEVfTkFNRSxcbiAgbWV0YToge1xuICAgIHR5cGU6ICdzdWdnZXN0aW9uJyxcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjogcGF0dGVybj8uc3VtbWFyeSB8fCAnTm8gQ29udGFpbmVyIGluc2lkZSBTZWN0aW9uJyxcbiAgICB9LFxuICAgIG1lc3NhZ2VzOiB7XG4gICAgICBub0NvbnRhaW5lckluU2VjdGlvbjogYFtDYW5vbiAke3BhdHRlcm4/LmlkIHx8ICcwMDInfV0gQ29udGFpbmVyIGluc2lkZSBTZWN0aW9uIGlzIHJlZHVuZGFudC4gU2VjdGlvbiBhbHJlYWR5IHByb3ZpZGVzIG1heC13aWR0aCBjb250YWlubWVudC4gVXNlIFNlY3Rpb24ncyBpbm5lckFsaWduIHByb3Agb3IgYSBwbGFpbiBkaXYgaW5zdGVhZC5gLFxuICAgIH0sXG4gICAgc2NoZW1hOiBbXSxcbiAgfSxcbiAgZGVmYXVsdE9wdGlvbnM6IFtdLFxuICBjcmVhdGUoY29udGV4dCkge1xuICAgIC8vIFRyYWNrIGlmIHdlJ3JlIGluc2lkZSBhIFNlY3Rpb24gY29tcG9uZW50XG4gICAgbGV0IHNlY3Rpb25EZXB0aCA9IDBcblxuICAgIGZ1bmN0aW9uIGlzSlNYRWxlbWVudE5hbWVkKFxuICAgICAgbm9kZTogVFNFU1RyZWUuSlNYT3BlbmluZ0VsZW1lbnQsXG4gICAgICBuYW1lOiBzdHJpbmdcbiAgICApOiBib29sZWFuIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIG5vZGUubmFtZS50eXBlID09PSAnSlNYSWRlbnRpZmllcicgJiZcbiAgICAgICAgbm9kZS5uYW1lLm5hbWUgPT09IG5hbWVcbiAgICAgIClcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgSlNYT3BlbmluZ0VsZW1lbnQobm9kZSkge1xuICAgICAgICAvLyBDaGVjayBpZiBlbnRlcmluZyBhIFNlY3Rpb25cbiAgICAgICAgaWYgKGlzSlNYRWxlbWVudE5hbWVkKG5vZGUsICdTZWN0aW9uJykpIHtcbiAgICAgICAgICBzZWN0aW9uRGVwdGgrK1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgd2UncmUgaW5zaWRlIGEgU2VjdGlvbiBhbmQgZm91bmQgYSBDb250YWluZXJcbiAgICAgICAgaWYgKHNlY3Rpb25EZXB0aCA+IDAgJiYgaXNKU1hFbGVtZW50TmFtZWQobm9kZSwgJ0NvbnRhaW5lcicpKSB7XG4gICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIG1lc3NhZ2VJZDogJ25vQ29udGFpbmVySW5TZWN0aW9uJyxcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICBKU1hDbG9zaW5nRWxlbWVudChub2RlKSB7XG4gICAgICAgIC8vIENoZWNrIGlmIGxlYXZpbmcgYSBTZWN0aW9uXG4gICAgICAgIGlmIChcbiAgICAgICAgICBub2RlLm5hbWUudHlwZSA9PT0gJ0pTWElkZW50aWZpZXInICYmXG4gICAgICAgICAgbm9kZS5uYW1lLm5hbWUgPT09ICdTZWN0aW9uJ1xuICAgICAgICApIHtcbiAgICAgICAgICBzZWN0aW9uRGVwdGgtLVxuICAgICAgICB9XG4gICAgICB9LFxuICAgIH1cbiAgfSxcbn0pXG4iXX0=