"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const canon_1 = require("../utils/canon");
const RULE_NAME = 'prefer-typography-components';
const pattern = (0, canon_1.getCanonPattern)(RULE_NAME);
const rule = {
    meta: {
        type: 'suggestion',
        docs: {
            description: pattern?.summary || 'Use Paragraph/Span, not raw tags',
            recommended: true,
            url: (0, canon_1.getCanonUrl)(RULE_NAME),
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
                    // Check className for text-related classes and gradient text
                    let hasTextClasses = false;
                    let isGradientText = false;
                    node.attributes?.forEach((attr) => {
                        if (attr.type === 'JSXAttribute' && attr.name?.name === 'className') {
                            const value = attr.value?.value || '';
                            // Check for text-related Tailwind classes
                            if (/\b(text-|font-|leading-|tracking-)/.test(value)) {
                                hasTextClasses = true;
                            }
                            // Skip gradient text spans (bg-clip-text is used for gradient text effects)
                            if (/\bbg-clip-text\b/.test(value)) {
                                isGradientText = true;
                            }
                        }
                    });
                    // Only warn if the span has text styling and is not gradient text
                    if (hasTextClasses && !isGradientText) {
                        context.report({
                            node,
                            messageId: 'useSpan',
                        });
                    }
                }
            },
        };
    },
};
exports.default = rule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZmVyLXR5cG9ncmFwaHktY29tcG9uZW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9wcmVmZXItdHlwb2dyYXBoeS1jb21wb25lbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsMENBQTZEO0FBRTdELE1BQU0sU0FBUyxHQUFHLDhCQUE4QixDQUFBO0FBQ2hELE1BQU0sT0FBTyxHQUFHLElBQUEsdUJBQWUsRUFBQyxTQUFTLENBQUMsQ0FBQTtBQUUxQyxNQUFNLElBQUksR0FBb0I7SUFDNUIsSUFBSSxFQUFFO1FBQ0osSUFBSSxFQUFFLFlBQVk7UUFDbEIsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFLE9BQU8sRUFBRSxPQUFPLElBQUksa0NBQWtDO1lBQ25FLFdBQVcsRUFBRSxJQUFJO1lBQ2pCLEdBQUcsRUFBRSxJQUFBLG1CQUFXLEVBQUMsU0FBUyxDQUFDO1NBQzVCO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsWUFBWSxFQUFFLFVBQVUsT0FBTyxFQUFFLEVBQUUsSUFBSSxLQUFLLGdHQUFnRztZQUM1SSxPQUFPLEVBQUUsVUFBVSxPQUFPLEVBQUUsRUFBRSxJQUFJLEtBQUssMEdBQTBHO1NBQ2xKO1FBQ0QsTUFBTSxFQUFFLEVBQUU7S0FDWDtJQUVELE1BQU0sQ0FBQyxPQUFPO1FBQ1osTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUE7UUFFMUQsNEJBQTRCO1FBQzVCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7WUFDbkMsT0FBTyxFQUFFLENBQUE7UUFDWCxDQUFDO1FBRUQsT0FBTztZQUNMLGlCQUFpQixDQUFDLElBQVM7Z0JBQ3pCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFBO2dCQUVuQyxJQUFJLFdBQVcsS0FBSyxHQUFHLEVBQUUsQ0FBQztvQkFDeEIsT0FBTyxDQUFDLE1BQU0sQ0FBQzt3QkFDYixJQUFJO3dCQUNKLFNBQVMsRUFBRSxjQUFjO3FCQUMxQixDQUFDLENBQUE7Z0JBQ0osQ0FBQztnQkFFRCxJQUFJLFdBQVcsS0FBSyxNQUFNLEVBQUUsQ0FBQztvQkFDM0IscUZBQXFGO29CQUNyRiwrRUFBK0U7b0JBQy9FLE1BQU0sb0JBQW9CLEdBQUcsQ0FBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQTtvQkFFdkcsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQTtvQkFDeEIsT0FBTyxNQUFNLEVBQUUsQ0FBQzt3QkFDZCxJQUNFLE1BQU0sQ0FBQyxJQUFJLEtBQUssWUFBWTs0QkFDNUIsTUFBTSxDQUFDLGNBQWMsRUFBRSxJQUFJLEVBQUUsSUFBSTs0QkFDakMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUM5RCxDQUFDOzRCQUNELHNEQUFzRDs0QkFDdEQsT0FBTTt3QkFDUixDQUFDO3dCQUNELE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFBO29CQUN4QixDQUFDO29CQUVELDZEQUE2RDtvQkFDN0QsSUFBSSxjQUFjLEdBQUcsS0FBSyxDQUFBO29CQUMxQixJQUFJLGNBQWMsR0FBRyxLQUFLLENBQUE7b0JBRTFCLElBQUksQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBUyxFQUFFLEVBQUU7d0JBQ3JDLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxjQUFjLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEtBQUssV0FBVyxFQUFFLENBQUM7NEJBQ3BFLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxJQUFJLEVBQUUsQ0FBQTs0QkFDckMsMENBQTBDOzRCQUMxQyxJQUFJLG9DQUFvQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO2dDQUNyRCxjQUFjLEdBQUcsSUFBSSxDQUFBOzRCQUN2QixDQUFDOzRCQUNELDRFQUE0RTs0QkFDNUUsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztnQ0FDbkMsY0FBYyxHQUFHLElBQUksQ0FBQTs0QkFDdkIsQ0FBQzt3QkFDSCxDQUFDO29CQUNILENBQUMsQ0FBQyxDQUFBO29CQUVGLGtFQUFrRTtvQkFDbEUsSUFBSSxjQUFjLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQzt3QkFDdEMsT0FBTyxDQUFDLE1BQU0sQ0FBQzs0QkFDYixJQUFJOzRCQUNKLFNBQVMsRUFBRSxTQUFTO3lCQUNyQixDQUFDLENBQUE7b0JBQ0osQ0FBQztnQkFDSCxDQUFDO1lBQ0gsQ0FBQztTQUNGLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQTtBQUVELGtCQUFlLElBQUksQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgUnVsZSB9IGZyb20gJ2VzbGludCdcbmltcG9ydCB7IGdldENhbm9uVXJsLCBnZXRDYW5vblBhdHRlcm4gfSBmcm9tICcuLi91dGlscy9jYW5vbidcblxuY29uc3QgUlVMRV9OQU1FID0gJ3ByZWZlci10eXBvZ3JhcGh5LWNvbXBvbmVudHMnXG5jb25zdCBwYXR0ZXJuID0gZ2V0Q2Fub25QYXR0ZXJuKFJVTEVfTkFNRSlcblxuY29uc3QgcnVsZTogUnVsZS5SdWxlTW9kdWxlID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiBwYXR0ZXJuPy5zdW1tYXJ5IHx8ICdVc2UgUGFyYWdyYXBoL1NwYW4sIG5vdCByYXcgdGFncycsXG4gICAgICByZWNvbW1lbmRlZDogdHJ1ZSxcbiAgICAgIHVybDogZ2V0Q2Fub25VcmwoUlVMRV9OQU1FKSxcbiAgICB9LFxuICAgIG1lc3NhZ2VzOiB7XG4gICAgICB1c2VQYXJhZ3JhcGg6IGBbQ2Fub24gJHtwYXR0ZXJuPy5pZCB8fCAnMDAzJ31dIFVzZSB0aGUgUGFyYWdyYXBoIGNvbXBvbmVudCBpbnN0ZWFkIG9mIDxwPi4gSW1wb3J0OiBpbXBvcnQgeyBQYXJhZ3JhcGggfSBmcm9tIFwiQC9jb21wb25lbnRzXCJgLFxuICAgICAgdXNlU3BhbjogYFtDYW5vbiAke3BhdHRlcm4/LmlkIHx8ICcwMDMnfV0gVXNlIHRoZSBTcGFuIGNvbXBvbmVudCBpbnN0ZWFkIG9mIDxzcGFuPiBmb3IgdGV4dCBjb250ZW50LiBJbXBvcnQ6IGltcG9ydCB7IFNwYW4gfSBmcm9tIFwiQC9jb21wb25lbnRzXCJgLFxuICAgIH0sXG4gICAgc2NoZW1hOiBbXSxcbiAgfSxcblxuICBjcmVhdGUoY29udGV4dCkge1xuICAgIGNvbnN0IGZpbGVuYW1lID0gY29udGV4dC5maWxlbmFtZSB8fCBjb250ZXh0LmdldEZpbGVuYW1lKClcblxuICAgIC8vIE9ubHkgYXBwbHkgdG8gYmxvY2sgZmlsZXNcbiAgICBpZiAoIWZpbGVuYW1lLmluY2x1ZGVzKCcvYmxvY2tzLycpKSB7XG4gICAgICByZXR1cm4ge31cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgSlNYT3BlbmluZ0VsZW1lbnQobm9kZTogYW55KSB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnROYW1lID0gbm9kZS5uYW1lPy5uYW1lXG5cbiAgICAgICAgaWYgKGVsZW1lbnROYW1lID09PSAncCcpIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbWVzc2FnZUlkOiAndXNlUGFyYWdyYXBoJyxcbiAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVsZW1lbnROYW1lID09PSAnc3BhbicpIHtcbiAgICAgICAgICAvLyBTa2lwIHNwYW5zIHRoYXQgYXJlIGluc2lkZSB0eXBvZ3JhcGh5IGNvbXBvbmVudHMgKEhlYWRpbmcsIFBhcmFncmFwaCwgTGFiZWwsIGV0Yy4pXG4gICAgICAgICAgLy8gVGhlc2UgYXJlIHVzZWQgZm9yIGlubGluZSBzdHlsaW5nIGVmZmVjdHMgbGlrZSBncmFkaWVudCB0ZXh0LCBlbXBoYXNpcywgZXRjLlxuICAgICAgICAgIGNvbnN0IHR5cG9ncmFwaHlDb21wb25lbnRzID0gWydIZWFkaW5nJywgJ1BhcmFncmFwaCcsICdMYWJlbCcsICdTcGFuJywgJ1F1b3RlJywgJ1N1YmhlYWRpbmcnLCAnQWNjZW50J11cbiAgICAgICAgICBcbiAgICAgICAgICBsZXQgcGFyZW50ID0gbm9kZS5wYXJlbnRcbiAgICAgICAgICB3aGlsZSAocGFyZW50KSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIHBhcmVudC50eXBlID09PSAnSlNYRWxlbWVudCcgJiZcbiAgICAgICAgICAgICAgcGFyZW50Lm9wZW5pbmdFbGVtZW50Py5uYW1lPy5uYW1lICYmXG4gICAgICAgICAgICAgIHR5cG9ncmFwaHlDb21wb25lbnRzLmluY2x1ZGVzKHBhcmVudC5vcGVuaW5nRWxlbWVudC5uYW1lLm5hbWUpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgLy8gU3BhbiBpcyBpbnNpZGUgYSB0eXBvZ3JhcGh5IGNvbXBvbmVudCwgc2tpcCB3YXJuaW5nXG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudFxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIENoZWNrIGNsYXNzTmFtZSBmb3IgdGV4dC1yZWxhdGVkIGNsYXNzZXMgYW5kIGdyYWRpZW50IHRleHRcbiAgICAgICAgICBsZXQgaGFzVGV4dENsYXNzZXMgPSBmYWxzZVxuICAgICAgICAgIGxldCBpc0dyYWRpZW50VGV4dCA9IGZhbHNlXG5cbiAgICAgICAgICBub2RlLmF0dHJpYnV0ZXM/LmZvckVhY2goKGF0dHI6IGFueSkgPT4ge1xuICAgICAgICAgICAgaWYgKGF0dHIudHlwZSA9PT0gJ0pTWEF0dHJpYnV0ZScgJiYgYXR0ci5uYW1lPy5uYW1lID09PSAnY2xhc3NOYW1lJykge1xuICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGF0dHIudmFsdWU/LnZhbHVlIHx8ICcnXG4gICAgICAgICAgICAgIC8vIENoZWNrIGZvciB0ZXh0LXJlbGF0ZWQgVGFpbHdpbmQgY2xhc3Nlc1xuICAgICAgICAgICAgICBpZiAoL1xcYih0ZXh0LXxmb250LXxsZWFkaW5nLXx0cmFja2luZy0pLy50ZXN0KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGhhc1RleHRDbGFzc2VzID0gdHJ1ZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vIFNraXAgZ3JhZGllbnQgdGV4dCBzcGFucyAoYmctY2xpcC10ZXh0IGlzIHVzZWQgZm9yIGdyYWRpZW50IHRleHQgZWZmZWN0cylcbiAgICAgICAgICAgICAgaWYgKC9cXGJiZy1jbGlwLXRleHRcXGIvLnRlc3QodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgaXNHcmFkaWVudFRleHQgPSB0cnVlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgLy8gT25seSB3YXJuIGlmIHRoZSBzcGFuIGhhcyB0ZXh0IHN0eWxpbmcgYW5kIGlzIG5vdCBncmFkaWVudCB0ZXh0XG4gICAgICAgICAgaWYgKGhhc1RleHRDbGFzc2VzICYmICFpc0dyYWRpZW50VGV4dCkge1xuICAgICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgICBtZXNzYWdlSWQ6ICd1c2VTcGFuJyxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgIH1cbiAgfSxcbn1cblxuZXhwb3J0IGRlZmF1bHQgcnVsZVxuIl19