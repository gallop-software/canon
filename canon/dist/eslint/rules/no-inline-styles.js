import { ESLintUtils } from '@typescript-eslint/utils';
import { getCanonUrl, getCanonPattern } from '../utils/canon.js';
const RULE_NAME = 'no-inline-styles';
const pattern = getCanonPattern(RULE_NAME);
const createRule = ESLintUtils.RuleCreator(() => getCanonUrl(RULE_NAME));
export default createRule({
    name: RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: pattern?.summary || 'No inline styles in blocks, use Tailwind exclusively',
        },
        messages: {
            noInlineStyles: `[Canon ${pattern?.id || '008'}] Avoid inline style attribute in blocks. Use Tailwind CSS classes instead. See: ${pattern?.title || 'Tailwind Only'} pattern.`,
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        const filename = context.filename || context.getFilename();
        // Only enforce in blocks - components can use inline styles for dynamic values
        const isBlock = filename.includes('/blocks/') || filename.includes('\\blocks\\');
        if (!isBlock) {
            return {};
        }
        return {
            JSXAttribute(node) {
                // Check if attribute is "style"
                if (node.name.type === 'JSXIdentifier' &&
                    node.name.name === 'style') {
                    context.report({
                        node,
                        messageId: 'noInlineStyles',
                    });
                }
            },
        };
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm8taW5saW5lLXN0eWxlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lc2xpbnQvcnVsZXMvbm8taW5saW5lLXN0eWxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sMEJBQTBCLENBQUE7QUFDdEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQTtBQUVoRSxNQUFNLFNBQVMsR0FBRyxrQkFBa0IsQ0FBQTtBQUNwQyxNQUFNLE9BQU8sR0FBRyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUE7QUFFMUMsTUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQTtBQUl4RSxlQUFlLFVBQVUsQ0FBaUI7SUFDeEMsSUFBSSxFQUFFLFNBQVM7SUFDZixJQUFJLEVBQUU7UUFDSixJQUFJLEVBQUUsWUFBWTtRQUNsQixJQUFJLEVBQUU7WUFDSixXQUFXLEVBQUUsT0FBTyxFQUFFLE9BQU8sSUFBSSxzREFBc0Q7U0FDeEY7UUFDRCxRQUFRLEVBQUU7WUFDUixjQUFjLEVBQUUsVUFBVSxPQUFPLEVBQUUsRUFBRSxJQUFJLEtBQUssb0ZBQW9GLE9BQU8sRUFBRSxLQUFLLElBQUksZUFBZSxXQUFXO1NBQy9LO1FBQ0QsTUFBTSxFQUFFLEVBQUU7S0FDWDtJQUNELGNBQWMsRUFBRSxFQUFFO0lBQ2xCLE1BQU0sQ0FBQyxPQUFPO1FBQ1osTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUE7UUFFMUQsK0VBQStFO1FBQy9FLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQTtRQUVoRixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDYixPQUFPLEVBQUUsQ0FBQTtRQUNYLENBQUM7UUFFRCxPQUFPO1lBQ0wsWUFBWSxDQUFDLElBQUk7Z0JBQ2YsZ0NBQWdDO2dCQUNoQyxJQUNFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLGVBQWU7b0JBQ2xDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLE9BQU8sRUFDMUIsQ0FBQztvQkFDRCxPQUFPLENBQUMsTUFBTSxDQUFDO3dCQUNiLElBQUk7d0JBQ0osU0FBUyxFQUFFLGdCQUFnQjtxQkFDNUIsQ0FBQyxDQUFBO2dCQUNKLENBQUM7WUFDSCxDQUFDO1NBQ0YsQ0FBQTtJQUNILENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFU0xpbnRVdGlscyB9IGZyb20gJ0B0eXBlc2NyaXB0LWVzbGludC91dGlscydcbmltcG9ydCB7IGdldENhbm9uVXJsLCBnZXRDYW5vblBhdHRlcm4gfSBmcm9tICcuLi91dGlscy9jYW5vbi5qcydcblxuY29uc3QgUlVMRV9OQU1FID0gJ25vLWlubGluZS1zdHlsZXMnXG5jb25zdCBwYXR0ZXJuID0gZ2V0Q2Fub25QYXR0ZXJuKFJVTEVfTkFNRSlcblxuY29uc3QgY3JlYXRlUnVsZSA9IEVTTGludFV0aWxzLlJ1bGVDcmVhdG9yKCgpID0+IGdldENhbm9uVXJsKFJVTEVfTkFNRSkpXG5cbnR5cGUgTWVzc2FnZUlkcyA9ICdub0lubGluZVN0eWxlcydcblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlUnVsZTxbXSwgTWVzc2FnZUlkcz4oe1xuICBuYW1lOiBSVUxFX05BTUUsXG4gIG1ldGE6IHtcbiAgICB0eXBlOiAnc3VnZ2VzdGlvbicsXG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246IHBhdHRlcm4/LnN1bW1hcnkgfHwgJ05vIGlubGluZSBzdHlsZXMgaW4gYmxvY2tzLCB1c2UgVGFpbHdpbmQgZXhjbHVzaXZlbHknLFxuICAgIH0sXG4gICAgbWVzc2FnZXM6IHtcbiAgICAgIG5vSW5saW5lU3R5bGVzOiBgW0Nhbm9uICR7cGF0dGVybj8uaWQgfHwgJzAwOCd9XSBBdm9pZCBpbmxpbmUgc3R5bGUgYXR0cmlidXRlIGluIGJsb2Nrcy4gVXNlIFRhaWx3aW5kIENTUyBjbGFzc2VzIGluc3RlYWQuIFNlZTogJHtwYXR0ZXJuPy50aXRsZSB8fCAnVGFpbHdpbmQgT25seSd9IHBhdHRlcm4uYCxcbiAgICB9LFxuICAgIHNjaGVtYTogW10sXG4gIH0sXG4gIGRlZmF1bHRPcHRpb25zOiBbXSxcbiAgY3JlYXRlKGNvbnRleHQpIHtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGNvbnRleHQuZmlsZW5hbWUgfHwgY29udGV4dC5nZXRGaWxlbmFtZSgpXG4gICAgXG4gICAgLy8gT25seSBlbmZvcmNlIGluIGJsb2NrcyAtIGNvbXBvbmVudHMgY2FuIHVzZSBpbmxpbmUgc3R5bGVzIGZvciBkeW5hbWljIHZhbHVlc1xuICAgIGNvbnN0IGlzQmxvY2sgPSBmaWxlbmFtZS5pbmNsdWRlcygnL2Jsb2Nrcy8nKSB8fCBmaWxlbmFtZS5pbmNsdWRlcygnXFxcXGJsb2Nrc1xcXFwnKVxuICAgIFxuICAgIGlmICghaXNCbG9jaykge1xuICAgICAgcmV0dXJuIHt9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIEpTWEF0dHJpYnV0ZShub2RlKSB7XG4gICAgICAgIC8vIENoZWNrIGlmIGF0dHJpYnV0ZSBpcyBcInN0eWxlXCJcbiAgICAgICAgaWYgKFxuICAgICAgICAgIG5vZGUubmFtZS50eXBlID09PSAnSlNYSWRlbnRpZmllcicgJiZcbiAgICAgICAgICBub2RlLm5hbWUubmFtZSA9PT0gJ3N0eWxlJ1xuICAgICAgICApIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbWVzc2FnZUlkOiAnbm9JbmxpbmVTdHlsZXMnLFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfVxuICB9LFxufSlcbiJdfQ==