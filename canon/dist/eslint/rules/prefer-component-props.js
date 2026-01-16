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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZmVyLWNvbXBvbmVudC1wcm9wcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lc2xpbnQvcnVsZXMvcHJlZmVyLWNvbXBvbmVudC1wcm9wcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsV0FBVyxFQUFZLE1BQU0sMEJBQTBCLENBQUE7QUFDaEUsT0FBTyxFQUFFLFdBQVcsRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQTtBQUVoRSxNQUFNLFNBQVMsR0FBRyx3QkFBd0IsQ0FBQTtBQUMxQyxNQUFNLE9BQU8sR0FBRyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUE7QUFFMUMsTUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQTtBQUl4RSxrRkFBa0Y7QUFDbEYsTUFBTSxxQkFBcUIsR0FBMkM7SUFDcEUsU0FBUyxFQUFFO1FBQ1QsTUFBTSxFQUFFLFlBQVksRUFBRSxrRUFBa0U7UUFDeEYsS0FBSyxFQUFFLDBDQUEwQztRQUNqRCxRQUFRLEVBQUUsMkRBQTJEO1FBQ3JFLFVBQVUsRUFBRSxXQUFXO1FBQ3ZCLFNBQVMsRUFBRSxvQ0FBb0M7UUFDL0MsVUFBVSxFQUFFLDRFQUE0RTtLQUN6RjtJQUNELE9BQU8sRUFBRTtRQUNQLE1BQU0sRUFBRSxZQUFZLEVBQUUsa0VBQWtFO1FBQ3hGLEtBQUssRUFBRSwwQ0FBMEM7UUFDakQsUUFBUSxFQUFFLDJEQUEyRDtRQUNyRSxVQUFVLEVBQUUsV0FBVztRQUN2QixTQUFTLEVBQUUsb0NBQW9DO1FBQy9DLFVBQVUsRUFBRSw0RUFBNEU7S0FDekY7SUFDRCxNQUFNLEVBQUU7UUFDTixNQUFNLEVBQUUsWUFBWSxFQUFFLGtFQUFrRTtRQUN4RixLQUFLLEVBQUUsMENBQTBDO1FBQ2pELElBQUksRUFBRSwyREFBMkQ7UUFDakUsU0FBUyxFQUFFLG9DQUFvQztL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QztnQ0FDYixJQUFJLEVBQUUsYUFBYTtnQ0FDbkIsU0FBUyxFQUFFLHNCQUFzQjtnQ0FDakMsSUFBSSxFQUFFO29DQUNKLFNBQVMsRUFBRSxHQUFHO29DQUNkLFFBQVE7aUNBQ1Q7NkJBQ0YsQ0FBQyxDQUFBOzRCQUNGLE1BQUssQ0FBQyw2QkFBNkI7d0JBQ3JDLENBQUM7b0JBQ0gsQ0FBQztnQkFDSCxDQUFDO1lBQ0gsQ0FBQztTQUNGLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRVNMaW50VXRpbHMsIFRTRVNUcmVlIH0gZnJvbSAnQHR5cGVzY3JpcHQtZXNsaW50L3V0aWxzJ1xuaW1wb3J0IHsgZ2V0Q2Fub25VcmwsIGdldENhbm9uUGF0dGVybiB9IGZyb20gJy4uL3V0aWxzL2Nhbm9uLmpzJ1xuXG5jb25zdCBSVUxFX05BTUUgPSAncHJlZmVyLWNvbXBvbmVudC1wcm9wcydcbmNvbnN0IHBhdHRlcm4gPSBnZXRDYW5vblBhdHRlcm4oUlVMRV9OQU1FKVxuXG5jb25zdCBjcmVhdGVSdWxlID0gRVNMaW50VXRpbHMuUnVsZUNyZWF0b3IoKCkgPT4gZ2V0Q2Fub25VcmwoUlVMRV9OQU1FKSlcblxudHlwZSBNZXNzYWdlSWRzID0gJ3ByZWZlckNvbXBvbmVudFByb3BzJ1xuXG4vLyBNYXAgb2YgY29tcG9uZW50IG5hbWVzIHRvIHRoZWlyIHN0eWxlIHByb3BzIGFuZCBjb3JyZXNwb25kaW5nIFRhaWx3aW5kIHBhdHRlcm5zXG5jb25zdCBjb21wb25lbnRQcm9wTWFwcGluZ3M6IFJlY29yZDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIFJlZ0V4cD4+ID0ge1xuICBQYXJhZ3JhcGg6IHtcbiAgICBtYXJnaW46IC9ebShbYnldKT8tLywgLy8gbS0gKGFsbCksIG1iLSAoYm90dG9tKSwgbXktICh5LWF4aXMpIC0gYWxsIGFmZmVjdCBib3R0b20gbWFyZ2luXG4gICAgY29sb3I6IC9edGV4dC0oYm9keXxjb250cmFzdHxhY2NlbnR8d2hpdGV8YmxhY2spLyxcbiAgICBmb250U2l6ZTogL150ZXh0LSh4c3xzbXxiYXNlfGxnfHhsfDJ4bHwzeGx8NHhsfDV4bHw2eGx8N3hsfDh4bHw5eGwpJC8sXG4gICAgbGluZUhlaWdodDogL15sZWFkaW5nLS8sXG4gICAgdGV4dEFsaWduOiAvXnRleHQtKGxlZnR8Y2VudGVyfHJpZ2h0fGp1c3RpZnkpJC8sXG4gICAgZm9udFdlaWdodDogL15mb250LSh0aGlufGV4dHJhbGlnaHR8bGlnaHR8bm9ybWFsfG1lZGl1bXxzZW1pYm9sZHxib2xkfGV4dHJhYm9sZHxibGFjaykkLyxcbiAgfSxcbiAgSGVhZGluZzoge1xuICAgIG1hcmdpbjogL15tKFtieV0pPy0vLCAvLyBtLSAoYWxsKSwgbWItIChib3R0b20pLCBteS0gKHktYXhpcykgLSBhbGwgYWZmZWN0IGJvdHRvbSBtYXJnaW5cbiAgICBjb2xvcjogL150ZXh0LShib2R5fGNvbnRyYXN0fGFjY2VudHx3aGl0ZXxibGFjaykvLFxuICAgIGZvbnRTaXplOiAvXnRleHQtKHhzfHNtfGJhc2V8bGd8eGx8MnhsfDN4bHw0eGx8NXhsfDZ4bHw3eGx8OHhsfDl4bCkkLyxcbiAgICBsaW5lSGVpZ2h0OiAvXmxlYWRpbmctLyxcbiAgICB0ZXh0QWxpZ246IC9edGV4dC0obGVmdHxjZW50ZXJ8cmlnaHR8anVzdGlmeSkkLyxcbiAgICBmb250V2VpZ2h0OiAvXmZvbnQtKHRoaW58ZXh0cmFsaWdodHxsaWdodHxub3JtYWx8bWVkaXVtfHNlbWlib2xkfGJvbGR8ZXh0cmFib2xkfGJsYWNrKSQvLFxuICB9LFxuICBBY2NlbnQ6IHtcbiAgICBtYXJnaW46IC9ebShbYnldKT8tLywgLy8gbS0gKGFsbCksIG1iLSAoYm90dG9tKSwgbXktICh5LWF4aXMpIC0gYWxsIGFmZmVjdCBib3R0b20gbWFyZ2luXG4gICAgY29sb3I6IC9edGV4dC0oYm9keXxjb250cmFzdHxhY2NlbnR8d2hpdGV8YmxhY2spLyxcbiAgICBzaXplOiAvXnRleHQtKHhzfHNtfGJhc2V8bGd8eGx8MnhsfDN4bHw0eGx8NXhsfDZ4bHw3eGx8OHhsfDl4bCkkLyxcbiAgICB0ZXh0QWxpZ246IC9edGV4dC0obGVmdHxjZW50ZXJ8cmlnaHR8anVzdGlmeSkkLyxcbiAgfSxcbiAgQnV0dG9uOiB7XG4gICAgbWFyZ2luOiAvXm0oW2J5XSk/LS8sIC8vIG0tIChhbGwpLCBtYi0gKGJvdHRvbSksIG15LSAoeS1heGlzKSAtIGFsbCBhZmZlY3QgYm90dG9tIG1hcmdpblxuICB9LFxuICBMYWJlbDoge1xuICAgIG1hcmdpbjogL15tKFtieV0pPy0vLCAvLyBtLSAoYWxsKSwgbWItIChib3R0b20pLCBteS0gKHktYXhpcykgLSBhbGwgYWZmZWN0IGJvdHRvbSBtYXJnaW5cbiAgICBjb2xvcjogL150ZXh0LShib2R5fGNvbnRyYXN0fGFjY2VudHx3aGl0ZXxibGFjaykvLFxuICB9LFxuICBRdW90ZToge1xuICAgIG1hcmdpbjogL15tKFtieV0pPy0vLCAvLyBtLSAoYWxsKSwgbWItIChib3R0b20pLCBteS0gKHktYXhpcykgLSBhbGwgYWZmZWN0IGJvdHRvbSBtYXJnaW5cbiAgICBjb2xvcjogL150ZXh0LShib2R5fGNvbnRyYXN0fGFjY2VudHx3aGl0ZXxibGFjaykvLFxuICAgIGZvbnRTaXplOiAvXnRleHQtKHhzfHNtfGJhc2V8bGd8eGx8MnhsfDN4bHw0eGx8NXhsfDZ4bHw3eGx8OHhsfDl4bCkkLyxcbiAgICBmb250V2VpZ2h0OiAvXmZvbnQtKHRoaW58ZXh0cmFsaWdodHxsaWdodHxub3JtYWx8bWVkaXVtfHNlbWlib2xkfGJvbGR8ZXh0cmFib2xkfGJsYWNrKSQvLFxuICAgIHRleHRBbGlnbjogL150ZXh0LShsZWZ0fGNlbnRlcnxyaWdodHxqdXN0aWZ5KSQvLFxuICB9LFxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVSdWxlPFtdLCBNZXNzYWdlSWRzPih7XG4gIG5hbWU6IFJVTEVfTkFNRSxcbiAgbWV0YToge1xuICAgIHR5cGU6ICdzdWdnZXN0aW9uJyxcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjogcGF0dGVybj8uc3VtbWFyeSB8fCAnVXNlIHByb3BzIG92ZXIgY2xhc3NOYW1lIGZvciBzdXBwb3J0ZWQgc3R5bGVzJyxcbiAgICB9LFxuICAgIG1lc3NhZ2VzOiB7XG4gICAgICBwcmVmZXJDb21wb25lbnRQcm9wczogYFtDYW5vbiAke3BhdHRlcm4/LmlkIHx8ICcwMDQnfV0gXCJ7e2NsYXNzTmFtZX19XCIgaW4gY2xhc3NOYW1lIHNob3VsZCB1c2UgdGhlIFwie3twcm9wTmFtZX19XCIgcHJvcCBpbnN0ZWFkLiBSZXBsYWNlIGNsYXNzTmFtZT1cInt7Y2xhc3NOYW1lfX1cIiB3aXRoIHt7cHJvcE5hbWV9fT1cInt7Y2xhc3NOYW1lfX1cIi5gLFxuICAgIH0sXG4gICAgc2NoZW1hOiBbXSxcbiAgfSxcbiAgZGVmYXVsdE9wdGlvbnM6IFtdLFxuICBjcmVhdGUoY29udGV4dCkge1xuICAgIHJldHVybiB7XG4gICAgICBKU1hPcGVuaW5nRWxlbWVudChub2RlKSB7XG4gICAgICAgIC8vIEdldCB0aGUgY29tcG9uZW50IG5hbWVcbiAgICAgICAgaWYgKG5vZGUubmFtZS50eXBlICE9PSAnSlNYSWRlbnRpZmllcicpIHJldHVyblxuICAgICAgICBjb25zdCBjb21wb25lbnROYW1lID0gbm9kZS5uYW1lLm5hbWVcblxuICAgICAgICAvLyBDaGVjayBpZiB0aGlzIGNvbXBvbmVudCBoYXMgcHJvcCBtYXBwaW5nc1xuICAgICAgICBjb25zdCBwcm9wTWFwcGluZ3MgPSBjb21wb25lbnRQcm9wTWFwcGluZ3NbY29tcG9uZW50TmFtZV1cbiAgICAgICAgaWYgKCFwcm9wTWFwcGluZ3MpIHJldHVyblxuXG4gICAgICAgIC8vIEZpbmQgdGhlIGNsYXNzTmFtZSBhdHRyaWJ1dGVcbiAgICAgICAgY29uc3QgY2xhc3NOYW1lQXR0ciA9IG5vZGUuYXR0cmlidXRlcy5maW5kKFxuICAgICAgICAgIChhdHRyKTogYXR0ciBpcyBUU0VTVHJlZS5KU1hBdHRyaWJ1dGUgPT5cbiAgICAgICAgICAgIGF0dHIudHlwZSA9PT0gJ0pTWEF0dHJpYnV0ZScgJiZcbiAgICAgICAgICAgIGF0dHIubmFtZS50eXBlID09PSAnSlNYSWRlbnRpZmllcicgJiZcbiAgICAgICAgICAgIGF0dHIubmFtZS5uYW1lID09PSAnY2xhc3NOYW1lJ1xuICAgICAgICApXG5cbiAgICAgICAgaWYgKCFjbGFzc05hbWVBdHRyIHx8ICFjbGFzc05hbWVBdHRyLnZhbHVlKSByZXR1cm5cblxuICAgICAgICAvLyBFeHRyYWN0IGNsYXNzIHN0cmluZyB2YWx1ZVxuICAgICAgICBsZXQgY2xhc3NWYWx1ZTogc3RyaW5nIHwgbnVsbCA9IG51bGxcblxuICAgICAgICBpZiAoY2xhc3NOYW1lQXR0ci52YWx1ZS50eXBlID09PSAnTGl0ZXJhbCcpIHtcbiAgICAgICAgICBjbGFzc1ZhbHVlID0gU3RyaW5nKGNsYXNzTmFtZUF0dHIudmFsdWUudmFsdWUpXG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgY2xhc3NOYW1lQXR0ci52YWx1ZS50eXBlID09PSAnSlNYRXhwcmVzc2lvbkNvbnRhaW5lcicgJiZcbiAgICAgICAgICBjbGFzc05hbWVBdHRyLnZhbHVlLmV4cHJlc3Npb24udHlwZSA9PT0gJ0xpdGVyYWwnXG4gICAgICAgICkge1xuICAgICAgICAgIGNsYXNzVmFsdWUgPSBTdHJpbmcoY2xhc3NOYW1lQXR0ci52YWx1ZS5leHByZXNzaW9uLnZhbHVlKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFjbGFzc1ZhbHVlKSByZXR1cm5cblxuICAgICAgICAvLyBTcGxpdCBpbnRvIGluZGl2aWR1YWwgY2xhc3NlcyBhbmQgY2hlY2sgZWFjaFxuICAgICAgICBjb25zdCBjbGFzc2VzID0gY2xhc3NWYWx1ZS5zcGxpdCgvXFxzKy8pLmZpbHRlcihCb29sZWFuKVxuXG4gICAgICAgIGZvciAoY29uc3QgY2xzIG9mIGNsYXNzZXMpIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IFtwcm9wTmFtZSwgcGF0dGVybl0gb2YgT2JqZWN0LmVudHJpZXMocHJvcE1hcHBpbmdzKSkge1xuICAgICAgICAgICAgaWYgKHBhdHRlcm4udGVzdChjbHMpKSB7XG4gICAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgICAgICBub2RlOiBjbGFzc05hbWVBdHRyLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2VJZDogJ3ByZWZlckNvbXBvbmVudFByb3BzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IGNscyxcbiAgICAgICAgICAgICAgICAgIHByb3BOYW1lLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIGJyZWFrIC8vIE9ubHkgcmVwb3J0IG9uY2UgcGVyIGNsYXNzXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgIH1cbiAgfSxcbn0pXG4iXX0=