import { ESLintUtils } from '@typescript-eslint/utils';
import { getCanonUrl, getCanonPattern } from '../utils/canon.js';
const RULE_NAME = 'no-arbitrary-colors';
const pattern = getCanonPattern(RULE_NAME);
const createRule = ESLintUtils.RuleCreator(() => getCanonUrl(RULE_NAME));
// Patterns that indicate arbitrary color values in Tailwind classes
const COLOR_PREFIXES = [
    'bg',
    'text',
    'border',
    'ring',
    'outline',
    'shadow',
    'accent',
    'caret',
    'fill',
    'stroke',
    'decoration',
    'divide',
    'from',
    'via',
    'to',
];
// Regex to match arbitrary color values like bg-[#fff], text-[rgb(...)], border-[hsl(...)]
const ARBITRARY_COLOR_REGEX = new RegExp(`\\b(${COLOR_PREFIXES.join('|')})-\\[(?:#[0-9a-fA-F]{3,8}|rgb[a]?\\(|hsl[a]?\\(|color\\(|oklch\\(|oklab\\()`, 'i');
// Also match var() references to non-color custom properties in color contexts
const ARBITRARY_VAR_COLOR_REGEX = new RegExp(`\\b(${COLOR_PREFIXES.join('|')})-\\[var\\(--(?!color-)`, 'i');
export default createRule({
    name: RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: pattern?.summary || 'Use defined color tokens, not arbitrary color values',
        },
        messages: {
            noArbitraryColors: `[Canon ${pattern?.id || '020'}] Avoid arbitrary color values. Use defined Tailwind color tokens (e.g., bg-accent, text-contrast) instead of hardcoded colors. See: ${pattern?.title || 'No Arbitrary Colors'} pattern.`,
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        return {
            JSXAttribute(node) {
                // Only check className attributes
                if (node.name.type !== 'JSXIdentifier' ||
                    node.name.name !== 'className') {
                    return;
                }
                // Get the className value
                let classValue = '';
                if (node.value?.type === 'Literal' && typeof node.value.value === 'string') {
                    classValue = node.value.value;
                }
                else if (node.value?.type === 'JSXExpressionContainer' &&
                    node.value.expression.type === 'Literal' &&
                    typeof node.value.expression.value === 'string') {
                    classValue = node.value.expression.value;
                }
                else if (node.value?.type === 'JSXExpressionContainer' &&
                    node.value.expression.type === 'TemplateLiteral') {
                    // Extract string parts from template literal
                    classValue = node.value.expression.quasis
                        .map((quasi) => quasi.value.raw)
                        .join(' ');
                }
                if (!classValue)
                    return;
                // Check for arbitrary color values
                if (ARBITRARY_COLOR_REGEX.test(classValue) ||
                    ARBITRARY_VAR_COLOR_REGEX.test(classValue)) {
                    context.report({
                        node,
                        messageId: 'noArbitraryColors',
                    });
                }
            },
        };
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm8tYXJiaXRyYXJ5LWNvbG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lc2xpbnQvcnVsZXMvbm8tYXJiaXRyYXJ5LWNvbG9ycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sMEJBQTBCLENBQUE7QUFDdEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQTtBQUVoRSxNQUFNLFNBQVMsR0FBRyxxQkFBcUIsQ0FBQTtBQUN2QyxNQUFNLE9BQU8sR0FBRyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUE7QUFFMUMsTUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQTtBQUl4RSxvRUFBb0U7QUFDcEUsTUFBTSxjQUFjLEdBQUc7SUFDckIsSUFBSTtJQUNKLE1BQU07SUFDTixRQUFRO0lBQ1IsTUFBTTtJQUNOLFNBQVM7SUFDVCxRQUFRO0lBQ1IsUUFBUTtJQUNSLE9BQU87SUFDUCxNQUFNO0lBQ04sUUFBUTtJQUNSLFlBQVk7SUFDWixRQUFRO0lBQ1IsTUFBTTtJQUNOLEtBQUs7SUFDTCxJQUFJO0NBQ0wsQ0FBQTtBQUVELDJGQUEyRjtBQUMzRixNQUFNLHFCQUFxQixHQUFHLElBQUksTUFBTSxDQUN0QyxPQUFPLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLDZFQUE2RSxFQUM1RyxHQUFHLENBQ0osQ0FBQTtBQUVELCtFQUErRTtBQUMvRSxNQUFNLHlCQUF5QixHQUFHLElBQUksTUFBTSxDQUMxQyxPQUFPLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLHlCQUF5QixFQUN4RCxHQUFHLENBQ0osQ0FBQTtBQUVELGVBQWUsVUFBVSxDQUFpQjtJQUN4QyxJQUFJLEVBQUUsU0FBUztJQUNmLElBQUksRUFBRTtRQUNKLElBQUksRUFBRSxZQUFZO1FBQ2xCLElBQUksRUFBRTtZQUNKLFdBQVcsRUFDVCxPQUFPLEVBQUUsT0FBTyxJQUFJLHNEQUFzRDtTQUM3RTtRQUNELFFBQVEsRUFBRTtZQUNSLGlCQUFpQixFQUFFLFVBQVUsT0FBTyxFQUFFLEVBQUUsSUFBSSxLQUFLLHdJQUF3SSxPQUFPLEVBQUUsS0FBSyxJQUFJLHFCQUFxQixXQUFXO1NBQzVPO1FBQ0QsTUFBTSxFQUFFLEVBQUU7S0FDWDtJQUNELGNBQWMsRUFBRSxFQUFFO0lBQ2xCLE1BQU0sQ0FBQyxPQUFPO1FBQ1osT0FBTztZQUNMLFlBQVksQ0FBQyxJQUFJO2dCQUNmLGtDQUFrQztnQkFDbEMsSUFDRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxlQUFlO29CQUNsQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxXQUFXLEVBQzlCLENBQUM7b0JBQ0QsT0FBTTtnQkFDUixDQUFDO2dCQUVELDBCQUEwQjtnQkFDMUIsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFBO2dCQUVuQixJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxLQUFLLFNBQVMsSUFBSSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxLQUFLLFFBQVEsRUFBRSxDQUFDO29CQUMzRSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUE7Z0JBQy9CLENBQUM7cUJBQU0sSUFDTCxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksS0FBSyx3QkFBd0I7b0JBQzdDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksS0FBSyxTQUFTO29CQUN4QyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEtBQUssS0FBSyxRQUFRLEVBQy9DLENBQUM7b0JBQ0QsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQTtnQkFDMUMsQ0FBQztxQkFBTSxJQUNMLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxLQUFLLHdCQUF3QjtvQkFDN0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLGlCQUFpQixFQUNoRCxDQUFDO29CQUNELDZDQUE2QztvQkFDN0MsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU07eUJBQ3RDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7eUJBQy9CLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFDZCxDQUFDO2dCQUVELElBQUksQ0FBQyxVQUFVO29CQUFFLE9BQU07Z0JBRXZCLG1DQUFtQztnQkFDbkMsSUFDRSxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO29CQUN0Qyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQzFDLENBQUM7b0JBQ0QsT0FBTyxDQUFDLE1BQU0sQ0FBQzt3QkFDYixJQUFJO3dCQUNKLFNBQVMsRUFBRSxtQkFBbUI7cUJBQy9CLENBQUMsQ0FBQTtnQkFDSixDQUFDO1lBQ0gsQ0FBQztTQUNGLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRVNMaW50VXRpbHMgfSBmcm9tICdAdHlwZXNjcmlwdC1lc2xpbnQvdXRpbHMnXG5pbXBvcnQgeyBnZXRDYW5vblVybCwgZ2V0Q2Fub25QYXR0ZXJuIH0gZnJvbSAnLi4vdXRpbHMvY2Fub24uanMnXG5cbmNvbnN0IFJVTEVfTkFNRSA9ICduby1hcmJpdHJhcnktY29sb3JzJ1xuY29uc3QgcGF0dGVybiA9IGdldENhbm9uUGF0dGVybihSVUxFX05BTUUpXG5cbmNvbnN0IGNyZWF0ZVJ1bGUgPSBFU0xpbnRVdGlscy5SdWxlQ3JlYXRvcigoKSA9PiBnZXRDYW5vblVybChSVUxFX05BTUUpKVxuXG50eXBlIE1lc3NhZ2VJZHMgPSAnbm9BcmJpdHJhcnlDb2xvcnMnXG5cbi8vIFBhdHRlcm5zIHRoYXQgaW5kaWNhdGUgYXJiaXRyYXJ5IGNvbG9yIHZhbHVlcyBpbiBUYWlsd2luZCBjbGFzc2VzXG5jb25zdCBDT0xPUl9QUkVGSVhFUyA9IFtcbiAgJ2JnJyxcbiAgJ3RleHQnLFxuICAnYm9yZGVyJyxcbiAgJ3JpbmcnLFxuICAnb3V0bGluZScsXG4gICdzaGFkb3cnLFxuICAnYWNjZW50JyxcbiAgJ2NhcmV0JyxcbiAgJ2ZpbGwnLFxuICAnc3Ryb2tlJyxcbiAgJ2RlY29yYXRpb24nLFxuICAnZGl2aWRlJyxcbiAgJ2Zyb20nLFxuICAndmlhJyxcbiAgJ3RvJyxcbl1cblxuLy8gUmVnZXggdG8gbWF0Y2ggYXJiaXRyYXJ5IGNvbG9yIHZhbHVlcyBsaWtlIGJnLVsjZmZmXSwgdGV4dC1bcmdiKC4uLildLCBib3JkZXItW2hzbCguLi4pXVxuY29uc3QgQVJCSVRSQVJZX0NPTE9SX1JFR0VYID0gbmV3IFJlZ0V4cChcbiAgYFxcXFxiKCR7Q09MT1JfUFJFRklYRVMuam9pbignfCcpfSktXFxcXFsoPzojWzAtOWEtZkEtRl17Myw4fXxyZ2JbYV0/XFxcXCh8aHNsW2FdP1xcXFwofGNvbG9yXFxcXCh8b2tsY2hcXFxcKHxva2xhYlxcXFwoKWAsXG4gICdpJ1xuKVxuXG4vLyBBbHNvIG1hdGNoIHZhcigpIHJlZmVyZW5jZXMgdG8gbm9uLWNvbG9yIGN1c3RvbSBwcm9wZXJ0aWVzIGluIGNvbG9yIGNvbnRleHRzXG5jb25zdCBBUkJJVFJBUllfVkFSX0NPTE9SX1JFR0VYID0gbmV3IFJlZ0V4cChcbiAgYFxcXFxiKCR7Q09MT1JfUFJFRklYRVMuam9pbignfCcpfSktXFxcXFt2YXJcXFxcKC0tKD8hY29sb3ItKWAsXG4gICdpJ1xuKVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVSdWxlPFtdLCBNZXNzYWdlSWRzPih7XG4gIG5hbWU6IFJVTEVfTkFNRSxcbiAgbWV0YToge1xuICAgIHR5cGU6ICdzdWdnZXN0aW9uJyxcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgcGF0dGVybj8uc3VtbWFyeSB8fCAnVXNlIGRlZmluZWQgY29sb3IgdG9rZW5zLCBub3QgYXJiaXRyYXJ5IGNvbG9yIHZhbHVlcycsXG4gICAgfSxcbiAgICBtZXNzYWdlczoge1xuICAgICAgbm9BcmJpdHJhcnlDb2xvcnM6IGBbQ2Fub24gJHtwYXR0ZXJuPy5pZCB8fCAnMDIwJ31dIEF2b2lkIGFyYml0cmFyeSBjb2xvciB2YWx1ZXMuIFVzZSBkZWZpbmVkIFRhaWx3aW5kIGNvbG9yIHRva2VucyAoZS5nLiwgYmctYWNjZW50LCB0ZXh0LWNvbnRyYXN0KSBpbnN0ZWFkIG9mIGhhcmRjb2RlZCBjb2xvcnMuIFNlZTogJHtwYXR0ZXJuPy50aXRsZSB8fCAnTm8gQXJiaXRyYXJ5IENvbG9ycyd9IHBhdHRlcm4uYCxcbiAgICB9LFxuICAgIHNjaGVtYTogW10sXG4gIH0sXG4gIGRlZmF1bHRPcHRpb25zOiBbXSxcbiAgY3JlYXRlKGNvbnRleHQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgSlNYQXR0cmlidXRlKG5vZGUpIHtcbiAgICAgICAgLy8gT25seSBjaGVjayBjbGFzc05hbWUgYXR0cmlidXRlc1xuICAgICAgICBpZiAoXG4gICAgICAgICAgbm9kZS5uYW1lLnR5cGUgIT09ICdKU1hJZGVudGlmaWVyJyB8fFxuICAgICAgICAgIG5vZGUubmFtZS5uYW1lICE9PSAnY2xhc3NOYW1lJ1xuICAgICAgICApIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEdldCB0aGUgY2xhc3NOYW1lIHZhbHVlXG4gICAgICAgIGxldCBjbGFzc1ZhbHVlID0gJydcblxuICAgICAgICBpZiAobm9kZS52YWx1ZT8udHlwZSA9PT0gJ0xpdGVyYWwnICYmIHR5cGVvZiBub2RlLnZhbHVlLnZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGNsYXNzVmFsdWUgPSBub2RlLnZhbHVlLnZhbHVlXG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgbm9kZS52YWx1ZT8udHlwZSA9PT0gJ0pTWEV4cHJlc3Npb25Db250YWluZXInICYmXG4gICAgICAgICAgbm9kZS52YWx1ZS5leHByZXNzaW9uLnR5cGUgPT09ICdMaXRlcmFsJyAmJlxuICAgICAgICAgIHR5cGVvZiBub2RlLnZhbHVlLmV4cHJlc3Npb24udmFsdWUgPT09ICdzdHJpbmcnXG4gICAgICAgICkge1xuICAgICAgICAgIGNsYXNzVmFsdWUgPSBub2RlLnZhbHVlLmV4cHJlc3Npb24udmFsdWVcbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICBub2RlLnZhbHVlPy50eXBlID09PSAnSlNYRXhwcmVzc2lvbkNvbnRhaW5lcicgJiZcbiAgICAgICAgICBub2RlLnZhbHVlLmV4cHJlc3Npb24udHlwZSA9PT0gJ1RlbXBsYXRlTGl0ZXJhbCdcbiAgICAgICAgKSB7XG4gICAgICAgICAgLy8gRXh0cmFjdCBzdHJpbmcgcGFydHMgZnJvbSB0ZW1wbGF0ZSBsaXRlcmFsXG4gICAgICAgICAgY2xhc3NWYWx1ZSA9IG5vZGUudmFsdWUuZXhwcmVzc2lvbi5xdWFzaXNcbiAgICAgICAgICAgIC5tYXAoKHF1YXNpKSA9PiBxdWFzaS52YWx1ZS5yYXcpXG4gICAgICAgICAgICAuam9pbignICcpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWNsYXNzVmFsdWUpIHJldHVyblxuXG4gICAgICAgIC8vIENoZWNrIGZvciBhcmJpdHJhcnkgY29sb3IgdmFsdWVzXG4gICAgICAgIGlmIChcbiAgICAgICAgICBBUkJJVFJBUllfQ09MT1JfUkVHRVgudGVzdChjbGFzc1ZhbHVlKSB8fFxuICAgICAgICAgIEFSQklUUkFSWV9WQVJfQ09MT1JfUkVHRVgudGVzdChjbGFzc1ZhbHVlKVxuICAgICAgICApIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbWVzc2FnZUlkOiAnbm9BcmJpdHJhcnlDb2xvcnMnLFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfVxuICB9LFxufSlcbiJdfQ==