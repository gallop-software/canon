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
            useHeading: `[Canon ${pattern?.id || '003'}] Use the Heading component instead of <{{tag}}>. Import: import { Heading } from "@/components/heading"`,
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
                // Check <h1>–<h6> tags
                if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(elementName)) {
                    context.report({ node, messageId: 'useHeading', data: { tag: elementName } });
                    return;
                }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZmVyLXR5cG9ncmFwaHktY29tcG9uZW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lc2xpbnQvcnVsZXMvcHJlZmVyLXR5cG9ncmFwaHktY29tcG9uZW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFBO0FBRWhFLE1BQU0sU0FBUyxHQUFHLDhCQUE4QixDQUFBO0FBQ2hELE1BQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUUxQyxNQUFNLElBQUksR0FBb0I7SUFDNUIsSUFBSSxFQUFFO1FBQ0osSUFBSSxFQUFFLFlBQVk7UUFDbEIsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFLE9BQU8sRUFBRSxPQUFPLElBQUksa0NBQWtDO1lBQ25FLFdBQVcsRUFBRSxJQUFJO1lBQ2pCLEdBQUcsRUFBRSxXQUFXLENBQUMsU0FBUyxDQUFDO1NBQzVCO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsVUFBVSxFQUFFLFVBQVUsT0FBTyxFQUFFLEVBQUUsSUFBSSxLQUFLLDBHQUEwRztZQUNwSixZQUFZLEVBQUUsVUFBVSxPQUFPLEVBQUUsRUFBRSxJQUFJLEtBQUssMEdBQTBHO1lBQ3RKLE9BQU8sRUFBRSxVQUFVLE9BQU8sRUFBRSxFQUFFLElBQUksS0FBSywrR0FBK0c7WUFDdEosUUFBUSxFQUFFLFVBQVUsT0FBTyxFQUFFLEVBQUUsSUFBSSxLQUFLLHVHQUF1RztZQUMvSSxtQkFBbUIsRUFBRSxVQUFVLE9BQU8sRUFBRSxFQUFFLElBQUksS0FBSyxvR0FBb0c7U0FDeEo7UUFDRCxNQUFNLEVBQUUsRUFBRTtLQUNYO0lBRUQsTUFBTSxDQUFDLE9BQU87UUFDWixNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxJQUFJLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQTtRQUUxRCw0QkFBNEI7UUFDNUIsSUFBSSxDQUFD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SSwyQkFBMkIsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO3dCQUN0QyxPQUFNO29CQUNSLENBQUM7b0JBRUQsTUFBTSxFQUFFLGNBQWMsRUFBRSxlQUFlLEVBQUUsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQTtvQkFFbEUsSUFBSSxjQUFjLElBQUksZUFBZSxFQUFFLENBQUM7d0JBQ3RDLE9BQU07b0JBQ1IsQ0FBQztvQkFFRCxJQUFJLG9CQUFvQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7d0JBQy9CLE9BQU8sQ0FBQyxNQUFNLENBQUM7NEJBQ2IsSUFBSTs0QkFDSixTQUFTLEVBQUUsU0FBUzt5QkFDckIsQ0FBQyxDQUFBO29CQUNKLENBQUM7b0JBQ0QsT0FBTTtnQkFDUixDQUFDO2dCQUVELHNEQUFzRDtnQkFDdEQsSUFBSSxXQUFXLEtBQUssS0FBSyxFQUFFLENBQUM7b0JBQzFCLElBQUksMkJBQTJCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQzt3QkFDdEMsT0FBTTtvQkFDUixDQUFDO29CQUVELE1BQU0sRUFBRSxjQUFjLEVBQUUsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQTtvQkFFakQsc0VBQXNFO29CQUN0RSxtRUFBbUU7b0JBQ25FLElBQUksY0FBYyxJQUFJLG9CQUFvQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7d0JBQ2pELE9BQU8sQ0FBQyxNQUFNLENBQUM7NEJBQ2IsSUFBSTs0QkFDSixTQUFTLEVBQUUscUJBQXFCO3lCQUNqQyxDQUFDLENBQUE7b0JBQ0osQ0FBQztnQkFDSCxDQUFDO1lBQ0gsQ0FBQztTQUNGLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQTtBQUVELGVBQWUsSUFBSSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBSdWxlIH0gZnJvbSAnZXNsaW50J1xuaW1wb3J0IHsgZ2V0Q2Fub25VcmwsIGdldENhbm9uUGF0dGVybiB9IGZyb20gJy4uL3V0aWxzL2Nhbm9uLmpzJ1xuXG5jb25zdCBSVUxFX05BTUUgPSAncHJlZmVyLXR5cG9ncmFwaHktY29tcG9uZW50cydcbmNvbnN0IHBhdHRlcm4gPSBnZXRDYW5vblBhdHRlcm4oUlVMRV9OQU1FKVxuXG5jb25zdCBydWxlOiBSdWxlLlJ1bGVNb2R1bGUgPSB7XG4gIG1ldGE6IHtcbiAgICB0eXBlOiAnc3VnZ2VzdGlvbicsXG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246IHBhdHRlcm4/LnN1bW1hcnkgfHwgJ1VzZSBQYXJhZ3JhcGgvU3Bhbiwgbm90IHJhdyB0YWdzJyxcbiAgICAgIHJlY29tbWVuZGVkOiB0cnVlLFxuICAgICAgdXJsOiBnZXRDYW5vblVybChSVUxFX05BTUUpLFxuICAgIH0sXG4gICAgbWVzc2FnZXM6IHtcbiAgICAgIHVzZUhlYWRpbmc6IGBbQ2Fub24gJHtwYXR0ZXJuPy5pZCB8fCAnMDAzJ31dIFVzZSB0aGUgSGVhZGluZyBjb21wb25lbnQgaW5zdGVhZCBvZiA8e3t0YWd9fT4uIEltcG9ydDogaW1wb3J0IHsgSGVhZGluZyB9IGZyb20gXCJAL2NvbXBvbmVudHMvaGVhZGluZ1wiYCxcbiAgICAgIHVzZVBhcmFncmFwaDogYFtDYW5vbiAke3BhdHRlcm4/LmlkIHx8ICcwMDMnfV0gVXNlIHRoZSBQYXJhZ3JhcGggY29tcG9uZW50IGluc3RlYWQgb2YgPHA+LiBJbXBvcnQ6IGltcG9ydCB7IFBhcmFncmFwaCB9IGZyb20gXCJAL2NvbXBvbmVudHMvcGFyYWdyYXBoXCJgLFxuICAgICAgdXNlU3BhbjogYFtDYW5vbiAke3BhdHRlcm4/LmlkIHx8ICcwMDMnfV0gVXNlIHRoZSBTcGFuIGNvbXBvbmVudCBpbnN0ZWFkIG9mIDxzcGFuPiBmb3IgdGV4dCBjb250ZW50LiBJbXBvcnQ6IGltcG9ydCB7IFNwYW4gfSBmcm9tIFwiQC9jb21wb25lbnRzL3NwYW5cImAsXG4gICAgICB1c2VRdW90ZTogYFtDYW5vbiAke3BhdHRlcm4/LmlkIHx8ICcwMDMnfV0gVXNlIHRoZSBRdW90ZSBjb21wb25lbnQgaW5zdGVhZCBvZiA8YmxvY2txdW90ZT4uIEltcG9ydDogaW1wb3J0IHsgUXVvdGUgfSBmcm9tIFwiQC9jb21wb25lbnRzL3F1b3RlXCJgLFxuICAgICAgdXNlVHlwb2dyYXBoeUZvckRpdjogYFtDYW5vbiAke3BhdHRlcm4/LmlkIHx8ICcwMDMnfV0gVXNlIGEgdHlwb2dyYXBoeSBjb21wb25lbnQgKEhlYWRpbmcsIFBhcmFncmFwaCwgTGFiZWwsIGV0Yy4pIGluc3RlYWQgb2YgPGRpdj4gd2l0aCB0ZXh0IGNvbnRlbnQuYCxcbiAgICB9LFxuICAgIHNjaGVtYTogW10sXG4gIH0sXG5cbiAgY3JlYXRlKGNvbnRleHQpIHtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGNvbnRleHQuZmlsZW5hbWUgfHwgY29udGV4dC5nZXRGaWxlbmFtZSgpXG5cbiAgICAvLyBPbmx5IGFwcGx5IHRvIGJsb2NrIGZpbGVzXG4gICAgaWYgKCFmaWxlbmFtZS5pbmNsdWRlcygnL2Jsb2Nrcy8nKSkge1xuICAgICAgcmV0dXJuIHt9XG4gICAgfVxuXG4gICAgY29uc3QgdHlwb2dyYXBoeUNvbXBvbmVudHMgPSBbJ0hlYWRpbmcnLCAnUGFyYWdyYXBoJywgJ0xhYmVsJywgJ1NwYW4nLCAnUXVvdGUnLCAnU3ViaGVhZGluZycsICdBY2NlbnQnXVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgZWxlbWVudCBpcyBpbnNpZGUgYSB0eXBvZ3JhcGh5IGNvbXBvbmVudFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzSW5zaWRlVHlwb2dyYXBoeUNvbXBvbmVudChub2RlOiBhbnkpOiBib29sZWFuIHtcbiAgICAgIGxldCBwYXJlbnQgPSBub2RlLnBhcmVudFxuICAgICAgd2hpbGUgKHBhcmVudCkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgcGFyZW50LnR5cGUgPT09ICdKU1hFbGVtZW50JyAmJlxuICAgICAgICAgIHBhcmVudC5vcGVuaW5nRWxlbWVudD8ubmFtZT8ubmFtZSAmJlxuICAgICAgICAgIHR5cG9ncmFwaHlDb21wb25lbnRzLmluY2x1ZGVzKHBhcmVudC5vcGVuaW5nRWxlbWVudC5uYW1lLm5hbWUpXG4gICAgICAgICkge1xuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudFxuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgZWxlbWVudCBoYXMgZGlyZWN0IHRleHQgY29udGVudFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGhhc0RpcmVjdFRleHRDb250ZW50KG5vZGU6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgY29uc3QganN4RWxlbWVudCA9IG5vZGUucGFyZW50XG4gICAgICBpZiAoanN4RWxlbWVudD8udHlwZSAhPT0gJ0pTWEVsZW1lbnQnKSByZXR1cm4gZmFsc2VcblxuICAgICAgY29uc3QgY2hpbGRyZW4gPSBqc3hFbGVtZW50LmNoaWxkcmVuIHx8IFtdXG4gICAgICByZXR1cm4gY2hpbGRyZW4uc29tZSgoY2hpbGQ6IGFueSkgPT4ge1xuICAgICAgICAvLyBDaGVjayBmb3IgZGlyZWN0IHRleHQgY29udGVudFxuICAgICAgICBpZiAoY2hpbGQudHlwZSA9PT0gJ0pTWFRleHQnKSB7XG4gICAgICAgICAgcmV0dXJuIGNoaWxkLnZhbHVlLnRyaW0oKS5sZW5ndGggPiAwXG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2hlY2sgZm9yIGV4cHJlc3Npb24gd2l0aCBsaXRlcmFsIHN0cmluZ1xuICAgICAgICBpZiAoY2hpbGQudHlwZSA9PT0gJ0pTWEV4cHJlc3Npb25Db250YWluZXInICYmIGNoaWxkLmV4cHJlc3Npb24/LnR5cGUgPT09ICdMaXRlcmFsJykge1xuICAgICAgICAgIHJldHVybiB0eXBlb2YgY2hpbGQuZXhwcmVzc2lvbi52YWx1ZSA9PT0gJ3N0cmluZycgJiYgY2hpbGQuZXhwcmVzc2lvbi52YWx1ZS50cmltKCkubGVuZ3RoID4gMFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBjbGFzc05hbWUgZm9yIHNwZWNpZmljIHBhdHRlcm5zXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0Q2xhc3NOYW1lSW5mbyhub2RlOiBhbnkpOiB7IGlzR3JhZGllbnRUZXh0OiBib29sZWFuOyBpc1Zpc3VhbEVsZW1lbnQ6IGJvb2xlYW47IGhhc1RleHRDbGFzc2VzOiBib29sZWFuIH0ge1xuICAgICAgbGV0IGlzR3JhZGllbnRUZXh0ID0gZmFsc2VcbiAgICAgIGxldCBpc1Zpc3VhbEVsZW1lbnQgPSBmYWxzZVxuICAgICAgbGV0IGhhc1RleHRDbGFzc2VzID0gZmFsc2VcblxuICAgICAgbm9kZS5hdHRyaWJ1dGVzPy5mb3JFYWNoKChhdHRyOiBhbnkpID0+IHtcbiAgICAgICAgaWYgKGF0dHIudHlwZSA9PT0gJ0pTWEF0dHJpYnV0ZScgJiYgYXR0ci5uYW1lPy5uYW1lID09PSAnY2xhc3NOYW1lJykge1xuICAgICAgICAgIGNvbnN0IHZhbHVlID0gYXR0ci52YWx1ZT8udmFsdWUgfHwgJydcbiAgICAgICAgICAvLyBTa2lwIGdyYWRpZW50IHRleHQgKGJnLWNsaXAtdGV4dCBpcyB1c2VkIGZvciBncmFkaWVudCB0ZXh0IGVmZmVjdHMpXG4gICAgICAgICAgaWYgKC9cXGJiZy1jbGlwLXRleHRcXGIvLnRlc3QodmFsdWUpKSB7XG4gICAgICAgICAgICBpc0dyYWRpZW50VGV4dCA9IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gVmlzdWFsIGVsZW1lbnRzIChkb3RzLCBkZWNvcmF0aXZlIGVsZW1lbnRzIHdpdGggdy0vaC0gYnV0IG5vIHRleHQgY2xhc3NlcylcbiAgICAgICAgICBpZiAoL1xcYih3LVxcZHxoLVxcZHxyb3VuZGVkLWZ1bGwpXFxiLy50ZXN0KHZhbHVlKSAmJiAhL1xcYnRleHQtLy50ZXN0KHZhbHVlKSkge1xuICAgICAgICAgICAgaXNWaXN1YWxFbGVtZW50ID0gdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBIYXMgdGV4dC1yZWxhdGVkIGNsYXNzZXNcbiAgICAgICAgICBpZiAoL1xcYih0ZXh0LXxmb250LXxsZWFkaW5nLXx0cmFja2luZy0pLy50ZXN0KHZhbHVlKSkge1xuICAgICAgICAgICAgaGFzVGV4dENsYXNzZXMgPSB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICByZXR1cm4geyBpc0dyYWRpZW50VGV4dCwgaXNWaXN1YWxFbGVtZW50LCBoYXNUZXh0Q2xhc3NlcyB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIEpTWE9wZW5pbmdFbGVtZW50KG5vZGU6IGFueSkge1xuICAgICAgICBjb25zdCBlbGVtZW50TmFtZSA9IG5vZGUubmFtZT8ubmFtZVxuXG4gICAgICAgIC8vIENoZWNrIDxoMT7igJM8aDY+IHRhZ3NcbiAgICAgICAgaWYgKFsnaDEnLCAnaDInLCAnaDMnLCAnaDQnLCAnaDUnLCAnaDYnXS5pbmNsdWRlcyhlbGVtZW50TmFtZSkpIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7IG5vZGUsIG1lc3NhZ2VJZDogJ3VzZUhlYWRpbmcnLCBkYXRhOiB7IHRhZzogZWxlbWVudE5hbWUgfSB9KVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgPHA+IHRhZ3NcbiAgICAgICAgaWYgKGVsZW1lbnROYW1lID09PSAncCcpIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbWVzc2FnZUlkOiAndXNlUGFyYWdyYXBoJyxcbiAgICAgICAgICB9KVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgPGJsb2NrcXVvdGU+IHRhZ3NcbiAgICAgICAgaWYgKGVsZW1lbnROYW1lID09PSAnYmxvY2txdW90ZScpIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbWVzc2FnZUlkOiAndXNlUXVvdGUnLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayA8c3Bhbj4gdGFnc1xuICAgICAgICBpZiAoZWxlbWVudE5hbWUgPT09ICdzcGFuJykge1xuICAgICAgICAgIGlmIChpc0luc2lkZVR5cG9ncmFwaHlDb21wb25lbnQobm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IHsgaXNHcmFkaWVudFRleHQsIGlzVmlzdWFsRWxlbWVudCB9ID0gZ2V0Q2xhc3NOYW1lSW5mbyhub2RlKVxuXG4gICAgICAgICAgaWYgKGlzR3JhZGllbnRUZXh0IHx8IGlzVmlzdWFsRWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGhhc0RpcmVjdFRleHRDb250ZW50KG5vZGUpKSB7XG4gICAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICAgIG1lc3NhZ2VJZDogJ3VzZVNwYW4nLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayA8ZGl2PiB0YWdzIHdpdGggdGV4dCBjb250ZW50IGFuZCB0ZXh0IHN0eWxpbmdcbiAgICAgICAgaWYgKGVsZW1lbnROYW1lID09PSAnZGl2Jykge1xuICAgICAgICAgIGlmIChpc0luc2lkZVR5cG9ncmFwaHlDb21wb25lbnQobm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IHsgaGFzVGV4dENsYXNzZXMgfSA9IGdldENsYXNzTmFtZUluZm8obm9kZSlcblxuICAgICAgICAgIC8vIE9ubHkgZmxhZyBkaXZzIHRoYXQgaGF2ZSBib3RoIHRleHQgY29udGVudCBBTkQgdGV4dC1yZWxhdGVkIGNsYXNzZXNcbiAgICAgICAgICAvLyBUaGlzIGluZGljYXRlcyBpdCdzIGJlaW5nIHVzZWQgZm9yIHR5cG9ncmFwaHkgcmF0aGVyIHRoYW4gbGF5b3V0XG4gICAgICAgICAgaWYgKGhhc1RleHRDbGFzc2VzICYmIGhhc0RpcmVjdFRleHRDb250ZW50KG5vZGUpKSB7XG4gICAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICAgIG1lc3NhZ2VJZDogJ3VzZVR5cG9ncmFwaHlGb3JEaXYnLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfVxuICB9LFxufVxuXG5leHBvcnQgZGVmYXVsdCBydWxlXG4iXX0=