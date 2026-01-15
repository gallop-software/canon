import { ESLintUtils } from '@typescript-eslint/utils';
import { getCanonUrl, getCanonPattern } from '../utils/canon.js';
const RULE_NAME = 'no-client-blocks';
const pattern = getCanonPattern(RULE_NAME);
const createRule = ESLintUtils.RuleCreator(() => getCanonUrl(RULE_NAME));
export default createRule({
    name: RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: pattern?.summary || 'Blocks must be server components',
        },
        messages: {
            noClientBlocks: `[Canon ${pattern?.id || '001'}] Block "{{blockName}}" uses 'use client'. Extract hooks and client-side logic into a component in src/components/, then import it here. See: ${pattern?.title || 'Server-First Blocks'} pattern.`,
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        const filename = context.filename || context.getFilename();
        // Only check files in src/blocks/
        if (!filename.includes('/blocks/') && !filename.includes('\\blocks\\')) {
            return {};
        }
        return {
            // Check for 'use client' directive at the top of the file
            ExpressionStatement(node) {
                if (node.expression.type === 'Literal' &&
                    node.expression.value === 'use client') {
                    // Extract block name from filename
                    const match = filename.match(/([^/\\]+)\.tsx?$/);
                    const blockName = match ? match[1] : 'unknown';
                    context.report({
                        node,
                        messageId: 'noClientBlocks',
                        data: {
                            blockName,
                        },
                    });
                }
            },
        };
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm8tY2xpZW50LWJsb2Nrcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lc2xpbnQvcnVsZXMvbm8tY2xpZW50LWJsb2Nrcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sMEJBQTBCLENBQUE7QUFDdEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQTtBQUVoRSxNQUFNLFNBQVMsR0FBRyxrQkFBa0IsQ0FBQTtBQUNwQyxNQUFNLE9BQU8sR0FBRyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUE7QUFFMUMsTUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQTtBQUl4RSxlQUFlLFVBQVUsQ0FBaUI7SUFDeEMsSUFBSSxFQUFFLFNBQVM7SUFDZixJQUFJLEVBQUU7UUFDSixJQUFJLEVBQUUsWUFBWTtRQUNsQixJQUFJLEVBQUU7WUFDSixXQUFXLEVBQUUsT0FBTyxFQUFFLE9BQU8sSUFBSSxrQ0FBa0M7U0FDcEU7UUFDRCxRQUFRLEVBQUU7WUFDUixjQUFjLEVBQUUsVUFBVSxPQUFPLEVBQUUsRUFBRSxJQUFJLEtBQUssaUpBQWlKLE9BQU8sRUFBRSxLQUFLLElBQUkscUJBQXFCLFdBQVc7U0FDbFA7UUFDRCxNQUFNLEVBQUUsRUFBRTtLQUNYO0lBQ0QsY0FBYyxFQUFFLEVBQUU7SUFDbEIsTUFBTSxDQUFDLE9BQU87UUFDWixNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxJQUFJLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQTtRQUUxRCxrQ0FBa0M7UUFDbEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUM7WUFDdkUsT0FBTyxFQUFFLENBQUE7UUFDWCxDQUFDO1FBRUQsT0FBTztZQUNMLDBEQUEwRDtZQUMxRCxtQkFBbUIsQ0FBQyxJQUFJO2dCQUN0QixJQUNFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLFNBQVM7b0JBQ2xDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxLQUFLLFlBQVksRUFDdEMsQ0FBQztvQkFDRCxtQ0FBbUM7b0JBQ25DLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQTtvQkFDaEQsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQTtvQkFFOUMsT0FBTyxDQUFDLE1BQU0sQ0FBQzt3QkFDYixJQUFJO3dCQUNKLFNBQVMsRUFBRSxnQkFBZ0I7d0JBQzNCLElBQUksRUFBRTs0QkFDSixTQUFTO3lCQUNWO3FCQUNGLENBQUMsQ0FBQTtnQkFDSixDQUFDO1lBQ0gsQ0FBQztTQUNGLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRVNMaW50VXRpbHMgfSBmcm9tICdAdHlwZXNjcmlwdC1lc2xpbnQvdXRpbHMnXG5pbXBvcnQgeyBnZXRDYW5vblVybCwgZ2V0Q2Fub25QYXR0ZXJuIH0gZnJvbSAnLi4vdXRpbHMvY2Fub24uanMnXG5cbmNvbnN0IFJVTEVfTkFNRSA9ICduby1jbGllbnQtYmxvY2tzJ1xuY29uc3QgcGF0dGVybiA9IGdldENhbm9uUGF0dGVybihSVUxFX05BTUUpXG5cbmNvbnN0IGNyZWF0ZVJ1bGUgPSBFU0xpbnRVdGlscy5SdWxlQ3JlYXRvcigoKSA9PiBnZXRDYW5vblVybChSVUxFX05BTUUpKVxuXG50eXBlIE1lc3NhZ2VJZHMgPSAnbm9DbGllbnRCbG9ja3MnXG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVJ1bGU8W10sIE1lc3NhZ2VJZHM+KHtcbiAgbmFtZTogUlVMRV9OQU1FLFxuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiBwYXR0ZXJuPy5zdW1tYXJ5IHx8ICdCbG9ja3MgbXVzdCBiZSBzZXJ2ZXIgY29tcG9uZW50cycsXG4gICAgfSxcbiAgICBtZXNzYWdlczoge1xuICAgICAgbm9DbGllbnRCbG9ja3M6IGBbQ2Fub24gJHtwYXR0ZXJuPy5pZCB8fCAnMDAxJ31dIEJsb2NrIFwie3tibG9ja05hbWV9fVwiIHVzZXMgJ3VzZSBjbGllbnQnLiBFeHRyYWN0IGhvb2tzIGFuZCBjbGllbnQtc2lkZSBsb2dpYyBpbnRvIGEgY29tcG9uZW50IGluIHNyYy9jb21wb25lbnRzLywgdGhlbiBpbXBvcnQgaXQgaGVyZS4gU2VlOiAke3BhdHRlcm4/LnRpdGxlIHx8ICdTZXJ2ZXItRmlyc3QgQmxvY2tzJ30gcGF0dGVybi5gLFxuICAgIH0sXG4gICAgc2NoZW1hOiBbXSxcbiAgfSxcbiAgZGVmYXVsdE9wdGlvbnM6IFtdLFxuICBjcmVhdGUoY29udGV4dCkge1xuICAgIGNvbnN0IGZpbGVuYW1lID0gY29udGV4dC5maWxlbmFtZSB8fCBjb250ZXh0LmdldEZpbGVuYW1lKClcblxuICAgIC8vIE9ubHkgY2hlY2sgZmlsZXMgaW4gc3JjL2Jsb2Nrcy9cbiAgICBpZiAoIWZpbGVuYW1lLmluY2x1ZGVzKCcvYmxvY2tzLycpICYmICFmaWxlbmFtZS5pbmNsdWRlcygnXFxcXGJsb2Nrc1xcXFwnKSkge1xuICAgICAgcmV0dXJuIHt9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIC8vIENoZWNrIGZvciAndXNlIGNsaWVudCcgZGlyZWN0aXZlIGF0IHRoZSB0b3Agb2YgdGhlIGZpbGVcbiAgICAgIEV4cHJlc3Npb25TdGF0ZW1lbnQobm9kZSkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgbm9kZS5leHByZXNzaW9uLnR5cGUgPT09ICdMaXRlcmFsJyAmJlxuICAgICAgICAgIG5vZGUuZXhwcmVzc2lvbi52YWx1ZSA9PT0gJ3VzZSBjbGllbnQnXG4gICAgICAgICkge1xuICAgICAgICAgIC8vIEV4dHJhY3QgYmxvY2sgbmFtZSBmcm9tIGZpbGVuYW1lXG4gICAgICAgICAgY29uc3QgbWF0Y2ggPSBmaWxlbmFtZS5tYXRjaCgvKFteL1xcXFxdKylcXC50c3g/JC8pXG4gICAgICAgICAgY29uc3QgYmxvY2tOYW1lID0gbWF0Y2ggPyBtYXRjaFsxXSA6ICd1bmtub3duJ1xuXG4gICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIG1lc3NhZ2VJZDogJ25vQ2xpZW50QmxvY2tzJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgYmxvY2tOYW1lLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9LFxuICAgIH1cbiAgfSxcbn0pXG4iXX0=