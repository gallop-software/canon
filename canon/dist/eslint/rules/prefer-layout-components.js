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
            useLayoutComponent: `[Canon ${pattern?.id || '018'}] Use the Grid or Columns component instead of <div className="grid ...">. Import: import { Grid, Columns, Column } from "@/components"`,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZmVyLWxheW91dC1jb21wb25lbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2VzbGludC9ydWxlcy9wcmVmZXItbGF5b3V0LWNvbXBvbmVudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLFdBQVcsRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQTtBQUVoRSxNQUFNLFNBQVMsR0FBRywwQkFBMEIsQ0FBQTtBQUM1QyxNQUFNLE9BQU8sR0FBRyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUE7QUFFMUMsTUFBTSxJQUFJLEdBQW9CO0lBQzVCLElBQUksRUFBRTtRQUNKLElBQUksRUFBRSxZQUFZO1FBQ2xCLElBQUksRUFBRTtZQUNKLFdBQVcsRUFBRSxPQUFPLEVBQUUsT0FBTyxJQUFJLHlDQUF5QztZQUMxRSxXQUFXLEVBQUUsSUFBSTtZQUNqQixHQUFHLEVBQUUsV0FBVyxDQUFDLFNBQVMsQ0FBQztTQUM1QjtRQUNELFFBQVEsRUFBRTtZQUNSLGtCQUFrQixFQUFFLFVBQVUsT0FBTyxFQUFFLEVBQUUsSUFBSSxLQUFLLHlJQUF5STtTQUM1TDtRQUNELE1BQU0sRUFBRSxFQUFFO0tBQ1g7SUFFRCxNQUFNLENBQUMsT0FBTztRQUNaLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFBO1FBRTFELDRCQUE0QjtRQUM1QixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDO1lBQ25DLE9BQU8sRUFBRSxDQUFBO1FBQ1gsQ0FBQztRQUVELE9BQU87WUFDTCxpQkFBaUIsQ0FBQyxJQUFTO2dCQUN6QixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQTtnQkFFbkMsMEJBQTBCO2dCQUMxQixJQUFJLFdBQVcsS0FBSyxLQUFLLEVBQUUsQ0FBQztvQkFDMUIsT0FBTTtnQkFDUixDQUFDO2dCQUVELHFDQUFxQztnQkFDckMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQ3pDLENBQUMsSUFBUyxFQUFFLEVBQUUsQ0FDWixJQUFJLENBQUMsSUFBSSxLQUFLLGNBQWM7b0JBQzVCLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxLQUFLLFdBQVcsQ0FDbEMsQ0FBQTtnQkFFRCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7b0JBQ25CLE9BQU07Z0JBQ1IsQ0FBQztnQkFFRCxrQ0FBa0M7Z0JBQ2xDLElBQUksYUFBYSxDQUFDLEtBQUssRUFBRSxJQUFJLEtBQUssU0FBUyxFQUFFLENBQUM7b0JBQzVDLE1BQU0sVUFBVSxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFBO29CQUM1QyxJQUFJLE9BQU8sVUFBVSxLQUFLLFFBQVEsSUFBSSxZQUFZLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQzt3QkFDL0QsT0FBTyxDQUFDLE1BQU0sQ0FBQzs0QkFDYixJQUFJOzRCQUNKLFNBQVMsRUFBRSxvQkFBb0I7eUJBQ2hDLENBQUMsQ0FBQTtvQkFDSixDQUFDO29CQUNELE9BQU07Z0JBQ1IsQ0FBQztnQkFFRCxvQ0FBb0M7Z0JBQ3BDLElBQUksYUFBYSxDQUFDLEtBQUssRUFBRSxJQUFJLEtBQUssd0JBQXdCLEVBQUUsQ0FBQztvQkFDM0QsTUFBTSxJQUFJLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUE7b0JBRTNDLGtEQUFrRDtvQkFDbEQsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLGlCQUFpQixFQUFFLENBQUM7d0JBQ3BDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFBO3dCQUNoQyxLQUFLLE1BQU0sS0FBSyxJQUFJLE1BQU0sRUFBRSxDQUFDOzRCQUMzQixJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxJQUFJLFlBQVksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0NBQ3RELE9BQU8sQ0FBQyxNQUFNLENBQUM7b0NBQ2IsSUFBSTtvQ0FDSixTQUFTLEVBQUUsb0JBQW9CO2lDQUNoQyxDQUFDLENBQUE7Z0NBQ0YsT0FBTTs0QkFDUixDQUFDO3dCQUNILENBQUM7b0JBQ0gsQ0FBQztvQkFFRCwyQ0FBMkM7b0JBQzNDLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxnQkFBZ0IsRUFBRSxDQUFDO3dCQUNuQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxJQUFJLEVBQUUsQ0FBQTt3QkFDakMsS0FBSyxNQUFNLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQzs0QkFDdkIsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLFNBQVMsSUFBSSxPQUFPLEdBQUcsQ0FBQyxLQUFLLEtBQUssUUFBUSxFQUFFLENBQUM7Z0NBQzVELElBQUksWUFBWSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO29DQUM1QixPQUFPLENBQUMsTUFBTSxDQUFDO3dDQUNiLElBQUk7d0NBQ0osU0FBUyxFQUFFLG9CQUFvQjtxQ0FDaEMsQ0FBQyxDQUFBO29DQUNGLE9BQU07Z0NBQ1IsQ0FBQzs0QkFDSCxDQUFDOzRCQUNELHVDQUF1Qzs0QkFDdkMsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLGlCQUFpQixFQUFFLENBQUM7Z0NBQ25DLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFBO2dDQUMvQixLQUFLLE1BQU0sS0FBSyxJQUFJLE1BQU0sRUFBRSxDQUFDO29DQUMzQixJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxJQUFJLFlBQVksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7d0NBQ3RELE9BQU8sQ0FBQyxNQUFNLENBQUM7NENBQ2IsSUFBSTs0Q0FDSixTQUFTLEVBQUUsb0JBQW9CO3lDQUNoQyxDQUFDLENBQUE7d0NBQ0YsT0FBTTtvQ0FDUixDQUFDO2dDQUNILENBQUM7NEJBQ0gsQ0FBQzt3QkFDSCxDQUFDO29CQUNILENBQUM7Z0JBQ0gsQ0FBQztZQUNILENBQUM7U0FDRixDQUFBO0lBQ0gsQ0FBQztDQUNGLENBQUE7QUFFRDs7OztHQUlHO0FBQ0gsU0FBUyxZQUFZLENBQUMsV0FBbUI7SUFDdkMsMkNBQTJDO0lBQzNDLE1BQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7SUFFeEMsS0FBSyxNQUFNLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUMxQixvREFBb0Q7UUFDcEQsSUFBSSxHQUFHLEtBQUssTUFBTSxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQztZQUNuRCxPQUFPLElBQUksQ0FBQTtRQUNiLENBQUM7SUFDSCxDQUFDO0lBRUQsT0FBTyxLQUFLLENBQUE7QUFDZCxDQUFDO0FBRUQsZUFBZSxJQUFJLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFJ1bGUgfSBmcm9tICdlc2xpbnQnXG5pbXBvcnQgeyBnZXRDYW5vblVybCwgZ2V0Q2Fub25QYXR0ZXJuIH0gZnJvbSAnLi4vdXRpbHMvY2Fub24uanMnXG5cbmNvbnN0IFJVTEVfTkFNRSA9ICdwcmVmZXItbGF5b3V0LWNvbXBvbmVudHMnXG5jb25zdCBwYXR0ZXJuID0gZ2V0Q2Fub25QYXR0ZXJuKFJVTEVfTkFNRSlcblxuY29uc3QgcnVsZTogUnVsZS5SdWxlTW9kdWxlID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiBwYXR0ZXJuPy5zdW1tYXJ5IHx8ICdVc2UgR3JpZC9Db2x1bW5zLCBub3QgcmF3IGRpdiB3aXRoIGdyaWQnLFxuICAgICAgcmVjb21tZW5kZWQ6IHRydWUsXG4gICAgICB1cmw6IGdldENhbm9uVXJsKFJVTEVfTkFNRSksXG4gICAgfSxcbiAgICBtZXNzYWdlczoge1xuICAgICAgdXNlTGF5b3V0Q29tcG9uZW50OiBgW0Nhbm9uICR7cGF0dGVybj8uaWQgfHwgJzAxOCd9XSBVc2UgdGhlIEdyaWQgb3IgQ29sdW1ucyBjb21wb25lbnQgaW5zdGVhZCBvZiA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgLi4uXCI+LiBJbXBvcnQ6IGltcG9ydCB7IEdyaWQsIENvbHVtbnMsIENvbHVtbiB9IGZyb20gXCJAL2NvbXBvbmVudHNcImAsXG4gICAgfSxcbiAgICBzY2hlbWE6IFtdLFxuICB9LFxuXG4gIGNyZWF0ZShjb250ZXh0KSB7XG4gICAgY29uc3QgZmlsZW5hbWUgPSBjb250ZXh0LmZpbGVuYW1lIHx8IGNvbnRleHQuZ2V0RmlsZW5hbWUoKVxuXG4gICAgLy8gT25seSBhcHBseSB0byBibG9jayBmaWxlc1xuICAgIGlmICghZmlsZW5hbWUuaW5jbHVkZXMoJy9ibG9ja3MvJykpIHtcbiAgICAgIHJldHVybiB7fVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBKU1hPcGVuaW5nRWxlbWVudChub2RlOiBhbnkpIHtcbiAgICAgICAgY29uc3QgZWxlbWVudE5hbWUgPSBub2RlLm5hbWU/Lm5hbWVcblxuICAgICAgICAvLyBPbmx5IGNoZWNrIGRpdiBlbGVtZW50c1xuICAgICAgICBpZiAoZWxlbWVudE5hbWUgIT09ICdkaXYnKSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayBpZiBjbGFzc05hbWUgY29udGFpbnMgJ2dyaWQnXG4gICAgICAgIGNvbnN0IGNsYXNzTmFtZUF0dHIgPSBub2RlLmF0dHJpYnV0ZXM/LmZpbmQoXG4gICAgICAgICAgKGF0dHI6IGFueSkgPT5cbiAgICAgICAgICAgIGF0dHIudHlwZSA9PT0gJ0pTWEF0dHJpYnV0ZScgJiZcbiAgICAgICAgICAgIGF0dHIubmFtZT8ubmFtZSA9PT0gJ2NsYXNzTmFtZSdcbiAgICAgICAgKVxuXG4gICAgICAgIGlmICghY2xhc3NOYW1lQXR0cikge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSGFuZGxlIHN0cmluZyBsaXRlcmFsIGNsYXNzTmFtZVxuICAgICAgICBpZiAoY2xhc3NOYW1lQXR0ci52YWx1ZT8udHlwZSA9PT0gJ0xpdGVyYWwnKSB7XG4gICAgICAgICAgY29uc3QgY2xhc3NWYWx1ZSA9IGNsYXNzTmFtZUF0dHIudmFsdWUudmFsdWVcbiAgICAgICAgICBpZiAodHlwZW9mIGNsYXNzVmFsdWUgPT09ICdzdHJpbmcnICYmIGhhc0dyaWRDbGFzcyhjbGFzc1ZhbHVlKSkge1xuICAgICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgICBtZXNzYWdlSWQ6ICd1c2VMYXlvdXRDb21wb25lbnQnLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICAvLyBIYW5kbGUgdGVtcGxhdGUgbGl0ZXJhbCBjbGFzc05hbWVcbiAgICAgICAgaWYgKGNsYXNzTmFtZUF0dHIudmFsdWU/LnR5cGUgPT09ICdKU1hFeHByZXNzaW9uQ29udGFpbmVyJykge1xuICAgICAgICAgIGNvbnN0IGV4cHIgPSBjbGFzc05hbWVBdHRyLnZhbHVlLmV4cHJlc3Npb25cblxuICAgICAgICAgIC8vIERpcmVjdCB0ZW1wbGF0ZSBsaXRlcmFsOiBjbGFzc05hbWU9e2BncmlkIC4uLmB9XG4gICAgICAgICAgaWYgKGV4cHIudHlwZSA9PT0gJ1RlbXBsYXRlTGl0ZXJhbCcpIHtcbiAgICAgICAgICAgIGNvbnN0IHF1YXNpcyA9IGV4cHIucXVhc2lzIHx8IFtdXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHF1YXNpIG9mIHF1YXNpcykge1xuICAgICAgICAgICAgICBpZiAocXVhc2kudmFsdWU/LnJhdyAmJiBoYXNHcmlkQ2xhc3MocXVhc2kudmFsdWUucmF3KSkge1xuICAgICAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlSWQ6ICd1c2VMYXlvdXRDb21wb25lbnQnLFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBjbHN4IGNhbGw6IGNsYXNzTmFtZT17Y2xzeCgnZ3JpZCcsIC4uLil9XG4gICAgICAgICAgaWYgKGV4cHIudHlwZSA9PT0gJ0NhbGxFeHByZXNzaW9uJykge1xuICAgICAgICAgICAgY29uc3QgYXJncyA9IGV4cHIuYXJndW1lbnRzIHx8IFtdXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGFyZyBvZiBhcmdzKSB7XG4gICAgICAgICAgICAgIGlmIChhcmcudHlwZSA9PT0gJ0xpdGVyYWwnICYmIHR5cGVvZiBhcmcudmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgaWYgKGhhc0dyaWRDbGFzcyhhcmcudmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VJZDogJ3VzZUxheW91dENvbXBvbmVudCcsXG4gICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vIENoZWNrIHRlbXBsYXRlIGxpdGVyYWxzIGluIGNsc3ggYXJnc1xuICAgICAgICAgICAgICBpZiAoYXJnLnR5cGUgPT09ICdUZW1wbGF0ZUxpdGVyYWwnKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcXVhc2lzID0gYXJnLnF1YXNpcyB8fCBbXVxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcXVhc2kgb2YgcXVhc2lzKSB7XG4gICAgICAgICAgICAgICAgICBpZiAocXVhc2kudmFsdWU/LnJhdyAmJiBoYXNHcmlkQ2xhc3MocXVhc2kudmFsdWUucmF3KSkge1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlSWQ6ICd1c2VMYXlvdXRDb21wb25lbnQnLFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfVxuICB9LFxufVxuXG4vKipcbiAqIENoZWNrIGlmIGEgY2xhc3NOYW1lIHN0cmluZyBjb250YWlucyBncmlkIGNsYXNzZXNcbiAqIE1hdGNoZXM6ICdncmlkJywgJ2dyaWQtY29scy0nLCBldGMuXG4gKiBEb2VzIE5PVCBtYXRjaDogJ2dyaWQtYXJlYScsIGNvbXBvbmVudCBuYW1lcyB3aXRoICdncmlkJyBpbiB0aGVtXG4gKi9cbmZ1bmN0aW9uIGhhc0dyaWRDbGFzcyhjbGFzc1N0cmluZzogc3RyaW5nKTogYm9vbGVhbiB7XG4gIC8vIFNwbGl0IGJ5IHdoaXRlc3BhY2UgYW5kIGNoZWNrIGVhY2ggY2xhc3NcbiAgY29uc3QgY2xhc3NlcyA9IGNsYXNzU3RyaW5nLnNwbGl0KC9cXHMrLylcbiAgXG4gIGZvciAoY29uc3QgY2xzIG9mIGNsYXNzZXMpIHtcbiAgICAvLyBNYXRjaCBzdGFuZGFsb25lICdncmlkJyBvciAnZ3JpZC1jb2xzLSonIHBhdHRlcm5zXG4gICAgaWYgKGNscyA9PT0gJ2dyaWQnIHx8IGNscy5zdGFydHNXaXRoKCdncmlkLWNvbHMtJykpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG4gIFxuICByZXR1cm4gZmFsc2Vcbn1cblxuZXhwb3J0IGRlZmF1bHQgcnVsZVxuIl19