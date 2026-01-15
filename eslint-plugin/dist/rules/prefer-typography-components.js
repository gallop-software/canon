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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZmVyLXR5cG9ncmFwaHktY29tcG9uZW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9wcmVmZXItdHlwb2dyYXBoeS1jb21wb25lbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxXQUFXLEVBQUUsZUFBZSxFQUFFLE1BQU0sbUJBQW1CLENBQUE7QUFFaEUsTUFBTSxTQUFTLEdBQUcsOEJBQThCLENBQUE7QUFDaEQsTUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBRTFDLE1BQU0sSUFBSSxHQUFvQjtJQUM1QixJQUFJLEVBQUU7UUFDSixJQUFJLEVBQUUsWUFBWTtRQUNsQixJQUFJLEVBQUU7WUFDSixXQUFXLEVBQUUsT0FBTyxFQUFFLE9BQU8sSUFBSSxrQ0FBa0M7WUFDbkUsV0FBVyxFQUFFLElBQUk7WUFDakIsR0FBRyxFQUFFLFdBQVcsQ0FBQyxTQUFTLENBQUM7U0FDNUI7UUFDRCxRQUFRLEVBQUU7WUFDUixZQUFZLEVBQUUsVUFBVSxPQUFPLEVBQUUsRUFBRSxJQUFJLEtBQUssZ0dBQWdHO1lBQzVJLE9BQU8sRUFBRSxVQUFVLE9BQU8sRUFBRSxFQUFFLElBQUksS0FBSywwR0FBMEc7U0FDbEo7UUFDRCxNQUFNLEVBQUUsRUFBRTtLQUNYO0lBRUQsTUFBTSxDQUFDLE9BQU87UUFDWixNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxJQUFJLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQTtRQUUxRCw0QkFBNEI7UUFDNUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztZQUNuQyxPQUFPLEVBQUUsQ0FBQTtRQUNYLENBQUM7UUFFRCxPQUFPO1lBQ0wsaUJBQWlCLENBQUMsSUFBUztnQkFDekIsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUE7Z0JBRW5DLElBQUksV0FBVyxLQUFLLEdBQUcsRUFBRSxDQUFDO29CQUN4QixPQUFPLENBQUMsTUFBTSxDQUFDO3dCQUNiLElBQUk7d0JBQ0osU0FBUyxFQUFFLGNBQWM7cUJBQzFCLENBQUMsQ0FBQTtnQkFDSixDQUFDO2dCQUVELElBQUksV0FBVyxLQUFLLE1BQU0sRUFBRSxDQUFDO29CQUMzQixxRkFBcUY7b0JBQ3JGLCtFQUErRTtvQkFDL0UsTUFBTSxvQkFBb0IsR0FBRyxDQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFBO29CQUV2RyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFBO29CQUN4QixPQUFPLE1BQU0sRUFBRSxDQUFDO3dCQUNkLElBQ0UsTUFBTSxDQUFDLElBQUksS0FBSyxZQUFZOzRCQUM1QixNQUFNLENBQUMsY0FBYyxFQUFFLElBQUksRUFBRSxJQUFJOzRCQUNqQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQzlELENBQUM7NEJBQ0Qsc0RBQXNEOzRCQUN0RCxPQUFNO3dCQUNSLENBQUM7d0JBQ0QsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUE7b0JBQ3hCLENBQUM7b0JBRUQsNkRBQTZEO29CQUM3RCxJQUFJLGNBQWMsR0FBRyxLQUFLLENBQUE7b0JBQzFCLElBQUksY0FBYyxHQUFHLEtBQUssQ0FBQTtvQkFFMUIsSUFBSSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFTLEVBQUUsRUFBRTt3QkFDckMsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLGNBQWMsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksS0FBSyxXQUFXLEVBQUUsQ0FBQzs0QkFDcEUsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLElBQUksRUFBRSxDQUFBOzRCQUNyQywwQ0FBMEM7NEJBQzFDLElBQUksb0NBQW9DLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7Z0NBQ3JELGNBQWMsR0FBRyxJQUFJLENBQUE7NEJBQ3ZCLENBQUM7NEJBQ0QsNEVBQTRFOzRCQUM1RSxJQUFJLGtCQUFrQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO2dDQUNuQyxjQUFjLEdBQUcsSUFBSSxDQUFBOzRCQUN2QixDQUFDO3dCQUNILENBQUM7b0JBQ0gsQ0FBQyxDQUFDLENBQUE7b0JBRUYsa0VBQWtFO29CQUNsRSxJQUFJLGNBQWMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO3dCQUN0QyxPQUFPLENBQUMsTUFBTSxDQUFDOzRCQUNiLElBQUk7NEJBQ0osU0FBUyxFQUFFLFNBQVM7eUJBQ3JCLENBQUMsQ0FBQTtvQkFDSixDQUFDO2dCQUNILENBQUM7WUFDSCxDQUFDO1NBQ0YsQ0FBQTtJQUNILENBQUM7Q0FDRixDQUFBO0FBRUQsZUFBZSxJQUFJLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFJ1bGUgfSBmcm9tICdlc2xpbnQnXG5pbXBvcnQgeyBnZXRDYW5vblVybCwgZ2V0Q2Fub25QYXR0ZXJuIH0gZnJvbSAnLi4vdXRpbHMvY2Fub24uanMnXG5cbmNvbnN0IFJVTEVfTkFNRSA9ICdwcmVmZXItdHlwb2dyYXBoeS1jb21wb25lbnRzJ1xuY29uc3QgcGF0dGVybiA9IGdldENhbm9uUGF0dGVybihSVUxFX05BTUUpXG5cbmNvbnN0IHJ1bGU6IFJ1bGUuUnVsZU1vZHVsZSA9IHtcbiAgbWV0YToge1xuICAgIHR5cGU6ICdzdWdnZXN0aW9uJyxcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjogcGF0dGVybj8uc3VtbWFyeSB8fCAnVXNlIFBhcmFncmFwaC9TcGFuLCBub3QgcmF3IHRhZ3MnLFxuICAgICAgcmVjb21tZW5kZWQ6IHRydWUsXG4gICAgICB1cmw6IGdldENhbm9uVXJsKFJVTEVfTkFNRSksXG4gICAgfSxcbiAgICBtZXNzYWdlczoge1xuICAgICAgdXNlUGFyYWdyYXBoOiBgW0Nhbm9uICR7cGF0dGVybj8uaWQgfHwgJzAwMyd9XSBVc2UgdGhlIFBhcmFncmFwaCBjb21wb25lbnQgaW5zdGVhZCBvZiA8cD4uIEltcG9ydDogaW1wb3J0IHsgUGFyYWdyYXBoIH0gZnJvbSBcIkAvY29tcG9uZW50c1wiYCxcbiAgICAgIHVzZVNwYW46IGBbQ2Fub24gJHtwYXR0ZXJuPy5pZCB8fCAnMDAzJ31dIFVzZSB0aGUgU3BhbiBjb21wb25lbnQgaW5zdGVhZCBvZiA8c3Bhbj4gZm9yIHRleHQgY29udGVudC4gSW1wb3J0OiBpbXBvcnQgeyBTcGFuIH0gZnJvbSBcIkAvY29tcG9uZW50c1wiYCxcbiAgICB9LFxuICAgIHNjaGVtYTogW10sXG4gIH0sXG5cbiAgY3JlYXRlKGNvbnRleHQpIHtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGNvbnRleHQuZmlsZW5hbWUgfHwgY29udGV4dC5nZXRGaWxlbmFtZSgpXG5cbiAgICAvLyBPbmx5IGFwcGx5IHRvIGJsb2NrIGZpbGVzXG4gICAgaWYgKCFmaWxlbmFtZS5pbmNsdWRlcygnL2Jsb2Nrcy8nKSkge1xuICAgICAgcmV0dXJuIHt9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIEpTWE9wZW5pbmdFbGVtZW50KG5vZGU6IGFueSkge1xuICAgICAgICBjb25zdCBlbGVtZW50TmFtZSA9IG5vZGUubmFtZT8ubmFtZVxuXG4gICAgICAgIGlmIChlbGVtZW50TmFtZSA9PT0gJ3AnKSB7XG4gICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIG1lc3NhZ2VJZDogJ3VzZVBhcmFncmFwaCcsXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbGVtZW50TmFtZSA9PT0gJ3NwYW4nKSB7XG4gICAgICAgICAgLy8gU2tpcCBzcGFucyB0aGF0IGFyZSBpbnNpZGUgdHlwb2dyYXBoeSBjb21wb25lbnRzIChIZWFkaW5nLCBQYXJhZ3JhcGgsIExhYmVsLCBldGMuKVxuICAgICAgICAgIC8vIFRoZXNlIGFyZSB1c2VkIGZvciBpbmxpbmUgc3R5bGluZyBlZmZlY3RzIGxpa2UgZ3JhZGllbnQgdGV4dCwgZW1waGFzaXMsIGV0Yy5cbiAgICAgICAgICBjb25zdCB0eXBvZ3JhcGh5Q29tcG9uZW50cyA9IFsnSGVhZGluZycsICdQYXJhZ3JhcGgnLCAnTGFiZWwnLCAnU3BhbicsICdRdW90ZScsICdTdWJoZWFkaW5nJywgJ0FjY2VudCddXG4gICAgICAgICAgXG4gICAgICAgICAgbGV0IHBhcmVudCA9IG5vZGUucGFyZW50XG4gICAgICAgICAgd2hpbGUgKHBhcmVudCkge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICBwYXJlbnQudHlwZSA9PT0gJ0pTWEVsZW1lbnQnICYmXG4gICAgICAgICAgICAgIHBhcmVudC5vcGVuaW5nRWxlbWVudD8ubmFtZT8ubmFtZSAmJlxuICAgICAgICAgICAgICB0eXBvZ3JhcGh5Q29tcG9uZW50cy5pbmNsdWRlcyhwYXJlbnQub3BlbmluZ0VsZW1lbnQubmFtZS5uYW1lKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIC8vIFNwYW4gaXMgaW5zaWRlIGEgdHlwb2dyYXBoeSBjb21wb25lbnQsIHNraXAgd2FybmluZ1xuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnRcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBDaGVjayBjbGFzc05hbWUgZm9yIHRleHQtcmVsYXRlZCBjbGFzc2VzIGFuZCBncmFkaWVudCB0ZXh0XG4gICAgICAgICAgbGV0IGhhc1RleHRDbGFzc2VzID0gZmFsc2VcbiAgICAgICAgICBsZXQgaXNHcmFkaWVudFRleHQgPSBmYWxzZVxuXG4gICAgICAgICAgbm9kZS5hdHRyaWJ1dGVzPy5mb3JFYWNoKChhdHRyOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGlmIChhdHRyLnR5cGUgPT09ICdKU1hBdHRyaWJ1dGUnICYmIGF0dHIubmFtZT8ubmFtZSA9PT0gJ2NsYXNzTmFtZScpIHtcbiAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBhdHRyLnZhbHVlPy52YWx1ZSB8fCAnJ1xuICAgICAgICAgICAgICAvLyBDaGVjayBmb3IgdGV4dC1yZWxhdGVkIFRhaWx3aW5kIGNsYXNzZXNcbiAgICAgICAgICAgICAgaWYgKC9cXGIodGV4dC18Zm9udC18bGVhZGluZy18dHJhY2tpbmctKS8udGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBoYXNUZXh0Q2xhc3NlcyA9IHRydWVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvLyBTa2lwIGdyYWRpZW50IHRleHQgc3BhbnMgKGJnLWNsaXAtdGV4dCBpcyB1c2VkIGZvciBncmFkaWVudCB0ZXh0IGVmZmVjdHMpXG4gICAgICAgICAgICAgIGlmICgvXFxiYmctY2xpcC10ZXh0XFxiLy50ZXN0KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGlzR3JhZGllbnRUZXh0ID0gdHJ1ZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcblxuICAgICAgICAgIC8vIE9ubHkgd2FybiBpZiB0aGUgc3BhbiBoYXMgdGV4dCBzdHlsaW5nIGFuZCBpcyBub3QgZ3JhZGllbnQgdGV4dFxuICAgICAgICAgIGlmIChoYXNUZXh0Q2xhc3NlcyAmJiAhaXNHcmFkaWVudFRleHQpIHtcbiAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICAgbWVzc2FnZUlkOiAndXNlU3BhbicsXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9XG4gIH0sXG59XG5cbmV4cG9ydCBkZWZhdWx0IHJ1bGVcbiJdfQ==