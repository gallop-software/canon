import { getCanonUrl, getCanonPattern } from '../utils/canon.js';
const RULE_NAME = 'prefer-typography-components';
const pattern = getCanonPattern(RULE_NAME);
const rule = {
    meta: {
        type: 'suggestion',
        docs: {
            description: pattern?.summary || 'Use Paragraph/Span, not raw tags',
            recommended: true,
            url: getCanonUrl(RULE_NAME),
        },
        messages: {
            useParagraph: `[Canon ${pattern?.id || '003'}] Use the Paragraph component instead of <p>. Import: import { Paragraph } from "@/components"`,
            useSpan: `[Canon ${pattern?.id || '003'}] Use the Span component instead of <span> for text content. Import: import { Span } from "@/components"`,
        },
        schema: [],
    },
    create(context) {
        const filename = context.filename || context.getFilename();
        // Only apply to block files
        if (!filename.includes('/blocks/')) {
            return {};
        }
        return {
            JSXOpeningElement(node) {
                const elementName = node.name?.name;
                if (elementName === 'p') {
                    context.report({
                        node,
                        messageId: 'useParagraph',
                    });
                }
                if (elementName === 'span') {
                    // Skip spans that are inside typography components (Heading, Paragraph, Label, etc.)
                    // These are used for inline styling effects like gradient text, emphasis, etc.
                    const typographyComponents = ['Heading', 'Paragraph', 'Label', 'Span', 'Quote', 'Subheading', 'Accent'];
                    let parent = node.parent;
                    while (parent) {
                        if (parent.type === 'JSXElement' &&
                            parent.openingElement?.name?.name &&
                            typographyComponents.includes(parent.openingElement.name.name)) {
                            // Span is inside a typography component, skip warning
                            return;
                        }
                        parent = parent.parent;
                    }
                    // Check className for gradient text (skip these)
                    let isGradientText = false;
                    let isVisualElement = false;
                    node.attributes?.forEach((attr) => {
                        if (attr.type === 'JSXAttribute' && attr.name?.name === 'className') {
                            const value = attr.value?.value || '';
                            // Skip gradient text spans (bg-clip-text is used for gradient text effects)
                            if (/\bbg-clip-text\b/.test(value)) {
                                isGradientText = true;
                            }
                            // Skip visual elements (dots, decorative elements with w-/h- but no text)
                            if (/\b(w-\d|h-\d|rounded-full)\b/.test(value) && !/\btext-/.test(value)) {
                                isVisualElement = true;
                            }
                        }
                    });
                    if (isGradientText) {
                        return;
                    }
                    // Check if span contains text content
                    const jsxElement = node.parent;
                    if (jsxElement?.type === 'JSXElement') {
                        const children = jsxElement.children || [];
                        const hasTextContent = children.some((child) => {
                            // Check for direct text content
                            if (child.type === 'JSXText') {
                                return child.value.trim().length > 0;
                            }
                            // Check for expression with literal string
                            if (child.type === 'JSXExpressionContainer' && child.expression?.type === 'Literal') {
                                return typeof child.expression.value === 'string' && child.expression.value.trim().length > 0;
                            }
                            return false;
                        });
                        // Warn if span has text content and is not a visual element
                        if (hasTextContent && !isVisualElement) {
                            context.report({
                                node,
                                messageId: 'useSpan',
                            });
                        }
                    }
                }
            },
        };
    },
};
export default rule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZmVyLXR5cG9ncmFwaHktY29tcG9uZW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lc2xpbnQvcnVsZXMvcHJlZmVyLXR5cG9ncmFwaHktY29tcG9uZW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFBO0FBRWhFLE1BQU0sU0FBUyxHQUFHLDhCQUE4QixDQUFBO0FBQ2hELE1BQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUUxQyxNQUFNLElBQUksR0FBb0I7SUFDNUIsSUFBSSxFQUFFO1FBQ0osSUFBSSxFQUFFLFlBQVk7UUFDbEIsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFLE9BQU8sRUFBRSxPQUFPLElBQUksa0NBQWtDO1lBQ25FLFdBQVcsRUFBRSxJQUFJO1lBQ2pCLEdBQUcsRUFBRSxXQUFXLENBQUMsU0FBUyxDQUFDO1NBQzVCO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsWUFBWSxFQUFFLFVBQVUsT0FBTyxFQUFFLEVBQUUsSUFBSSxLQUFLLGdHQUFnRztZQUM1SSxPQUFPLEVBQUUsVUFBVSxPQUFPLEVBQUUsRUFBRSxJQUFJLEtBQUssMEdBQTBHO1NBQ2xKO1FBQ0QsTUFBTSxFQUFFLEVBQUU7S0FDWDtJQUVELE1BQU0sQ0FBQyxPQUFPO1FBQ1osTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUE7UUFFMUQsNEJBQTRCO1FBQzVCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7WUFDbkMsT0FBTyxFQUFFLENBQUE7UUFDWCxDQUFDO1FBRUQsT0FBTztZQUNMLGlCQUFpQixDQUFDLElBQVM7Z0JBQ3pCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFBO2dCQUVu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RixDQUFDOzRCQUNELE9BQU8sS0FBSyxDQUFBO3dCQUNkLENBQUMsQ0FBQyxDQUFBO3dCQUVGLDREQUE0RDt3QkFDNUQsSUFBSSxjQUFjLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQzs0QkFDdkMsT0FBTyxDQUFDLE1BQU0sQ0FBQztnQ0FDYixJQUFJO2dDQUNKLFNBQVMsRUFBRSxTQUFTOzZCQUNyQixDQUFDLENBQUE7d0JBQ0osQ0FBQztvQkFDSCxDQUFDO2dCQUNILENBQUM7WUFDSCxDQUFDO1NBQ0YsQ0FBQTtJQUNILENBQUM7Q0FDRixDQUFBO0FBRUQsZUFBZSxJQUFJLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFJ1bGUgfSBmcm9tICdlc2xpbnQnXG5pbXBvcnQgeyBnZXRDYW5vblVybCwgZ2V0Q2Fub25QYXR0ZXJuIH0gZnJvbSAnLi4vdXRpbHMvY2Fub24uanMnXG5cbmNvbnN0IFJVTEVfTkFNRSA9ICdwcmVmZXItdHlwb2dyYXBoeS1jb21wb25lbnRzJ1xuY29uc3QgcGF0dGVybiA9IGdldENhbm9uUGF0dGVybihSVUxFX05BTUUpXG5cbmNvbnN0IHJ1bGU6IFJ1bGUuUnVsZU1vZHVsZSA9IHtcbiAgbWV0YToge1xuICAgIHR5cGU6ICdzdWdnZXN0aW9uJyxcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjogcGF0dGVybj8uc3VtbWFyeSB8fCAnVXNlIFBhcmFncmFwaC9TcGFuLCBub3QgcmF3IHRhZ3MnLFxuICAgICAgcmVjb21tZW5kZWQ6IHRydWUsXG4gICAgICB1cmw6IGdldENhbm9uVXJsKFJVTEVfTkFNRSksXG4gICAgfSxcbiAgICBtZXNzYWdlczoge1xuICAgICAgdXNlUGFyYWdyYXBoOiBgW0Nhbm9uICR7cGF0dGVybj8uaWQgfHwgJzAwMyd9XSBVc2UgdGhlIFBhcmFncmFwaCBjb21wb25lbnQgaW5zdGVhZCBvZiA8cD4uIEltcG9ydDogaW1wb3J0IHsgUGFyYWdyYXBoIH0gZnJvbSBcIkAvY29tcG9uZW50c1wiYCxcbiAgICAgIHVzZVNwYW46IGBbQ2Fub24gJHtwYXR0ZXJuPy5pZCB8fCAnMDAzJ31dIFVzZSB0aGUgU3BhbiBjb21wb25lbnQgaW5zdGVhZCBvZiA8c3Bhbj4gZm9yIHRleHQgY29udGVudC4gSW1wb3J0OiBpbXBvcnQgeyBTcGFuIH0gZnJvbSBcIkAvY29tcG9uZW50c1wiYCxcbiAgICB9LFxuICAgIHNjaGVtYTogW10sXG4gIH0sXG5cbiAgY3JlYXRlKGNvbnRleHQpIHtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGNvbnRleHQuZmlsZW5hbWUgfHwgY29udGV4dC5nZXRGaWxlbmFtZSgpXG5cbiAgICAvLyBPbmx5IGFwcGx5IHRvIGJsb2NrIGZpbGVzXG4gICAgaWYgKCFmaWxlbmFtZS5pbmNsdWRlcygnL2Jsb2Nrcy8nKSkge1xuICAgICAgcmV0dXJuIHt9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIEpTWE9wZW5pbmdFbGVtZW50KG5vZGU6IGFueSkge1xuICAgICAgICBjb25zdCBlbGVtZW50TmFtZSA9IG5vZGUubmFtZT8ubmFtZVxuXG4gICAgICAgIGlmIChlbGVtZW50TmFtZSA9PT0gJ3AnKSB7XG4gICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIG1lc3NhZ2VJZDogJ3VzZVBhcmFncmFwaCcsXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbGVtZW50TmFtZSA9PT0gJ3NwYW4nKSB7XG4gICAgICAgICAgLy8gU2tpcCBzcGFucyB0aGF0IGFyZSBpbnNpZGUgdHlwb2dyYXBoeSBjb21wb25lbnRzIChIZWFkaW5nLCBQYXJhZ3JhcGgsIExhYmVsLCBldGMuKVxuICAgICAgICAgIC8vIFRoZXNlIGFyZSB1c2VkIGZvciBpbmxpbmUgc3R5bGluZyBlZmZlY3RzIGxpa2UgZ3JhZGllbnQgdGV4dCwgZW1waGFzaXMsIGV0Yy5cbiAgICAgICAgICBjb25zdCB0eXBvZ3JhcGh5Q29tcG9uZW50cyA9IFsnSGVhZGluZycsICdQYXJhZ3JhcGgnLCAnTGFiZWwnLCAnU3BhbicsICdRdW90ZScsICdTdWJoZWFkaW5nJywgJ0FjY2VudCddXG4gICAgICAgICAgXG4gICAgICAgICAgbGV0IHBhcmVudCA9IG5vZGUucGFyZW50XG4gICAgICAgICAgd2hpbGUgKHBhcmVudCkge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICBwYXJlbnQudHlwZSA9PT0gJ0pTWEVsZW1lbnQnICYmXG4gICAgICAgICAgICAgIHBhcmVudC5vcGVuaW5nRWxlbWVudD8ubmFtZT8ubmFtZSAmJlxuICAgICAgICAgICAgICB0eXBvZ3JhcGh5Q29tcG9uZW50cy5pbmNsdWRlcyhwYXJlbnQub3BlbmluZ0VsZW1lbnQubmFtZS5uYW1lKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIC8vIFNwYW4gaXMgaW5zaWRlIGEgdHlwb2dyYXBoeSBjb21wb25lbnQsIHNraXAgd2FybmluZ1xuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnRcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBDaGVjayBjbGFzc05hbWUgZm9yIGdyYWRpZW50IHRleHQgKHNraXAgdGhlc2UpXG4gICAgICAgICAgbGV0IGlzR3JhZGllbnRUZXh0ID0gZmFsc2VcbiAgICAgICAgICBsZXQgaXNWaXN1YWxFbGVtZW50ID0gZmFsc2VcblxuICAgICAgICAgIG5vZGUuYXR0cmlidXRlcz8uZm9yRWFjaCgoYXR0cjogYW55KSA9PiB7XG4gICAgICAgICAgICBpZiAoYXR0ci50eXBlID09PSAnSlNYQXR0cmlidXRlJyAmJiBhdHRyLm5hbWU/Lm5hbWUgPT09ICdjbGFzc05hbWUnKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gYXR0ci52YWx1ZT8udmFsdWUgfHwgJydcbiAgICAgICAgICAgICAgLy8gU2tpcCBncmFkaWVudCB0ZXh0IHNwYW5zIChiZy1jbGlwLXRleHQgaXMgdXNlZCBmb3IgZ3JhZGllbnQgdGV4dCBlZmZlY3RzKVxuICAgICAgICAgICAgICBpZiAoL1xcYmJnLWNsaXAtdGV4dFxcYi8udGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBpc0dyYWRpZW50VGV4dCA9IHRydWVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvLyBTa2lwIHZpc3VhbCBlbGVtZW50cyAoZG90cywgZGVjb3JhdGl2ZSBlbGVtZW50cyB3aXRoIHctL2gtIGJ1dCBubyB0ZXh0KVxuICAgICAgICAgICAgICBpZiAoL1xcYih3LVxcZHxoLVxcZHxyb3VuZGVkLWZ1bGwpXFxiLy50ZXN0KHZhbHVlKSAmJiAhL1xcYnRleHQtLy50ZXN0KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGlzVmlzdWFsRWxlbWVudCA9IHRydWVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICBpZiAoaXNHcmFkaWVudFRleHQpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIENoZWNrIGlmIHNwYW4gY29udGFpbnMgdGV4dCBjb250ZW50XG4gICAgICAgICAgY29uc3QganN4RWxlbWVudCA9IG5vZGUucGFyZW50XG4gICAgICAgICAgaWYgKGpzeEVsZW1lbnQ/LnR5cGUgPT09ICdKU1hFbGVtZW50Jykge1xuICAgICAgICAgICAgY29uc3QgY2hpbGRyZW4gPSBqc3hFbGVtZW50LmNoaWxkcmVuIHx8IFtdXG4gICAgICAgICAgICBjb25zdCBoYXNUZXh0Q29udGVudCA9IGNoaWxkcmVuLnNvbWUoKGNoaWxkOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIGRpcmVjdCB0ZXh0IGNvbnRlbnRcbiAgICAgICAgICAgICAgaWYgKGNoaWxkLnR5cGUgPT09ICdKU1hUZXh0Jykge1xuICAgICAgICAgICAgICAgIHJldHVybiBjaGlsZC52YWx1ZS50cmltKCkubGVuZ3RoID4gMFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vIENoZWNrIGZvciBleHByZXNzaW9uIHdpdGggbGl0ZXJhbCBzdHJpbmdcbiAgICAgICAgICAgICAgaWYgKGNoaWxkLnR5cGUgPT09ICdKU1hFeHByZXNzaW9uQ29udGFpbmVyJyAmJiBjaGlsZC5leHByZXNzaW9uPy50eXBlID09PSAnTGl0ZXJhbCcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mIGNoaWxkLmV4cHJlc3Npb24udmFsdWUgPT09ICdzdHJpbmcnICYmIGNoaWxkLmV4cHJlc3Npb24udmFsdWUudHJpbSgpLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIC8vIFdhcm4gaWYgc3BhbiBoYXMgdGV4dCBjb250ZW50IGFuZCBpcyBub3QgYSB2aXN1YWwgZWxlbWVudFxuICAgICAgICAgICAgaWYgKGhhc1RleHRDb250ZW50ICYmICFpc1Zpc3VhbEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICAgICAgbWVzc2FnZUlkOiAndXNlU3BhbicsXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgIH1cbiAgfSxcbn1cblxuZXhwb3J0IGRlZmF1bHQgcnVsZVxuIl19