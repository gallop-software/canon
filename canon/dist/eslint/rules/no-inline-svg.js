import { getCanonUrl, getCanonPattern } from '../utils/canon.js';
const RULE_NAME = 'no-inline-svg';
const pattern = getCanonPattern(RULE_NAME);
const rule = {
    meta: {
        type: 'suggestion',
        docs: {
            description: pattern?.summary || 'Use Icon component instead of inline SVGs',
            recommended: true,
            url: getCanonUrl(RULE_NAME),
        },
        messages: {
            noInlineSvg: `[Canon ${pattern?.id || '012'}] Use the Icon component with Iconify icons instead of inline <svg>. Import: import { Icon } from "@/components/icon"`,
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
                if (elementName === 'svg') {
                    context.report({
                        node,
                        messageId: 'noInlineSvg',
                    });
                }
            },
        };
    },
};
export default rule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm8taW5saW5lLXN2Zy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lc2xpbnQvcnVsZXMvbm8taW5saW5lLXN2Zy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFBO0FBRWhFLE1BQU0sU0FBUyxHQUFHLGVBQWUsQ0FBQTtBQUNqQyxNQUFNLE9BQU8sR0FBRyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUE7QUFFMUMsTUFBTSxJQUFJLEdBQW9CO0lBQzVCLElBQUksRUFBRTtRQUNKLElBQUksRUFBRSxZQUFZO1FBQ2xCLElBQUksRUFBRTtZQUNKLFdBQVcsRUFBRSxPQUFPLEVBQUUsT0FBTyxJQUFJLDJDQUEyQztZQUM1RSxXQUFXLEVBQUUsSUFBSTtZQUNqQixHQUFHLEVBQUUsV0FBVyxDQUFDLFNBQVMsQ0FBQztTQUM1QjtRQUNELFFBQVEsRUFBRTtZQUNSLFdBQVcsRUFBRSxVQUFVLE9BQU8sRUFBRSxFQUFFLElBQUksS0FBSyx1SEFBdUg7U0FDbks7UUFDRCxNQUFNLEVBQUUsRUFBRTtLQUNYO0lBRUQsTUFBTSxDQUFDLE9BQU87UUFDWixNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxJQUFJLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQTtRQUUxRCw0QkFBNEI7UUFDNUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztZQUNuQyxPQUFPLEVBQUUsQ0FBQTtRQUNYLENBQUM7UUFFRCxPQUFPO1lBQ0wsaUJBQWlCLENBQUMsSUFBUztnQkFDekIsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUE7Z0JBRW5DLElBQUksV0FBVyxLQUFLLEtBQUssRUFBRSxDQUFDO29CQUMxQixPQUFPLENBQUMsTUFBTSxDQUFDO3dCQUNiLElBQUk7d0JBQ0osU0FBUyxFQUFFLGFBQWE7cUJBQ3pCLENBQUMsQ0FBQTtnQkFDSixDQUFDO1lBQ0gsQ0FBQztTQUNGLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQTtBQUVELGVBQWUsSUFBSSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBSdWxlIH0gZnJvbSAnZXNsaW50J1xuaW1wb3J0IHsgZ2V0Q2Fub25VcmwsIGdldENhbm9uUGF0dGVybiB9IGZyb20gJy4uL3V0aWxzL2Nhbm9uLmpzJ1xuXG5jb25zdCBSVUxFX05BTUUgPSAnbm8taW5saW5lLXN2ZydcbmNvbnN0IHBhdHRlcm4gPSBnZXRDYW5vblBhdHRlcm4oUlVMRV9OQU1FKVxuXG5jb25zdCBydWxlOiBSdWxlLlJ1bGVNb2R1bGUgPSB7XG4gIG1ldGE6IHtcbiAgICB0eXBlOiAnc3VnZ2VzdGlvbicsXG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246IHBhdHRlcm4/LnN1bW1hcnkgfHwgJ1VzZSBJY29uIGNvbXBvbmVudCBpbnN0ZWFkIG9mIGlubGluZSBTVkdzJyxcbiAgICAgIHJlY29tbWVuZGVkOiB0cnVlLFxuICAgICAgdXJsOiBnZXRDYW5vblVybChSVUxFX05BTUUpLFxuICAgIH0sXG4gICAgbWVzc2FnZXM6IHtcbiAgICAgIG5vSW5saW5lU3ZnOiBgW0Nhbm9uICR7cGF0dGVybj8uaWQgfHwgJzAxMid9XSBVc2UgdGhlIEljb24gY29tcG9uZW50IHdpdGggSWNvbmlmeSBpY29ucyBpbnN0ZWFkIG9mIGlubGluZSA8c3ZnPi4gSW1wb3J0OiBpbXBvcnQgeyBJY29uIH0gZnJvbSBcIkAvY29tcG9uZW50cy9pY29uXCJgLFxuICAgIH0sXG4gICAgc2NoZW1hOiBbXSxcbiAgfSxcblxuICBjcmVhdGUoY29udGV4dCkge1xuICAgIGNvbnN0IGZpbGVuYW1lID0gY29udGV4dC5maWxlbmFtZSB8fCBjb250ZXh0LmdldEZpbGVuYW1lKClcblxuICAgIC8vIE9ubHkgYXBwbHkgdG8gYmxvY2sgZmlsZXNcbiAgICBpZiAoIWZpbGVuYW1lLmluY2x1ZGVzKCcvYmxvY2tzLycpKSB7XG4gICAgICByZXR1cm4ge31cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgSlNYT3BlbmluZ0VsZW1lbnQobm9kZTogYW55KSB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnROYW1lID0gbm9kZS5uYW1lPy5uYW1lXG5cbiAgICAgICAgaWYgKGVsZW1lbnROYW1lID09PSAnc3ZnJykge1xuICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICBtZXNzYWdlSWQ6ICdub0lubGluZVN2ZycsXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9XG4gIH0sXG59XG5cbmV4cG9ydCBkZWZhdWx0IHJ1bGVcbiJdfQ==