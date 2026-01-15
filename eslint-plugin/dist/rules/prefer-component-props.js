"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@typescript-eslint/utils");
const canon_1 = require("../utils/canon");
const RULE_NAME = 'prefer-component-props';
const pattern = (0, canon_1.getCanonPattern)(RULE_NAME);
const createRule = utils_1.ESLintUtils.RuleCreator(() => (0, canon_1.getCanonUrl)(RULE_NAME));
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
exports.default = createRule({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZmVyLWNvbXBvbmVudC1wcm9wcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9wcmVmZXItY29tcG9uZW50LXByb3BzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQWdFO0FBQ2hFLDBDQUE2RDtBQUU3RCxNQUFNLFNBQVMsR0FBRyx3QkFBd0IsQ0FBQTtBQUMxQyxNQUFNLE9BQU8sR0FBRyxJQUFBLHVCQUFlLEVBQUMsU0FBUyxDQUFDLENBQUE7QUFFMUMsTUFBTSxVQUFVLEdBQUcsbUJBQVcsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBQSxtQkFBVyxFQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUE7QUFJeEUsa0ZBQWtGO0FBQ2xGLE1BQU0scUJBQXFCLEdBQTJDO0lBQ3BFLFNBQVMsRUFBRTtRQUNULE1BQU0sRUFBRSxZQUFZLEVBQUUsa0VBQWtFO1FBQ3hGLEtBQUssRUFBRSwwQ0FBMEM7UUFDakQsUUFBUSxFQUFFLDJEQUEyRDtRQUNyRSxVQUFVLEVBQUUsV0FBVztRQUN2QixTQUFTLEVBQUUsb0NBQW9DO1FBQy9DLFVBQVUsRUFBRSw0RUFBNEU7S0FDekY7SUFDRCxPQUFPLEVBQUU7UUFDUCxNQUFNLEVBQUUsWUFBWSxFQUFFLGtFQUFrRTtRQUN4RixLQUFLLEVBQUUsMENBQTBDO1FBQ2pELFFBQVEsRUFBRSwyREFBMkQ7UUFDckUsVUFBVSxFQUFFLFdBQVc7UUFDdkIsU0FBUyxFQUFFLG9DQUFvQztRQUMvQyxVQUFVLEVBQUUsNEVBQTRFO0tBQ3pGO0lBQ0QsTUFBTSxFQUFFO1FBQ04sTUFBTSxFQUFFLFlBQVksRUFBRSxrRUFBa0U7UUFDeEYsS0FBSyxFQUFFLDBDQUEwQztRQUNqRCxJQUFJLEVBQUUsMkRBQTJEO1FBQ2pFLFNBQVMsRUFBRSxvQ0FBb0M7S0FDaEQ7SUFDRCxNQUFNLEVBQUU7UUFDTixNQUFNLEVBQUUsWUFBWSxFQUFFLGtFQUFrRTtLQUN6RjtJQUNELEtB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LENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVTTGludFV0aWxzLCBUU0VTVHJlZSB9IGZyb20gJ0B0eXBlc2NyaXB0LWVzbGludC91dGlscydcbmltcG9ydCB7IGdldENhbm9uVXJsLCBnZXRDYW5vblBhdHRlcm4gfSBmcm9tICcuLi91dGlscy9jYW5vbidcblxuY29uc3QgUlVMRV9OQU1FID0gJ3ByZWZlci1jb21wb25lbnQtcHJvcHMnXG5jb25zdCBwYXR0ZXJuID0gZ2V0Q2Fub25QYXR0ZXJuKFJVTEVfTkFNRSlcblxuY29uc3QgY3JlYXRlUnVsZSA9IEVTTGludFV0aWxzLlJ1bGVDcmVhdG9yKCgpID0+IGdldENhbm9uVXJsKFJVTEVfTkFNRSkpXG5cbnR5cGUgTWVzc2FnZUlkcyA9ICdwcmVmZXJDb21wb25lbnRQcm9wcydcblxuLy8gTWFwIG9mIGNvbXBvbmVudCBuYW1lcyB0byB0aGVpciBzdHlsZSBwcm9wcyBhbmQgY29ycmVzcG9uZGluZyBUYWlsd2luZCBwYXR0ZXJuc1xuY29uc3QgY29tcG9uZW50UHJvcE1hcHBpbmdzOiBSZWNvcmQ8c3RyaW5nLCBSZWNvcmQ8c3RyaW5nLCBSZWdFeHA+PiA9IHtcbiAgUGFyYWdyYXBoOiB7XG4gICAgbWFyZ2luOiAvXm0oW2J5XSk/LS8sIC8vIG0tIChhbGwpLCBtYi0gKGJvdHRvbSksIG15LSAoeS1heGlzKSAtIGFsbCBhZmZlY3QgYm90dG9tIG1hcmdpblxuICAgIGNvbG9yOiAvXnRleHQtKGJvZHl8Y29udHJhc3R8YWNjZW50fHdoaXRlfGJsYWNrKS8sXG4gICAgZm9udFNpemU6IC9edGV4dC0oeHN8c218YmFzZXxsZ3x4bHwyeGx8M3hsfDR4bHw1eGx8NnhsfDd4bHw4eGx8OXhsKSQvLFxuICAgIGxpbmVIZWlnaHQ6IC9ebGVhZGluZy0vLFxuICAgIHRleHRBbGlnbjogL150ZXh0LShsZWZ0fGNlbnRlcnxyaWdodHxqdXN0aWZ5KSQvLFxuICAgIGZvbnRXZWlnaHQ6IC9eZm9udC0odGhpbnxleHRyYWxpZ2h0fGxpZ2h0fG5vcm1hbHxtZWRpdW18c2VtaWJvbGR8Ym9sZHxleHRyYWJvbGR8YmxhY2spJC8sXG4gIH0sXG4gIEhlYWRpbmc6IHtcbiAgICBtYXJnaW46IC9ebShbYnldKT8tLywgLy8gbS0gKGFsbCksIG1iLSAoYm90dG9tKSwgbXktICh5LWF4aXMpIC0gYWxsIGFmZmVjdCBib3R0b20gbWFyZ2luXG4gICAgY29sb3I6IC9edGV4dC0oYm9keXxjb250cmFzdHxhY2NlbnR8d2hpdGV8YmxhY2spLyxcbiAgICBmb250U2l6ZTogL150ZXh0LSh4c3xzbXxiYXNlfGxnfHhsfDJ4bHwzeGx8NHhsfDV4bHw2eGx8N3hsfDh4bHw5eGwpJC8sXG4gICAgbGluZUhlaWdodDogL15sZWFkaW5nLS8sXG4gICAgdGV4dEFsaWduOiAvXnRleHQtKGxlZnR8Y2VudGVyfHJpZ2h0fGp1c3RpZnkpJC8sXG4gICAgZm9udFdlaWdodDogL15mb250LSh0aGlufGV4dHJhbGlnaHR8bGlnaHR8bm9ybWFsfG1lZGl1bXxzZW1pYm9sZHxib2xkfGV4dHJhYm9sZHxibGFjaykkLyxcbiAgfSxcbiAgQWNjZW50OiB7XG4gICAgbWFyZ2luOiAvXm0oW2J5XSk/LS8sIC8vIG0tIChhbGwpLCBtYi0gKGJvdHRvbSksIG15LSAoeS1heGlzKSAtIGFsbCBhZmZlY3QgYm90dG9tIG1hcmdpblxuICAgIGNvbG9yOiAvXnRleHQtKGJvZHl8Y29udHJhc3R8YWNjZW50fHdoaXRlfGJsYWNrKS8sXG4gICAgc2l6ZTogL150ZXh0LSh4c3xzbXxiYXNlfGxnfHhsfDJ4bHwzeGx8NHhsfDV4bHw2eGx8N3hsfDh4bHw5eGwpJC8sXG4gICAgdGV4dEFsaWduOiAvXnRleHQtKGxlZnR8Y2VudGVyfHJpZ2h0fGp1c3RpZnkpJC8sXG4gIH0sXG4gIEJ1dHRvbjoge1xuICAgIG1hcmdpbjogL15tKFtieV0pPy0vLCAvLyBtLSAoYWxsKSwgbWItIChib3R0b20pLCBteS0gKHktYXhpcykgLSBhbGwgYWZmZWN0IGJvdHRvbSBtYXJnaW5cbiAgfSxcbiAgTGFiZWw6IHtcbiAgICBtYXJnaW46IC9ebShbYnldKT8tLywgLy8gbS0gKGFsbCksIG1iLSAoYm90dG9tKSwgbXktICh5LWF4aXMpIC0gYWxsIGFmZmVjdCBib3R0b20gbWFyZ2luXG4gICAgY29sb3I6IC9edGV4dC0oYm9keXxjb250cmFzdHxhY2NlbnR8d2hpdGV8YmxhY2spLyxcbiAgfSxcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlUnVsZTxbXSwgTWVzc2FnZUlkcz4oe1xuICBuYW1lOiBSVUxFX05BTUUsXG4gIG1ldGE6IHtcbiAgICB0eXBlOiAnc3VnZ2VzdGlvbicsXG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246IHBhdHRlcm4/LnN1bW1hcnkgfHwgJ1VzZSBwcm9wcyBvdmVyIGNsYXNzTmFtZSBmb3Igc3VwcG9ydGVkIHN0eWxlcycsXG4gICAgfSxcbiAgICBtZXNzYWdlczoge1xuICAgICAgcHJlZmVyQ29tcG9uZW50UHJvcHM6IGBbQ2Fub24gJHtwYXR0ZXJuPy5pZCB8fCAnMDA0J31dIFwie3tjbGFzc05hbWV9fVwiIGluIGNsYXNzTmFtZSBzaG91bGQgdXNlIHRoZSBcInt7cHJvcE5hbWV9fVwiIHByb3AgaW5zdGVhZC4gUmVwbGFjZSBjbGFzc05hbWU9XCJ7e2NsYXNzTmFtZX19XCIgd2l0aCB7e3Byb3BOYW1lfX09XCJ7e2NsYXNzTmFtZX19XCIuYCxcbiAgICB9LFxuICAgIHNjaGVtYTogW10sXG4gIH0sXG4gIGRlZmF1bHRPcHRpb25zOiBbXSxcbiAgY3JlYXRlKGNvbnRleHQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgSlNYT3BlbmluZ0VsZW1lbnQobm9kZSkge1xuICAgICAgICAvLyBHZXQgdGhlIGNvbXBvbmVudCBuYW1lXG4gICAgICAgIGlmIChub2RlLm5hbWUudHlwZSAhPT0gJ0pTWElkZW50aWZpZXInKSByZXR1cm5cbiAgICAgICAgY29uc3QgY29tcG9uZW50TmFtZSA9IG5vZGUubmFtZS5uYW1lXG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhpcyBjb21wb25lbnQgaGFzIHByb3AgbWFwcGluZ3NcbiAgICAgICAgY29uc3QgcHJvcE1hcHBpbmdzID0gY29tcG9uZW50UHJvcE1hcHBpbmdzW2NvbXBvbmVudE5hbWVdXG4gICAgICAgIGlmICghcHJvcE1hcHBpbmdzKSByZXR1cm5cblxuICAgICAgICAvLyBGaW5kIHRoZSBjbGFzc05hbWUgYXR0cmlidXRlXG4gICAgICAgIGNvbnN0IGNsYXNzTmFtZUF0dHIgPSBub2RlLmF0dHJpYnV0ZXMuZmluZChcbiAgICAgICAgICAoYXR0cik6IGF0dHIgaXMgVFNFU1RyZWUuSlNYQXR0cmlidXRlID0+XG4gICAgICAgICAgICBhdHRyLnR5cGUgPT09ICdKU1hBdHRyaWJ1dGUnICYmXG4gICAgICAgICAgICBhdHRyLm5hbWUudHlwZSA9PT0gJ0pTWElkZW50aWZpZXInICYmXG4gICAgICAgICAgICBhdHRyLm5hbWUubmFtZSA9PT0gJ2NsYXNzTmFtZSdcbiAgICAgICAgKVxuXG4gICAgICAgIGlmICghY2xhc3NOYW1lQXR0ciB8fCAhY2xhc3NOYW1lQXR0ci52YWx1ZSkgcmV0dXJuXG5cbiAgICAgICAgLy8gRXh0cmFjdCBjbGFzcyBzdHJpbmcgdmFsdWVcbiAgICAgICAgbGV0IGNsYXNzVmFsdWU6IHN0cmluZyB8IG51bGwgPSBudWxsXG5cbiAgICAgICAgaWYgKGNsYXNzTmFtZUF0dHIudmFsdWUudHlwZSA9PT0gJ0xpdGVyYWwnKSB7XG4gICAgICAgICAgY2xhc3NWYWx1ZSA9IFN0cmluZyhjbGFzc05hbWVBdHRyLnZhbHVlLnZhbHVlKVxuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgIGNsYXNzTmFtZUF0dHIudmFsdWUudHlwZSA9PT0gJ0pTWEV4cHJlc3Npb25Db250YWluZXInICYmXG4gICAgICAgICAgY2xhc3NOYW1lQXR0ci52YWx1ZS5leHByZXNzaW9uLnR5cGUgPT09ICdMaXRlcmFsJ1xuICAgICAgICApIHtcbiAgICAgICAgICBjbGFzc1ZhbHVlID0gU3RyaW5nKGNsYXNzTmFtZUF0dHIudmFsdWUuZXhwcmVzc2lvbi52YWx1ZSlcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghY2xhc3NWYWx1ZSkgcmV0dXJuXG5cbiAgICAgICAgLy8gU3BsaXQgaW50byBpbmRpdmlkdWFsIGNsYXNzZXMgYW5kIGNoZWNrIGVhY2hcbiAgICAgICAgY29uc3QgY2xhc3NlcyA9IGNsYXNzVmFsdWUuc3BsaXQoL1xccysvKS5maWx0ZXIoQm9vbGVhbilcblxuICAgICAgICBmb3IgKGNvbnN0IGNscyBvZiBjbGFzc2VzKSB7XG4gICAgICAgICAgZm9yIChjb25zdCBbcHJvcE5hbWUsIHBhdHRlcm5dIG9mIE9iamVjdC5lbnRyaWVzKHByb3BNYXBwaW5ncykpIHtcbiAgICAgICAgICAgIGlmIChwYXR0ZXJuLnRlc3QoY2xzKSkge1xuICAgICAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICAgICAgbm9kZTogY2xhc3NOYW1lQXR0cixcbiAgICAgICAgICAgICAgICBtZXNzYWdlSWQ6ICdwcmVmZXJDb21wb25lbnRQcm9wcycsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBjbHMsXG4gICAgICAgICAgICAgICAgICBwcm9wTmFtZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICBicmVhayAvLyBPbmx5IHJlcG9ydCBvbmNlIHBlciBjbGFzc1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9XG4gIH0sXG59KVxuIl19