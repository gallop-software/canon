import { getCanonUrl, getCanonPattern } from '../utils/canon.js';
const RULE_NAME = 'no-native-date';
const pattern = getCanonPattern(RULE_NAME);
const rule = {
    meta: {
        type: 'suggestion',
        docs: {
            description: pattern?.summary || 'Use Luxon DateTime, not native JavaScript Date',
            recommended: true,
            url: getCanonUrl(RULE_NAME),
        },
        messages: {
            noNewDate: `[Canon ${pattern?.id || '027'}] Use Luxon's DateTime instead of new Date(). Native Date operates in the user's local timezone, causing inconsistencies. Import: import { DateTime } from 'luxon'`,
            noDateNow: `[Canon ${pattern?.id || '027'}] Use Luxon's DateTime.now() instead of Date.now(). Import: import { DateTime } from 'luxon'`,
            noDateParse: `[Canon ${pattern?.id || '027'}] Use Luxon's DateTime.fromISO() or DateTime.fromFormat() instead of Date.parse(). Import: import { DateTime } from 'luxon'`,
        },
        schema: [],
    },
    create(context) {
        const filename = context.filename || context.getFilename();
        // Only check files in src/ (blocks, components, hooks, etc.)
        if (!filename.includes('/src/')) {
            return {};
        }
        // Skip _scripts and _data folders
        if (filename.includes('/_scripts/') || filename.includes('/_data/')) {
            return {};
        }
        return {
            // Catch: new Date()
            NewExpression(node) {
                if (node.callee?.name === 'Date') {
                    context.report({
                        node,
                        messageId: 'noNewDate',
                    });
                }
            },
            // Catch: Date.now() and Date.parse()
            CallExpression(node) {
                if (node.callee?.type === 'MemberExpression' &&
                    node.callee?.object?.name === 'Date') {
                    const methodName = node.callee?.property?.name;
                    if (methodName === 'now') {
                        context.report({
                            node,
                            messageId: 'noDateNow',
                        });
                    }
                    else if (methodName === 'parse') {
                        context.report({
                            node,
                            messageId: 'noDateParse',
                        });
                    }
                }
            },
        };
    },
};
export default rule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm8tbmF0aXZlLWRhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZXNsaW50L3J1bGVzL25vLW5hdGl2ZS1kYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxXQUFXLEVBQUUsZUFBZSxFQUFFLE1BQU0sbUJBQW1CLENBQUE7QUFFaEUsTUFBTSxTQUFTLEdBQUcsZ0JBQWdCLENBQUE7QUFDbEMsTUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBRTFDLE1BQU0sSUFBSSxHQUFvQjtJQUM1QixJQUFJLEVBQUU7UUFDSixJQUFJLEVBQUUsWUFBWTtRQUNsQixJQUFJLEVBQUU7WUFDSixXQUFXLEVBQ1QsT0FBTyxFQUFFLE9BQU8sSUFBSSxnREFBZ0Q7WUFDdEUsV0FBVyxFQUFFLElBQUk7WUFDakIsR0FBRyxFQUFFLFdBQVcsQ0FBQyxTQUFTLENBQUM7U0FDNUI7UUFDRCxRQUFRLEVBQUU7WUFDUixTQUFTLEVBQUUsVUFBVSxPQUFPLEVBQUUsRUFBRSxJQUFJLEtBQUssb0tBQW9LO1lBQzdNLFNBQVMsRUFBRSxVQUFVLE9BQU8sRUFBRSxFQUFFLElBQUksS0FBSyw4RkFBOEY7WUFDdkksV0FBVyxFQUFFLFVBQVUsT0FBTyxFQUFFLEVBQUUsSUFBSSxLQUFLLDZIQUE2SDtTQUN6SztRQUNELE1BQU0sRUFBRSxFQUFFO0tBQ1g7SUFFRCxNQUFNLENBQUMsT0FBTztRQUNaLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFBO1FBRTFELDZEQUE2RDtRQUM3RCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1lBQ2hDLE9BQU8sRUFBRSxDQUFBO1FBQ1gsQ0FBQztRQUVELGtDQUFrQztRQUNsQyxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDO1lBQ3BFLE9BQU8sRUFBRSxDQUFBO1FBQ1gsQ0FBQztRQUVELE9BQU87WUFDTCxvQkFBb0I7WUFDcEIsYUFBYSxDQUFDLElBQVM7Z0JBQ3JCLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLEtBQUssTUFBTSxFQUFFLENBQUM7b0JBQ2pDLE9BQU8sQ0FBQyxNQUFNLENBQUM7d0JBQ2IsSUFBSTt3QkFDSixTQUFTLEVBQUUsV0FBVztxQkFDdkIsQ0FBQyxDQUFBO2dCQUNKLENBQUM7WUFDSCxDQUFDO1lBRUQscUNBQXFDO1lBQ3JDLGNBQWMsQ0FBQyxJQUFTO2dCQUN0QixJQUNFLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxLQUFLLGtCQUFrQjtvQkFDeEMsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxLQUFLLE1BQU0sRUFDcEMsQ0FBQztvQkFDRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUE7b0JBRTlDLElBQUksVUFBVSxLQUFLLEtBQUssRUFBRSxDQUFDO3dCQUN6QixPQUFPLENBQUMsTUFBTSxDQUFDOzRCQUNiLElBQUk7NEJBQ0osU0FBUyxFQUFFLFdBQVc7eUJBQ3ZCLENBQUMsQ0FBQTtvQkFDSixDQUFDO3lCQUFNLElBQUksVUFBVSxLQUFLLE9BQU8sRUFBRSxDQUFDO3dCQUNsQyxPQUFPLENBQUMsTUFBTSxDQUFDOzRCQUNiLElBQUk7NEJBQ0osU0FBUyxFQUFFLGFBQWE7eUJBQ3pCLENBQUMsQ0FBQTtvQkFDSixDQUFDO2dCQUNILENBQUM7WUFDSCxDQUFDO1NBQ0YsQ0FBQTtJQUNILENBQUM7Q0FDRixDQUFBO0FBRUQsZUFBZSxJQUFJLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFJ1bGUgfSBmcm9tICdlc2xpbnQnXG5pbXBvcnQgeyBnZXRDYW5vblVybCwgZ2V0Q2Fub25QYXR0ZXJuIH0gZnJvbSAnLi4vdXRpbHMvY2Fub24uanMnXG5cbmNvbnN0IFJVTEVfTkFNRSA9ICduby1uYXRpdmUtZGF0ZSdcbmNvbnN0IHBhdHRlcm4gPSBnZXRDYW5vblBhdHRlcm4oUlVMRV9OQU1FKVxuXG5jb25zdCBydWxlOiBSdWxlLlJ1bGVNb2R1bGUgPSB7XG4gIG1ldGE6IHtcbiAgICB0eXBlOiAnc3VnZ2VzdGlvbicsXG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgIHBhdHRlcm4/LnN1bW1hcnkgfHwgJ1VzZSBMdXhvbiBEYXRlVGltZSwgbm90IG5hdGl2ZSBKYXZhU2NyaXB0IERhdGUnLFxuICAgICAgcmVjb21tZW5kZWQ6IHRydWUsXG4gICAgICB1cmw6IGdldENhbm9uVXJsKFJVTEVfTkFNRSksXG4gICAgfSxcbiAgICBtZXNzYWdlczoge1xuICAgICAgbm9OZXdEYXRlOiBgW0Nhbm9uICR7cGF0dGVybj8uaWQgfHwgJzAyNyd9XSBVc2UgTHV4b24ncyBEYXRlVGltZSBpbnN0ZWFkIG9mIG5ldyBEYXRlKCkuIE5hdGl2ZSBEYXRlIG9wZXJhdGVzIGluIHRoZSB1c2VyJ3MgbG9jYWwgdGltZXpvbmUsIGNhdXNpbmcgaW5jb25zaXN0ZW5jaWVzLiBJbXBvcnQ6IGltcG9ydCB7IERhdGVUaW1lIH0gZnJvbSAnbHV4b24nYCxcbiAgICAgIG5vRGF0ZU5vdzogYFtDYW5vbiAke3BhdHRlcm4/LmlkIHx8ICcwMjcnfV0gVXNlIEx1eG9uJ3MgRGF0ZVRpbWUubm93KCkgaW5zdGVhZCBvZiBEYXRlLm5vdygpLiBJbXBvcnQ6IGltcG9ydCB7IERhdGVUaW1lIH0gZnJvbSAnbHV4b24nYCxcbiAgICAgIG5vRGF0ZVBhcnNlOiBgW0Nhbm9uICR7cGF0dGVybj8uaWQgfHwgJzAyNyd9XSBVc2UgTHV4b24ncyBEYXRlVGltZS5mcm9tSVNPKCkgb3IgRGF0ZVRpbWUuZnJvbUZvcm1hdCgpIGluc3RlYWQgb2YgRGF0ZS5wYXJzZSgpLiBJbXBvcnQ6IGltcG9ydCB7IERhdGVUaW1lIH0gZnJvbSAnbHV4b24nYCxcbiAgICB9LFxuICAgIHNjaGVtYTogW10sXG4gIH0sXG5cbiAgY3JlYXRlKGNvbnRleHQpIHtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGNvbnRleHQuZmlsZW5hbWUgfHwgY29udGV4dC5nZXRGaWxlbmFtZSgpXG5cbiAgICAvLyBPbmx5IGNoZWNrIGZpbGVzIGluIHNyYy8gKGJsb2NrcywgY29tcG9uZW50cywgaG9va3MsIGV0Yy4pXG4gICAgaWYgKCFmaWxlbmFtZS5pbmNsdWRlcygnL3NyYy8nKSkge1xuICAgICAgcmV0dXJuIHt9XG4gICAgfVxuXG4gICAgLy8gU2tpcCBfc2NyaXB0cyBhbmQgX2RhdGEgZm9sZGVyc1xuICAgIGlmIChmaWxlbmFtZS5pbmNsdWRlcygnL19zY3JpcHRzLycpIHx8IGZpbGVuYW1lLmluY2x1ZGVzKCcvX2RhdGEvJykpIHtcbiAgICAgIHJldHVybiB7fVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAvLyBDYXRjaDogbmV3IERhdGUoKVxuICAgICAgTmV3RXhwcmVzc2lvbihub2RlOiBhbnkpIHtcbiAgICAgICAgaWYgKG5vZGUuY2FsbGVlPy5uYW1lID09PSAnRGF0ZScpIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbWVzc2FnZUlkOiAnbm9OZXdEYXRlJyxcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvLyBDYXRjaDogRGF0ZS5ub3coKSBhbmQgRGF0ZS5wYXJzZSgpXG4gICAgICBDYWxsRXhwcmVzc2lvbihub2RlOiBhbnkpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIG5vZGUuY2FsbGVlPy50eXBlID09PSAnTWVtYmVyRXhwcmVzc2lvbicgJiZcbiAgICAgICAgICBub2RlLmNhbGxlZT8ub2JqZWN0Py5uYW1lID09PSAnRGF0ZSdcbiAgICAgICAgKSB7XG4gICAgICAgICAgY29uc3QgbWV0aG9kTmFtZSA9IG5vZGUuY2FsbGVlPy5wcm9wZXJ0eT8ubmFtZVxuXG4gICAgICAgICAgaWYgKG1ldGhvZE5hbWUgPT09ICdub3cnKSB7XG4gICAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICAgIG1lc3NhZ2VJZDogJ25vRGF0ZU5vdycsXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0gZWxzZSBpZiAobWV0aG9kTmFtZSA9PT0gJ3BhcnNlJykge1xuICAgICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgICBtZXNzYWdlSWQ6ICdub0RhdGVQYXJzZScsXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9XG4gIH0sXG59XG5cbmV4cG9ydCBkZWZhdWx0IHJ1bGVcbiJdfQ==