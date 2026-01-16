import { getCanonUrl, getCanonPattern } from '../utils/canon.js';
const RULE_NAME = 'prefer-list-components';
const pattern = getCanonPattern(RULE_NAME);
const rule = {
    meta: {
        type: 'suggestion',
        docs: {
            description: pattern?.summary || 'Use List/Li, not raw ul/li tags',
            recommended: true,
            url: getCanonUrl(RULE_NAME),
        },
        messages: {
            useList: `[Canon ${pattern?.id || '026'}] Use the List component instead of <ul>. Import: import { List } from "@/components"`,
            useLi: `[Canon ${pattern?.id || '026'}] Use the Li component instead of <li>. Import: import { Li } from "@/components"`,
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
                // Check <ul> tags
                if (elementName === 'ul') {
                    context.report({
                        node,
                        messageId: 'useList',
                    });
                    return;
                }
                // Check <li> tags
                if (elementName === 'li') {
                    context.report({
                        node,
                        messageId: 'useLi',
                    });
                    return;
                }
            },
        };
    },
};
export default rule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZmVyLWxpc3QtY29tcG9uZW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lc2xpbnQvcnVsZXMvcHJlZmVyLWxpc3QtY29tcG9uZW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFBO0FBRWhFLE1BQU0sU0FBUyxHQUFHLHdCQUF3QixDQUFBO0FBQzFDLE1BQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUUxQyxNQUFNLElBQUksR0FBb0I7SUFDNUIsSUFBSSxFQUFFO1FBQ0osSUFBSSxFQUFFLFlBQVk7UUFDbEIsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFLE9BQU8sRUFBRSxPQUFPLElBQUksaUNBQWlDO1lBQ2xFLFdBQVcsRUFBRSxJQUFJO1lBQ2pCLEdBQUcsRUFBRSxXQUFXLENBQUMsU0FBUyxDQUFDO1NBQzVCO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsT0FBTyxFQUFFLFVBQVUsT0FBTyxFQUFFLEVBQUUsSUFBSSxLQUFLLHVGQUF1RjtZQUM5SCxLQUFLLEVBQUUsVUFBVSxPQUFPLEVBQUUsRUFBRSxJQUFJLEtBQUssbUZBQW1GO1NBQ3pIO1FBQ0QsTUFBTSxFQUFFLEVBQUU7S0FDWDtJQUVELE1BQU0sQ0FBQyxPQUFPO1FBQ1osTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUE7UUFFMUQsNEJBQTRCO1FBQzVCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7WUFDbkMsT0FBTyxFQUFFLENBQUE7UUFDWCxDQUFDO1FBRUQsT0FBTztZQUNMLGlCQUFpQixDQUFDLElBQVM7Z0JBQ3pCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFBO2dCQUVuQyxrQkFBa0I7Z0JBQ2xCLElBQUksV0FBVyxLQUFLLElBQUksRUFBRSxDQUFDO29CQUN6QixPQUFPLENBQUMsTUFBTSxDQUFDO3dCQUNiLElBQUk7d0JBQ0osU0FBUyxFQUFFLFNBQVM7cUJBQ3JCLENBQUMsQ0FBQTtvQkFDRixPQUFNO2dCQUNSLENBQUM7Z0JBRUQsa0JBQWtCO2dCQUNsQixJQUFJLFdBQVcsS0FBSyxJQUFJLEVBQUUsQ0FBQztvQkFDekIsT0FBTyxDQUFDLE1BQU0sQ0FBQzt3QkFDYixJQUFJO3dCQUNKLFNBQVMsRUFBRSxPQUFPO3FCQUNuQixDQUFDLENBQUE7b0JBQ0YsT0FBTTtnQkFDUixDQUFDO1lBQ0gsQ0FBQztTQUNGLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQTtBQUVELGVBQWUsSUFBSSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBSdWxlIH0gZnJvbSAnZXNsaW50J1xuaW1wb3J0IHsgZ2V0Q2Fub25VcmwsIGdldENhbm9uUGF0dGVybiB9IGZyb20gJy4uL3V0aWxzL2Nhbm9uLmpzJ1xuXG5jb25zdCBSVUxFX05BTUUgPSAncHJlZmVyLWxpc3QtY29tcG9uZW50cydcbmNvbnN0IHBhdHRlcm4gPSBnZXRDYW5vblBhdHRlcm4oUlVMRV9OQU1FKVxuXG5jb25zdCBydWxlOiBSdWxlLlJ1bGVNb2R1bGUgPSB7XG4gIG1ldGE6IHtcbiAgICB0eXBlOiAnc3VnZ2VzdGlvbicsXG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246IHBhdHRlcm4/LnN1bW1hcnkgfHwgJ1VzZSBMaXN0L0xpLCBub3QgcmF3IHVsL2xpIHRhZ3MnLFxuICAgICAgcmVjb21tZW5kZWQ6IHRydWUsXG4gICAgICB1cmw6IGdldENhbm9uVXJsKFJVTEVfTkFNRSksXG4gICAgfSxcbiAgICBtZXNzYWdlczoge1xuICAgICAgdXNlTGlzdDogYFtDYW5vbiAke3BhdHRlcm4/LmlkIHx8ICcwMjYnfV0gVXNlIHRoZSBMaXN0IGNvbXBvbmVudCBpbnN0ZWFkIG9mIDx1bD4uIEltcG9ydDogaW1wb3J0IHsgTGlzdCB9IGZyb20gXCJAL2NvbXBvbmVudHNcImAsXG4gICAgICB1c2VMaTogYFtDYW5vbiAke3BhdHRlcm4/LmlkIHx8ICcwMjYnfV0gVXNlIHRoZSBMaSBjb21wb25lbnQgaW5zdGVhZCBvZiA8bGk+LiBJbXBvcnQ6IGltcG9ydCB7IExpIH0gZnJvbSBcIkAvY29tcG9uZW50c1wiYCxcbiAgICB9LFxuICAgIHNjaGVtYTogW10sXG4gIH0sXG5cbiAgY3JlYXRlKGNvbnRleHQpIHtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGNvbnRleHQuZmlsZW5hbWUgfHwgY29udGV4dC5nZXRGaWxlbmFtZSgpXG5cbiAgICAvLyBPbmx5IGFwcGx5IHRvIGJsb2NrIGZpbGVzXG4gICAgaWYgKCFmaWxlbmFtZS5pbmNsdWRlcygnL2Jsb2Nrcy8nKSkge1xuICAgICAgcmV0dXJuIHt9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIEpTWE9wZW5pbmdFbGVtZW50KG5vZGU6IGFueSkge1xuICAgICAgICBjb25zdCBlbGVtZW50TmFtZSA9IG5vZGUubmFtZT8ubmFtZVxuXG4gICAgICAgIC8vIENoZWNrIDx1bD4gdGFnc1xuICAgICAgICBpZiAoZWxlbWVudE5hbWUgPT09ICd1bCcpIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbWVzc2FnZUlkOiAndXNlTGlzdCcsXG4gICAgICAgICAgfSlcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENoZWNrIDxsaT4gdGFnc1xuICAgICAgICBpZiAoZWxlbWVudE5hbWUgPT09ICdsaScpIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbWVzc2FnZUlkOiAndXNlTGknLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfVxuICB9LFxufVxuXG5leHBvcnQgZGVmYXVsdCBydWxlXG4iXX0=