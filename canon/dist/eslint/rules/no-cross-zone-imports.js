import { ESLintUtils } from '@typescript-eslint/utils';
import { getCanonUrl, getCanonPattern } from '../utils/canon.js';
const RULE_NAME = 'no-cross-zone-imports';
const pattern = getCanonPattern(RULE_NAME);
const createRule = ESLintUtils.RuleCreator(() => getCanonUrl(RULE_NAME));
/**
 * Determine which zone a file is in based on its path
 */
function getZone(filename) {
    if (filename.includes('/blocks/') || filename.includes('\\blocks\\')) {
        return 'blocks';
    }
    if (filename.includes('/components/') || filename.includes('\\components\\')) {
        return 'components';
    }
    if (filename.includes('/app/') || filename.includes('\\app\\')) {
        return 'app';
    }
    if (filename.includes('/hooks/') || filename.includes('\\hooks\\')) {
        return 'hooks';
    }
    if (filename.includes('/utils/') || filename.includes('\\utils\\')) {
        return 'utils';
    }
    if (filename.includes('/tools/') || filename.includes('\\tools\\')) {
        return 'tools';
    }
    return null;
}
/**
 * Check if an import path targets a specific zone
 */
function importsZone(importPath, zone) {
    // Handle alias imports like @/blocks/... or @/components/...
    if (importPath.startsWith('@/')) {
        return importPath.startsWith(`@/${zone}/`);
    }
    // Handle relative imports
    return importPath.includes(`/${zone}/`) || importPath.includes(`\\${zone}\\`);
}
/**
 * Check if an import targets _scripts
 */
function importsScripts(importPath) {
    return (importPath.includes('_scripts/') ||
        importPath.includes('_scripts\\') ||
        importPath.startsWith('@/_scripts/'));
}
export default createRule({
    name: RULE_NAME,
    meta: {
        type: 'problem',
        docs: {
            description: pattern?.summary || 'Enforce import boundaries between Canon zones',
        },
        messages: {
            blocksImportBlocks: `[Canon ${pattern?.id || '021'}] Blocks cannot import from other blocks. Each block should be self-contained or import from components.`,
            componentsImportBlocks: `[Canon ${pattern?.id || '021'}] Components cannot import from blocks. Blocks compose components, not the other way around.`,
            runtimeImportScripts: `[Canon ${pattern?.id || '021'}] Runtime code cannot import from _scripts/. Scripts are for build-time only.`,
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        const filename = context.filename || context.getFilename();
        const currentZone = getZone(filename);
        // Skip files not in a known zone
        if (!currentZone) {
            return {};
        }
        return {
            ImportDeclaration(node) {
                const importPath = node.source.value;
                // Rule 1: Blocks cannot import from other blocks
                if (currentZone === 'blocks' && importsZone(importPath, 'blocks')) {
                    context.report({
                        node,
                        messageId: 'blocksImportBlocks',
                    });
                }
                // Rule 2: Components cannot import from blocks
                if (currentZone === 'components' && importsZone(importPath, 'blocks')) {
                    context.report({
                        node,
                        messageId: 'componentsImportBlocks',
                    });
                }
                // Rule 3: No runtime code can import from _scripts
                if (importsScripts(importPath)) {
                    context.report({
                        node,
                        messageId: 'runtimeImportScripts',
                    });
                }
            },
        };
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm8tY3Jvc3Mtem9uZS1pbXBvcnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2VzbGludC9ydWxlcy9uby1jcm9zcy16b25lLWltcG9ydHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDBCQUEwQixDQUFBO0FBQ3RELE9BQU8sRUFBRSxXQUFXLEVBQUUsZUFBZSxFQUFFLE1BQU0sbUJBQW1CLENBQUE7QUFFaEUsTUFBTSxTQUFTLEdBQUcsdUJBQXVCLENBQUE7QUFDekMsTUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBRTFDLE1BQU0sVUFBVSxHQUFHLFdBQVcsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUE7QUFJeEU7O0dBRUc7QUFDSCxTQUFTLE9BQU8sQ0FBQyxRQUFnQjtJQUMvQixJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDO1FBQ3JFLE9BQU8sUUFBUSxDQUFBO0lBQ2pCLENBQUM7SUFDRCxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUM7UUFDN0UsT0FBTyxZQUFZLENBQUE7SUFDckIsQ0FBQztJQUNELElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUM7UUFDL0QsT0FBTyxLQUFLLENBQUE7SUFDZCxDQUFDO0lBQ0QsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQztRQUNuRSxPQUFPLE9B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LENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztvQkFDL0IsT0FBTyxDQUFDLE1BQU0sQ0FBQzt3QkFDYixJQUFJO3dCQUNKLFNBQVMsRUFBRSxzQkFBc0I7cUJBQ2xDLENBQUMsQ0FBQTtnQkFDSixDQUFDO1lBQ0gsQ0FBQztTQUNGLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRVNMaW50VXRpbHMgfSBmcm9tICdAdHlwZXNjcmlwdC1lc2xpbnQvdXRpbHMnXG5pbXBvcnQgeyBnZXRDYW5vblVybCwgZ2V0Q2Fub25QYXR0ZXJuIH0gZnJvbSAnLi4vdXRpbHMvY2Fub24uanMnXG5cbmNvbnN0IFJVTEVfTkFNRSA9ICduby1jcm9zcy16b25lLWltcG9ydHMnXG5jb25zdCBwYXR0ZXJuID0gZ2V0Q2Fub25QYXR0ZXJuKFJVTEVfTkFNRSlcblxuY29uc3QgY3JlYXRlUnVsZSA9IEVTTGludFV0aWxzLlJ1bGVDcmVhdG9yKCgpID0+IGdldENhbm9uVXJsKFJVTEVfTkFNRSkpXG5cbnR5cGUgTWVzc2FnZUlkcyA9ICdibG9ja3NJbXBvcnRCbG9ja3MnIHwgJ2NvbXBvbmVudHNJbXBvcnRCbG9ja3MnIHwgJ3J1bnRpbWVJbXBvcnRTY3JpcHRzJ1xuXG4vKipcbiAqIERldGVybWluZSB3aGljaCB6b25lIGEgZmlsZSBpcyBpbiBiYXNlZCBvbiBpdHMgcGF0aFxuICovXG5mdW5jdGlvbiBnZXRab25lKGZpbGVuYW1lOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgaWYgKGZpbGVuYW1lLmluY2x1ZGVzKCcvYmxvY2tzLycpIHx8IGZpbGVuYW1lLmluY2x1ZGVzKCdcXFxcYmxvY2tzXFxcXCcpKSB7XG4gICAgcmV0dXJuICdibG9ja3MnXG4gIH1cbiAgaWYgKGZpbGVuYW1lLmluY2x1ZGVzKCcvY29tcG9uZW50cy8nKSB8fCBmaWxlbmFtZS5pbmNsdWRlcygnXFxcXGNvbXBvbmVudHNcXFxcJykpIHtcbiAgICByZXR1cm4gJ2NvbXBvbmVudHMnXG4gIH1cbiAgaWYgKGZpbGVuYW1lLmluY2x1ZGVzKCcvYXBwLycpIHx8IGZpbGVuYW1lLmluY2x1ZGVzKCdcXFxcYXBwXFxcXCcpKSB7XG4gICAgcmV0dXJuICdhcHAnXG4gIH1cbiAgaWYgKGZpbGVuYW1lLmluY2x1ZGVzKCcvaG9va3MvJykgfHwgZmlsZW5hbWUuaW5jbHVkZXMoJ1xcXFxob29rc1xcXFwnKSkge1xuICAgIHJldHVybiAnaG9va3MnXG4gIH1cbiAgaWYgKGZpbGVuYW1lLmluY2x1ZGVzKCcvdXRpbHMvJykgfHwgZmlsZW5hbWUuaW5jbHVkZXMoJ1xcXFx1dGlsc1xcXFwnKSkge1xuICAgIHJldHVybiAndXRpbHMnXG4gIH1cbiAgaWYgKGZpbGVuYW1lLmluY2x1ZGVzKCcvdG9vbHMvJykgfHwgZmlsZW5hbWUuaW5jbHVkZXMoJ1xcXFx0b29sc1xcXFwnKSkge1xuICAgIHJldHVybiAndG9vbHMnXG4gIH1cbiAgcmV0dXJuIG51bGxcbn1cblxuLyoqXG4gKiBDaGVjayBpZiBhbiBpbXBvcnQgcGF0aCB0YXJnZXRzIGEgc3BlY2lmaWMgem9uZVxuICovXG5mdW5jdGlvbiBpbXBvcnRzWm9uZShpbXBvcnRQYXRoOiBzdHJpbmcsIHpvbmU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAvLyBIYW5kbGUgYWxpYXMgaW1wb3J0cyBsaWtlIEAvYmxvY2tzLy4uLiBvciBAL2NvbXBvbmVudHMvLi4uXG4gIGlmIChpbXBvcnRQYXRoLnN0YXJ0c1dpdGgoJ0AvJykpIHtcbiAgICByZXR1cm4gaW1wb3J0UGF0aC5zdGFydHNXaXRoKGBALyR7em9uZX0vYClcbiAgfVxuICAvLyBIYW5kbGUgcmVsYXRpdmUgaW1wb3J0c1xuICByZXR1cm4gaW1wb3J0UGF0aC5pbmNsdWRlcyhgLyR7em9uZX0vYCkgfHwgaW1wb3J0UGF0aC5pbmNsdWRlcyhgXFxcXCR7em9uZX1cXFxcYClcbn1cblxuLyoqXG4gKiBDaGVjayBpZiBhbiBpbXBvcnQgdGFyZ2V0cyBfc2NyaXB0c1xuICovXG5mdW5jdGlvbiBpbXBvcnRzU2NyaXB0cyhpbXBvcnRQYXRoOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIChcbiAgICBpbXBvcnRQYXRoLmluY2x1ZGVzKCdfc2NyaXB0cy8nKSB8fFxuICAgIGltcG9ydFBhdGguaW5jbHVkZXMoJ19zY3JpcHRzXFxcXCcpIHx8XG4gICAgaW1wb3J0UGF0aC5zdGFydHNXaXRoKCdAL19zY3JpcHRzLycpXG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlUnVsZTxbXSwgTWVzc2FnZUlkcz4oe1xuICBuYW1lOiBSVUxFX05BTUUsXG4gIG1ldGE6IHtcbiAgICB0eXBlOiAncHJvYmxlbScsXG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgIHBhdHRlcm4/LnN1bW1hcnkgfHwgJ0VuZm9yY2UgaW1wb3J0IGJvdW5kYXJpZXMgYmV0d2VlbiBDYW5vbiB6b25lcycsXG4gICAgfSxcbiAgICBtZXNzYWdlczoge1xuICAgICAgYmxvY2tzSW1wb3J0QmxvY2tzOiBgW0Nhbm9uICR7cGF0dGVybj8uaWQgfHwgJzAyMSd9XSBCbG9ja3MgY2Fubm90IGltcG9ydCBmcm9tIG90aGVyIGJsb2Nrcy4gRWFjaCBibG9jayBzaG91bGQgYmUgc2VsZi1jb250YWluZWQgb3IgaW1wb3J0IGZyb20gY29tcG9uZW50cy5gLFxuICAgICAgY29tcG9uZW50c0ltcG9ydEJsb2NrczogYFtDYW5vbiAke3BhdHRlcm4/LmlkIHx8ICcwMjEnfV0gQ29tcG9uZW50cyBjYW5ub3QgaW1wb3J0IGZyb20gYmxvY2tzLiBCbG9ja3MgY29tcG9zZSBjb21wb25lbnRzLCBub3QgdGhlIG90aGVyIHdheSBhcm91bmQuYCxcbiAgICAgIHJ1bnRpbWVJbXBvcnRTY3JpcHRzOiBgW0Nhbm9uICR7cGF0dGVybj8uaWQgfHwgJzAyMSd9XSBSdW50aW1lIGNvZGUgY2Fubm90IGltcG9ydCBmcm9tIF9zY3JpcHRzLy4gU2NyaXB0cyBhcmUgZm9yIGJ1aWxkLXRpbWUgb25seS5gLFxuICAgIH0sXG4gICAgc2NoZW1hOiBbXSxcbiAgfSxcbiAgZGVmYXVsdE9wdGlvbnM6IFtdLFxuICBjcmVhdGUoY29udGV4dCkge1xuICAgIGNvbnN0IGZpbGVuYW1lID0gY29udGV4dC5maWxlbmFtZSB8fCBjb250ZXh0LmdldEZpbGVuYW1lKClcbiAgICBjb25zdCBjdXJyZW50Wm9uZSA9IGdldFpvbmUoZmlsZW5hbWUpXG5cbiAgICAvLyBTa2lwIGZpbGVzIG5vdCBpbiBhIGtub3duIHpvbmVcbiAgICBpZiAoIWN1cnJlbnRab25lKSB7XG4gICAgICByZXR1cm4ge31cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgSW1wb3J0RGVjbGFyYXRpb24obm9kZSkge1xuICAgICAgICBjb25zdCBpbXBvcnRQYXRoID0gbm9kZS5zb3VyY2UudmFsdWUgYXMgc3RyaW5nXG5cbiAgICAgICAgLy8gUnVsZSAxOiBCbG9ja3MgY2Fubm90IGltcG9ydCBmcm9tIG90aGVyIGJsb2Nrc1xuICAgICAgICBpZiAoY3VycmVudFpvbmUgPT09ICdibG9ja3MnICYmIGltcG9ydHNab25lKGltcG9ydFBhdGgsICdibG9ja3MnKSkge1xuICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICBtZXNzYWdlSWQ6ICdibG9ja3NJbXBvcnRCbG9ja3MnLFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICAvLyBSdWxlIDI6IENvbXBvbmVudHMgY2Fubm90IGltcG9ydCBmcm9tIGJsb2Nrc1xuICAgICAgICBpZiAoY3VycmVudFpvbmUgPT09ICdjb21wb25lbnRzJyAmJiBpbXBvcnRzWm9uZShpbXBvcnRQYXRoLCAnYmxvY2tzJykpIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbWVzc2FnZUlkOiAnY29tcG9uZW50c0ltcG9ydEJsb2NrcycsXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJ1bGUgMzogTm8gcnVudGltZSBjb2RlIGNhbiBpbXBvcnQgZnJvbSBfc2NyaXB0c1xuICAgICAgICBpZiAoaW1wb3J0c1NjcmlwdHMoaW1wb3J0UGF0aCkpIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbWVzc2FnZUlkOiAncnVudGltZUltcG9ydFNjcmlwdHMnLFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfVxuICB9LFxufSlcbiJdfQ==