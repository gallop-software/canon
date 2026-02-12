import { getCanonUrl, getCanonPattern } from '../utils/canon.js';
const RULE_NAME = 'no-classnames-package';
const pattern = getCanonPattern(RULE_NAME);
const CLASSNAMES_SOURCES = ['classnames', 'classnames/bind', 'classnames/dedupe'];
const rule = {
    meta: {
        type: 'suggestion',
        docs: {
            description: pattern?.summary || 'Use clsx instead of classnames',
            recommended: true,
            url: getCanonUrl(RULE_NAME),
        },
        messages: {
            noClassnames: `[Canon ${pattern?.id || '014'}] Use "clsx" instead of "classnames". Import: import { clsx } from "clsx"`,
        },
        schema: [],
    },
    create(context) {
        return {
            ImportDeclaration(node) {
                const source = node.source?.value;
                if (typeof source === 'string' && CLASSNAMES_SOURCES.includes(source)) {
                    context.report({
                        node,
                        messageId: 'noClassnames',
                    });
                }
            },
            CallExpression(node) {
                // Check for require('classnames')
                if (node.callee?.name === 'require' &&
                    node.arguments?.length === 1 &&
                    node.arguments[0]?.type === 'Literal' &&
                    typeof node.arguments[0].value === 'string' &&
                    CLASSNAMES_SOURCES.includes(node.arguments[0].value)) {
                    context.report({
                        node,
                        messageId: 'noClassnames',
                    });
                }
            },
        };
    },
};
export default rule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm8tY2xhc3NuYW1lcy1wYWNrYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2VzbGludC9ydWxlcy9uby1jbGFzc25hbWVzLXBhY2thZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLFdBQVcsRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQTtBQUVoRSxNQUFNLFNBQVMsR0FBRyx1QkFBdUIsQ0FBQTtBQUN6QyxNQUFNLE9BQU8sR0FBRyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUE7QUFFMUMsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLFlBQVksRUFBRSxpQkFBaUIsRUFBRSxtQkFBbUIsQ0FBQyxDQUFBO0FBRWpGLE1BQU0sSUFBSSxHQUFvQjtJQUM1QixJQUFJLEVBQUU7UUFDSixJQUFJLEVBQUUsWUFBWTtRQUNsQixJQUFJLEVBQUU7WUFDSixXQUFXLEVBQUUsT0FBTyxFQUFFLE9BQU8sSUFBSSxnQ0FBZ0M7WUFDakUsV0FBVyxFQUFFLElBQUk7WUFDakIsR0FBRyxFQUFFLFdBQVcsQ0FBQyxTQUFTLENBQUM7U0FDNUI7UUFDRCxRQUFRLEVBQUU7WUFDUixZQUFZLEVBQUUsVUFBVSxPQUFPLEVBQUUsRUFBRSxJQUFJLEtBQUssMkVBQTJFO1NBQ3hIO1FBQ0QsTUFBTSxFQUFFLEVBQUU7S0FDWDtJQUVELE1BQU0sQ0FBQyxPQUFPO1FBQ1osT0FBTztZQUNMLGlCQUFpQixDQUFDLElBQVM7Z0JBQ3pCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFBO2dCQUNqQyxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsSUFBSSxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztvQkFDdEUsT0FBTyxDQUFDLE1BQU0sQ0FBQzt3QkFDYixJQUFJO3dCQUNKLFNBQVMsRUFBRSxjQUFjO3FCQUMxQixDQUFDLENBQUE7Z0JBQ0osQ0FBQztZQUNILENBQUM7WUFDRCxjQUFjLENBQUMsSUFBUztnQkFDdEIsa0NBQWtDO2dCQUNsQyxJQUNFLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxLQUFLLFNBQVM7b0JBQy9CLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxLQUFLLENBQUM7b0JBQzVCLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxLQUFLLFNBQVM7b0JBQ3JDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssUUFBUTtvQkFDM0Msa0JBQWtCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQ3BELENBQUM7b0JBQ0QsT0FBTyxDQUFDLE1BQU0sQ0FBQzt3QkFDYixJQUFJO3dCQUNKLFNBQVMsRUFBRSxjQUFjO3FCQUMxQixDQUFDLENBQUE7Z0JBQ0osQ0FBQztZQUNILENBQUM7U0FDRixDQUFBO0lBQ0gsQ0FBQztDQUNGLENBQUE7QUFFRCxlQUFlLElBQUksQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgUnVsZSB9IGZyb20gJ2VzbGludCdcbmltcG9ydCB7IGdldENhbm9uVXJsLCBnZXRDYW5vblBhdHRlcm4gfSBmcm9tICcuLi91dGlscy9jYW5vbi5qcydcblxuY29uc3QgUlVMRV9OQU1FID0gJ25vLWNsYXNzbmFtZXMtcGFja2FnZSdcbmNvbnN0IHBhdHRlcm4gPSBnZXRDYW5vblBhdHRlcm4oUlVMRV9OQU1FKVxuXG5jb25zdCBDTEFTU05BTUVTX1NPVVJDRVMgPSBbJ2NsYXNzbmFtZXMnLCAnY2xhc3NuYW1lcy9iaW5kJywgJ2NsYXNzbmFtZXMvZGVkdXBlJ11cblxuY29uc3QgcnVsZTogUnVsZS5SdWxlTW9kdWxlID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiBwYXR0ZXJuPy5zdW1tYXJ5IHx8ICdVc2UgY2xzeCBpbnN0ZWFkIG9mIGNsYXNzbmFtZXMnLFxuICAgICAgcmVjb21tZW5kZWQ6IHRydWUsXG4gICAgICB1cmw6IGdldENhbm9uVXJsKFJVTEVfTkFNRSksXG4gICAgfSxcbiAgICBtZXNzYWdlczoge1xuICAgICAgbm9DbGFzc25hbWVzOiBgW0Nhbm9uICR7cGF0dGVybj8uaWQgfHwgJzAxNCd9XSBVc2UgXCJjbHN4XCIgaW5zdGVhZCBvZiBcImNsYXNzbmFtZXNcIi4gSW1wb3J0OiBpbXBvcnQgeyBjbHN4IH0gZnJvbSBcImNsc3hcImAsXG4gICAgfSxcbiAgICBzY2hlbWE6IFtdLFxuICB9LFxuXG4gIGNyZWF0ZShjb250ZXh0KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIEltcG9ydERlY2xhcmF0aW9uKG5vZGU6IGFueSkge1xuICAgICAgICBjb25zdCBzb3VyY2UgPSBub2RlLnNvdXJjZT8udmFsdWVcbiAgICAgICAgaWYgKHR5cGVvZiBzb3VyY2UgPT09ICdzdHJpbmcnICYmIENMQVNTTkFNRVNfU09VUkNFUy5pbmNsdWRlcyhzb3VyY2UpKSB7XG4gICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIG1lc3NhZ2VJZDogJ25vQ2xhc3NuYW1lcycsXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIENhbGxFeHByZXNzaW9uKG5vZGU6IGFueSkge1xuICAgICAgICAvLyBDaGVjayBmb3IgcmVxdWlyZSgnY2xhc3NuYW1lcycpXG4gICAgICAgIGlmIChcbiAgICAgICAgICBub2RlLmNhbGxlZT8ubmFtZSA9PT0gJ3JlcXVpcmUnICYmXG4gICAgICAgICAgbm9kZS5hcmd1bWVudHM/Lmxlbmd0aCA9PT0gMSAmJlxuICAgICAgICAgIG5vZGUuYXJndW1lbnRzWzBdPy50eXBlID09PSAnTGl0ZXJhbCcgJiZcbiAgICAgICAgICB0eXBlb2Ygbm9kZS5hcmd1bWVudHNbMF0udmFsdWUgPT09ICdzdHJpbmcnICYmXG4gICAgICAgICAgQ0xBU1NOQU1FU19TT1VSQ0VTLmluY2x1ZGVzKG5vZGUuYXJndW1lbnRzWzBdLnZhbHVlKVxuICAgICAgICApIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbWVzc2FnZUlkOiAnbm9DbGFzc25hbWVzJyxcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9LFxuICAgIH1cbiAgfSxcbn1cblxuZXhwb3J0IGRlZmF1bHQgcnVsZVxuIl19