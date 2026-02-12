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
            useList: `[Canon ${pattern?.id || '026'}] Use the List component instead of <ul>. Import: import { List } from "@/components/list"`,
            useLi: `[Canon ${pattern?.id || '026'}] Use the Li component instead of <li>. Import: import { Li } from "@/components/list"`,
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
                // Check <ul> and <ol> tags
                if (elementName === 'ul' || elementName === 'ol') {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZmVyLWxpc3QtY29tcG9uZW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lc2xpbnQvcnVsZXMvcHJlZmVyLWxpc3QtY29tcG9uZW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFBO0FBRWhFLE1BQU0sU0FBUyxHQUFHLHdCQUF3QixDQUFBO0FBQzFDLE1BQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUUxQyxNQUFNLElBQUksR0FBb0I7SUFDNUIsSUFBSSxFQUFFO1FBQ0osSUFBSSxFQUFFLFlBQVk7UUFDbEIsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFLE9BQU8sRUFBRSxPQUFPLElBQUksaUNBQWlDO1lBQ2xFLFdBQVcsRUFBRSxJQUFJO1lBQ2pCLEdBQUcsRUFBRSxXQUFXLENBQUMsU0FBUyxDQUFDO1NBQzVCO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsT0FBTyxFQUFFLFVBQVUsT0FBTyxFQUFFLEVBQUUsSUFBSSxLQUFLLDRGQUE0RjtZQUNuSSxLQUFLLEVBQUUsVUFBVSxPQUFPLEVBQUUsRUFBRSxJQUFJLEtBQUssd0ZBQXdGO1NBQzlIO1FBQ0QsTUFBTSxFQUFFLEVBQUU7S0FDWDtJQUVELE1BQU0sQ0FBQyxPQUFPO1FBQ1osTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUE7UUFFMUQsNEJBQTRCO1FBQzVCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7WUFDbkMsT0FBTyxFQUFFLENBQUE7UUFDWCxDQUFDO1FBRUQsT0FBTztZQUNMLGlCQUFpQixDQUFDLElBQVM7Z0JBQ3pCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFBO2dCQUVuQywyQkFBMkI7Z0JBQzNCLElBQUksV0FBVyxLQUFLLElBQUksSUFBSSxXQUFXLEtBQUssSUFBSSxFQUFFLENBQUM7b0JBQ2pELE9BQU8sQ0FBQyxNQUFNLENBQUM7d0JBQ2IsSUFBSTt3QkFDSixTQUFTLEVBQUUsU0FBUztxQkFDckIsQ0FBQyxDQUFBO29CQUNGLE9BQU07Z0JBQ1IsQ0FBQztnQkFFRCxrQkFBa0I7Z0JBQ2xCLElBQUksV0FBVyxLQUFLLElBQUksRUFBRSxDQUFDO29CQUN6QixPQUFPLENBQUMsTUFBTSxDQUFDO3dCQUNiLElBQUk7d0JBQ0osU0FBUyxFQUFFLE9BQU87cUJBQ25CLENBQUMsQ0FBQTtvQkFDRixPQUFNO2dCQUNSLENBQUM7WUFDSCxDQUFDO1NBQ0YsQ0FBQTtJQUNILENBQUM7Q0FDRixDQUFBO0FBRUQsZUFBZSxJQUFJLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFJ1bGUgfSBmcm9tICdlc2xpbnQnXG5pbXBvcnQgeyBnZXRDYW5vblVybCwgZ2V0Q2Fub25QYXR0ZXJuIH0gZnJvbSAnLi4vdXRpbHMvY2Fub24uanMnXG5cbmNvbnN0IFJVTEVfTkFNRSA9ICdwcmVmZXItbGlzdC1jb21wb25lbnRzJ1xuY29uc3QgcGF0dGVybiA9IGdldENhbm9uUGF0dGVybihSVUxFX05BTUUpXG5cbmNvbnN0IHJ1bGU6IFJ1bGUuUnVsZU1vZHVsZSA9IHtcbiAgbWV0YToge1xuICAgIHR5cGU6ICdzdWdnZXN0aW9uJyxcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjogcGF0dGVybj8uc3VtbWFyeSB8fCAnVXNlIExpc3QvTGksIG5vdCByYXcgdWwvbGkgdGFncycsXG4gICAgICByZWNvbW1lbmRlZDogdHJ1ZSxcbiAgICAgIHVybDogZ2V0Q2Fub25VcmwoUlVMRV9OQU1FKSxcbiAgICB9LFxuICAgIG1lc3NhZ2VzOiB7XG4gICAgICB1c2VMaXN0OiBgW0Nhbm9uICR7cGF0dGVybj8uaWQgfHwgJzAyNid9XSBVc2UgdGhlIExpc3QgY29tcG9uZW50IGluc3RlYWQgb2YgPHVsPi4gSW1wb3J0OiBpbXBvcnQgeyBMaXN0IH0gZnJvbSBcIkAvY29tcG9uZW50cy9saXN0XCJgLFxuICAgICAgdXNlTGk6IGBbQ2Fub24gJHtwYXR0ZXJuPy5pZCB8fCAnMDI2J31dIFVzZSB0aGUgTGkgY29tcG9uZW50IGluc3RlYWQgb2YgPGxpPi4gSW1wb3J0OiBpbXBvcnQgeyBMaSB9IGZyb20gXCJAL2NvbXBvbmVudHMvbGlzdFwiYCxcbiAgICB9LFxuICAgIHNjaGVtYTogW10sXG4gIH0sXG5cbiAgY3JlYXRlKGNvbnRleHQpIHtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGNvbnRleHQuZmlsZW5hbWUgfHwgY29udGV4dC5nZXRGaWxlbmFtZSgpXG5cbiAgICAvLyBPbmx5IGFwcGx5IHRvIGJsb2NrIGZpbGVzXG4gICAgaWYgKCFmaWxlbmFtZS5pbmNsdWRlcygnL2Jsb2Nrcy8nKSkge1xuICAgICAgcmV0dXJuIHt9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIEpTWE9wZW5pbmdFbGVtZW50KG5vZGU6IGFueSkge1xuICAgICAgICBjb25zdCBlbGVtZW50TmFtZSA9IG5vZGUubmFtZT8ubmFtZVxuXG4gICAgICAgIC8vIENoZWNrIDx1bD4gYW5kIDxvbD4gdGFnc1xuICAgICAgICBpZiAoZWxlbWVudE5hbWUgPT09ICd1bCcgfHwgZWxlbWVudE5hbWUgPT09ICdvbCcpIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbWVzc2FnZUlkOiAndXNlTGlzdCcsXG4gICAgICAgICAgfSlcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENoZWNrIDxsaT4gdGFnc1xuICAgICAgICBpZiAoZWxlbWVudE5hbWUgPT09ICdsaScpIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbWVzc2FnZUlkOiAndXNlTGknLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfVxuICB9LFxufVxuXG5leHBvcnQgZGVmYXVsdCBydWxlXG4iXX0=