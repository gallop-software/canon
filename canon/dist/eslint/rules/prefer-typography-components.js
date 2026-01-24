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
            useParagraph: `[Canon ${pattern?.id || '003'}] Use the Paragraph component instead of <p>. Import: import { Paragraph } from "@/components/paragraph"`,
            useSpan: `[Canon ${pattern?.id || '003'}] Use the Span component instead of <span> for text content. Import: import { Span } from "@/components/span"`,
            useQuote: `[Canon ${pattern?.id || '003'}] Use the Quote component instead of <blockquote>. Import: import { Quote } from "@/components/quote"`,
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
                // Check <blockquote> tags
                if (elementName === 'blockquote') {
                    context.report({
                        node,
                        messageId: 'useQuote',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZmVyLXR5cG9ncmFwaHktY29tcG9uZW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lc2xpbnQvcnVsZXMvcHJlZmVyLXR5cG9ncmFwaHktY29tcG9uZW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFBO0FBRWhFLE1BQU0sU0FBUyxHQUFHLDhCQUE4QixDQUFBO0FBQ2hELE1BQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUUxQyxNQUFNLElBQUksR0FBb0I7SUFDNUIsSUFBSSxFQUFFO1FBQ0osSUFBSSxFQUFFLFlBQVk7UUFDbEIsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFLE9BQU8sRUFBRSxPQUFPLElBQUksa0NBQWtDO1lBQ25FLFdBQVcsRUFBRSxJQUFJO1lBQ2pCLEdBQUcsRUFBRSxXQUFXLENBQUMsU0FBUyxDQUFDO1NBQzVCO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsWUFBWSxFQUFFLFVBQVUsT0FBTyxFQUFFLEVBQUUsSUFBSSxLQUFLLDBHQUEwRztZQUN0SixPQUFPLEVBQUUsVUFBVSxPQUFPLEVBQUUsRUFBRSxJQUFJLEtBQUssK0dBQStHO1lBQ3RKLFFBQVEsRUFBRSxVQUFVLE9BQU8sRUFBRSxFQUFFLElBQUksS0FBSyx1R0FBdUc7WUFDL0ksbUJBQW1CLEVBQUUsVUFBVSxPQUFPLEVBQUUsRUFBRSxJQUFJLEtBQUssb0dBQW9HO1NBQ3hKO1FBQ0QsTUFBTSxFQUFFLEVBQUU7S0FDWDtJQUVELE1BQU0sQ0FBQyxPQUFPO1FBQ1osTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUE7UUFFMUQsNEJBQTRCO1FBQzVCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7WUFDbkMsT0FBTyxF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QztvQkFDRCxPQUFNO2dCQUNSLENBQUM7Z0JBRUQsc0RBQXNEO2dCQUN0RCxJQUFJLFdBQVcsS0FBSyxLQUFLLEVBQUUsQ0FBQztvQkFDMUIsSUFBSSwyQkFBMkIsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO3dCQUN0QyxPQUFNO29CQUNSLENBQUM7b0JBRUQsTUFBTSxFQUFFLGNBQWMsRUFBRSxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFBO29CQUVqRCxzRUFBc0U7b0JBQ3RFLG1FQUFtRTtvQkFDbkUsSUFBSSxjQUFjLElBQUksb0JBQW9CLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQzt3QkFDakQsT0FBTyxDQUFDLE1BQU0sQ0FBQzs0QkFDYixJQUFJOzRCQUNKLFNBQVMsRUFBRSxxQkFBcUI7eUJBQ2pDLENBQUMsQ0FBQTtvQkFDSixDQUFDO2dCQUNILENBQUM7WUFDSCxDQUFDO1NBQ0YsQ0FBQTtJQUNILENBQUM7Q0FDRixDQUFBO0FBRUQsZUFBZSxJQUFJLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFJ1bGUgfSBmcm9tICdlc2xpbnQnXG5pbXBvcnQgeyBnZXRDYW5vblVybCwgZ2V0Q2Fub25QYXR0ZXJuIH0gZnJvbSAnLi4vdXRpbHMvY2Fub24uanMnXG5cbmNvbnN0IFJVTEVfTkFNRSA9ICdwcmVmZXItdHlwb2dyYXBoeS1jb21wb25lbnRzJ1xuY29uc3QgcGF0dGVybiA9IGdldENhbm9uUGF0dGVybihSVUxFX05BTUUpXG5cbmNvbnN0IHJ1bGU6IFJ1bGUuUnVsZU1vZHVsZSA9IHtcbiAgbWV0YToge1xuICAgIHR5cGU6ICdzdWdnZXN0aW9uJyxcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjogcGF0dGVybj8uc3VtbWFyeSB8fCAnVXNlIFBhcmFncmFwaC9TcGFuLCBub3QgcmF3IHRhZ3MnLFxuICAgICAgcmVjb21tZW5kZWQ6IHRydWUsXG4gICAgICB1cmw6IGdldENhbm9uVXJsKFJVTEVfTkFNRSksXG4gICAgfSxcbiAgICBtZXNzYWdlczoge1xuICAgICAgdXNlUGFyYWdyYXBoOiBgW0Nhbm9uICR7cGF0dGVybj8uaWQgfHwgJzAwMyd9XSBVc2UgdGhlIFBhcmFncmFwaCBjb21wb25lbnQgaW5zdGVhZCBvZiA8cD4uIEltcG9ydDogaW1wb3J0IHsgUGFyYWdyYXBoIH0gZnJvbSBcIkAvY29tcG9uZW50cy9wYXJhZ3JhcGhcImAsXG4gICAgICB1c2VTcGFuOiBgW0Nhbm9uICR7cGF0dGVybj8uaWQgfHwgJzAwMyd9XSBVc2UgdGhlIFNwYW4gY29tcG9uZW50IGluc3RlYWQgb2YgPHNwYW4+IGZvciB0ZXh0IGNvbnRlbnQuIEltcG9ydDogaW1wb3J0IHsgU3BhbiB9IGZyb20gXCJAL2NvbXBvbmVudHMvc3BhblwiYCxcbiAgICAgIHVzZVF1b3RlOiBgW0Nhbm9uICR7cGF0dGVybj8uaWQgfHwgJzAwMyd9XSBVc2UgdGhlIFF1b3RlIGNvbXBvbmVudCBpbnN0ZWFkIG9mIDxibG9ja3F1b3RlPi4gSW1wb3J0OiBpbXBvcnQgeyBRdW90ZSB9IGZyb20gXCJAL2NvbXBvbmVudHMvcXVvdGVcImAsXG4gICAgICB1c2VUeXBvZ3JhcGh5Rm9yRGl2OiBgW0Nhbm9uICR7cGF0dGVybj8uaWQgfHwgJzAwMyd9XSBVc2UgYSB0eXBvZ3JhcGh5IGNvbXBvbmVudCAoSGVhZGluZywgUGFyYWdyYXBoLCBMYWJlbCwgZXRjLikgaW5zdGVhZCBvZiA8ZGl2PiB3aXRoIHRleHQgY29udGVudC5gLFxuICAgIH0sXG4gICAgc2NoZW1hOiBbXSxcbiAgfSxcblxuICBjcmVhdGUoY29udGV4dCkge1xuICAgIGNvbnN0IGZpbGVuYW1lID0gY29udGV4dC5maWxlbmFtZSB8fCBjb250ZXh0LmdldEZpbGVuYW1lKClcblxuICAgIC8vIE9ubHkgYXBwbHkgdG8gYmxvY2sgZmlsZXNcbiAgICBpZiAoIWZpbGVuYW1lLmluY2x1ZGVzKCcvYmxvY2tzLycpKSB7XG4gICAgICByZXR1cm4ge31cbiAgICB9XG5cbiAgICBjb25zdCB0eXBvZ3JhcGh5Q29tcG9uZW50cyA9IFsnSGVhZGluZycsICdQYXJhZ3JhcGgnLCAnTGFiZWwnLCAnU3BhbicsICdRdW90ZScsICdTdWJoZWFkaW5nJywgJ0FjY2VudCddXG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiBlbGVtZW50IGlzIGluc2lkZSBhIHR5cG9ncmFwaHkgY29tcG9uZW50XG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNJbnNpZGVUeXBvZ3JhcGh5Q29tcG9uZW50KG5vZGU6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgbGV0IHBhcmVudCA9IG5vZGUucGFyZW50XG4gICAgICB3aGlsZSAocGFyZW50KSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBwYXJlbnQudHlwZSA9PT0gJ0pTWEVsZW1lbnQnICYmXG4gICAgICAgICAgcGFyZW50Lm9wZW5pbmdFbGVtZW50Py5uYW1lPy5uYW1lICYmXG4gICAgICAgICAgdHlwb2dyYXBoeUNvbXBvbmVudHMuaW5jbHVkZXMocGFyZW50Lm9wZW5pbmdFbGVtZW50Lm5hbWUubmFtZSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiBlbGVtZW50IGhhcyBkaXJlY3QgdGV4dCBjb250ZW50XG4gICAgICovXG4gICAgZnVuY3Rpb24gaGFzRGlyZWN0VGV4dENvbnRlbnQobm9kZTogYW55KTogYm9vbGVhbiB7XG4gICAgICBjb25zdCBqc3hFbGVtZW50ID0gbm9kZS5wYXJlbnRcbiAgICAgIGlmIChqc3hFbGVtZW50Py50eXBlICE9PSAnSlNYRWxlbWVudCcpIHJldHVybiBmYWxzZVxuXG4gICAgICBjb25zdCBjaGlsZHJlbiA9IGpzeEVsZW1lbnQuY2hpbGRyZW4gfHwgW11cbiAgICAgIHJldHVybiBjaGlsZHJlbi5zb21lKChjaGlsZDogYW55KSA9PiB7XG4gICAgICAgIC8vIENoZWNrIGZvciBkaXJlY3QgdGV4dCBjb250ZW50XG4gICAgICAgIGlmIChjaGlsZC50eXBlID09PSAnSlNYVGV4dCcpIHtcbiAgICAgICAgICByZXR1cm4gY2hpbGQudmFsdWUudHJpbSgpLmxlbmd0aCA+IDBcbiAgICAgICAgfVxuICAgICAgICAvLyBDaGVjayBmb3IgZXhwcmVzc2lvbiB3aXRoIGxpdGVyYWwgc3RyaW5nXG4gICAgICAgIGlmIChjaGlsZC50eXBlID09PSAnSlNYRXhwcmVzc2lvbkNvbnRhaW5lcicgJiYgY2hpbGQuZXhwcmVzc2lvbj8udHlwZSA9PT0gJ0xpdGVyYWwnKSB7XG4gICAgICAgICAgcmV0dXJuIHR5cGVvZiBjaGlsZC5leHByZXNzaW9uLnZhbHVlID09PSAnc3RyaW5nJyAmJiBjaGlsZC5leHByZXNzaW9uLnZhbHVlLnRyaW0oKS5sZW5ndGggPiAwXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIGNsYXNzTmFtZSBmb3Igc3BlY2lmaWMgcGF0dGVybnNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRDbGFzc05hbWVJbmZvKG5vZGU6IGFueSk6IHsgaXNHcmFkaWVudFRleHQ6IGJvb2xlYW47IGlzVmlzdWFsRWxlbWVudDogYm9vbGVhbjsgaGFzVGV4dENsYXNzZXM6IGJvb2xlYW4gfSB7XG4gICAgICBsZXQgaXNHcmFkaWVudFRleHQgPSBmYWxzZVxuICAgICAgbGV0IGlzVmlzdWFsRWxlbWVudCA9IGZhbHNlXG4gICAgICBsZXQgaGFzVGV4dENsYXNzZXMgPSBmYWxzZVxuXG4gICAgICBub2RlLmF0dHJpYnV0ZXM/LmZvckVhY2goKGF0dHI6IGFueSkgPT4ge1xuICAgICAgICBpZiAoYXR0ci50eXBlID09PSAnSlNYQXR0cmlidXRlJyAmJiBhdHRyLm5hbWU/Lm5hbWUgPT09ICdjbGFzc05hbWUnKSB7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSBhdHRyLnZhbHVlPy52YWx1ZSB8fCAnJ1xuICAgICAgICAgIC8vIFNraXAgZ3JhZGllbnQgdGV4dCAoYmctY2xpcC10ZXh0IGlzIHVzZWQgZm9yIGdyYWRpZW50IHRleHQgZWZmZWN0cylcbiAgICAgICAgICBpZiAoL1xcYmJnLWNsaXAtdGV4dFxcYi8udGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIGlzR3JhZGllbnRUZXh0ID0gdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBWaXN1YWwgZWxlbWVudHMgKGRvdHMsIGRlY29yYXRpdmUgZWxlbWVudHMgd2l0aCB3LS9oLSBidXQgbm8gdGV4dCBjbGFzc2VzKVxuICAgICAgICAgIGlmICgvXFxiKHctXFxkfGgtXFxkfHJvdW5kZWQtZnVsbClcXGIvLnRlc3QodmFsdWUpICYmICEvXFxidGV4dC0vLnRlc3QodmFsdWUpKSB7XG4gICAgICAgICAgICBpc1Zpc3VhbEVsZW1lbnQgPSB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIEhhcyB0ZXh0LXJlbGF0ZWQgY2xhc3Nlc1xuICAgICAgICAgIGlmICgvXFxiKHRleHQtfGZvbnQtfGxlYWRpbmctfHRyYWNraW5nLSkvLnRlc3QodmFsdWUpKSB7XG4gICAgICAgICAgICBoYXNUZXh0Q2xhc3NlcyA9IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIHJldHVybiB7IGlzR3JhZGllbnRUZXh0LCBpc1Zpc3VhbEVsZW1lbnQsIGhhc1RleHRDbGFzc2VzIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgSlNYT3BlbmluZ0VsZW1lbnQobm9kZTogYW55KSB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnROYW1lID0gbm9kZS5uYW1lPy5uYW1lXG5cbiAgICAgICAgLy8gQ2hlY2sgPHA+IHRhZ3NcbiAgICAgICAgaWYgKGVsZW1lbnROYW1lID09PSAncCcpIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbWVzc2FnZUlkOiAndXNlUGFyYWdyYXBoJyxcbiAgICAgICAgICB9KVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgPGJsb2NrcXVvdGU+IHRhZ3NcbiAgICAgICAgaWYgKGVsZW1lbnROYW1lID09PSAnYmxvY2txdW90ZScpIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbWVzc2FnZUlkOiAndXNlUXVvdGUnLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayA8c3Bhbj4gdGFnc1xuICAgICAgICBpZiAoZWxlbWVudE5hbWUgPT09ICdzcGFuJykge1xuICAgICAgICAgIGlmIChpc0luc2lkZVR5cG9ncmFwaHlDb21wb25lbnQobm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IHsgaXNHcmFkaWVudFRleHQsIGlzVmlzdWFsRWxlbWVudCB9ID0gZ2V0Q2xhc3NOYW1lSW5mbyhub2RlKVxuXG4gICAgICAgICAgaWYgKGlzR3JhZGllbnRUZXh0IHx8IGlzVmlzdWFsRWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGhhc0RpcmVjdFRleHRDb250ZW50KG5vZGUpKSB7XG4gICAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICAgIG1lc3NhZ2VJZDogJ3VzZVNwYW4nLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayA8ZGl2PiB0YWdzIHdpdGggdGV4dCBjb250ZW50IGFuZCB0ZXh0IHN0eWxpbmdcbiAgICAgICAgaWYgKGVsZW1lbnROYW1lID09PSAnZGl2Jykge1xuICAgICAgICAgIGlmIChpc0luc2lkZVR5cG9ncmFwaHlDb21wb25lbnQobm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IHsgaGFzVGV4dENsYXNzZXMgfSA9IGdldENsYXNzTmFtZUluZm8obm9kZSlcblxuICAgICAgICAgIC8vIE9ubHkgZmxhZyBkaXZzIHRoYXQgaGF2ZSBib3RoIHRleHQgY29udGVudCBBTkQgdGV4dC1yZWxhdGVkIGNsYXNzZXNcbiAgICAgICAgICAvLyBUaGlzIGluZGljYXRlcyBpdCdzIGJlaW5nIHVzZWQgZm9yIHR5cG9ncmFwaHkgcmF0aGVyIHRoYW4gbGF5b3V0XG4gICAgICAgICAgaWYgKGhhc1RleHRDbGFzc2VzICYmIGhhc0RpcmVjdFRleHRDb250ZW50KG5vZGUpKSB7XG4gICAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICAgIG1lc3NhZ2VJZDogJ3VzZVR5cG9ncmFwaHlGb3JEaXYnLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfVxuICB9LFxufVxuXG5leHBvcnQgZGVmYXVsdCBydWxlXG4iXX0=