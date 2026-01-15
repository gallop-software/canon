import { ESLintUtils } from '@typescript-eslint/utils';
import { getCanonUrl, getCanonPattern } from '../utils/canon.js';
const RULE_NAME = 'prefer-component-props';
const pattern = getCanonPattern(RULE_NAME);
const createRule = ESLintUtils.RuleCreator(() => getCanonUrl(RULE_NAME));
// Map of component names to their style props and corresponding Tailwind patterns
const componentPropMappings = {
    Paragraph: {
        margin: /^m([by])?-/, // m- (all), mb- (bottom), my- (y-axis) - all affect bottom margin
        color: /^text-(body|contrast|accent|white|black)/,
        fontSize: /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/,
        lineHeight: /^leading-/,
        textAlign: /^text-(left|center|right|justify)$/,
        fontWeight: /^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/,
    },
    Heading: {
        margin: /^m([by])?-/, // m- (all), mb- (bottom), my- (y-axis) - all affect bottom margin
        color: /^text-(body|contrast|accent|white|black)/,
        fontSize: /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/,
        lineHeight: /^leading-/,
        textAlign: /^text-(left|center|right|justify)$/,
        fontWeight: /^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/,
    },
    Accent: {
        margin: /^m([by])?-/, // m- (all), mb- (bottom), my- (y-axis) - all affect bottom margin
        color: /^text-(body|contrast|accent|white|black)/,
        size: /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/,
        textAlign: /^text-(left|center|right|justify)$/,
    },
    Button: {
        margin: /^m([by])?-/, // m- (all), mb- (bottom), my- (y-axis) - all affect bottom margin
    },
    Label: {
        margin: /^m([by])?-/, // m- (all), mb- (bottom), my- (y-axis) - all affect bottom margin
        color: /^text-(body|contrast|accent|white|black)/,
    },
};
export default createRule({
    name: RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: pattern?.summary || 'Use props over className for supported styles',
        },
        messages: {
            preferComponentProps: `[Canon ${pattern?.id || '004'}] "{{className}}" in className should use the "{{propName}}" prop instead. Replace className="{{className}}" with {{propName}}="{{className}}".`,
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        return {
            JSXOpeningElement(node) {
                // Get the component name
                if (node.name.type !== 'JSXIdentifier')
                    return;
                const componentName = node.name.name;
                // Check if this component has prop mappings
                const propMappings = componentPropMappings[componentName];
                if (!propMappings)
                    return;
                // Find the className attribute
                const classNameAttr = node.attributes.find((attr) => attr.type === 'JSXAttribute' &&
                    attr.name.type === 'JSXIdentifier' &&
                    attr.name.name === 'className');
                if (!classNameAttr || !classNameAttr.value)
                    return;
                // Extract class string value
                let classValue = null;
                if (classNameAttr.value.type === 'Literal') {
                    classValue = String(classNameAttr.value.value);
                }
                else if (classNameAttr.value.type === 'JSXExpressionContainer' &&
                    classNameAttr.value.expression.type === 'Literal') {
                    classValue = String(classNameAttr.value.expression.value);
                }
                if (!classValue)
                    return;
                // Split into individual classes and check each
                const classes = classValue.split(/\s+/).filter(Boolean);
                for (const cls of classes) {
                    for (const [propName, pattern] of Object.entries(propMappings)) {
                        if (pattern.test(cls)) {
                            context.report({
                                node: classNameAttr,
                                messageId: 'preferComponentProps',
                                data: {
                                    className: cls,
                                    propName,
                                },
                            });
                            break; // Only report once per class
                        }
                    }
                }
            },
        };
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZmVyLWNvbXBvbmVudC1wcm9wcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lc2xpbnQvcnVsZXMvcHJlZmVyLWNvbXBvbmVudC1wcm9wcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsV0FBVyxFQUFZLE1BQU0sMEJBQTBCLENBQUE7QUFDaEUsT0FBTyxFQUFFLFdBQVcsRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQTtBQUVoRSxNQUFNLFNBQVMsR0FBRyx3QkFBd0IsQ0FBQTtBQUMxQyxNQUFNLE9BQU8sR0FBRyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUE7QUFFMUMsTUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQTtBQUl4RSxrRkFBa0Y7QUFDbEYsTUFBTSxxQkFBcUIsR0FBMkM7SUFDcEUsU0FBUyxFQUFFO1FBQ1QsTUFBTSxFQUFFLFlBQVksRUFBRSxrRUFBa0U7UUFDeEYsS0FBSyxFQUFFLDBDQUEwQztRQUNqRCxRQUFRLEVBQUUsMkRBQTJEO1FBQ3JFLFVBQVUsRUFBRSxXQUFXO1FBQ3ZCLFNBQVMsRUFBRSxvQ0FBb0M7UUFDL0MsVUFBVSxFQUFFLDRFQUE0RTtLQUN6RjtJQUNELE9BQU8sRUFBRTtRQUNQLE1BQU0sRUFBRSxZQUFZLEVBQUUsa0VBQWtFO1FBQ3hGLEtBQUssRUFBRSwwQ0FBMEM7UUFDakQsUUFBUSxFQUFFLDJEQUEyRDtRQUNyRSxVQUFVLEVBQUUsV0FBVztRQUN2QixTQUFTLEVBQUUsb0NBQW9DO1FBQy9DLFVBQVUsRUFBRSw0RUFBNEU7S0FDekY7SUFDRCxNQUFNLEVBQUU7UUFDTixNQUFNLEVBQUUsWUFBWSxFQUFFLGtFQUFrRTtRQUN4RixLQUFLLEVBQUUsMENBQTBDO1FBQ2pELElBQUksRUFBRSwyREFBMkQ7UUFDakUsU0FBUyxFQUFFLG9DQUFvQztLQUNoRDtJQUNELE1BQU0sRUFBRTtRQUNOLE1BQU0sRUFBRSxZQUFZLEVBQUUsa0VBQWtFO0tBQ3pGO0lBQ0QsS0FBSyxFQUFFO1FBQ0wsTUFBTSxFQUFFLFlBQVksRUFBRSxrRUFBa0U7UUFDeEYsS0FBSyxFQUFFLDBDQUEwQztLQUNsRDtDQUNGLENBQUE7QUFFRCxlQUFlLFVBQVUsQ0FBaUI7SUFDeEMsSUFBSSxFQUFFLFNBQVM7SUFDZixJQUFJLEVBQUU7UUFDSixJQUFJLEVBQUUsWUFBWTtRQUNsQixJQUFJLEVBQUU7WUFDSixXQUFXLEVBQUUsT0FBTyxFQUFFLE9BQU8sSUFBSSwrQ0FBK0M7U0FDakY7UUFDRCxRQUFRLEVBQUU7WUFDUixvQkFBb0IsRUFBRSxVQUFVLE9BQU8sRUFBRSxFQUFFLElBQUksS0FBSyxpSkFBaUo7U0FDdE07UUFDRCxNQUFNLEVBQUUsRUFBRTtLQUNYO0lBQ0QsY0FBYyxFQUFFLEVBQUU7SUFDbEIsTUFBTSxDQUFDLE9BQU87UUFDWixPQUFPO1lBQ0wsaUJBQWlCLENBQUMsSUFBSTtnQkFDcEIseUJBQXlCO2dCQUN6QixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLGVBQWU7b0JBQUUsT0FBTTtnQkFDOUMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUE7Z0JBRXBDLDRDQUE0QztnQkFDNUMsTUFBTSxZQUFZLEdBQUcscUJBQXFCLENBQUMsYUFBYSxDQUFDLENBQUE7Z0JBQ3pELElBQUksQ0FBQyxZQUFZO29CQUFFLE9BQU07Z0JBRXpCLCtCQUErQjtnQkFDL0IsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQ3hDLENBQUMsSUFBSSxFQUFpQyxFQUFFLENBQ3RDLElBQUksQ0FBQyxJQUFJLEtBQUssY0FBYztvQkFDNUIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssZUFBZTtvQkFDbEMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssV0FBVyxDQUNqQyxDQUFBO2dCQUVELElBQUksQ0FBQyxhQUFhLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSztvQkFBRSxPQUFNO2dCQUVsRCw2QkFBNkI7Z0JBQzdCLElBQUksVUFBVSxHQUFrQixJQUFJLENBQUE7Z0JBRXBDLElBQUksYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssU0FBUyxFQUFFLENBQUM7b0JBQzNDLFVBQVUsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQTtnQkFDaEQsQ0FBQztxQkFBTSxJQUNMLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLHdCQUF3QjtvQkFDckQsYUFBYSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFDakQsQ0FBQztvQkFDRCxVQUFVLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFBO2dCQUMzRCxDQUFDO2dCQUVELElBQUksQ0FBQyxVQUFVO29CQUFFLE9BQU07Z0JBRXZCLCtDQUErQztnQkFDL0MsTUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUE7Z0JBRXZELEtBQUssTUFBTSxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7b0JBQzFCLEtBQUssTUFBTSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUM7d0JBQy9ELElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDOzRCQUN0QixPQUFPLENBQUMsTUFBTSxDQUFDO2dDQUNiLElBQUksRUFBRSxhQUFhO2dDQUNuQixTQUFTLEVBQUUsc0JBQXNCO2dDQUNqQyxJQUFJLEVBQUU7b0NBQ0osU0FBUyxFQUFFLEdBQUc7b0NBQ2QsUUFBUTtpQ0FDVDs2QkFDRixDQUFDLENBQUE7NEJBQ0YsTUFBSyxDQUFDLDZCQUE2Qjt3QkFDckMsQ0FBQztvQkFDSCxDQUFDO2dCQUNILENBQUM7WUFDSCxDQUFDO1NBQ0YsQ0FBQTtJQUNILENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFU0xpbnRVdGlscywgVFNFU1RyZWUgfSBmcm9tICdAdHlwZXNjcmlwdC1lc2xpbnQvdXRpbHMnXG5pbXBvcnQgeyBnZXRDYW5vblVybCwgZ2V0Q2Fub25QYXR0ZXJuIH0gZnJvbSAnLi4vdXRpbHMvY2Fub24uanMnXG5cbmNvbnN0IFJVTEVfTkFNRSA9ICdwcmVmZXItY29tcG9uZW50LXByb3BzJ1xuY29uc3QgcGF0dGVybiA9IGdldENhbm9uUGF0dGVybihSVUxFX05BTUUpXG5cbmNvbnN0IGNyZWF0ZVJ1bGUgPSBFU0xpbnRVdGlscy5SdWxlQ3JlYXRvcigoKSA9PiBnZXRDYW5vblVybChSVUxFX05BTUUpKVxuXG50eXBlIE1lc3NhZ2VJZHMgPSAncHJlZmVyQ29tcG9uZW50UHJvcHMnXG5cbi8vIE1hcCBvZiBjb21wb25lbnQgbmFtZXMgdG8gdGhlaXIgc3R5bGUgcHJvcHMgYW5kIGNvcnJlc3BvbmRpbmcgVGFpbHdpbmQgcGF0dGVybnNcbmNvbnN0IGNvbXBvbmVudFByb3BNYXBwaW5nczogUmVjb3JkPHN0cmluZywgUmVjb3JkPHN0cmluZywgUmVnRXhwPj4gPSB7XG4gIFBhcmFncmFwaDoge1xuICAgIG1hcmdpbjogL15tKFtieV0pPy0vLCAvLyBtLSAoYWxsKSwgbWItIChib3R0b20pLCBteS0gKHktYXhpcykgLSBhbGwgYWZmZWN0IGJvdHRvbSBtYXJnaW5cbiAgICBjb2xvcjogL150ZXh0LShib2R5fGNvbnRyYXN0fGFjY2VudHx3aGl0ZXxibGFjaykvLFxuICAgIGZvbnRTaXplOiAvXnRleHQtKHhzfHNtfGJhc2V8bGd8eGx8MnhsfDN4bHw0eGx8NXhsfDZ4bHw3eGx8OHhsfDl4bCkkLyxcbiAgICBsaW5lSGVpZ2h0OiAvXmxlYWRpbmctLyxcbiAgICB0ZXh0QWxpZ246IC9edGV4dC0obGVmdHxjZW50ZXJ8cmlnaHR8anVzdGlmeSkkLyxcbiAgICBmb250V2VpZ2h0OiAvXmZvbnQtKHRoaW58ZXh0cmFsaWdodHxsaWdodHxub3JtYWx8bWVkaXVtfHNlbWlib2xkfGJvbGR8ZXh0cmFib2xkfGJsYWNrKSQvLFxuICB9LFxuICBIZWFkaW5nOiB7XG4gICAgbWFyZ2luOiAvXm0oW2J5XSk/LS8sIC8vIG0tIChhbGwpLCBtYi0gKGJvdHRvbSksIG15LSAoeS1heGlzKSAtIGFsbCBhZmZlY3QgYm90dG9tIG1hcmdpblxuICAgIGNvbG9yOiAvXnRleHQtKGJvZHl8Y29udHJhc3R8YWNjZW50fHdoaXRlfGJsYWNrKS8sXG4gICAgZm9udFNpemU6IC9edGV4dC0oeHN8c218YmFzZXxsZ3x4bHwyeGx8M3hsfDR4bHw1eGx8NnhsfDd4bHw4eGx8OXhsKSQvLFxuICAgIGxpbmVIZWlnaHQ6IC9ebGVhZGluZy0vLFxuICAgIHRleHRBbGlnbjogL150ZXh0LShsZWZ0fGNlbnRlcnxyaWdodHxqdXN0aWZ5KSQvLFxuICAgIGZvbnRXZWlnaHQ6IC9eZm9udC0odGhpbnxleHRyYWxpZ2h0fGxpZ2h0fG5vcm1hbHxtZWRpdW18c2VtaWJvbGR8Ym9sZHxleHRyYWJvbGR8YmxhY2spJC8sXG4gIH0sXG4gIEFjY2VudDoge1xuICAgIG1hcmdpbjogL15tKFtieV0pPy0vLCAvLyBtLSAoYWxsKSwgbWItIChib3R0b20pLCBteS0gKHktYXhpcykgLSBhbGwgYWZmZWN0IGJvdHRvbSBtYXJnaW5cbiAgICBjb2xvcjogL150ZXh0LShib2R5fGNvbnRyYXN0fGFjY2VudHx3aGl0ZXxibGFjaykvLFxuICAgIHNpemU6IC9edGV4dC0oeHN8c218YmFzZXxsZ3x4bHwyeGx8M3hsfDR4bHw1eGx8NnhsfDd4bHw4eGx8OXhsKSQvLFxuICAgIHRleHRBbGlnbjogL150ZXh0LShsZWZ0fGNlbnRlcnxyaWdodHxqdXN0aWZ5KSQvLFxuICB9LFxuICBCdXR0b246IHtcbiAgICBtYXJnaW46IC9ebShbYnldKT8tLywgLy8gbS0gKGFsbCksIG1iLSAoYm90dG9tKSwgbXktICh5LWF4aXMpIC0gYWxsIGFmZmVjdCBib3R0b20gbWFyZ2luXG4gIH0sXG4gIExhYmVsOiB7XG4gICAgbWFyZ2luOiAvXm0oW2J5XSk/LS8sIC8vIG0tIChhbGwpLCBtYi0gKGJvdHRvbSksIG15LSAoeS1heGlzKSAtIGFsbCBhZmZlY3QgYm90dG9tIG1hcmdpblxuICAgIGNvbG9yOiAvXnRleHQtKGJvZHl8Y29udHJhc3R8YWNjZW50fHdoaXRlfGJsYWNrKS8sXG4gIH0sXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVJ1bGU8W10sIE1lc3NhZ2VJZHM+KHtcbiAgbmFtZTogUlVMRV9OQU1FLFxuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiBwYXR0ZXJuPy5zdW1tYXJ5IHx8ICdVc2UgcHJvcHMgb3ZlciBjbGFzc05hbWUgZm9yIHN1cHBvcnRlZCBzdHlsZXMnLFxuICAgIH0sXG4gICAgbWVzc2FnZXM6IHtcbiAgICAgIHByZWZlckNvbXBvbmVudFByb3BzOiBgW0Nhbm9uICR7cGF0dGVybj8uaWQgfHwgJzAwNCd9XSBcInt7Y2xhc3NOYW1lfX1cIiBpbiBjbGFzc05hbWUgc2hvdWxkIHVzZSB0aGUgXCJ7e3Byb3BOYW1lfX1cIiBwcm9wIGluc3RlYWQuIFJlcGxhY2UgY2xhc3NOYW1lPVwie3tjbGFzc05hbWV9fVwiIHdpdGgge3twcm9wTmFtZX19PVwie3tjbGFzc05hbWV9fVwiLmAsXG4gICAgfSxcbiAgICBzY2hlbWE6IFtdLFxuICB9LFxuICBkZWZhdWx0T3B0aW9uczogW10sXG4gIGNyZWF0ZShjb250ZXh0KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIEpTWE9wZW5pbmdFbGVtZW50KG5vZGUpIHtcbiAgICAgICAgLy8gR2V0IHRoZSBjb21wb25lbnQgbmFtZVxuICAgICAgICBpZiAobm9kZS5uYW1lLnR5cGUgIT09ICdKU1hJZGVudGlmaWVyJykgcmV0dXJuXG4gICAgICAgIGNvbnN0IGNvbXBvbmVudE5hbWUgPSBub2RlLm5hbWUubmFtZVxuXG4gICAgICAgIC8vIENoZWNrIGlmIHRoaXMgY29tcG9uZW50IGhhcyBwcm9wIG1hcHBpbmdzXG4gICAgICAgIGNvbnN0IHByb3BNYXBwaW5ncyA9IGNvbXBvbmVudFByb3BNYXBwaW5nc1tjb21wb25lbnROYW1lXVxuICAgICAgICBpZiAoIXByb3BNYXBwaW5ncykgcmV0dXJuXG5cbiAgICAgICAgLy8gRmluZCB0aGUgY2xhc3NOYW1lIGF0dHJpYnV0ZVxuICAgICAgICBjb25zdCBjbGFzc05hbWVBdHRyID0gbm9kZS5hdHRyaWJ1dGVzLmZpbmQoXG4gICAgICAgICAgKGF0dHIpOiBhdHRyIGlzIFRTRVNUcmVlLkpTWEF0dHJpYnV0ZSA9PlxuICAgICAgICAgICAgYXR0ci50eXBlID09PSAnSlNYQXR0cmlidXRlJyAmJlxuICAgICAgICAgICAgYXR0ci5uYW1lLnR5cGUgPT09ICdKU1hJZGVudGlmaWVyJyAmJlxuICAgICAgICAgICAgYXR0ci5uYW1lLm5hbWUgPT09ICdjbGFzc05hbWUnXG4gICAgICAgIClcblxuICAgICAgICBpZiAoIWNsYXNzTmFtZUF0dHIgfHwgIWNsYXNzTmFtZUF0dHIudmFsdWUpIHJldHVyblxuXG4gICAgICAgIC8vIEV4dHJhY3QgY2xhc3Mgc3RyaW5nIHZhbHVlXG4gICAgICAgIGxldCBjbGFzc1ZhbHVlOiBzdHJpbmcgfCBudWxsID0gbnVsbFxuXG4gICAgICAgIGlmIChjbGFzc05hbWVBdHRyLnZhbHVlLnR5cGUgPT09ICdMaXRlcmFsJykge1xuICAgICAgICAgIGNsYXNzVmFsdWUgPSBTdHJpbmcoY2xhc3NOYW1lQXR0ci52YWx1ZS52YWx1ZSlcbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICBjbGFzc05hbWVBdHRyLnZhbHVlLnR5cGUgPT09ICdKU1hFeHByZXNzaW9uQ29udGFpbmVyJyAmJlxuICAgICAgICAgIGNsYXNzTmFtZUF0dHIudmFsdWUuZXhwcmVzc2lvbi50eXBlID09PSAnTGl0ZXJhbCdcbiAgICAgICAgKSB7XG4gICAgICAgICAgY2xhc3NWYWx1ZSA9IFN0cmluZyhjbGFzc05hbWVBdHRyLnZhbHVlLmV4cHJlc3Npb24udmFsdWUpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWNsYXNzVmFsdWUpIHJldHVyblxuXG4gICAgICAgIC8vIFNwbGl0IGludG8gaW5kaXZpZHVhbCBjbGFzc2VzIGFuZCBjaGVjayBlYWNoXG4gICAgICAgIGNvbnN0IGNsYXNzZXMgPSBjbGFzc1ZhbHVlLnNwbGl0KC9cXHMrLykuZmlsdGVyKEJvb2xlYW4pXG5cbiAgICAgICAgZm9yIChjb25zdCBjbHMgb2YgY2xhc3Nlcykge1xuICAgICAgICAgIGZvciAoY29uc3QgW3Byb3BOYW1lLCBwYXR0ZXJuXSBvZiBPYmplY3QuZW50cmllcyhwcm9wTWFwcGluZ3MpKSB7XG4gICAgICAgICAgICBpZiAocGF0dGVybi50ZXN0KGNscykpIHtcbiAgICAgICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgICAgIG5vZGU6IGNsYXNzTmFtZUF0dHIsXG4gICAgICAgICAgICAgICAgbWVzc2FnZUlkOiAncHJlZmVyQ29tcG9uZW50UHJvcHMnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogY2xzLFxuICAgICAgICAgICAgICAgICAgcHJvcE5hbWUsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgYnJlYWsgLy8gT25seSByZXBvcnQgb25jZSBwZXIgY2xhc3NcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfVxuICB9LFxufSlcbiJdfQ==