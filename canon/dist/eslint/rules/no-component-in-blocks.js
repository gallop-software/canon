const rule = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Prevent defining component functions inside block files - components should be in the components folder',
            category: 'Best Practices',
            recommended: true,
        },
        messages: {
            noComponentInBlocks: '[Canon 025] Component functions should not be defined in block files. Move this component to src/components/ and import it.',
        },
        schema: [],
    },
    create(context) {
        const filename = context.filename || context.getFilename();
        // Only check block files
        const isBlock = filename.includes('/blocks/') || filename.includes('\\blocks\\');
        if (!isBlock) {
            return {};
        }
        // Track the default export name to allow it
        let defaultExportName = null;
        return {
            // Track the default export
            ExportDefaultDeclaration(node) {
                if (node.declaration.type === 'FunctionDeclaration' && node.declaration.id) {
                    defaultExportName = node.declaration.id.name;
                }
                else if (node.declaration.type === 'Identifier') {
                    defaultExportName = node.declaration.name;
                }
            },
            // Check for function declarations that look like components (PascalCase)
            FunctionDeclaration(node) {
                if (!node.id)
                    return;
                const name = node.id.name;
                // Skip the default export (the block itself)
                if (name === defaultExportName)
                    return;
                // Check if it's PascalCase (likely a component)
                if (/^[A-Z]/.test(name)) {
                    context.report({
                        node,
                        messageId: 'noComponentInBlocks',
                    });
                }
            },
            // Check for arrow function components: const MyComponent = () => {}
            VariableDeclaration(node) {
                for (const declarator of node.declarations) {
                    if (declarator.id.type === 'Identifier' &&
                        declarator.init &&
                        (declarator.init.type === 'ArrowFunctionExpression' ||
                            declarator.init.type === 'FunctionExpression')) {
                        const name = declarator.id.name;
                        // Skip the default export
                        if (name === defaultExportName)
                            return;
                        // Check if it's PascalCase (likely a component)
                        if (/^[A-Z]/.test(name)) {
                            context.report({
                                node: declarator,
                                messageId: 'noComponentInBlocks',
                            });
                        }
                    }
                }
            },
        };
    },
};
export default rule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm8tY29tcG9uZW50LWluLWJsb2Nrcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lc2xpbnQvcnVsZXMvbm8tY29tcG9uZW50LWluLWJsb2Nrcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxNQUFNLElBQUksR0FBb0I7SUFDNUIsSUFBSSxFQUFFO1FBQ0osSUFBSSxFQUFFLFlBQVk7UUFDbEIsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUNULHlHQUF5RztZQUMzRyxRQUFRLEVBQUUsZ0JBQWdCO1lBQzFCLFdBQVcsRUFBRSxJQUFJO1NBQ2xCO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsbUJBQW1CLEVBQ2pCLDZIQUE2SDtTQUNoSTtRQUNELE1BQU0sRUFBRSxFQUFFO0tBQ1g7SUFDRCxNQUFNLENBQUMsT0FBeUI7UUFDOUIsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUE7UUFFMUQseUJBQXlCO1FBQ3pCLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQTtRQUNoRixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDYixPQUFPLEVBQUUsQ0FBQTtRQUNYLENBQUM7UUFFRCw0Q0FBNEM7UUFDNUMsSUFBSSxpQkFBaUIsR0FBa0IsSUFBSSxDQUFBO1FBRTNDLE9BQU87WUFDTCwyQkFBMkI7WUFDM0Isd0JBQXdCLENBQUMsSUFBSTtnQkFDM0IsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksS0FBSyxxQkFBcUIsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUMzRSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUE7Z0JBQzlDLENBQUM7cUJBQU0sSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksS0FBSyxZQUFZLEVBQUUsQ0FBQztvQkFDbEQsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUE7Z0JBQzNDLENBQUM7WUFDSCxDQUFDO1lBRUQseUVBQXlFO1lBQ3pFLG1CQUFtQixDQUFDLElBQUk7Z0JBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFBRSxPQUFNO2dCQUVwQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQTtnQkFFekIsNkNBQTZDO2dCQUM3QyxJQUFJLElBQUksS0FBSyxpQkFBaUI7b0JBQUUsT0FBTTtnQkFFdEMsZ0RBQWdEO2dCQUNoRCxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztvQkFDeEIsT0FBTyxDQUFDLE1BQU0sQ0FBQzt3QkFDYixJQUFJO3dCQUNKLFNBQVMsRUFBRSxxQkFBcUI7cUJBQ2pDLENBQUMsQ0FBQTtnQkFDSixDQUFDO1lBQ0gsQ0FBQztZQUVELG9FQUFvRTtZQUNwRSxtQkFBbUIsQ0FBQyxJQUFJO2dCQUN0QixLQUFLLE1BQU0sVUFBVSxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztvQkFDM0MsSUFDRSxVQUFVLENBQUMsRUFBRSxDQUFDLElBQUksS0FBSyxZQUFZO3dCQUNuQyxVQUFVLENBQUMsSUFBSTt3QkFDZixDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLHlCQUF5Qjs0QkFDakQsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssb0JBQW9CLENBQUMsRUFDaEQsQ0FBQzt3QkFDRCxNQUFNLElBQUksR0FBRyxVQUFVLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQTt3QkFFL0IsMEJBQTBCO3dCQUMxQixJQUFJLElBQUksS0FBSyxpQkFBaUI7NEJBQUUsT0FBTTt3QkFFdEMsZ0RBQWdEO3dCQUNoRCxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQzs0QkFDeEIsT0FBTyxDQUFDLE1BQU0sQ0FBQztnQ0FDYixJQUFJLEVBQUUsVUFBVTtnQ0FDaEIsU0FBUyxFQUFFLHFCQUFxQjs2QkFDakMsQ0FBQyxDQUFBO3dCQUNKLENBQUM7b0JBQ0gsQ0FBQztnQkFDSCxDQUFDO1lBQ0gsQ0FBQztTQUNGLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQTtBQUVELGVBQWUsSUFBSSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUnVsZSB9IGZyb20gJ2VzbGludCdcblxuY29uc3QgcnVsZTogUnVsZS5SdWxlTW9kdWxlID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAnUHJldmVudCBkZWZpbmluZyBjb21wb25lbnQgZnVuY3Rpb25zIGluc2lkZSBibG9jayBmaWxlcyAtIGNvbXBvbmVudHMgc2hvdWxkIGJlIGluIHRoZSBjb21wb25lbnRzIGZvbGRlcicsXG4gICAgICBjYXRlZ29yeTogJ0Jlc3QgUHJhY3RpY2VzJyxcbiAgICAgIHJlY29tbWVuZGVkOiB0cnVlLFxuICAgIH0sXG4gICAgbWVzc2FnZXM6IHtcbiAgICAgIG5vQ29tcG9uZW50SW5CbG9ja3M6XG4gICAgICAgICdbQ2Fub24gMDI1XSBDb21wb25lbnQgZnVuY3Rpb25zIHNob3VsZCBub3QgYmUgZGVmaW5lZCBpbiBibG9jayBmaWxlcy4gTW92ZSB0aGlzIGNvbXBvbmVudCB0byBzcmMvY29tcG9uZW50cy8gYW5kIGltcG9ydCBpdC4nLFxuICAgIH0sXG4gICAgc2NoZW1hOiBbXSxcbiAgfSxcbiAgY3JlYXRlKGNvbnRleHQ6IFJ1bGUuUnVsZUNvbnRleHQpIHtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGNvbnRleHQuZmlsZW5hbWUgfHwgY29udGV4dC5nZXRGaWxlbmFtZSgpXG5cbiAgICAvLyBPbmx5IGNoZWNrIGJsb2NrIGZpbGVzXG4gICAgY29uc3QgaXNCbG9jayA9IGZpbGVuYW1lLmluY2x1ZGVzKCcvYmxvY2tzLycpIHx8IGZpbGVuYW1lLmluY2x1ZGVzKCdcXFxcYmxvY2tzXFxcXCcpXG4gICAgaWYgKCFpc0Jsb2NrKSB7XG4gICAgICByZXR1cm4ge31cbiAgICB9XG5cbiAgICAvLyBUcmFjayB0aGUgZGVmYXVsdCBleHBvcnQgbmFtZSB0byBhbGxvdyBpdFxuICAgIGxldCBkZWZhdWx0RXhwb3J0TmFtZTogc3RyaW5nIHwgbnVsbCA9IG51bGxcblxuICAgIHJldHVybiB7XG4gICAgICAvLyBUcmFjayB0aGUgZGVmYXVsdCBleHBvcnRcbiAgICAgIEV4cG9ydERlZmF1bHREZWNsYXJhdGlvbihub2RlKSB7XG4gICAgICAgIGlmIChub2RlLmRlY2xhcmF0aW9uLnR5cGUgPT09ICdGdW5jdGlvbkRlY2xhcmF0aW9uJyAmJiBub2RlLmRlY2xhcmF0aW9uLmlkKSB7XG4gICAgICAgICAgZGVmYXVsdEV4cG9ydE5hbWUgPSBub2RlLmRlY2xhcmF0aW9uLmlkLm5hbWVcbiAgICAgICAgfSBlbHNlIGlmIChub2RlLmRlY2xhcmF0aW9uLnR5cGUgPT09ICdJZGVudGlmaWVyJykge1xuICAgICAgICAgIGRlZmF1bHRFeHBvcnROYW1lID0gbm9kZS5kZWNsYXJhdGlvbi5uYW1lXG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8vIENoZWNrIGZvciBmdW5jdGlvbiBkZWNsYXJhdGlvbnMgdGhhdCBsb29rIGxpa2UgY29tcG9uZW50cyAoUGFzY2FsQ2FzZSlcbiAgICAgIEZ1bmN0aW9uRGVjbGFyYXRpb24obm9kZSkge1xuICAgICAgICBpZiAoIW5vZGUuaWQpIHJldHVyblxuXG4gICAgICAgIGNvbnN0IG5hbWUgPSBub2RlLmlkLm5hbWVcblxuICAgICAgICAvLyBTa2lwIHRoZSBkZWZhdWx0IGV4cG9ydCAodGhlIGJsb2NrIGl0c2VsZilcbiAgICAgICAgaWYgKG5hbWUgPT09IGRlZmF1bHRFeHBvcnROYW1lKSByZXR1cm5cblxuICAgICAgICAvLyBDaGVjayBpZiBpdCdzIFBhc2NhbENhc2UgKGxpa2VseSBhIGNvbXBvbmVudClcbiAgICAgICAgaWYgKC9eW0EtWl0vLnRlc3QobmFtZSkpIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbWVzc2FnZUlkOiAnbm9Db21wb25lbnRJbkJsb2NrcycsXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLy8gQ2hlY2sgZm9yIGFycm93IGZ1bmN0aW9uIGNvbXBvbmVudHM6IGNvbnN0IE15Q29tcG9uZW50ID0gKCkgPT4ge31cbiAgICAgIFZhcmlhYmxlRGVjbGFyYXRpb24obm9kZSkge1xuICAgICAgICBmb3IgKGNvbnN0IGRlY2xhcmF0b3Igb2Ygbm9kZS5kZWNsYXJhdGlvbnMpIHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBkZWNsYXJhdG9yLmlkLnR5cGUgPT09ICdJZGVudGlmaWVyJyAmJlxuICAgICAgICAgICAgZGVjbGFyYXRvci5pbml0ICYmXG4gICAgICAgICAgICAoZGVjbGFyYXRvci5pbml0LnR5cGUgPT09ICdBcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbicgfHxcbiAgICAgICAgICAgICAgZGVjbGFyYXRvci5pbml0LnR5cGUgPT09ICdGdW5jdGlvbkV4cHJlc3Npb24nKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgY29uc3QgbmFtZSA9IGRlY2xhcmF0b3IuaWQubmFtZVxuXG4gICAgICAgICAgICAvLyBTa2lwIHRoZSBkZWZhdWx0IGV4cG9ydFxuICAgICAgICAgICAgaWYgKG5hbWUgPT09IGRlZmF1bHRFeHBvcnROYW1lKSByZXR1cm5cblxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgaXQncyBQYXNjYWxDYXNlIChsaWtlbHkgYSBjb21wb25lbnQpXG4gICAgICAgICAgICBpZiAoL15bQS1aXS8udGVzdChuYW1lKSkge1xuICAgICAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICAgICAgbm9kZTogZGVjbGFyYXRvcixcbiAgICAgICAgICAgICAgICBtZXNzYWdlSWQ6ICdub0NvbXBvbmVudEluQmxvY2tzJyxcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfVxuICB9LFxufVxuXG5leHBvcnQgZGVmYXVsdCBydWxlXG4iXX0=