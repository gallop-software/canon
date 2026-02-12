import { getCanonUrl, getCanonPattern } from '../utils/canon.js';
const RULE_NAME = 'no-raw-colors';
const pattern = getCanonPattern(RULE_NAME);
// Tailwind color prefixes (shared concept with no-arbitrary-colors)
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
// Standard Tailwind named color families
const DEFAULT_FORBIDDEN_FAMILIES = [
    'white',
    'black',
    'gray',
    'slate',
    'zinc',
    'neutral',
    'stone',
    'red',
    'orange',
    'amber',
    'yellow',
    'lime',
    'green',
    'emerald',
    'teal',
    'cyan',
    'sky',
    'blue',
    'indigo',
    'violet',
    'purple',
    'fuchsia',
    'pink',
    'rose',
];
/**
 * Build regex to match raw Tailwind color classes.
 * Matches: text-white, bg-gray-500, border-slate-200, etc.
 */
function buildRawColorRegex(families) {
    const prefixes = COLOR_PREFIXES.join('|');
    const familyGroup = families.join('|');
    // Match {prefix}-{family} or {prefix}-{family}-{shade}
    return new RegExp(`\\b(?:${prefixes})-(?:${familyGroup})(?:-\\d{1,3})?\\b`);
}
/**
 * Extract all raw color class matches from a className string
 */
function findRawColorClasses(classValue, families, allowedClasses) {
    const prefixes = COLOR_PREFIXES.join('|');
    const familyGroup = families.join('|');
    const globalRegex = new RegExp(`\\b(?:${prefixes})-(?:${familyGroup})(?:-\\d{1,3})?\\b`, 'g');
    const matches = [];
    let match;
    while ((match = globalRegex.exec(classValue)) !== null) {
        if (!allowedClasses.includes(match[0])) {
            matches.push(match[0]);
        }
    }
    return matches;
}
const rule = {
    meta: {
        type: 'suggestion',
        docs: {
            description: pattern?.summary || 'Use semantic color tokens, not raw Tailwind colors',
            recommended: true,
            url: getCanonUrl(RULE_NAME),
        },
        messages: {
            noRawColors: `[Canon ${pattern?.id || '009'}] Avoid raw Tailwind color "{{class}}". Use a semantic token instead.`,
        },
        schema: [
            {
                type: 'object',
                properties: {
                    allowedClasses: {
                        type: 'array',
                        items: { type: 'string' },
                    },
                },
                additionalProperties: false,
            },
        ],
    },
    create(context) {
        const options = context.options[0] || {};
        const allowedClasses = options.allowedClasses || [];
        return {
            JSXAttribute(node) {
                // Only check className attributes
                if (node.name?.name !== 'className') {
                    return;
                }
                // Extract className value
                let classValue = '';
                if (node.value?.type === 'Literal' && typeof node.value.value === 'string') {
                    classValue = node.value.value;
                }
                else if (node.value?.type === 'JSXExpressionContainer' &&
                    node.value.expression?.type === 'Literal' &&
                    typeof node.value.expression.value === 'string') {
                    classValue = node.value.expression.value;
                }
                else if (node.value?.type === 'JSXExpressionContainer' &&
                    node.value.expression?.type === 'TemplateLiteral') {
                    classValue = node.value.expression.quasis
                        .map((quasi) => quasi.value.raw)
                        .join(' ');
                }
                if (!classValue)
                    return;
                const matches = findRawColorClasses(classValue, DEFAULT_FORBIDDEN_FAMILIES, allowedClasses);
                for (const cls of matches) {
                    context.report({
                        node,
                        messageId: 'noRawColors',
                        data: { class: cls },
                    });
                }
            },
        };
    },
};
export default rule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm8tcmF3LWNvbG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lc2xpbnQvcnVsZXMvbm8tcmF3LWNvbG9ycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFBO0FBRWhFLE1BQU0sU0FBUyxHQUFHLGVBQWUsQ0FBQTtBQUNqQyxNQUFNLE9BQU8sR0FBRyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUE7QUFFMUMsb0VBQW9FO0FBQ3BFLE1BQU0sY0FBYyxHQUFHO0lBQ3JCLElBQUk7SUFDSixNQUFNO0lBQ04sUUFBUTtJQUNSLE1BQU07SUFDTixTQUFTO0lBQ1QsUUFBUTtJQUNSLFFBQVE7SUFDUixPQUFPO0lBQ1AsTUFBTTtJQUNOLFFBQVE7SUFDUixZQUFZO0lBQ1osUUFBUTtJQUNSLE1BQU07SUFDTixLQUFLO0lBQ0wsSUFBSTtDQUNMLENBQUE7QUFFRCx5Q0FBeUM7QUFDekMsTUFBTSwwQkFBMEIsR0FBRztJQUNqQyxPQUFPO0lBQ1AsT0FBTztJQUNQLE1BQU07SUFDTixPQUFPO0lBQ1AsTUFBTTtJQUNOLFNBQVM7SUFDVCxPQUFPO0lBQ1AsS0FBSztJQUNMLFFBQVE7SUFDUixPQUFPO0lBQ1AsUUFBUTtJQUNSLE1BQU07SUFDTixPQUFPO0lBQ1AsU0FBUztJQUNULE1BQU07SUFDTixNQUFNO0lBQ04sS0FBSztJQUNMLE1BQU07SUFDTixRQUFRO0lBQ1IsUUFBUTtJQUNSLFFBQVE7SUFDUixTQUFTO0lBQ1QsTUFBTTtJQUNOLE1BQU07Q0FDUCxDQUFBO0FBRUQ7OztHQUdHO0FBQ0gsU0FBUyxrQkFBa0IsQ0FBQyxRQUFrQjtJQUM1QyxNQUFNLFFBQVEsR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQ3pDLE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7SUFD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SUFDTCxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksS0FBSyx3QkFBd0I7b0JBQzdDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLElBQUksS0FBSyxpQkFBaUIsRUFDakQsQ0FBQztvQkFDRCxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTTt5QkFDdEMsR0FBRyxDQUFDLENBQUMsS0FBVSxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQzt5QkFDcEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO2dCQUNkLENBQUM7Z0JBRUQsSUFBSSxDQUFDLFVBQVU7b0JBQUUsT0FBTTtnQkFFdkIsTUFBTSxPQUFPLEdBQUcsbUJBQW1CLENBQUMsVUFBVSxFQUFFLDBCQUEwQixFQUFFLGNBQWMsQ0FBQyxDQUFBO2dCQUMzRixLQUFLLE1BQU0sR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO29CQUMxQixPQUFPLENBQUMsTUFBTSxDQUFDO3dCQUNiLElBQUk7d0JBQ0osU0FBUyxFQUFFLGFBQWE7d0JBQ3hCLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUU7cUJBQ3JCLENBQUMsQ0FBQTtnQkFDSixDQUFDO1lBQ0gsQ0FBQztTQUNGLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQTtBQUVELGVBQWUsSUFBSSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBSdWxlIH0gZnJvbSAnZXNsaW50J1xuaW1wb3J0IHsgZ2V0Q2Fub25VcmwsIGdldENhbm9uUGF0dGVybiB9IGZyb20gJy4uL3V0aWxzL2Nhbm9uLmpzJ1xuXG5jb25zdCBSVUxFX05BTUUgPSAnbm8tcmF3LWNvbG9ycydcbmNvbnN0IHBhdHRlcm4gPSBnZXRDYW5vblBhdHRlcm4oUlVMRV9OQU1FKVxuXG4vLyBUYWlsd2luZCBjb2xvciBwcmVmaXhlcyAoc2hhcmVkIGNvbmNlcHQgd2l0aCBuby1hcmJpdHJhcnktY29sb3JzKVxuY29uc3QgQ09MT1JfUFJFRklYRVMgPSBbXG4gICdiZycsXG4gICd0ZXh0JyxcbiAgJ2JvcmRlcicsXG4gICdyaW5nJyxcbiAgJ291dGxpbmUnLFxuICAnc2hhZG93JyxcbiAgJ2FjY2VudCcsXG4gICdjYXJldCcsXG4gICdmaWxsJyxcbiAgJ3N0cm9rZScsXG4gICdkZWNvcmF0aW9uJyxcbiAgJ2RpdmlkZScsXG4gICdmcm9tJyxcbiAgJ3ZpYScsXG4gICd0bycsXG5dXG5cbi8vIFN0YW5kYXJkIFRhaWx3aW5kIG5hbWVkIGNvbG9yIGZhbWlsaWVzXG5jb25zdCBERUZBVUxUX0ZPUkJJRERFTl9GQU1JTElFUyA9IFtcbiAgJ3doaXRlJyxcbiAgJ2JsYWNrJyxcbiAgJ2dyYXknLFxuICAnc2xhdGUnLFxuICAnemluYycsXG4gICduZXV0cmFsJyxcbiAgJ3N0b25lJyxcbiAgJ3JlZCcsXG4gICdvcmFuZ2UnLFxuICAnYW1iZXInLFxuICAneWVsbG93JyxcbiAgJ2xpbWUnLFxuICAnZ3JlZW4nLFxuICAnZW1lcmFsZCcsXG4gICd0ZWFsJyxcbiAgJ2N5YW4nLFxuICAnc2t5JyxcbiAgJ2JsdWUnLFxuICAnaW5kaWdvJyxcbiAgJ3Zpb2xldCcsXG4gICdwdXJwbGUnLFxuICAnZnVjaHNpYScsXG4gICdwaW5rJyxcbiAgJ3Jvc2UnLFxuXVxuXG4vKipcbiAqIEJ1aWxkIHJlZ2V4IHRvIG1hdGNoIHJhdyBUYWlsd2luZCBjb2xvciBjbGFzc2VzLlxuICogTWF0Y2hlczogdGV4dC13aGl0ZSwgYmctZ3JheS01MDAsIGJvcmRlci1zbGF0ZS0yMDAsIGV0Yy5cbiAqL1xuZnVuY3Rpb24gYnVpbGRSYXdDb2xvclJlZ2V4KGZhbWlsaWVzOiBzdHJpbmdbXSk6IFJlZ0V4cCB7XG4gIGNvbnN0IHByZWZpeGVzID0gQ09MT1JfUFJFRklYRVMuam9pbignfCcpXG4gIGNvbnN0IGZhbWlseUdyb3VwID0gZmFtaWxpZXMuam9pbignfCcpXG4gIC8vIE1hdGNoIHtwcmVmaXh9LXtmYW1pbHl9IG9yIHtwcmVmaXh9LXtmYW1pbHl9LXtzaGFkZX1cbiAgcmV0dXJuIG5ldyBSZWdFeHAoYFxcXFxiKD86JHtwcmVmaXhlc30pLSg/OiR7ZmFtaWx5R3JvdXB9KSg/Oi1cXFxcZHsxLDN9KT9cXFxcYmApXG59XG5cbi8qKlxuICogRXh0cmFjdCBhbGwgcmF3IGNvbG9yIGNsYXNzIG1hdGNoZXMgZnJvbSBhIGNsYXNzTmFtZSBzdHJpbmdcbiAqL1xuZnVuY3Rpb24gZmluZFJhd0NvbG9yQ2xhc3NlcyhjbGFzc1ZhbHVlOiBzdHJpbmcsIGZhbWlsaWVzOiBzdHJpbmdbXSwgYWxsb3dlZENsYXNzZXM6IHN0cmluZ1tdKTogc3RyaW5nW10ge1xuICBjb25zdCBwcmVmaXhlcyA9IENPTE9SX1BSRUZJWEVTLmpvaW4oJ3wnKVxuICBjb25zdCBmYW1pbHlHcm91cCA9IGZhbWlsaWVzLmpvaW4oJ3wnKVxuICBjb25zdCBnbG9iYWxSZWdleCA9IG5ldyBSZWdFeHAoYFxcXFxiKD86JHtwcmVmaXhlc30pLSg/OiR7ZmFtaWx5R3JvdXB9KSg/Oi1cXFxcZHsxLDN9KT9cXFxcYmAsICdnJylcbiAgY29uc3QgbWF0Y2hlczogc3RyaW5nW10gPSBbXVxuICBsZXQgbWF0Y2g6IFJlZ0V4cEV4ZWNBcnJheSB8IG51bGxcbiAgd2hpbGUgKChtYXRjaCA9IGdsb2JhbFJlZ2V4LmV4ZWMoY2xhc3NWYWx1ZSkpICE9PSBudWxsKSB7XG4gICAgaWYgKCFhbGxvd2VkQ2xhc3Nlcy5pbmNsdWRlcyhtYXRjaFswXSkpIHtcbiAgICAgIG1hdGNoZXMucHVzaChtYXRjaFswXSlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG1hdGNoZXNcbn1cblxuY29uc3QgcnVsZTogUnVsZS5SdWxlTW9kdWxlID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiBwYXR0ZXJuPy5zdW1tYXJ5IHx8ICdVc2Ugc2VtYW50aWMgY29sb3IgdG9rZW5zLCBub3QgcmF3IFRhaWx3aW5kIGNvbG9ycycsXG4gICAgICByZWNvbW1lbmRlZDogdHJ1ZSxcbiAgICAgIHVybDogZ2V0Q2Fub25VcmwoUlVMRV9OQU1FKSxcbiAgICB9LFxuICAgIG1lc3NhZ2VzOiB7XG4gICAgICBub1Jhd0NvbG9yczogYFtDYW5vbiAke3BhdHRlcm4/LmlkIHx8ICcwMDknfV0gQXZvaWQgcmF3IFRhaWx3aW5kIGNvbG9yIFwie3tjbGFzc319XCIuIFVzZSBhIHNlbWFudGljIHRva2VuIGluc3RlYWQuYCxcbiAgICB9LFxuICAgIHNjaGVtYTogW1xuICAgICAge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIGFsbG93ZWRDbGFzc2VzOiB7XG4gICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgICAgaXRlbXM6IHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBhZGRpdGlvbmFsUHJvcGVydGllczogZmFsc2UsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG5cbiAgY3JlYXRlKGNvbnRleHQpIHtcbiAgICBjb25zdCBvcHRpb25zID0gY29udGV4dC5vcHRpb25zWzBdIHx8IHt9XG4gICAgY29uc3QgYWxsb3dlZENsYXNzZXM6IHN0cmluZ1tdID0gb3B0aW9ucy5hbGxvd2VkQ2xhc3NlcyB8fCBbXVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIEpTWEF0dHJpYnV0ZShub2RlOiBhbnkpIHtcbiAgICAgICAgLy8gT25seSBjaGVjayBjbGFzc05hbWUgYXR0cmlidXRlc1xuICAgICAgICBpZiAobm9kZS5uYW1lPy5uYW1lICE9PSAnY2xhc3NOYW1lJykge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRXh0cmFjdCBjbGFzc05hbWUgdmFsdWVcbiAgICAgICAgbGV0IGNsYXNzVmFsdWUgPSAnJ1xuXG4gICAgICAgIGlmIChub2RlLnZhbHVlPy50eXBlID09PSAnTGl0ZXJhbCcgJiYgdHlwZW9mIG5vZGUudmFsdWUudmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgY2xhc3NWYWx1ZSA9IG5vZGUudmFsdWUudmFsdWVcbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICBub2RlLnZhbHVlPy50eXBlID09PSAnSlNYRXhwcmVzc2lvbkNvbnRhaW5lcicgJiZcbiAgICAgICAgICBub2RlLnZhbHVlLmV4cHJlc3Npb24/LnR5cGUgPT09ICdMaXRlcmFsJyAmJlxuICAgICAgICAgIHR5cGVvZiBub2RlLnZhbHVlLmV4cHJlc3Npb24udmFsdWUgPT09ICdzdHJpbmcnXG4gICAgICAgICkge1xuICAgICAgICAgIGNsYXNzVmFsdWUgPSBub2RlLnZhbHVlLmV4cHJlc3Npb24udmFsdWVcbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICBub2RlLnZhbHVlPy50eXBlID09PSAnSlNYRXhwcmVzc2lvbkNvbnRhaW5lcicgJiZcbiAgICAgICAgICBub2RlLnZhbHVlLmV4cHJlc3Npb24/LnR5cGUgPT09ICdUZW1wbGF0ZUxpdGVyYWwnXG4gICAgICAgICkge1xuICAgICAgICAgIGNsYXNzVmFsdWUgPSBub2RlLnZhbHVlLmV4cHJlc3Npb24ucXVhc2lzXG4gICAgICAgICAgICAubWFwKChxdWFzaTogYW55KSA9PiBxdWFzaS52YWx1ZS5yYXcpXG4gICAgICAgICAgICAuam9pbignICcpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWNsYXNzVmFsdWUpIHJldHVyblxuXG4gICAgICAgIGNvbnN0IG1hdGNoZXMgPSBmaW5kUmF3Q29sb3JDbGFzc2VzKGNsYXNzVmFsdWUsIERFRkFVTFRfRk9SQklEREVOX0ZBTUlMSUVTLCBhbGxvd2VkQ2xhc3NlcylcbiAgICAgICAgZm9yIChjb25zdCBjbHMgb2YgbWF0Y2hlcykge1xuICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICBtZXNzYWdlSWQ6ICdub1Jhd0NvbG9ycycsXG4gICAgICAgICAgICBkYXRhOiB7IGNsYXNzOiBjbHMgfSxcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9LFxuICAgIH1cbiAgfSxcbn1cblxuZXhwb3J0IGRlZmF1bHQgcnVsZVxuIl19