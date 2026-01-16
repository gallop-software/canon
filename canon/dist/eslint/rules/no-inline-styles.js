import { ESLintUtils } from '@typescript-eslint/utils';
import { getCanonUrl, getCanonPattern } from '../utils/canon.js';
const RULE_NAME = 'no-inline-styles';
const pattern = getCanonPattern(RULE_NAME);
const createRule = ESLintUtils.RuleCreator(() => getCanonUrl(RULE_NAME));
export default createRule({
    name: RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: pattern?.summary || 'No inline styles, use Tailwind exclusively',
        },
        messages: {
            noInlineStyles: `[Canon ${pattern?.id || '008'}] Avoid inline style attribute. Use Tailwind CSS classes instead. See: ${pattern?.title || 'Tailwind Only'} pattern.`,
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        return {
            JSXAttribute(node) {
                // Check if attribute is "style"
                if (node.name.type === 'JSXIdentifier' &&
                    node.name.name === 'style') {
                    context.report({
                        node,
                        messageId: 'noInlineStyles',
                    });
                }
            },
        };
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm8taW5saW5lLXN0eWxlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lc2xpbnQvcnVsZXMvbm8taW5saW5lLXN0eWxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sMEJBQTBCLENBQUE7QUFDdEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQTtBQUVoRSxNQUFNLFNBQVMsR0FBRyxrQkFBa0IsQ0FBQTtBQUNwQyxNQUFNLE9BQU8sR0FBRyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUE7QUFFMUMsTUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQTtBQUl4RSxlQUFlLFVBQVUsQ0FBaUI7SUFDeEMsSUFBSSxFQUFFLFNBQVM7SUFDZixJQUFJLEVBQUU7UUFDSixJQUFJLEVBQUUsWUFBWTtRQUNsQixJQUFJLEVBQUU7WUFDSixXQUFXLEVBQUUsT0FBTyxFQUFFLE9BQU8sSUFBSSw0Q0FBNEM7U0FDOUU7UUFDRCxRQUFRLEVBQUU7WUFDUixjQUFjLEVBQUUsVUFBVSxPQUFPLEVBQUUsRUFBRSxJQUFJLEtBQUssMEVBQTBFLE9BQU8sRUFBRSxLQUFLLElBQUksZUFBZSxXQUFXO1NBQ3JLO1FBQ0QsTUFBTSxFQUFFLEVBQUU7S0FDWDtJQUNELGNBQWMsRUFBRSxFQUFFO0lBQ2xCLE1BQU0sQ0FBQyxPQUFPO1FBQ1osT0FBTztZQUNMLFlBQVksQ0FBQyxJQUFJO2dCQUNmLGdDQUFnQztnQkFDaEMsSUFDRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxlQUFlO29CQUNsQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxPQUFPLEVBQzFCLENBQUM7b0JBQ0QsT0FBTyxDQUFDLE1BQU0sQ0FBQzt3QkFDYixJQUFJO3dCQUNKLFNBQVMsRUFBRSxnQkFBZ0I7cUJBQzVCLENBQUMsQ0FBQTtnQkFDSixDQUFDO1lBQ0gsQ0FBQztTQUNGLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRVNMaW50VXRpbHMgfSBmcm9tICdAdHlwZXNjcmlwdC1lc2xpbnQvdXRpbHMnXG5pbXBvcnQgeyBnZXRDYW5vblVybCwgZ2V0Q2Fub25QYXR0ZXJuIH0gZnJvbSAnLi4vdXRpbHMvY2Fub24uanMnXG5cbmNvbnN0IFJVTEVfTkFNRSA9ICduby1pbmxpbmUtc3R5bGVzJ1xuY29uc3QgcGF0dGVybiA9IGdldENhbm9uUGF0dGVybihSVUxFX05BTUUpXG5cbmNvbnN0IGNyZWF0ZVJ1bGUgPSBFU0xpbnRVdGlscy5SdWxlQ3JlYXRvcigoKSA9PiBnZXRDYW5vblVybChSVUxFX05BTUUpKVxuXG50eXBlIE1lc3NhZ2VJZHMgPSAnbm9JbmxpbmVTdHlsZXMnXG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVJ1bGU8W10sIE1lc3NhZ2VJZHM+KHtcbiAgbmFtZTogUlVMRV9OQU1FLFxuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiBwYXR0ZXJuPy5zdW1tYXJ5IHx8ICdObyBpbmxpbmUgc3R5bGVzLCB1c2UgVGFpbHdpbmQgZXhjbHVzaXZlbHknLFxuICAgIH0sXG4gICAgbWVzc2FnZXM6IHtcbiAgICAgIG5vSW5saW5lU3R5bGVzOiBgW0Nhbm9uICR7cGF0dGVybj8uaWQgfHwgJzAwOCd9XSBBdm9pZCBpbmxpbmUgc3R5bGUgYXR0cmlidXRlLiBVc2UgVGFpbHdpbmQgQ1NTIGNsYXNzZXMgaW5zdGVhZC4gU2VlOiAke3BhdHRlcm4/LnRpdGxlIHx8ICdUYWlsd2luZCBPbmx5J30gcGF0dGVybi5gLFxuICAgIH0sXG4gICAgc2NoZW1hOiBbXSxcbiAgfSxcbiAgZGVmYXVsdE9wdGlvbnM6IFtdLFxuICBjcmVhdGUoY29udGV4dCkge1xuICAgIHJldHVybiB7XG4gICAgICBKU1hBdHRyaWJ1dGUobm9kZSkge1xuICAgICAgICAvLyBDaGVjayBpZiBhdHRyaWJ1dGUgaXMgXCJzdHlsZVwiXG4gICAgICAgIGlmIChcbiAgICAgICAgICBub2RlLm5hbWUudHlwZSA9PT0gJ0pTWElkZW50aWZpZXInICYmXG4gICAgICAgICAgbm9kZS5uYW1lLm5hbWUgPT09ICdzdHlsZSdcbiAgICAgICAgKSB7XG4gICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIG1lc3NhZ2VJZDogJ25vSW5saW5lU3R5bGVzJyxcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9LFxuICAgIH1cbiAgfSxcbn0pXG4iXX0=