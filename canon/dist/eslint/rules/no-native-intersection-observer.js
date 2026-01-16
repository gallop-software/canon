const rule = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Enforce using react-intersection-observer package instead of native IntersectionObserver',
            category: 'Best Practices',
            recommended: true,
        },
        messages: {
            usePackage: '[Canon 024] Use react-intersection-observer package instead of native IntersectionObserver. Install with: npm install react-intersection-observer',
        },
        schema: [],
    },
    create(context) {
        return {
            // Detect: new IntersectionObserver(...)
            NewExpression(node) {
                if (node.callee.type === 'Identifier' &&
                    node.callee.name === 'IntersectionObserver') {
                    context.report({
                        node,
                        messageId: 'usePackage',
                    });
                }
            },
        };
    },
};
export default rule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm8tbmF0aXZlLWludGVyc2VjdGlvbi1vYnNlcnZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lc2xpbnQvcnVsZXMvbm8tbmF0aXZlLWludGVyc2VjdGlvbi1vYnNlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxNQUFNLElBQUksR0FBb0I7SUFDNUIsSUFBSSxFQUFFO1FBQ0osSUFBSSxFQUFFLFlBQVk7UUFDbEIsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUNULDBGQUEwRjtZQUM1RixRQUFRLEVBQUUsZ0JBQWdCO1lBQzFCLFdBQVcsRUFBRSxJQUFJO1NBQ2xCO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsVUFBVSxFQUNSLG1KQUFtSjtTQUN0SjtRQUNELE1BQU0sRUFBRSxFQUFFO0tBQ1g7SUFDRCxNQUFNLENBQUMsT0FBeUI7UUFDOUIsT0FBTztZQUNMLHdDQUF3QztZQUN4QyxhQUFhLENBQUMsSUFBSTtnQkFDaEIsSUFDRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxZQUFZO29CQUNqQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxzQkFBc0IsRUFDM0MsQ0FBQztvQkFDRCxPQUFPLENBQUMsTUFBTSxDQUFDO3dCQUNiLElBQUk7d0JBQ0osU0FBUyxFQUFFLFlBQVk7cUJBQ3hCLENBQUMsQ0FBQTtnQkFDSixDQUFDO1lBQ0gsQ0FBQztTQUNGLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQTtBQUVELGVBQWUsSUFBSSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUnVsZSB9IGZyb20gJ2VzbGludCdcblxuY29uc3QgcnVsZTogUnVsZS5SdWxlTW9kdWxlID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAnRW5mb3JjZSB1c2luZyByZWFjdC1pbnRlcnNlY3Rpb24tb2JzZXJ2ZXIgcGFja2FnZSBpbnN0ZWFkIG9mIG5hdGl2ZSBJbnRlcnNlY3Rpb25PYnNlcnZlcicsXG4gICAgICBjYXRlZ29yeTogJ0Jlc3QgUHJhY3RpY2VzJyxcbiAgICAgIHJlY29tbWVuZGVkOiB0cnVlLFxuICAgIH0sXG4gICAgbWVzc2FnZXM6IHtcbiAgICAgIHVzZVBhY2thZ2U6XG4gICAgICAgICdbQ2Fub24gMDI0XSBVc2UgcmVhY3QtaW50ZXJzZWN0aW9uLW9ic2VydmVyIHBhY2thZ2UgaW5zdGVhZCBvZiBuYXRpdmUgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIuIEluc3RhbGwgd2l0aDogbnBtIGluc3RhbGwgcmVhY3QtaW50ZXJzZWN0aW9uLW9ic2VydmVyJyxcbiAgICB9LFxuICAgIHNjaGVtYTogW10sXG4gIH0sXG4gIGNyZWF0ZShjb250ZXh0OiBSdWxlLlJ1bGVDb250ZXh0KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC8vIERldGVjdDogbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKC4uLilcbiAgICAgIE5ld0V4cHJlc3Npb24obm9kZSkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgbm9kZS5jYWxsZWUudHlwZSA9PT0gJ0lkZW50aWZpZXInICYmXG4gICAgICAgICAgbm9kZS5jYWxsZWUubmFtZSA9PT0gJ0ludGVyc2VjdGlvbk9ic2VydmVyJ1xuICAgICAgICApIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbWVzc2FnZUlkOiAndXNlUGFja2FnZScsXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9XG4gIH0sXG59XG5cbmV4cG9ydCBkZWZhdWx0IHJ1bGVcbiJdfQ==