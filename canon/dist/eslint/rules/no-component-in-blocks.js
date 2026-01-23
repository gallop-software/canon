const rule = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Prevent exporting component functions from block files - reusable components should be in the components folder',
            category: 'Best Practices',
            recommended: true,
        },
        messages: {
            noComponentInBlocks: '[Canon 025] Exported component functions should not be defined in block files. Move this component to src/components/ and import it. Non-exported content components are allowed.',
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
        // Track named exports
        const namedExports = new Set();
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
            // Track named exports: export function Foo() {} or export const Foo = () => {}
            ExportNamedDeclaration(node) {
                if (node.declaration) {
                    if (node.declaration.type === 'FunctionDeclaration' && node.declaration.id) {
                        namedExports.add(node.declaration.id.name);
                    }
                    else if (node.declaration.type === 'VariableDeclaration') {
                        for (const declarator of node.declaration.declarations) {
                            if (declarator.id.type === 'Identifier') {
                                namedExports.add(declarator.id.name);
                            }
                        }
                    }
                }
                // Handle: export { Foo, Bar }
                if (node.specifiers) {
                    for (const specifier of node.specifiers) {
                        if (specifier.exported.type === 'Identifier') {
                            namedExports.add(specifier.exported.name);
                        }
                    }
                }
            },
            // Check for exported function declarations that look like components (PascalCase)
            'Program:exit'() {
                // Now check all named exports that are PascalCase
                // The actual flagging happens in the ExportNamedDeclaration handler
            },
            // Check for function declarations that look like components (PascalCase)
            FunctionDeclaration(node) {
                if (!node.id)
                    return;
                const name = node.id.name;
                // Skip the default export (the block itself)
                if (name === defaultExportName)
                    return;
                // Only flag if it's exported (named export)
                // Non-exported content components are allowed
                if (!namedExports.has(name))
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
                        // Only flag if it's exported (named export)
                        // Non-exported content components are allowed
                        if (!namedExports.has(name))
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm8tY29tcG9uZW50LWluLWJsb2Nrcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lc2xpbnQvcnVsZXMvbm8tY29tcG9uZW50LWluLWJsb2Nrcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxNQUFNLElBQUksR0FBb0I7SUFDNUIsSUFBSSxFQUFFO1FBQ0osSUFBSSxFQUFFLFlBQVk7UUFDbEIsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUNULGlIQUFpSDtZQUNuSCxRQUFRLEVBQUUsZ0JBQWdCO1lBQzFCLFdBQVcsRUFBRSxJQUFJO1NBQ2xCO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsbUJBQW1CLEVBQ2pCLG1MQUFtTDtTQUN0TDtRQUNELE1BQU0sRUFBRSxFQUFFO0tBQ1g7SUFDRCxNQUFNLENBQUMsT0FBeUI7UUFDOUIsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUE7UUFFMUQseUJBQXlCO1FBQ3pCLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQTtRQUNoRixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDYixPQUFPLEVBQUUsQ0FBQTtRQUNYLENBQUM7UUFFRCw0Q0FBNEM7UUFDNUMsSUFBSSxpQkFBaUIsR0FBa0IsSUFBSSxDQUFBO1FBQzNDLHNCQUFzQjtRQUN0QixNQUFNLFlBQVksR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFBO1FBRXRDLE9BQU87WUFDTCwyQkFBMkI7WUFDM0Isd0JBQXdCLENBQUMsSUFBSTtnQkFDM0IsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksS0FBSyxxQkFBcUIsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUMzRSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUs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Qjs0QkFBRSxPQUFNO3dCQUV0Qyw0Q0FBNEM7d0JBQzVDLDhDQUE4Qzt3QkFDOUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDOzRCQUFFLE9BQU07d0JBRW5DLGdEQUFnRDt3QkFDaEQsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7NEJBQ3hCLE9BQU8sQ0FBQyxNQUFNLENBQUM7Z0NBQ2IsSUFBSSxFQUFFLFVBQVU7Z0NBQ2hCLFNBQVMsRUFBRSxxQkFBcUI7NkJBQ2pDLENBQUMsQ0FBQTt3QkFDSixDQUFDO29CQUNILENBQUM7Z0JBQ0gsQ0FBQztZQUNILENBQUM7U0FDRixDQUFBO0lBQ0gsQ0FBQztDQUNGLENBQUE7QUFFRCxlQUFlLElBQUksQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJ1bGUgfSBmcm9tICdlc2xpbnQnXG5cbmNvbnN0IHJ1bGU6IFJ1bGUuUnVsZU1vZHVsZSA9IHtcbiAgbWV0YToge1xuICAgIHR5cGU6ICdzdWdnZXN0aW9uJyxcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgJ1ByZXZlbnQgZXhwb3J0aW5nIGNvbXBvbmVudCBmdW5jdGlvbnMgZnJvbSBibG9jayBmaWxlcyAtIHJldXNhYmxlIGNvbXBvbmVudHMgc2hvdWxkIGJlIGluIHRoZSBjb21wb25lbnRzIGZvbGRlcicsXG4gICAgICBjYXRlZ29yeTogJ0Jlc3QgUHJhY3RpY2VzJyxcbiAgICAgIHJlY29tbWVuZGVkOiB0cnVlLFxuICAgIH0sXG4gICAgbWVzc2FnZXM6IHtcbiAgICAgIG5vQ29tcG9uZW50SW5CbG9ja3M6XG4gICAgICAgICdbQ2Fub24gMDI1XSBFeHBvcnRlZCBjb21wb25lbnQgZnVuY3Rpb25zIHNob3VsZCBub3QgYmUgZGVmaW5lZCBpbiBibG9jayBmaWxlcy4gTW92ZSB0aGlzIGNvbXBvbmVudCB0byBzcmMvY29tcG9uZW50cy8gYW5kIGltcG9ydCBpdC4gTm9uLWV4cG9ydGVkIGNvbnRlbnQgY29tcG9uZW50cyBhcmUgYWxsb3dlZC4nLFxuICAgIH0sXG4gICAgc2NoZW1hOiBbXSxcbiAgfSxcbiAgY3JlYXRlKGNvbnRleHQ6IFJ1bGUuUnVsZUNvbnRleHQpIHtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGNvbnRleHQuZmlsZW5hbWUgfHwgY29udGV4dC5nZXRGaWxlbmFtZSgpXG5cbiAgICAvLyBPbmx5IGNoZWNrIGJsb2NrIGZpbGVzXG4gICAgY29uc3QgaXNCbG9jayA9IGZpbGVuYW1lLmluY2x1ZGVzKCcvYmxvY2tzLycpIHx8IGZpbGVuYW1lLmluY2x1ZGVzKCdcXFxcYmxvY2tzXFxcXCcpXG4gICAgaWYgKCFpc0Jsb2NrKSB7XG4gICAgICByZXR1cm4ge31cbiAgICB9XG5cbiAgICAvLyBUcmFjayB0aGUgZGVmYXVsdCBleHBvcnQgbmFtZSB0byBhbGxvdyBpdFxuICAgIGxldCBkZWZhdWx0RXhwb3J0TmFtZTogc3RyaW5nIHwgbnVsbCA9IG51bGxcbiAgICAvLyBUcmFjayBuYW1lZCBleHBvcnRzXG4gICAgY29uc3QgbmFtZWRFeHBvcnRzID0gbmV3IFNldDxzdHJpbmc+KClcblxuICAgIHJldHVybiB7XG4gICAgICAvLyBUcmFjayB0aGUgZGVmYXVsdCBleHBvcnRcbiAgICAgIEV4cG9ydERlZmF1bHREZWNsYXJhdGlvbihub2RlKSB7XG4gICAgICAgIGlmIChub2RlLmRlY2xhcmF0aW9uLnR5cGUgPT09ICdGdW5jdGlvbkRlY2xhcmF0aW9uJyAmJiBub2RlLmRlY2xhcmF0aW9uLmlkKSB7XG4gICAgICAgICAgZGVmYXVsdEV4cG9ydE5hbWUgPSBub2RlLmRlY2xhcmF0aW9uLmlkLm5hbWVcbiAgICAgICAgfSBlbHNlIGlmIChub2RlLmRlY2xhcmF0aW9uLnR5cGUgPT09ICdJZGVudGlmaWVyJykge1xuICAgICAgICAgIGRlZmF1bHRFeHBvcnROYW1lID0gbm9kZS5kZWNsYXJhdGlvbi5uYW1lXG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8vIFRyYWNrIG5hbWVkIGV4cG9ydHM6IGV4cG9ydCBmdW5jdGlvbiBGb28oKSB7fSBvciBleHBvcnQgY29uc3QgRm9vID0gKCkgPT4ge31cbiAgICAgIEV4cG9ydE5hbWVkRGVjbGFyYXRpb24obm9kZSkge1xuICAgICAgICBpZiAobm9kZS5kZWNsYXJhdGlvbikge1xuICAgICAgICAgIGlmIChub2RlLmRlY2xhcmF0aW9uLnR5cGUgPT09ICdGdW5jdGlvbkRlY2xhcmF0aW9uJyAmJiBub2RlLmRlY2xhcmF0aW9uLmlkKSB7XG4gICAgICAgICAgICBuYW1lZEV4cG9ydHMuYWRkKG5vZGUuZGVjbGFyYXRpb24uaWQubmFtZSlcbiAgICAgICAgICB9IGVsc2UgaWYgKG5vZGUuZGVjbGFyYXRpb24udHlwZSA9PT0gJ1ZhcmlhYmxlRGVjbGFyYXRpb24nKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGRlY2xhcmF0b3Igb2Ygbm9kZS5kZWNsYXJhdGlvbi5kZWNsYXJhdGlvbnMpIHtcbiAgICAgICAgICAgICAgaWYgKGRlY2xhcmF0b3IuaWQudHlwZSA9PT0gJ0lkZW50aWZpZXInKSB7XG4gICAgICAgICAgICAgICAgbmFtZWRFeHBvcnRzLmFkZChkZWNsYXJhdG9yLmlkLm5hbWUpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gSGFuZGxlOiBleHBvcnQgeyBGb28sIEJhciB9XG4gICAgICAgIGlmIChub2RlLnNwZWNpZmllcnMpIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IHNwZWNpZmllciBvZiBub2RlLnNwZWNpZmllcnMpIHtcbiAgICAgICAgICAgIGlmIChzcGVjaWZpZXIuZXhwb3J0ZWQudHlwZSA9PT0gJ0lkZW50aWZpZXInKSB7XG4gICAgICAgICAgICAgIG5hbWVkRXhwb3J0cy5hZGQoc3BlY2lmaWVyLmV4cG9ydGVkLm5hbWUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvLyBDaGVjayBmb3IgZXhwb3J0ZWQgZnVuY3Rpb24gZGVjbGFyYXRpb25zIHRoYXQgbG9vayBsaWtlIGNvbXBvbmVudHMgKFBhc2NhbENhc2UpXG4gICAgICAnUHJvZ3JhbTpleGl0JygpIHtcbiAgICAgICAgLy8gTm93IGNoZWNrIGFsbCBuYW1lZCBleHBvcnRzIHRoYXQgYXJlIFBhc2NhbENhc2VcbiAgICAgICAgLy8gVGhlIGFjdHVhbCBmbGFnZ2luZyBoYXBwZW5zIGluIHRoZSBFeHBvcnROYW1lZERlY2xhcmF0aW9uIGhhbmRsZXJcbiAgICAgIH0sXG5cbiAgICAgIC8vIENoZWNrIGZvciBmdW5jdGlvbiBkZWNsYXJhdGlvbnMgdGhhdCBsb29rIGxpa2UgY29tcG9uZW50cyAoUGFzY2FsQ2FzZSlcbiAgICAgIEZ1bmN0aW9uRGVjbGFyYXRpb24obm9kZSkge1xuICAgICAgICBpZiAoIW5vZGUuaWQpIHJldHVyblxuXG4gICAgICAgIGNvbnN0IG5hbWUgPSBub2RlLmlkLm5hbWVcblxuICAgICAgICAvLyBTa2lwIHRoZSBkZWZhdWx0IGV4cG9ydCAodGhlIGJsb2NrIGl0c2VsZilcbiAgICAgICAgaWYgKG5hbWUgPT09IGRlZmF1bHRFeHBvcnROYW1lKSByZXR1cm5cblxuICAgICAgICAvLyBPbmx5IGZsYWcgaWYgaXQncyBleHBvcnRlZCAobmFtZWQgZXhwb3J0KVxuICAgICAgICAvLyBOb24tZXhwb3J0ZWQgY29udGVudCBjb21wb25lbnRzIGFyZSBhbGxvd2VkXG4gICAgICAgIGlmICghbmFtZWRFeHBvcnRzLmhhcyhuYW1lKSkgcmV0dXJuXG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgaXQncyBQYXNjYWxDYXNlIChsaWtlbHkgYSBjb21wb25lbnQpXG4gICAgICAgIGlmICgvXltBLVpdLy50ZXN0KG5hbWUpKSB7XG4gICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIG1lc3NhZ2VJZDogJ25vQ29tcG9uZW50SW5CbG9ja3MnLFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8vIENoZWNrIGZvciBhcnJvdyBmdW5jdGlvbiBjb21wb25lbnRzOiBjb25zdCBNeUNvbXBvbmVudCA9ICgpID0+IHt9XG4gICAgICBWYXJpYWJsZURlY2xhcmF0aW9uKG5vZGUpIHtcbiAgICAgICAgZm9yIChjb25zdCBkZWNsYXJhdG9yIG9mIG5vZGUuZGVjbGFyYXRpb25zKSB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgZGVjbGFyYXRvci5pZC50eXBlID09PSAnSWRlbnRpZmllcicgJiZcbiAgICAgICAgICAgIGRlY2xhcmF0b3IuaW5pdCAmJlxuICAgICAgICAgICAgKGRlY2xhcmF0b3IuaW5pdC50eXBlID09PSAnQXJyb3dGdW5jdGlvbkV4cHJlc3Npb24nIHx8XG4gICAgICAgICAgICAgIGRlY2xhcmF0b3IuaW5pdC50eXBlID09PSAnRnVuY3Rpb25FeHByZXNzaW9uJylcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBkZWNsYXJhdG9yLmlkLm5hbWVcblxuICAgICAgICAgICAgLy8gU2tpcCB0aGUgZGVmYXVsdCBleHBvcnRcbiAgICAgICAgICAgIGlmIChuYW1lID09PSBkZWZhdWx0RXhwb3J0TmFtZSkgcmV0dXJuXG5cbiAgICAgICAgICAgIC8vIE9ubHkgZmxhZyBpZiBpdCdzIGV4cG9ydGVkIChuYW1lZCBleHBvcnQpXG4gICAgICAgICAgICAvLyBOb24tZXhwb3J0ZWQgY29udGVudCBjb21wb25lbnRzIGFyZSBhbGxvd2VkXG4gICAgICAgICAgICBpZiAoIW5hbWVkRXhwb3J0cy5oYXMobmFtZSkpIHJldHVyblxuXG4gICAgICAgICAgICAvLyBDaGVjayBpZiBpdCdzIFBhc2NhbENhc2UgKGxpa2VseSBhIGNvbXBvbmVudClcbiAgICAgICAgICAgIGlmICgvXltBLVpdLy50ZXN0KG5hbWUpKSB7XG4gICAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgICAgICBub2RlOiBkZWNsYXJhdG9yLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2VJZDogJ25vQ29tcG9uZW50SW5CbG9ja3MnLFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9XG4gIH0sXG59XG5cbmV4cG9ydCBkZWZhdWx0IHJ1bGVcbiJdfQ==