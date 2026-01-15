"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@typescript-eslint/utils");
const canon_1 = require("../utils/canon");
const RULE_NAME = 'no-client-blocks';
const pattern = (0, canon_1.getCanonPattern)(RULE_NAME);
const createRule = utils_1.ESLintUtils.RuleCreator(() => (0, canon_1.getCanonUrl)(RULE_NAME));
exports.default = createRule({
    name: RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: pattern?.summary || 'Blocks must be server components',
        },
        messages: {
            noClientBlocks: `[Canon ${pattern?.id || '001'}] Block "{{blockName}}" uses 'use client'. Extract hooks and client-side logic into a component in src/components/, then import it here. See: ${pattern?.title || 'Server-First Blocks'} pattern.`,
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        const filename = context.filename || context.getFilename();
        // Only check files in src/blocks/
        if (!filename.includes('/blocks/') && !filename.includes('\\blocks\\')) {
            return {};
        }
        return {
            // Check for 'use client' directive at the top of the file
            ExpressionStatement(node) {
                if (node.expression.type === 'Literal' &&
                    node.expression.value === 'use client') {
                    // Extract block name from filename
                    const match = filename.match(/([^/\\]+)\.tsx?$/);
                    const blockName = match ? match[1] : 'unknown';
                    context.report({
                        node,
                        messageId: 'noClientBlocks',
                        data: {
                            blockName,
                        },
                    });
                }
            },
        };
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm8tY2xpZW50LWJsb2Nrcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1jbGllbnQtYmxvY2tzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQXNEO0FBQ3RELDBDQUE2RDtBQUU3RCxNQUFNLFNBQVMsR0FBRyxrQkFBa0IsQ0FBQTtBQUNwQyxNQUFNLE9BQU8sR0FBRyxJQUFBLHVCQUFlLEVBQUMsU0FBUyxDQUFDLENBQUE7QUFFMUMsTUFBTSxVQUFVLEdBQUcsbUJBQVcsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBQSxtQkFBVyxFQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUE7QUFJeEUsa0JBQWUsVUFBVSxDQUFpQjtJQUN4QyxJQUFJLEVBQUUsU0FBUztJQUNmLElBQUksRUFBRTtRQUNKLElBQUksRUFBRSxZQUFZO1FBQ2xCLElBQUksRUFBRTtZQUNKLFdBQVcsRUFBRSxPQUFPLEVBQUUsT0FBTyxJQUFJLGtDQUFrQztTQUNwRTtRQUNELFFBQVEsRUFBRTtZQUNSLGNBQWMsRUFBRSxVQUFVLE9BQU8sRUFBRSxFQUFFLElBQUksS0FBSyxpSkFBaUosT0FBTyxFQUFFLEtBQUssSUFBSSxxQkFBcUIsV0FBVztTQUNsUDtRQUNELE1BQU0sRUFBRSxFQUFFO0tBQ1g7SUFDRCxjQUFjLEVBQUUsRUFBRTtJQUNsQixNQUFNLENBQUMsT0FBTztRQUNaLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFBO1FBRTFELGtDQUFrQztRQUNsQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQztZQUN2RSxPQUFPLEVBQUUsQ0FBQTtRQUNYLENBQUM7UUFFRCxPQUFPO1lBQ0wsMERBQTBEO1lBQzFELG1CQUFtQixDQUFDLElBQUk7Z0JBQ3RCLElBQ0UsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEtBQUssU0FBUztvQkFDbEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEtBQUssWUFBWSxFQUN0QyxDQUFDO29CQUNELG1DQUFtQztvQkFDbkMsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO29CQUNoRCxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFBO29CQUU5QyxPQUFPLENBQUMsTUFBTSxDQUFDO3dCQUNiLElBQUk7d0JBQ0osU0FBUyxFQUFFLGdCQUFnQjt3QkFDM0IsSUFBSSxFQUFFOzRCQUNKLFNBQVM7eUJBQ1Y7cUJBQ0YsQ0FBQyxDQUFBO2dCQUNKLENBQUM7WUFDSCxDQUFDO1NBQ0YsQ0FBQTtJQUNILENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFU0xpbnRVdGlscyB9IGZyb20gJ0B0eXBlc2NyaXB0LWVzbGludC91dGlscydcbmltcG9ydCB7IGdldENhbm9uVXJsLCBnZXRDYW5vblBhdHRlcm4gfSBmcm9tICcuLi91dGlscy9jYW5vbidcblxuY29uc3QgUlVMRV9OQU1FID0gJ25vLWNsaWVudC1ibG9ja3MnXG5jb25zdCBwYXR0ZXJuID0gZ2V0Q2Fub25QYXR0ZXJuKFJVTEVfTkFNRSlcblxuY29uc3QgY3JlYXRlUnVsZSA9IEVTTGludFV0aWxzLlJ1bGVDcmVhdG9yKCgpID0+IGdldENhbm9uVXJsKFJVTEVfTkFNRSkpXG5cbnR5cGUgTWVzc2FnZUlkcyA9ICdub0NsaWVudEJsb2NrcydcblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlUnVsZTxbXSwgTWVzc2FnZUlkcz4oe1xuICBuYW1lOiBSVUxFX05BTUUsXG4gIG1ldGE6IHtcbiAgICB0eXBlOiAnc3VnZ2VzdGlvbicsXG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246IHBhdHRlcm4/LnN1bW1hcnkgfHwgJ0Jsb2NrcyBtdXN0IGJlIHNlcnZlciBjb21wb25lbnRzJyxcbiAgICB9LFxuICAgIG1lc3NhZ2VzOiB7XG4gICAgICBub0NsaWVudEJsb2NrczogYFtDYW5vbiAke3BhdHRlcm4/LmlkIHx8ICcwMDEnfV0gQmxvY2sgXCJ7e2Jsb2NrTmFtZX19XCIgdXNlcyAndXNlIGNsaWVudCcuIEV4dHJhY3QgaG9va3MgYW5kIGNsaWVudC1zaWRlIGxvZ2ljIGludG8gYSBjb21wb25lbnQgaW4gc3JjL2NvbXBvbmVudHMvLCB0aGVuIGltcG9ydCBpdCBoZXJlLiBTZWU6ICR7cGF0dGVybj8udGl0bGUgfHwgJ1NlcnZlci1GaXJzdCBCbG9ja3MnfSBwYXR0ZXJuLmAsXG4gICAgfSxcbiAgICBzY2hlbWE6IFtdLFxuICB9LFxuICBkZWZhdWx0T3B0aW9uczogW10sXG4gIGNyZWF0ZShjb250ZXh0KSB7XG4gICAgY29uc3QgZmlsZW5hbWUgPSBjb250ZXh0LmZpbGVuYW1lIHx8IGNvbnRleHQuZ2V0RmlsZW5hbWUoKVxuXG4gICAgLy8gT25seSBjaGVjayBmaWxlcyBpbiBzcmMvYmxvY2tzL1xuICAgIGlmICghZmlsZW5hbWUuaW5jbHVkZXMoJy9ibG9ja3MvJykgJiYgIWZpbGVuYW1lLmluY2x1ZGVzKCdcXFxcYmxvY2tzXFxcXCcpKSB7XG4gICAgICByZXR1cm4ge31cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgLy8gQ2hlY2sgZm9yICd1c2UgY2xpZW50JyBkaXJlY3RpdmUgYXQgdGhlIHRvcCBvZiB0aGUgZmlsZVxuICAgICAgRXhwcmVzc2lvblN0YXRlbWVudChub2RlKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBub2RlLmV4cHJlc3Npb24udHlwZSA9PT0gJ0xpdGVyYWwnICYmXG4gICAgICAgICAgbm9kZS5leHByZXNzaW9uLnZhbHVlID09PSAndXNlIGNsaWVudCdcbiAgICAgICAgKSB7XG4gICAgICAgICAgLy8gRXh0cmFjdCBibG9jayBuYW1lIGZyb20gZmlsZW5hbWVcbiAgICAgICAgICBjb25zdCBtYXRjaCA9IGZpbGVuYW1lLm1hdGNoKC8oW14vXFxcXF0rKVxcLnRzeD8kLylcbiAgICAgICAgICBjb25zdCBibG9ja05hbWUgPSBtYXRjaCA/IG1hdGNoWzFdIDogJ3Vua25vd24nXG5cbiAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbWVzc2FnZUlkOiAnbm9DbGllbnRCbG9ja3MnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBibG9ja05hbWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfVxuICB9LFxufSlcbiJdfQ==