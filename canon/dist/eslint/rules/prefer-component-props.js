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
    Quote: {
        margin: /^m([by])?-/, // m- (all), mb- (bottom), my- (y-axis) - all affect bottom margin
        color: /^text-(body|contrast|accent|white|black)/,
        fontSize: /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/,
        fontWeight: /^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/,
        textAlign: /^text-(left|center|right|justify)$/,
    },
    Image: {
        rounded: /^rounded(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/,
        aspect: /^aspect-/,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZmVyLWNvbXBvbmVudC1wcm9wcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lc2xpbnQvcnVsZXMvcHJlZmVyLWNvbXBvbmVudC1wcm9wcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsV0FBVyxFQUFZLE1BQU0sMEJBQTBCLENBQUE7QUFDaEUsT0FBTyxFQUFFLFdBQVcsRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQTtBQUVoRSxNQUFNLFNBQVMsR0FBRyx3QkFBd0IsQ0FBQTtBQUMxQyxNQUFNLE9BQU8sR0FBRyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUE7QUFFMUMsTUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQTtBQUl4RSxrRkFBa0Y7QUFDbEYsTUFBTSxxQkFBcUIsR0FBMkM7SUFDcEUsU0FBUyxFQUFFO1FBQ1QsTUFBTSxFQUFFLFlBQVksRUFBRSxrRUFBa0U7UUFDeEYsS0FBSyxFQUFFLDBDQUEwQztRQUNqRCxRQUFRLEVBQUUsMkRBQTJEO1FBQ3JFLFVBQVUsRUFBRSxXQUFXO1FBQ3ZCLFNBQVMsRUFBRSxvQ0FBb0M7UUFDL0MsVUFBVSxFQUFFLDRFQUE0RTtLQUN6RjtJQUNELE9BQU8sRUFBRTtRQUNQLE1BQU0sRUFBRSxZQUFZLEVBQUUsa0VBQWtFO1FBQ3hGLEtBQUssRUFBRSwwQ0FBMEM7UUFDakQsUUFBUSxFQUFFLDJEQUEyRDtRQUNyRSxVQUFVLEVBQUUsV0FBVztRQUN2QixTQUFTLEVBQUUsb0NBQW9DO1FBQy9DLFVBQVUsRUFBRSw0RUFBNEU7S0FDekY7SUFDRCxNQUFNLEVBQUU7UUFDTixNQUFNLEVBQUUsWUFBWSxFQUFFLGtFQUFrRTtRQUN4RixLQUFLLEVBQUUsMENBQTBDO1FBQ2pELElBQUksRUFBRSwyREFBMkQ7UUFDakUsU0FBUyxFQUFFLG9DQUFvQztL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QUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7NEJBQ3RCLE9BQU8sQ0FBQyxNQUFNLENBQUM7Z0NBQ2IsSUFBSSxFQUFFLGFBQWE7Z0NBQ25CLFNBQVMsRUFBRSxzQkFBc0I7Z0NBQ2pDLElBQUksRUFBRTtvQ0FDSixTQUFTLEVBQUUsR0FBRztvQ0FDZCxRQUFRO2lDQUNUOzZCQUNGLENBQUMsQ0FBQTs0QkFDRixNQUFLLENBQUMsNkJBQTZCO3dCQUNyQyxDQUFDO29CQUNILENBQUM7Z0JBQ0gsQ0FBQztZQUNILENBQUM7U0FDRixDQUFBO0lBQ0gsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVTTGludFV0aWxzLCBUU0VTVHJlZSB9IGZyb20gJ0B0eXBlc2NyaXB0LWVzbGludC91dGlscydcbmltcG9ydCB7IGdldENhbm9uVXJsLCBnZXRDYW5vblBhdHRlcm4gfSBmcm9tICcuLi91dGlscy9jYW5vbi5qcydcblxuY29uc3QgUlVMRV9OQU1FID0gJ3ByZWZlci1jb21wb25lbnQtcHJvcHMnXG5jb25zdCBwYXR0ZXJuID0gZ2V0Q2Fub25QYXR0ZXJuKFJVTEVfTkFNRSlcblxuY29uc3QgY3JlYXRlUnVsZSA9IEVTTGludFV0aWxzLlJ1bGVDcmVhdG9yKCgpID0+IGdldENhbm9uVXJsKFJVTEVfTkFNRSkpXG5cbnR5cGUgTWVzc2FnZUlkcyA9ICdwcmVmZXJDb21wb25lbnRQcm9wcydcblxuLy8gTWFwIG9mIGNvbXBvbmVudCBuYW1lcyB0byB0aGVpciBzdHlsZSBwcm9wcyBhbmQgY29ycmVzcG9uZGluZyBUYWlsd2luZCBwYXR0ZXJuc1xuY29uc3QgY29tcG9uZW50UHJvcE1hcHBpbmdzOiBSZWNvcmQ8c3RyaW5nLCBSZWNvcmQ8c3RyaW5nLCBSZWdFeHA+PiA9IHtcbiAgUGFyYWdyYXBoOiB7XG4gICAgbWFyZ2luOiAvXm0oW2J5XSk/LS8sIC8vIG0tIChhbGwpLCBtYi0gKGJvdHRvbSksIG15LSAoeS1heGlzKSAtIGFsbCBhZmZlY3QgYm90dG9tIG1hcmdpblxuICAgIGNvbG9yOiAvXnRleHQtKGJvZHl8Y29udHJhc3R8YWNjZW50fHdoaXRlfGJsYWNrKS8sXG4gICAgZm9udFNpemU6IC9edGV4dC0oeHN8c218YmFzZXxsZ3x4bHwyeGx8M3hsfDR4bHw1eGx8NnhsfDd4bHw4eGx8OXhsKSQvLFxuICAgIGxpbmVIZWlnaHQ6IC9ebGVhZGluZy0vLFxuICAgIHRleHRBbGlnbjogL150ZXh0LShsZWZ0fGNlbnRlcnxyaWdodHxqdXN0aWZ5KSQvLFxuICAgIGZvbnRXZWlnaHQ6IC9eZm9udC0odGhpbnxleHRyYWxpZ2h0fGxpZ2h0fG5vcm1hbHxtZWRpdW18c2VtaWJvbGR8Ym9sZHxleHRyYWJvbGR8YmxhY2spJC8sXG4gIH0sXG4gIEhlYWRpbmc6IHtcbiAgICBtYXJnaW46IC9ebShbYnldKT8tLywgLy8gbS0gKGFsbCksIG1iLSAoYm90dG9tKSwgbXktICh5LWF4aXMpIC0gYWxsIGFmZmVjdCBib3R0b20gbWFyZ2luXG4gICAgY29sb3I6IC9edGV4dC0oYm9keXxjb250cmFzdHxhY2NlbnR8d2hpdGV8YmxhY2spLyxcbiAgICBmb250U2l6ZTogL150ZXh0LSh4c3xzbXxiYXNlfGxnfHhsfDJ4bHwzeGx8NHhsfDV4bHw2eGx8N3hsfDh4bHw5eGwpJC8sXG4gICAgbGluZUhlaWdodDogL15sZWFkaW5nLS8sXG4gICAgdGV4dEFsaWduOiAvXnRleHQtKGxlZnR8Y2VudGVyfHJpZ2h0fGp1c3RpZnkpJC8sXG4gICAgZm9udFdlaWdodDogL15mb250LSh0aGlufGV4dHJhbGlnaHR8bGlnaHR8bm9ybWFsfG1lZGl1bXxzZW1pYm9sZHxib2xkfGV4dHJhYm9sZHxibGFjaykkLyxcbiAgfSxcbiAgQWNjZW50OiB7XG4gICAgbWFyZ2luOiAvXm0oW2J5XSk/LS8sIC8vIG0tIChhbGwpLCBtYi0gKGJvdHRvbSksIG15LSAoeS1heGlzKSAtIGFsbCBhZmZlY3QgYm90dG9tIG1hcmdpblxuICAgIGNvbG9yOiAvXnRleHQtKGJvZHl8Y29udHJhc3R8YWNjZW50fHdoaXRlfGJsYWNrKS8sXG4gICAgc2l6ZTogL150ZXh0LSh4c3xzbXxiYXNlfGxnfHhsfDJ4bHwzeGx8NHhsfDV4bHw2eGx8N3hsfDh4bHw5eGwpJC8sXG4gICAgdGV4dEFsaWduOiAvXnRleHQtKGxlZnR8Y2VudGVyfHJpZ2h0fGp1c3RpZnkpJC8sXG4gIH0sXG4gIEJ1dHRvbjoge1xuICAgIG1hcmdpbjogL15tKFtieV0pPy0vLCAvLyBtLSAoYWxsKSwgbWItIChib3R0b20pLCBteS0gKHktYXhpcykgLSBhbGwgYWZmZWN0IGJvdHRvbSBtYXJnaW5cbiAgfSxcbiAgTGFiZWw6IHtcbiAgICBtYXJnaW46IC9ebShbYnldKT8tLywgLy8gbS0gKGFsbCksIG1iLSAoYm90dG9tKSwgbXktICh5LWF4aXMpIC0gYWxsIGFmZmVjdCBib3R0b20gbWFyZ2luXG4gICAgY29sb3I6IC9edGV4dC0oYm9keXxjb250cmFzdHxhY2NlbnR8d2hpdGV8YmxhY2spLyxcbiAgfSxcbiAgUXVvdGU6IHtcbiAgICBtYXJnaW46IC9ebShbYnldKT8tLywgLy8gbS0gKGFsbCksIG1iLSAoYm90dG9tKSwgbXktICh5LWF4aXMpIC0gYWxsIGFmZmVjdCBib3R0b20gbWFyZ2luXG4gICAgY29sb3I6IC9edGV4dC0oYm9keXxjb250cmFzdHxhY2NlbnR8d2hpdGV8YmxhY2spLyxcbiAgICBmb250U2l6ZTogL150ZXh0LSh4c3xzbXxiYXNlfGxnfHhsfDJ4bHwzeGx8NHhsfDV4bHw2eGx8N3hsfDh4bHw5eGwpJC8sXG4gICAgZm9udFdlaWdodDogL15mb250LSh0aGlufGV4dHJhbGlnaHR8bGlnaHR8bm9ybWFsfG1lZGl1bXxzZW1pYm9sZHxib2xkfGV4dHJhYm9sZHxibGFjaykkLyxcbiAgICB0ZXh0QWxpZ246IC9edGV4dC0obGVmdHxjZW50ZXJ8cmlnaHR8anVzdGlmeSkkLyxcbiAgfSxcbiAgSW1hZ2U6IHtcbiAgICByb3VuZGVkOiAvXnJvdW5kZWQoLW5vbmV8LXNtfC1tZHwtbGd8LXhsfC0yeGx8LTN4bHwtZnVsbCk/JC8sXG4gICAgYXNwZWN0OiAvXmFzcGVjdC0vLFxuICB9LFxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVSdWxlPFtdLCBNZXNzYWdlSWRzPih7XG4gIG5hbWU6IFJVTEVfTkFNRSxcbiAgbWV0YToge1xuICAgIHR5cGU6ICdzdWdnZXN0aW9uJyxcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjogcGF0dGVybj8uc3VtbWFyeSB8fCAnVXNlIHByb3BzIG92ZXIgY2xhc3NOYW1lIGZvciBzdXBwb3J0ZWQgc3R5bGVzJyxcbiAgICB9LFxuICAgIG1lc3NhZ2VzOiB7XG4gICAgICBwcmVmZXJDb21wb25lbnRQcm9wczogYFtDYW5vbiAke3BhdHRlcm4/LmlkIHx8ICcwMDQnfV0gXCJ7e2NsYXNzTmFtZX19XCIgaW4gY2xhc3NOYW1lIHNob3VsZCB1c2UgdGhlIFwie3twcm9wTmFtZX19XCIgcHJvcCBpbnN0ZWFkLiBSZXBsYWNlIGNsYXNzTmFtZT1cInt7Y2xhc3NOYW1lfX1cIiB3aXRoIHt7cHJvcE5hbWV9fT1cInt7Y2xhc3NOYW1lfX1cIi5gLFxuICAgIH0sXG4gICAgc2NoZW1hOiBbXSxcbiAgfSxcbiAgZGVmYXVsdE9wdGlvbnM6IFtdLFxuICBjcmVhdGUoY29udGV4dCkge1xuICAgIHJldHVybiB7XG4gICAgICBKU1hPcGVuaW5nRWxlbWVudChub2RlKSB7XG4gICAgICAgIC8vIEdldCB0aGUgY29tcG9uZW50IG5hbWVcbiAgICAgICAgaWYgKG5vZGUubmFtZS50eXBlICE9PSAnSlNYSWRlbnRpZmllcicpIHJldHVyblxuICAgICAgICBjb25zdCBjb21wb25lbnROYW1lID0gbm9kZS5uYW1lLm5hbWVcblxuICAgICAgICAvLyBDaGVjayBpZiB0aGlzIGNvbXBvbmVudCBoYXMgcHJvcCBtYXBwaW5nc1xuICAgICAgICBjb25zdCBwcm9wTWFwcGluZ3MgPSBjb21wb25lbnRQcm9wTWFwcGluZ3NbY29tcG9uZW50TmFtZV1cbiAgICAgICAgaWYgKCFwcm9wTWFwcGluZ3MpIHJldHVyblxuXG4gICAgICAgIC8vIEZpbmQgdGhlIGNsYXNzTmFtZSBhdHRyaWJ1dGVcbiAgICAgICAgY29uc3QgY2xhc3NOYW1lQXR0ciA9IG5vZGUuYXR0cmlidXRlcy5maW5kKFxuICAgICAgICAgIChhdHRyKTogYXR0ciBpcyBUU0VTVHJlZS5KU1hBdHRyaWJ1dGUgPT5cbiAgICAgICAgICAgIGF0dHIudHlwZSA9PT0gJ0pTWEF0dHJpYnV0ZScgJiZcbiAgICAgICAgICAgIGF0dHIubmFtZS50eXBlID09PSAnSlNYSWRlbnRpZmllcicgJiZcbiAgICAgICAgICAgIGF0dHIubmFtZS5uYW1lID09PSAnY2xhc3NOYW1lJ1xuICAgICAgICApXG5cbiAgICAgICAgaWYgKCFjbGFzc05hbWVBdHRyIHx8ICFjbGFzc05hbWVBdHRyLnZhbHVlKSByZXR1cm5cblxuICAgICAgICAvLyBFeHRyYWN0IGNsYXNzIHN0cmluZyB2YWx1ZVxuICAgICAgICBsZXQgY2xhc3NWYWx1ZTogc3RyaW5nIHwgbnVsbCA9IG51bGxcblxuICAgICAgICBpZiAoY2xhc3NOYW1lQXR0ci52YWx1ZS50eXBlID09PSAnTGl0ZXJhbCcpIHtcbiAgICAgICAgICBjbGFzc1ZhbHVlID0gU3RyaW5nKGNsYXNzTmFtZUF0dHIudmFsdWUudmFsdWUpXG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgY2xhc3NOYW1lQXR0ci52YWx1ZS50eXBlID09PSAnSlNYRXhwcmVzc2lvbkNvbnRhaW5lcicgJiZcbiAgICAgICAgICBjbGFzc05hbWVBdHRyLnZhbHVlLmV4cHJlc3Npb24udHlwZSA9PT0gJ0xpdGVyYWwnXG4gICAgICAgICkge1xuICAgICAgICAgIGNsYXNzVmFsdWUgPSBTdHJpbmcoY2xhc3NOYW1lQXR0ci52YWx1ZS5leHByZXNzaW9uLnZhbHVlKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFjbGFzc1ZhbHVlKSByZXR1cm5cblxuICAgICAgICAvLyBTcGxpdCBpbnRvIGluZGl2aWR1YWwgY2xhc3NlcyBhbmQgY2hlY2sgZWFjaFxuICAgICAgICBjb25zdCBjbGFzc2VzID0gY2xhc3NWYWx1ZS5zcGxpdCgvXFxzKy8pLmZpbHRlcihCb29sZWFuKVxuXG4gICAgICAgIGZvciAoY29uc3QgY2xzIG9mIGNsYXNzZXMpIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IFtwcm9wTmFtZSwgcGF0dGVybl0gb2YgT2JqZWN0LmVudHJpZXMocHJvcE1hcHBpbmdzKSkge1xuICAgICAgICAgICAgaWYgKHBhdHRlcm4udGVzdChjbHMpKSB7XG4gICAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgICAgICBub2RlOiBjbGFzc05hbWVBdHRyLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2VJZDogJ3ByZWZlckNvbXBvbmVudFByb3BzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IGNscyxcbiAgICAgICAgICAgICAgICAgIHByb3BOYW1lLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIGJyZWFrIC8vIE9ubHkgcmVwb3J0IG9uY2UgcGVyIGNsYXNzXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgIH1cbiAgfSxcbn0pXG4iXX0=