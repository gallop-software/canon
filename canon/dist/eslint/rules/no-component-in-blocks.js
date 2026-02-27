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
        const isBlock = filename.includes('/blocks/') || filename.includes('/_blocks/') ||
            filename.includes('\\blocks\\') || filename.includes('\\_blocks\\');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm8tY29tcG9uZW50LWluLWJsb2Nrcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lc2xpbnQvcnVsZXMvbm8tY29tcG9uZW50LWluLWJsb2Nrcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxNQUFNLElBQUksR0FBb0I7SUFDNUIsSUFBSSxFQUFFO1FBQ0osSUFBSSxFQUFFLFlBQVk7UUFDbEIsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUNULGlIQUFpSDtZQUNuSCxRQUFRLEVBQUUsZ0JBQWdCO1lBQzFCLFdBQVcsRUFBRSxJQUFJO1NBQ2xCO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsbUJBQW1CLEVBQ2pCLG1MQUFtTDtTQUN0TDtRQUNELE1BQU0sRUFBRSxFQUFFO0tBQ1g7SUFDRCxNQUFNLENBQUMsT0FBeUI7UUFDOUIsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUE7UUFFMUQseUJBQXlCO1FBQ3pCLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUM7WUFDL0QsUUFBUSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFBO1FBQ25GLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNiLE9BQU8sRUFBRSxDQUFBO1FBQ1gsQ0FBQztRQUVELDRDQUE0QztRQUM1QyxJQUFJLGlCQUFpQixHQUFrQixJQUFJLENBQUE7UUFDM0Msc0JBQXNCO1FBQ3RCLE1BQU0sWUFBWSxHQUFHLElBQUksR0FBRyxFQUFVLENBQUE7UUFFdEMsT0FBTztZQUNMLDJCQUEyQjtZQUMzQix3QkFBd0IsQ0FBQyxJQUFJO2dCQUMzQixJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxLQUFLLHFCQUFxQixJQUFJLElBQUksQ0FB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VUFBVSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUE7d0JBRS9CLDBCQUEwQjt3QkFDMUIsSUFBSSxJQUFJLEtBQUssaUJBQWlCOzRCQUFFLE9BQU07d0JBRXRDLDRDQUE0Qzt3QkFDNUMsOENBQThDO3dCQUM5QyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7NEJBQUUsT0FBTTt3QkFFbkMsZ0RBQWdEO3dCQUNoRCxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQzs0QkFDeEIsT0FBTyxDQUFDLE1BQU0sQ0FBQztnQ0FDYixJQUFJLEVBQUUsVUFBVTtnQ0FDaEIsU0FBUyxFQUFFLHFCQUFxQjs2QkFDakMsQ0FBQyxDQUFBO3dCQUNKLENBQUM7b0JBQ0gsQ0FBQztnQkFDSCxDQUFDO1lBQ0gsQ0FBQztTQUNGLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQTtBQUVELGVBQWUsSUFBSSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUnVsZSB9IGZyb20gJ2VzbGludCdcblxuY29uc3QgcnVsZTogUnVsZS5SdWxlTW9kdWxlID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAnUHJldmVudCBleHBvcnRpbmcgY29tcG9uZW50IGZ1bmN0aW9ucyBmcm9tIGJsb2NrIGZpbGVzIC0gcmV1c2FibGUgY29tcG9uZW50cyBzaG91bGQgYmUgaW4gdGhlIGNvbXBvbmVudHMgZm9sZGVyJyxcbiAgICAgIGNhdGVnb3J5OiAnQmVzdCBQcmFjdGljZXMnLFxuICAgICAgcmVjb21tZW5kZWQ6IHRydWUsXG4gICAgfSxcbiAgICBtZXNzYWdlczoge1xuICAgICAgbm9Db21wb25lbnRJbkJsb2NrczpcbiAgICAgICAgJ1tDYW5vbiAwMjVdIEV4cG9ydGVkIGNvbXBvbmVudCBmdW5jdGlvbnMgc2hvdWxkIG5vdCBiZSBkZWZpbmVkIGluIGJsb2NrIGZpbGVzLiBNb3ZlIHRoaXMgY29tcG9uZW50IHRvIHNyYy9jb21wb25lbnRzLyBhbmQgaW1wb3J0IGl0LiBOb24tZXhwb3J0ZWQgY29udGVudCBjb21wb25lbnRzIGFyZSBhbGxvd2VkLicsXG4gICAgfSxcbiAgICBzY2hlbWE6IFtdLFxuICB9LFxuICBjcmVhdGUoY29udGV4dDogUnVsZS5SdWxlQ29udGV4dCkge1xuICAgIGNvbnN0IGZpbGVuYW1lID0gY29udGV4dC5maWxlbmFtZSB8fCBjb250ZXh0LmdldEZpbGVuYW1lKClcblxuICAgIC8vIE9ubHkgY2hlY2sgYmxvY2sgZmlsZXNcbiAgICBjb25zdCBpc0Jsb2NrID0gZmlsZW5hbWUuaW5jbHVkZXMoJy9ibG9ja3MvJykgfHwgZmlsZW5hbWUuaW5jbHVkZXMoJy9fYmxvY2tzLycpIHx8XG4gICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lLmluY2x1ZGVzKCdcXFxcYmxvY2tzXFxcXCcpIHx8IGZpbGVuYW1lLmluY2x1ZGVzKCdcXFxcX2Jsb2Nrc1xcXFwnKVxuICAgIGlmICghaXNCbG9jaykge1xuICAgICAgcmV0dXJuIHt9XG4gICAgfVxuXG4gICAgLy8gVHJhY2sgdGhlIGRlZmF1bHQgZXhwb3J0IG5hbWUgdG8gYWxsb3cgaXRcbiAgICBsZXQgZGVmYXVsdEV4cG9ydE5hbWU6IHN0cmluZyB8IG51bGwgPSBudWxsXG4gICAgLy8gVHJhY2sgbmFtZWQgZXhwb3J0c1xuICAgIGNvbnN0IG5hbWVkRXhwb3J0cyA9IG5ldyBTZXQ8c3RyaW5nPigpXG5cbiAgICByZXR1cm4ge1xuICAgICAgLy8gVHJhY2sgdGhlIGRlZmF1bHQgZXhwb3J0XG4gICAgICBFeHBvcnREZWZhdWx0RGVjbGFyYXRpb24obm9kZSkge1xuICAgICAgICBpZiAobm9kZS5kZWNsYXJhdGlvbi50eXBlID09PSAnRnVuY3Rpb25EZWNsYXJhdGlvbicgJiYgbm9kZS5kZWNsYXJhdGlvbi5pZCkge1xuICAgICAgICAgIGRlZmF1bHRFeHBvcnROYW1lID0gbm9kZS5kZWNsYXJhdGlvbi5pZC5uYW1lXG4gICAgICAgIH0gZWxzZSBpZiAobm9kZS5kZWNsYXJhdGlvbi50eXBlID09PSAnSWRlbnRpZmllcicpIHtcbiAgICAgICAgICBkZWZhdWx0RXhwb3J0TmFtZSA9IG5vZGUuZGVjbGFyYXRpb24ubmFtZVxuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvLyBUcmFjayBuYW1lZCBleHBvcnRzOiBleHBvcnQgZnVuY3Rpb24gRm9vKCkge30gb3IgZXhwb3J0IGNvbnN0IEZvbyA9ICgpID0+IHt9XG4gICAgICBFeHBvcnROYW1lZERlY2xhcmF0aW9uKG5vZGUpIHtcbiAgICAgICAgaWYgKG5vZGUuZGVjbGFyYXRpb24pIHtcbiAgICAgICAgICBpZiAobm9kZS5kZWNsYXJhdGlvbi50eXBlID09PSAnRnVuY3Rpb25EZWNsYXJhdGlvbicgJiYgbm9kZS5kZWNsYXJhdGlvbi5pZCkge1xuICAgICAgICAgICAgbmFtZWRFeHBvcnRzLmFkZChub2RlLmRlY2xhcmF0aW9uLmlkLm5hbWUpXG4gICAgICAgICAgfSBlbHNlIGlmIChub2RlLmRlY2xhcmF0aW9uLnR5cGUgPT09ICdWYXJpYWJsZURlY2xhcmF0aW9uJykge1xuICAgICAgICAgICAgZm9yIChjb25zdCBkZWNsYXJhdG9yIG9mIG5vZGUuZGVjbGFyYXRpb24uZGVjbGFyYXRpb25zKSB7XG4gICAgICAgICAgICAgIGlmIChkZWNsYXJhdG9yLmlkLnR5cGUgPT09ICdJZGVudGlmaWVyJykge1xuICAgICAgICAgICAgICAgIG5hbWVkRXhwb3J0cy5hZGQoZGVjbGFyYXRvci5pZC5uYW1lKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEhhbmRsZTogZXhwb3J0IHsgRm9vLCBCYXIgfVxuICAgICAgICBpZiAobm9kZS5zcGVjaWZpZXJzKSB7XG4gICAgICAgICAgZm9yIChjb25zdCBzcGVjaWZpZXIgb2Ygbm9kZS5zcGVjaWZpZXJzKSB7XG4gICAgICAgICAgICBpZiAoc3BlY2lmaWVyLmV4cG9ydGVkLnR5cGUgPT09ICdJZGVudGlmaWVyJykge1xuICAgICAgICAgICAgICBuYW1lZEV4cG9ydHMuYWRkKHNwZWNpZmllci5leHBvcnRlZC5uYW1lKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLy8gQ2hlY2sgZm9yIGV4cG9ydGVkIGZ1bmN0aW9uIGRlY2xhcmF0aW9ucyB0aGF0IGxvb2sgbGlrZSBjb21wb25lbnRzIChQYXNjYWxDYXNlKVxuICAgICAgJ1Byb2dyYW06ZXhpdCcoKSB7XG4gICAgICAgIC8vIE5vdyBjaGVjayBhbGwgbmFtZWQgZXhwb3J0cyB0aGF0IGFyZSBQYXNjYWxDYXNlXG4gICAgICAgIC8vIFRoZSBhY3R1YWwgZmxhZ2dpbmcgaGFwcGVucyBpbiB0aGUgRXhwb3J0TmFtZWREZWNsYXJhdGlvbiBoYW5kbGVyXG4gICAgICB9LFxuXG4gICAgICAvLyBDaGVjayBmb3IgZnVuY3Rpb24gZGVjbGFyYXRpb25zIHRoYXQgbG9vayBsaWtlIGNvbXBvbmVudHMgKFBhc2NhbENhc2UpXG4gICAgICBGdW5jdGlvbkRlY2xhcmF0aW9uKG5vZGUpIHtcbiAgICAgICAgaWYgKCFub2RlLmlkKSByZXR1cm5cblxuICAgICAgICBjb25zdCBuYW1lID0gbm9kZS5pZC5uYW1lXG5cbiAgICAgICAgLy8gU2tpcCB0aGUgZGVmYXVsdCBleHBvcnQgKHRoZSBibG9jayBpdHNlbGYpXG4gICAgICAgIGlmIChuYW1lID09PSBkZWZhdWx0RXhwb3J0TmFtZSkgcmV0dXJuXG5cbiAgICAgICAgLy8gT25seSBmbGFnIGlmIGl0J3MgZXhwb3J0ZWQgKG5hbWVkIGV4cG9ydClcbiAgICAgICAgLy8gTm9uLWV4cG9ydGVkIGNvbnRlbnQgY29tcG9uZW50cyBhcmUgYWxsb3dlZFxuICAgICAgICBpZiAoIW5hbWVkRXhwb3J0cy5oYXMobmFtZSkpIHJldHVyblxuXG4gICAgICAgIC8vIENoZWNrIGlmIGl0J3MgUGFzY2FsQ2FzZSAobGlrZWx5IGEgY29tcG9uZW50KVxuICAgICAgICBpZiAoL15bQS1aXS8udGVzdChuYW1lKSkge1xuICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICBtZXNzYWdlSWQ6ICdub0NvbXBvbmVudEluQmxvY2tzJyxcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvLyBDaGVjayBmb3IgYXJyb3cgZnVuY3Rpb24gY29tcG9uZW50czogY29uc3QgTXlDb21wb25lbnQgPSAoKSA9PiB7fVxuICAgICAgVmFyaWFibGVEZWNsYXJhdGlvbihub2RlKSB7XG4gICAgICAgIGZvciAoY29uc3QgZGVjbGFyYXRvciBvZiBub2RlLmRlY2xhcmF0aW9ucykge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGRlY2xhcmF0b3IuaWQudHlwZSA9PT0gJ0lkZW50aWZpZXInICYmXG4gICAgICAgICAgICBkZWNsYXJhdG9yLmluaXQgJiZcbiAgICAgICAgICAgIChkZWNsYXJhdG9yLmluaXQudHlwZSA9PT0gJ0Fycm93RnVuY3Rpb25FeHByZXNzaW9uJyB8fFxuICAgICAgICAgICAgICBkZWNsYXJhdG9yLmluaXQudHlwZSA9PT0gJ0Z1bmN0aW9uRXhwcmVzc2lvbicpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBjb25zdCBuYW1lID0gZGVjbGFyYXRvci5pZC5uYW1lXG5cbiAgICAgICAgICAgIC8vIFNraXAgdGhlIGRlZmF1bHQgZXhwb3J0XG4gICAgICAgICAgICBpZiAobmFtZSA9PT0gZGVmYXVsdEV4cG9ydE5hbWUpIHJldHVyblxuXG4gICAgICAgICAgICAvLyBPbmx5IGZsYWcgaWYgaXQncyBleHBvcnRlZCAobmFtZWQgZXhwb3J0KVxuICAgICAgICAgICAgLy8gTm9uLWV4cG9ydGVkIGNvbnRlbnQgY29tcG9uZW50cyBhcmUgYWxsb3dlZFxuICAgICAgICAgICAgaWYgKCFuYW1lZEV4cG9ydHMuaGFzKG5hbWUpKSByZXR1cm5cblxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgaXQncyBQYXNjYWxDYXNlIChsaWtlbHkgYSBjb21wb25lbnQpXG4gICAgICAgICAgICBpZiAoL15bQS1aXS8udGVzdChuYW1lKSkge1xuICAgICAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICAgICAgbm9kZTogZGVjbGFyYXRvcixcbiAgICAgICAgICAgICAgICBtZXNzYWdlSWQ6ICdub0NvbXBvbmVudEluQmxvY2tzJyxcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfVxuICB9LFxufVxuXG5leHBvcnQgZGVmYXVsdCBydWxlXG4iXX0=