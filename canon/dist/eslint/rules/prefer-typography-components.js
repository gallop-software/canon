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
export default rule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZmVyLXR5cG9ncmFwaHktY29tcG9uZW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lc2xpbnQvcnVsZXMvcHJlZmVyLXR5cG9ncmFwaHktY29tcG9uZW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFBO0FBRWhFLE1BQU0sU0FBUyxHQUFHLDhCQUE4QixDQUFBO0FBQ2hELE1BQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUUxQyxNQUFNLElBQUksR0FBb0I7SUFDNUIsSUFBSSxFQUFFO1FBQ0osSUFBSSxFQUFFLFlBQVk7UUFDbEIsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFLE9BQU8sRUFBRSxPQUFPLElBQUksa0NBQWtDO1lBQ25FLFdBQVcsRUFBRSxJQUFJO1lBQ2pCLEdBQUcsRUFBRSxXQUFXLENBQUMsU0FBUyxDQUFDO1NBQzVCO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsWUFBWSxFQUFFLFVBQVUsT0FBTyxFQUFFLEVBQUUsSUFBSSxLQUFLLGdHQUFnRztZQUM1SSxPQUFPLEVBQUUsVUFBVSxPQUFPLEVBQUUsRUFBRSxJQUFJLEtBQUssMEdBQTBHO1NBQ2xKO1FBQ0QsTUFBTSxFQUFFLEVBQUU7S0FDWDtJQUVELE1BQU0sQ0FBQyxPQUFPO1FBQ1osTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUE7UUFFMUQsNEJBQTRCO1FBQzVCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7WUFDbkMsT0FBTyxFQUFFLENBQUE7UUFDWCxDQUFDO1FBRUQsT0FBTztZQUNMLGlCQUFpQixDQUFDLElBQVM7Z0JBQ3pCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFBO2dCQUVuQyxJQUFJLFdBQVcsS0FBSyxHQUFHLEVBQUUsQ0FBQztvQkFDeEIsT0FBTyxDQUFDLE1BQU0sQ0FBQzt3QkFDYixJQUFJO3dCQUNKLFNBQVMsRUFBRSxjQUFjO3FCQUMxQixDQUFDLENBQUE7Z0JBQ0osQ0FBQztnQkFFRCxJQUFJLFdBQVcsS0FBSyxNQUFNLEVBQUUsQ0FBQztvQkFDM0IscUZBQXFGO29CQUNyRiwrRUFBK0U7b0JBQy9FLE1BQU0sb0JBQW9CLEdBQUcsQ0FBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQTtvQkFFdkcsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQTtvQkFDeEIsT0FBTyxNQUFNLEVBQUUsQ0FBQzt3QkFDZCxJQUNFLE1BQU0sQ0FBQyxJQUFJLEtBQUssWUFBWTs0QkFDNUIsTUFBTSxDQUFDLGNBQWMsRUFBRSxJQUFJLEVBQUUsSUFBSTs0QkFDakMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUM5RCxDQUFDOzRCQUNELHNEQUFzRDs0QkFDdEQsT0FBTTt3QkFDUixDQUFDO3dCQUNELE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFBO29CQUN4QixDQUFDO29CQUVELDZEQUE2RDtvQkFDN0QsSUFBSSxjQUFjLEdBQUcsS0FBSyxDQUFBO29CQUMxQixJQUFJLGNBQWMsR0FBRyxLQUFLLENBQUE7b0JBRTFCLElBQUksQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBUyxFQUFFLEVBQUU7d0JBQ3JDLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxjQUFjLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEtBQUssV0FBVyxFQUFFLENBQUM7NEJBQ3BFLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxJQUFJLEVBQUUsQ0FBQTs0QkFDckMsMENBQTBDOzRCQUMxQyxJQUFJLG9DQUFvQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO2dDQUNyRCxjQUFjLEdBQUcsSUFBSSxDQUFBOzRCQUN2QixDQUFDOzRCQUNELDRFQUE0RTs0QkFDNUUsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztnQ0FDbkMsY0FBYyxHQUFHLElBQUksQ0FBQTs0QkFDdkIsQ0FBQzt3QkFDSCxDQUFDO29CQUNILENBQUMsQ0FBQyxDQUFBO29CQUVGLGtFQUFrRTtvQkFDbEUsSUFBSSxjQUFjLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQzt3QkFDdEMsT0FBTyxDQUFDLE1BQU0sQ0FBQzs0QkFDYixJQUFJOzRCQUNKLFNBQVMsRUFBRSxTQUFTO3lCQUNyQixDQUFDLENBQUE7b0JBQ0osQ0FBQztnQkFDSCxDQUFDO1lBQ0gsQ0FBQztTQUNGLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQTtBQUVELGVBQWUsSUFBSSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBSdWxlIH0gZnJvbSAnZXNsaW50J1xuaW1wb3J0IHsgZ2V0Q2Fub25VcmwsIGdldENhbm9uUGF0dGVybiB9IGZyb20gJy4uL3V0aWxzL2Nhbm9uLmpzJ1xuXG5jb25zdCBSVUxFX05BTUUgPSAncHJlZmVyLXR5cG9ncmFwaHktY29tcG9uZW50cydcbmNvbnN0IHBhdHRlcm4gPSBnZXRDYW5vblBhdHRlcm4oUlVMRV9OQU1FKVxuXG5jb25zdCBydWxlOiBSdWxlLlJ1bGVNb2R1bGUgPSB7XG4gIG1ldGE6IHtcbiAgICB0eXBlOiAnc3VnZ2VzdGlvbicsXG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246IHBhdHRlcm4/LnN1bW1hcnkgfHwgJ1VzZSBQYXJhZ3JhcGgvU3Bhbiwgbm90IHJhdyB0YWdzJyxcbiAgICAgIHJlY29tbWVuZGVkOiB0cnVlLFxuICAgICAgdXJsOiBnZXRDYW5vblVybChSVUxFX05BTUUpLFxuICAgIH0sXG4gICAgbWVzc2FnZXM6IHtcbiAgICAgIHVzZVBhcmFncmFwaDogYFtDYW5vbiAke3BhdHRlcm4/LmlkIHx8ICcwMDMnfV0gVXNlIHRoZSBQYXJhZ3JhcGggY29tcG9uZW50IGluc3RlYWQgb2YgPHA+LiBJbXBvcnQ6IGltcG9ydCB7IFBhcmFncmFwaCB9IGZyb20gXCJAL2NvbXBvbmVudHNcImAsXG4gICAgICB1c2VTcGFuOiBgW0Nhbm9uICR7cGF0dGVybj8uaWQgfHwgJzAwMyd9XSBVc2UgdGhlIFNwYW4gY29tcG9uZW50IGluc3RlYWQgb2YgPHNwYW4+IGZvciB0ZXh0IGNvbnRlbnQuIEltcG9ydDogaW1wb3J0IHsgU3BhbiB9IGZyb20gXCJAL2NvbXBvbmVudHNcImAsXG4gICAgfSxcbiAgICBzY2hlbWE6IFtdLFxuICB9LFxuXG4gIGNyZWF0ZShjb250ZXh0KSB7XG4gICAgY29uc3QgZmlsZW5hbWUgPSBjb250ZXh0LmZpbGVuYW1lIHx8IGNvbnRleHQuZ2V0RmlsZW5hbWUoKVxuXG4gICAgLy8gT25seSBhcHBseSB0byBibG9jayBmaWxlc1xuICAgIGlmICghZmlsZW5hbWUuaW5jbHVkZXMoJy9ibG9ja3MvJykpIHtcbiAgICAgIHJldHVybiB7fVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBKU1hPcGVuaW5nRWxlbWVudChub2RlOiBhbnkpIHtcbiAgICAgICAgY29uc3QgZWxlbWVudE5hbWUgPSBub2RlLm5hbWU/Lm5hbWVcblxuICAgICAgICBpZiAoZWxlbWVudE5hbWUgPT09ICdwJykge1xuICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICBtZXNzYWdlSWQ6ICd1c2VQYXJhZ3JhcGgnLFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZWxlbWVudE5hbWUgPT09ICdzcGFuJykge1xuICAgICAgICAgIC8vIFNraXAgc3BhbnMgdGhhdCBhcmUgaW5zaWRlIHR5cG9ncmFwaHkgY29tcG9uZW50cyAoSGVhZGluZywgUGFyYWdyYXBoLCBMYWJlbCwgZXRjLilcbiAgICAgICAgICAvLyBUaGVzZSBhcmUgdXNlZCBmb3IgaW5saW5lIHN0eWxpbmcgZWZmZWN0cyBsaWtlIGdyYWRpZW50IHRleHQsIGVtcGhhc2lzLCBldGMuXG4gICAgICAgICAgY29uc3QgdHlwb2dyYXBoeUNvbXBvbmVudHMgPSBbJ0hlYWRpbmcnLCAnUGFyYWdyYXBoJywgJ0xhYmVsJywgJ1NwYW4nLCAnUXVvdGUnLCAnU3ViaGVhZGluZycsICdBY2NlbnQnXVxuICAgICAgICAgIFxuICAgICAgICAgIGxldCBwYXJlbnQgPSBub2RlLnBhcmVudFxuICAgICAgICAgIHdoaWxlIChwYXJlbnQpIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgcGFyZW50LnR5cGUgPT09ICdKU1hFbGVtZW50JyAmJlxuICAgICAgICAgICAgICBwYXJlbnQub3BlbmluZ0VsZW1lbnQ/Lm5hbWU/Lm5hbWUgJiZcbiAgICAgICAgICAgICAgdHlwb2dyYXBoeUNvbXBvbmVudHMuaW5jbHVkZXMocGFyZW50Lm9wZW5pbmdFbGVtZW50Lm5hbWUubmFtZSlcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAvLyBTcGFuIGlzIGluc2lkZSBhIHR5cG9ncmFwaHkgY29tcG9uZW50LCBza2lwIHdhcm5pbmdcbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQ2hlY2sgY2xhc3NOYW1lIGZvciB0ZXh0LXJlbGF0ZWQgY2xhc3NlcyBhbmQgZ3JhZGllbnQgdGV4dFxuICAgICAgICAgIGxldCBoYXNUZXh0Q2xhc3NlcyA9IGZhbHNlXG4gICAgICAgICAgbGV0IGlzR3JhZGllbnRUZXh0ID0gZmFsc2VcblxuICAgICAgICAgIG5vZGUuYXR0cmlidXRlcz8uZm9yRWFjaCgoYXR0cjogYW55KSA9PiB7XG4gICAgICAgICAgICBpZiAoYXR0ci50eXBlID09PSAnSlNYQXR0cmlidXRlJyAmJiBhdHRyLm5hbWU/Lm5hbWUgPT09ICdjbGFzc05hbWUnKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gYXR0ci52YWx1ZT8udmFsdWUgfHwgJydcbiAgICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIHRleHQtcmVsYXRlZCBUYWlsd2luZCBjbGFzc2VzXG4gICAgICAgICAgICAgIGlmICgvXFxiKHRleHQtfGZvbnQtfGxlYWRpbmctfHRyYWNraW5nLSkvLnRlc3QodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgaGFzVGV4dENsYXNzZXMgPSB0cnVlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLy8gU2tpcCBncmFkaWVudCB0ZXh0IHNwYW5zIChiZy1jbGlwLXRleHQgaXMgdXNlZCBmb3IgZ3JhZGllbnQgdGV4dCBlZmZlY3RzKVxuICAgICAgICAgICAgICBpZiAoL1xcYmJnLWNsaXAtdGV4dFxcYi8udGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBpc0dyYWRpZW50VGV4dCA9IHRydWVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICAvLyBPbmx5IHdhcm4gaWYgdGhlIHNwYW4gaGFzIHRleHQgc3R5bGluZyBhbmQgaXMgbm90IGdyYWRpZW50IHRleHRcbiAgICAgICAgICBpZiAoaGFzVGV4dENsYXNzZXMgJiYgIWlzR3JhZGllbnRUZXh0KSB7XG4gICAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICAgIG1lc3NhZ2VJZDogJ3VzZVNwYW4nLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfVxuICB9LFxufVxuXG5leHBvcnQgZGVmYXVsdCBydWxlXG4iXX0=