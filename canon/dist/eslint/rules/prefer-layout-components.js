import { getCanonUrl, getCanonPattern } from '../utils/canon.js';
const RULE_NAME = 'prefer-layout-components';
const pattern = getCanonPattern(RULE_NAME);
const rule = {
    meta: {
        type: 'suggestion',
        docs: {
            description: pattern?.summary || 'Use Grid/Columns, not raw div with grid',
            recommended: true,
            url: getCanonUrl(RULE_NAME),
        },
        messages: {
            useLayoutComponent: `[Canon ${pattern?.id || '018'}] Use the Grid or Columns component instead of <div className="grid ...">. Import: import { Columns, Column } from "@/components/columns"`,
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
                // Only check div elements
                if (elementName !== 'div') {
                    return;
                }
                // Check if className contains 'grid'
                const classNameAttr = node.attributes?.find((attr) => attr.type === 'JSXAttribute' &&
                    attr.name?.name === 'className');
                if (!classNameAttr) {
                    return;
                }
                // Handle string literal className
                if (classNameAttr.value?.type === 'Literal') {
                    const classValue = classNameAttr.value.value;
                    if (typeof classValue === 'string' && hasGridClass(classValue)) {
                        context.report({
                            node,
                            messageId: 'useLayoutComponent',
                        });
                    }
                    return;
                }
                // Handle template literal className
                if (classNameAttr.value?.type === 'JSXExpressionContainer') {
                    const expr = classNameAttr.value.expression;
                    // Direct template literal: className={`grid ...`}
                    if (expr.type === 'TemplateLiteral') {
                        const quasis = expr.quasis || [];
                        for (const quasi of quasis) {
                            if (quasi.value?.raw && hasGridClass(quasi.value.raw)) {
                                context.report({
                                    node,
                                    messageId: 'useLayoutComponent',
                                });
                                return;
                            }
                        }
                    }
                    // clsx call: className={clsx('grid', ...)}
                    if (expr.type === 'CallExpression') {
                        const args = expr.arguments || [];
                        for (const arg of args) {
                            if (arg.type === 'Literal' && typeof arg.value === 'string') {
                                if (hasGridClass(arg.value)) {
                                    context.report({
                                        node,
                                        messageId: 'useLayoutComponent',
                                    });
                                    return;
                                }
                            }
                            // Check template literals in clsx args
                            if (arg.type === 'TemplateLiteral') {
                                const quasis = arg.quasis || [];
                                for (const quasi of quasis) {
                                    if (quasi.value?.raw && hasGridClass(quasi.value.raw)) {
                                        context.report({
                                            node,
                                            messageId: 'useLayoutComponent',
                                        });
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }
            },
        };
    },
};
/**
 * Check if a className string contains grid classes
 * Matches: 'grid', 'grid-cols-', etc.
 * Does NOT match: 'grid-area', component names with 'grid' in them
 */
function hasGridClass(classString) {
    // Split by whitespace and check each class
    const classes = classString.split(/\s+/);
    for (const cls of classes) {
        // Match standalone 'grid' or 'grid-cols-*' patterns
        if (cls === 'grid' || cls.startsWith('grid-cols-')) {
            return true;
        }
    }
    return false;
}
export default rule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZmVyLWxheW91dC1jb21wb25lbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2VzbGludC9ydWxlcy9wcmVmZXItbGF5b3V0LWNvbXBvbmVudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLFdBQVcsRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQTtBQUVoRSxNQUFNLFNBQVMsR0FBRywwQkFBMEIsQ0FBQTtBQUM1QyxNQUFNLE9BQU8sR0FBRyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUE7QUFFMUMsTUFBTSxJQUFJLEdBQW9CO0lBQzVCLElBQUksRUFBRTtRQUNKLElBQUksRUFBRSxZQUFZO1FBQ2xCLElBQUksRUFBRTtZQUNKLFdBQVcsRUFBRSxPQUFPLEVBQUUsT0FBTyxJQUFJLHlDQUF5QztZQUMxRSxXQUFXLEVBQUUsSUFBSTtZQUNqQixHQUFHLEVBQUUsV0FBVyxDQUFDLFNBQVMsQ0FBQztTQUM1QjtRQUNELFFBQVEsRUFBRTtZQUNSLGtCQUFrQixFQUFFLFVBQVUsT0FBTyxFQUFFLEVBQUUsSUFBSSxLQUFLLDJJQUEySTtTQUM5TDtRQUNELE1BQU0sRUFBRSxFQUFFO0tBQ1g7SUFFRCxNQUFNLENBQUMsT0FBTztRQUNaLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFBO1FBRTFELDRCQUE0QjtRQUM1QixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDO1lBQ25DLE9BQU8sRUFBRSxDQUFBO1FBQ1gsQ0FBQztRQUVELE9BQU87WUFDTCxpQkFBaUIsQ0FBQyxJQUFTO2dCQUN6QixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQTtnQkFFbkMsMEJBQTBCO2dCQUMxQixJQUFJLFdBQVcsS0FBSyxLQUFLLEVBQUUsQ0FBQztvQkFDMUIsT0FBTTtn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QkFDSCxDQUFDO29CQUNILENBQUM7Z0JBQ0gsQ0FBQztZQUNILENBQUM7U0FDRixDQUFBO0lBQ0gsQ0FBQztDQUNGLENBQUE7QUFFRDs7OztHQUlHO0FBQ0gsU0FBUyxZQUFZLENBQUMsV0FBbUI7SUFDdkMsMkNBQTJDO0lBQzNDLE1BQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7SUFFeEMsS0FBSyxNQUFNLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUMxQixvREFBb0Q7UUFDcEQsSUFBSSxHQUFHLEtBQUssTUFBTSxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQztZQUNuRCxPQUFPLElBQUksQ0FBQTtRQUNiLENBQUM7SUFDSCxDQUFDO0lBRUQsT0FBTyxLQUFLLENBQUE7QUFDZCxDQUFDO0FBRUQsZUFBZSxJQUFJLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFJ1bGUgfSBmcm9tICdlc2xpbnQnXG5pbXBvcnQgeyBnZXRDYW5vblVybCwgZ2V0Q2Fub25QYXR0ZXJuIH0gZnJvbSAnLi4vdXRpbHMvY2Fub24uanMnXG5cbmNvbnN0IFJVTEVfTkFNRSA9ICdwcmVmZXItbGF5b3V0LWNvbXBvbmVudHMnXG5jb25zdCBwYXR0ZXJuID0gZ2V0Q2Fub25QYXR0ZXJuKFJVTEVfTkFNRSlcblxuY29uc3QgcnVsZTogUnVsZS5SdWxlTW9kdWxlID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiBwYXR0ZXJuPy5zdW1tYXJ5IHx8ICdVc2UgR3JpZC9Db2x1bW5zLCBub3QgcmF3IGRpdiB3aXRoIGdyaWQnLFxuICAgICAgcmVjb21tZW5kZWQ6IHRydWUsXG4gICAgICB1cmw6IGdldENhbm9uVXJsKFJVTEVfTkFNRSksXG4gICAgfSxcbiAgICBtZXNzYWdlczoge1xuICAgICAgdXNlTGF5b3V0Q29tcG9uZW50OiBgW0Nhbm9uICR7cGF0dGVybj8uaWQgfHwgJzAxOCd9XSBVc2UgdGhlIEdyaWQgb3IgQ29sdW1ucyBjb21wb25lbnQgaW5zdGVhZCBvZiA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgLi4uXCI+LiBJbXBvcnQ6IGltcG9ydCB7IENvbHVtbnMsIENvbHVtbiB9IGZyb20gXCJAL2NvbXBvbmVudHMvY29sdW1uc1wiYCxcbiAgICB9LFxuICAgIHNjaGVtYTogW10sXG4gIH0sXG5cbiAgY3JlYXRlKGNvbnRleHQpIHtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGNvbnRleHQuZmlsZW5hbWUgfHwgY29udGV4dC5nZXRGaWxlbmFtZSgpXG5cbiAgICAvLyBPbmx5IGFwcGx5IHRvIGJsb2NrIGZpbGVzXG4gICAgaWYgKCFmaWxlbmFtZS5pbmNsdWRlcygnL2Jsb2Nrcy8nKSkge1xuICAgICAgcmV0dXJuIHt9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIEpTWE9wZW5pbmdFbGVtZW50KG5vZGU6IGFueSkge1xuICAgICAgICBjb25zdCBlbGVtZW50TmFtZSA9IG5vZGUubmFtZT8ubmFtZVxuXG4gICAgICAgIC8vIE9ubHkgY2hlY2sgZGl2IGVsZW1lbnRzXG4gICAgICAgIGlmIChlbGVtZW50TmFtZSAhPT0gJ2RpdicpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENoZWNrIGlmIGNsYXNzTmFtZSBjb250YWlucyAnZ3JpZCdcbiAgICAgICAgY29uc3QgY2xhc3NOYW1lQXR0ciA9IG5vZGUuYXR0cmlidXRlcz8uZmluZChcbiAgICAgICAgICAoYXR0cjogYW55KSA9PlxuICAgICAgICAgICAgYXR0ci50eXBlID09PSAnSlNYQXR0cmlidXRlJyAmJlxuICAgICAgICAgICAgYXR0ci5uYW1lPy5uYW1lID09PSAnY2xhc3NOYW1lJ1xuICAgICAgICApXG5cbiAgICAgICAgaWYgKCFjbGFzc05hbWVBdHRyKSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICAvLyBIYW5kbGUgc3RyaW5nIGxpdGVyYWwgY2xhc3NOYW1lXG4gICAgICAgIGlmIChjbGFzc05hbWVBdHRyLnZhbHVlPy50eXBlID09PSAnTGl0ZXJhbCcpIHtcbiAgICAgICAgICBjb25zdCBjbGFzc1ZhbHVlID0gY2xhc3NOYW1lQXR0ci52YWx1ZS52YWx1ZVxuICAgICAgICAgIGlmICh0eXBlb2YgY2xhc3NWYWx1ZSA9PT0gJ3N0cmluZycgJiYgaGFzR3JpZENsYXNzKGNsYXNzVmFsdWUpKSB7XG4gICAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICAgIG1lc3NhZ2VJZDogJ3VzZUxheW91dENvbXBvbmVudCcsXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEhhbmRsZSB0ZW1wbGF0ZSBsaXRlcmFsIGNsYXNzTmFtZVxuICAgICAgICBpZiAoY2xhc3NOYW1lQXR0ci52YWx1ZT8udHlwZSA9PT0gJ0pTWEV4cHJlc3Npb25Db250YWluZXInKSB7XG4gICAgICAgICAgY29uc3QgZXhwciA9IGNsYXNzTmFtZUF0dHIudmFsdWUuZXhwcmVzc2lvblxuXG4gICAgICAgICAgLy8gRGlyZWN0IHRlbXBsYXRlIGxpdGVyYWw6IGNsYXNzTmFtZT17YGdyaWQgLi4uYH1cbiAgICAgICAgICBpZiAoZXhwci50eXBlID09PSAnVGVtcGxhdGVMaXRlcmFsJykge1xuICAgICAgICAgICAgY29uc3QgcXVhc2lzID0gZXhwci5xdWFzaXMgfHwgW11cbiAgICAgICAgICAgIGZvciAoY29uc3QgcXVhc2kgb2YgcXVhc2lzKSB7XG4gICAgICAgICAgICAgIGlmIChxdWFzaS52YWx1ZT8ucmF3ICYmIGhhc0dyaWRDbGFzcyhxdWFzaS52YWx1ZS5yYXcpKSB7XG4gICAgICAgICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2VJZDogJ3VzZUxheW91dENvbXBvbmVudCcsXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGNsc3ggY2FsbDogY2xhc3NOYW1lPXtjbHN4KCdncmlkJywgLi4uKX1cbiAgICAgICAgICBpZiAoZXhwci50eXBlID09PSAnQ2FsbEV4cHJlc3Npb24nKSB7XG4gICAgICAgICAgICBjb25zdCBhcmdzID0gZXhwci5hcmd1bWVudHMgfHwgW11cbiAgICAgICAgICAgIGZvciAoY29uc3QgYXJnIG9mIGFyZ3MpIHtcbiAgICAgICAgICAgICAgaWYgKGFyZy50eXBlID09PSAnTGl0ZXJhbCcgJiYgdHlwZW9mIGFyZy52YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBpZiAoaGFzR3JpZENsYXNzKGFyZy52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZUlkOiAndXNlTGF5b3V0Q29tcG9uZW50JyxcbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLy8gQ2hlY2sgdGVtcGxhdGUgbGl0ZXJhbHMgaW4gY2xzeCBhcmdzXG4gICAgICAgICAgICAgIGlmIChhcmcudHlwZSA9PT0gJ1RlbXBsYXRlTGl0ZXJhbCcpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBxdWFzaXMgPSBhcmcucXVhc2lzIHx8IFtdXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBxdWFzaSBvZiBxdWFzaXMpIHtcbiAgICAgICAgICAgICAgICAgIGlmIChxdWFzaS52YWx1ZT8ucmF3ICYmIGhhc0dyaWRDbGFzcyhxdWFzaS52YWx1ZS5yYXcpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VJZDogJ3VzZUxheW91dENvbXBvbmVudCcsXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9XG4gIH0sXG59XG5cbi8qKlxuICogQ2hlY2sgaWYgYSBjbGFzc05hbWUgc3RyaW5nIGNvbnRhaW5zIGdyaWQgY2xhc3Nlc1xuICogTWF0Y2hlczogJ2dyaWQnLCAnZ3JpZC1jb2xzLScsIGV0Yy5cbiAqIERvZXMgTk9UIG1hdGNoOiAnZ3JpZC1hcmVhJywgY29tcG9uZW50IG5hbWVzIHdpdGggJ2dyaWQnIGluIHRoZW1cbiAqL1xuZnVuY3Rpb24gaGFzR3JpZENsYXNzKGNsYXNzU3RyaW5nOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgLy8gU3BsaXQgYnkgd2hpdGVzcGFjZSBhbmQgY2hlY2sgZWFjaCBjbGFzc1xuICBjb25zdCBjbGFzc2VzID0gY2xhc3NTdHJpbmcuc3BsaXQoL1xccysvKVxuICBcbiAgZm9yIChjb25zdCBjbHMgb2YgY2xhc3Nlcykge1xuICAgIC8vIE1hdGNoIHN0YW5kYWxvbmUgJ2dyaWQnIG9yICdncmlkLWNvbHMtKicgcGF0dGVybnNcbiAgICBpZiAoY2xzID09PSAnZ3JpZCcgfHwgY2xzLnN0YXJ0c1dpdGgoJ2dyaWQtY29scy0nKSkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cbiAgXG4gIHJldHVybiBmYWxzZVxufVxuXG5leHBvcnQgZGVmYXVsdCBydWxlXG4iXX0=