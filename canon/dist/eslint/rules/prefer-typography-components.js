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
            useTypographyForDiv: `[Canon ${pattern?.id || '003'}] Use a typography component (Heading, Paragraph, Label, etc.) instead of <div> with text content.`,
        },
        schema: [],
    },
    create(context) {
        const filename = context.filename || context.getFilename();
        // Only apply to block files
        if (!filename.includes('/blocks/')) {
            return {};
        }
        const typographyComponents = ['Heading', 'Paragraph', 'Label', 'Span', 'Quote', 'Subheading', 'Accent'];
        /**
         * Check if element is inside a typography component
         */
        function isInsideTypographyComponent(node) {
            let parent = node.parent;
            while (parent) {
                if (parent.type === 'JSXElement' &&
                    parent.openingElement?.name?.name &&
                    typographyComponents.includes(parent.openingElement.name.name)) {
                    return true;
                }
                parent = parent.parent;
            }
            return false;
        }
        /**
         * Check if element has direct text content
         */
        function hasDirectTextContent(node) {
            const jsxElement = node.parent;
            if (jsxElement?.type !== 'JSXElement')
                return false;
            const children = jsxElement.children || [];
            return children.some((child) => {
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
        }
        /**
         * Check className for specific patterns
         */
        function getClassNameInfo(node) {
            let isGradientText = false;
            let isVisualElement = false;
            let hasTextClasses = false;
            node.attributes?.forEach((attr) => {
                if (attr.type === 'JSXAttribute' && attr.name?.name === 'className') {
                    const value = attr.value?.value || '';
                    // Skip gradient text (bg-clip-text is used for gradient text effects)
                    if (/\bbg-clip-text\b/.test(value)) {
                        isGradientText = true;
                    }
                    // Visual elements (dots, decorative elements with w-/h- but no text classes)
                    if (/\b(w-\d|h-\d|rounded-full)\b/.test(value) && !/\btext-/.test(value)) {
                        isVisualElement = true;
                    }
                    // Has text-related classes
                    if (/\b(text-|font-|leading-|tracking-)/.test(value)) {
                        hasTextClasses = true;
                    }
                }
            });
            return { isGradientText, isVisualElement, hasTextClasses };
        }
        return {
            JSXOpeningElement(node) {
                const elementName = node.name?.name;
                // Check <p> tags
                if (elementName === 'p') {
                    context.report({
                        node,
                        messageId: 'useParagraph',
                    });
                    return;
                }
                // Check <span> tags
                if (elementName === 'span') {
                    if (isInsideTypographyComponent(node)) {
                        return;
                    }
                    const { isGradientText, isVisualElement } = getClassNameInfo(node);
                    if (isGradientText || isVisualElement) {
                        return;
                    }
                    if (hasDirectTextContent(node)) {
                        context.report({
                            node,
                            messageId: 'useSpan',
                        });
                    }
                    return;
                }
                // Check <div> tags with text content and text styling
                if (elementName === 'div') {
                    if (isInsideTypographyComponent(node)) {
                        return;
                    }
                    const { hasTextClasses } = getClassNameInfo(node);
                    // Only flag divs that have both text content AND text-related classes
                    // This indicates it's being used for typography rather than layout
                    if (hasTextClasses && hasDirectTextContent(node)) {
                        context.report({
                            node,
                            messageId: 'useTypographyForDiv',
                        });
                    }
                }
            },
        };
    },
};
export default rule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZmVyLXR5cG9ncmFwaHktY29tcG9uZW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lc2xpbnQvcnVsZXMvcHJlZmVyLXR5cG9ncmFwaHktY29tcG9uZW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFBO0FBRWhFLE1BQU0sU0FBUyxHQUFHLDhCQUE4QixDQUFBO0FBQ2hELE1BQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUUxQyxNQUFNLElBQUksR0FBb0I7SUFDNUIsSUFBSSxFQUFFO1FBQ0osSUFBSSxFQUFFLFlBQVk7UUFDbEIsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFLE9BQU8sRUFBRSxPQUFPLElBQUksa0NBQWtDO1lBQ25FLFdBQVcsRUFBRSxJQUFJO1lBQ2pCLEdBQUcsRUFBRSxXQUFXLENBQUMsU0FBUyxDQUFDO1NBQzVCO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsWUFBWSxFQUFFLFVBQVUsT0FBTyxFQUFFLEVBQUUsSUFBSSxLQUFLLGdHQUFnRztZQUM1SSxPQUFPLEVBQUUsVUFBVSxPQUFPLEVBQUUsRUFBRSxJQUFJLEtBQUssMEdBQTBHO1lBQ2pKLG1CQUFtQixFQUFFLFVBQVUsT0FBTyxFQUFFLEVBQUUsSUFBSSxLQUFLLG9HQUFvRztTQUN4SjtRQUNELE1BQU0sRUFBRSxFQUFFO0tBQ1g7SUFFRCxNQUFNLENBQUMsT0FBTztRQUNaLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFBO1FBRTFELDRCQUE0QjtRQUM1QixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDO1lBQ25DLE9BQU8sRUFBRSxDQUFBO1FBQ1gsQ0FBQztRQUVELE1BQU0sb0JBQW9CLEdBQUcsQ0FBQyxTQUFTLEVB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QUVqRCxzRUFBc0U7b0JBQ3RFLG1FQUFtRTtvQkFDbkUsSUFBSSxjQUFjLElBQUksb0JBQW9CLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQzt3QkFDakQsT0FBTyxDQUFDLE1BQU0sQ0FBQzs0QkFDYixJQUFJOzRCQUNKLFNBQVMsRUFBRSxxQkFBcUI7eUJBQ2pDLENBQUMsQ0FBQTtvQkFDSixDQUFDO2dCQUNILENBQUM7WUFDSCxDQUFDO1NBQ0YsQ0FBQTtJQUNILENBQUM7Q0FDRixDQUFBO0FBRUQsZUFBZSxJQUFJLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFJ1bGUgfSBmcm9tICdlc2xpbnQnXG5pbXBvcnQgeyBnZXRDYW5vblVybCwgZ2V0Q2Fub25QYXR0ZXJuIH0gZnJvbSAnLi4vdXRpbHMvY2Fub24uanMnXG5cbmNvbnN0IFJVTEVfTkFNRSA9ICdwcmVmZXItdHlwb2dyYXBoeS1jb21wb25lbnRzJ1xuY29uc3QgcGF0dGVybiA9IGdldENhbm9uUGF0dGVybihSVUxFX05BTUUpXG5cbmNvbnN0IHJ1bGU6IFJ1bGUuUnVsZU1vZHVsZSA9IHtcbiAgbWV0YToge1xuICAgIHR5cGU6ICdzdWdnZXN0aW9uJyxcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjogcGF0dGVybj8uc3VtbWFyeSB8fCAnVXNlIFBhcmFncmFwaC9TcGFuLCBub3QgcmF3IHRhZ3MnLFxuICAgICAgcmVjb21tZW5kZWQ6IHRydWUsXG4gICAgICB1cmw6IGdldENhbm9uVXJsKFJVTEVfTkFNRSksXG4gICAgfSxcbiAgICBtZXNzYWdlczoge1xuICAgICAgdXNlUGFyYWdyYXBoOiBgW0Nhbm9uICR7cGF0dGVybj8uaWQgfHwgJzAwMyd9XSBVc2UgdGhlIFBhcmFncmFwaCBjb21wb25lbnQgaW5zdGVhZCBvZiA8cD4uIEltcG9ydDogaW1wb3J0IHsgUGFyYWdyYXBoIH0gZnJvbSBcIkAvY29tcG9uZW50c1wiYCxcbiAgICAgIHVzZVNwYW46IGBbQ2Fub24gJHtwYXR0ZXJuPy5pZCB8fCAnMDAzJ31dIFVzZSB0aGUgU3BhbiBjb21wb25lbnQgaW5zdGVhZCBvZiA8c3Bhbj4gZm9yIHRleHQgY29udGVudC4gSW1wb3J0OiBpbXBvcnQgeyBTcGFuIH0gZnJvbSBcIkAvY29tcG9uZW50c1wiYCxcbiAgICAgIHVzZVR5cG9ncmFwaHlGb3JEaXY6IGBbQ2Fub24gJHtwYXR0ZXJuPy5pZCB8fCAnMDAzJ31dIFVzZSBhIHR5cG9ncmFwaHkgY29tcG9uZW50IChIZWFkaW5nLCBQYXJhZ3JhcGgsIExhYmVsLCBldGMuKSBpbnN0ZWFkIG9mIDxkaXY+IHdpdGggdGV4dCBjb250ZW50LmAsXG4gICAgfSxcbiAgICBzY2hlbWE6IFtdLFxuICB9LFxuXG4gIGNyZWF0ZShjb250ZXh0KSB7XG4gICAgY29uc3QgZmlsZW5hbWUgPSBjb250ZXh0LmZpbGVuYW1lIHx8IGNvbnRleHQuZ2V0RmlsZW5hbWUoKVxuXG4gICAgLy8gT25seSBhcHBseSB0byBibG9jayBmaWxlc1xuICAgIGlmICghZmlsZW5hbWUuaW5jbHVkZXMoJy9ibG9ja3MvJykpIHtcbiAgICAgIHJldHVybiB7fVxuICAgIH1cblxuICAgIGNvbnN0IHR5cG9ncmFwaHlDb21wb25lbnRzID0gWydIZWFkaW5nJywgJ1BhcmFncmFwaCcsICdMYWJlbCcsICdTcGFuJywgJ1F1b3RlJywgJ1N1YmhlYWRpbmcnLCAnQWNjZW50J11cblxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIGVsZW1lbnQgaXMgaW5zaWRlIGEgdHlwb2dyYXBoeSBjb21wb25lbnRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc0luc2lkZVR5cG9ncmFwaHlDb21wb25lbnQobm9kZTogYW55KTogYm9vbGVhbiB7XG4gICAgICBsZXQgcGFyZW50ID0gbm9kZS5wYXJlbnRcbiAgICAgIHdoaWxlIChwYXJlbnQpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHBhcmVudC50eXBlID09PSAnSlNYRWxlbWVudCcgJiZcbiAgICAgICAgICBwYXJlbnQub3BlbmluZ0VsZW1lbnQ/Lm5hbWU/Lm5hbWUgJiZcbiAgICAgICAgICB0eXBvZ3JhcGh5Q29tcG9uZW50cy5pbmNsdWRlcyhwYXJlbnQub3BlbmluZ0VsZW1lbnQubmFtZS5uYW1lKVxuICAgICAgICApIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnRcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIGVsZW1lbnQgaGFzIGRpcmVjdCB0ZXh0IGNvbnRlbnRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBoYXNEaXJlY3RUZXh0Q29udGVudChub2RlOiBhbnkpOiBib29sZWFuIHtcbiAgICAgIGNvbnN0IGpzeEVsZW1lbnQgPSBub2RlLnBhcmVudFxuICAgICAgaWYgKGpzeEVsZW1lbnQ/LnR5cGUgIT09ICdKU1hFbGVtZW50JykgcmV0dXJuIGZhbHNlXG5cbiAgICAgIGNvbnN0IGNoaWxkcmVuID0ganN4RWxlbWVudC5jaGlsZHJlbiB8fCBbXVxuICAgICAgcmV0dXJuIGNoaWxkcmVuLnNvbWUoKGNoaWxkOiBhbnkpID0+IHtcbiAgICAgICAgLy8gQ2hlY2sgZm9yIGRpcmVjdCB0ZXh0IGNvbnRlbnRcbiAgICAgICAgaWYgKGNoaWxkLnR5cGUgPT09ICdKU1hUZXh0Jykge1xuICAgICAgICAgIHJldHVybiBjaGlsZC52YWx1ZS50cmltKCkubGVuZ3RoID4gMFxuICAgICAgICB9XG4gICAgICAgIC8vIENoZWNrIGZvciBleHByZXNzaW9uIHdpdGggbGl0ZXJhbCBzdHJpbmdcbiAgICAgICAgaWYgKGNoaWxkLnR5cGUgPT09ICdKU1hFeHByZXNzaW9uQ29udGFpbmVyJyAmJiBjaGlsZC5leHByZXNzaW9uPy50eXBlID09PSAnTGl0ZXJhbCcpIHtcbiAgICAgICAgICByZXR1cm4gdHlwZW9mIGNoaWxkLmV4cHJlc3Npb24udmFsdWUgPT09ICdzdHJpbmcnICYmIGNoaWxkLmV4cHJlc3Npb24udmFsdWUudHJpbSgpLmxlbmd0aCA+IDBcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgY2xhc3NOYW1lIGZvciBzcGVjaWZpYyBwYXR0ZXJuc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldENsYXNzTmFtZUluZm8obm9kZTogYW55KTogeyBpc0dyYWRpZW50VGV4dDogYm9vbGVhbjsgaXNWaXN1YWxFbGVtZW50OiBib29sZWFuOyBoYXNUZXh0Q2xhc3NlczogYm9vbGVhbiB9IHtcbiAgICAgIGxldCBpc0dyYWRpZW50VGV4dCA9IGZhbHNlXG4gICAgICBsZXQgaXNWaXN1YWxFbGVtZW50ID0gZmFsc2VcbiAgICAgIGxldCBoYXNUZXh0Q2xhc3NlcyA9IGZhbHNlXG5cbiAgICAgIG5vZGUuYXR0cmlidXRlcz8uZm9yRWFjaCgoYXR0cjogYW55KSA9PiB7XG4gICAgICAgIGlmIChhdHRyLnR5cGUgPT09ICdKU1hBdHRyaWJ1dGUnICYmIGF0dHIubmFtZT8ubmFtZSA9PT0gJ2NsYXNzTmFtZScpIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IGF0dHIudmFsdWU/LnZhbHVlIHx8ICcnXG4gICAgICAgICAgLy8gU2tpcCBncmFkaWVudCB0ZXh0IChiZy1jbGlwLXRleHQgaXMgdXNlZCBmb3IgZ3JhZGllbnQgdGV4dCBlZmZlY3RzKVxuICAgICAgICAgIGlmICgvXFxiYmctY2xpcC10ZXh0XFxiLy50ZXN0KHZhbHVlKSkge1xuICAgICAgICAgICAgaXNHcmFkaWVudFRleHQgPSB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIFZpc3VhbCBlbGVtZW50cyAoZG90cywgZGVjb3JhdGl2ZSBlbGVtZW50cyB3aXRoIHctL2gtIGJ1dCBubyB0ZXh0IGNsYXNzZXMpXG4gICAgICAgICAgaWYgKC9cXGIody1cXGR8aC1cXGR8cm91bmRlZC1mdWxsKVxcYi8udGVzdCh2YWx1ZSkgJiYgIS9cXGJ0ZXh0LS8udGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIGlzVmlzdWFsRWxlbWVudCA9IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gSGFzIHRleHQtcmVsYXRlZCBjbGFzc2VzXG4gICAgICAgICAgaWYgKC9cXGIodGV4dC18Zm9udC18bGVhZGluZy18dHJhY2tpbmctKS8udGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIGhhc1RleHRDbGFzc2VzID0gdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgcmV0dXJuIHsgaXNHcmFkaWVudFRleHQsIGlzVmlzdWFsRWxlbWVudCwgaGFzVGV4dENsYXNzZXMgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBKU1hPcGVuaW5nRWxlbWVudChub2RlOiBhbnkpIHtcbiAgICAgICAgY29uc3QgZWxlbWVudE5hbWUgPSBub2RlLm5hbWU/Lm5hbWVcblxuICAgICAgICAvLyBDaGVjayA8cD4gdGFnc1xuICAgICAgICBpZiAoZWxlbWVudE5hbWUgPT09ICdwJykge1xuICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICBtZXNzYWdlSWQ6ICd1c2VQYXJhZ3JhcGgnLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayA8c3Bhbj4gdGFnc1xuICAgICAgICBpZiAoZWxlbWVudE5hbWUgPT09ICdzcGFuJykge1xuICAgICAgICAgIGlmIChpc0luc2lkZVR5cG9ncmFwaHlDb21wb25lbnQobm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IHsgaXNHcmFkaWVudFRleHQsIGlzVmlzdWFsRWxlbWVudCB9ID0gZ2V0Q2xhc3NOYW1lSW5mbyhub2RlKVxuXG4gICAgICAgICAgaWYgKGlzR3JhZGllbnRUZXh0IHx8IGlzVmlzdWFsRWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGhhc0RpcmVjdFRleHRDb250ZW50KG5vZGUpKSB7XG4gICAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICAgIG1lc3NhZ2VJZDogJ3VzZVNwYW4nLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayA8ZGl2PiB0YWdzIHdpdGggdGV4dCBjb250ZW50IGFuZCB0ZXh0IHN0eWxpbmdcbiAgICAgICAgaWYgKGVsZW1lbnROYW1lID09PSAnZGl2Jykge1xuICAgICAgICAgIGlmIChpc0luc2lkZVR5cG9ncmFwaHlDb21wb25lbnQobm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IHsgaGFzVGV4dENsYXNzZXMgfSA9IGdldENsYXNzTmFtZUluZm8obm9kZSlcblxuICAgICAgICAgIC8vIE9ubHkgZmxhZyBkaXZzIHRoYXQgaGF2ZSBib3RoIHRleHQgY29udGVudCBBTkQgdGV4dC1yZWxhdGVkIGNsYXNzZXNcbiAgICAgICAgICAvLyBUaGlzIGluZGljYXRlcyBpdCdzIGJlaW5nIHVzZWQgZm9yIHR5cG9ncmFwaHkgcmF0aGVyIHRoYW4gbGF5b3V0XG4gICAgICAgICAgaWYgKGhhc1RleHRDbGFzc2VzICYmIGhhc0RpcmVjdFRleHRDb250ZW50KG5vZGUpKSB7XG4gICAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICAgIG1lc3NhZ2VJZDogJ3VzZVR5cG9ncmFwaHlGb3JEaXYnLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfVxuICB9LFxufVxuXG5leHBvcnQgZGVmYXVsdCBydWxlXG4iXX0=