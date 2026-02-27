import { ESLintUtils } from '@typescript-eslint/utils';
import { getCanonUrl, getCanonPattern } from '../utils/canon.js';
const RULE_NAME = 'no-cross-zone-imports';
const pattern = getCanonPattern(RULE_NAME);
const createRule = ESLintUtils.RuleCreator(() => getCanonUrl(RULE_NAME));
/**
 * Determine which zone a file is in based on its path
 */
function getZone(filename) {
    if (filename.includes('/blocks/') || filename.includes('/_blocks/') ||
        filename.includes('\\blocks\\') || filename.includes('\\_blocks\\')) {
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
    // Handle relative imports (including _blocks/ as blocks zone)
    if (zone === 'blocks') {
        return importPath.includes(`/${zone}/`) || importPath.includes(`/_blocks/`) ||
            importPath.includes(`\\${zone}\\`) || importPath.includes(`\\_blocks\\`);
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm8tY3Jvc3Mtem9uZS1pbXBvcnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2VzbGludC9ydWxlcy9uby1jcm9zcy16b25lLWltcG9ydHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDBCQUEwQixDQUFBO0FBQ3RELE9BQU8sRUFBRSxXQUFXLEVBQUUsZUFBZSxFQUFFLE1BQU0sbUJBQW1CLENBQUE7QUFFaEUsTUFBTSxTQUFTLEdBQUcsdUJBQXVCLENBQUE7QUFDekMsTUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBRTFDLE1BQU0sVUFBVSxHQUFHLFdBQVcsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUE7QUFJeEU7O0dBRUc7QUFDSCxTQUFTLE9BQU8sQ0FBQyxRQUFnQjtJQUMvQixJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUM7UUFDL0QsUUFBUSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUM7UUFDeEUsT0FBTyxRQUFRLENBQUE7SUFDakIsQ0FBQztJQUNELElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQztRQUM3RSxPQUFPLFlBQVksQ0FBQTtJQUNyQixDQUFDO0lBQ0QsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQztRQUMvRCxPQUFPLEtBQUssQ0FBQTtJQUNkLENBQUM7SUFDRCxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDO1FBQ25FLE9BQU8sT0FBTyxDQUFBO0lBQ2hCLENBQUM7SUFDRCxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDO1FBQ25FLE9BQU8sT0FBTyxDQUFBO0lBQ2hCLENBQUM7SUFDRCxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDO1FBQ25FLE9BQU8sT0FBTyxDQUFBO0lBQ2hCLENBQUM7SUFDRCxPQUFPLElBQUksQ0FBQTtBQUNiLENBQUM7QUFFRDs7R0FFRztBQUNILFNBQVMsV0FBVyxDQUFDLFVBQWtCLEVBQUUsSUFBWTtJQUNuRCw2REFBNkQ7SUFDN0QsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDaEMsT0FBTyxVQUFVLENBQUMsVUFBVSxDQUFDLEtBQUssSUFBSSxHQUFHLENBQUMsQ0FBQTtJQUM1QyxDQUFDO0lBQ0QsOERBQThEO0lBQzlELElBQUksSUFBSSxLQUFLLFFBQVEsRUFBRSxDQUFDO1FBQ3RCLE9BQU8sVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUM7WUFDcEUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQTtJQUNqRixDQUFDO0lBQ0QsT0FBTyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQTtBQUMvRSxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLGNBQWMsQ0FBQyxVQUFrQjtJQUN4QyxPQUFPLENBQ0wsVUFBVSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUM7UUFDaEMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUM7UUFDakMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FDckMsQ0FBQTtBQUNILENBQUM7QUFFRCxlQUFlLFVBQVUsQ0FBaUI7SUFDeEMsSUFBSSxFQUFFLFNBQVM7SUFDZixJQUFJLEVBQUU7UUFDSixJQUFJLEVBQUUsU0FBUztRQUNmLElBQUksRUFBRTtZQUNKLFdBQVcsRUFDVCxPQUFPLEVBQUUsT0FBTyxJQUFJLCtDQUErQztTQUN0RTtRQUNELFFBQVEsRUFBRTtZQUNSLGtCQUFrQixFQUFFLFVBQVUsT0FBTyxFQUFFLEVBQUUsSUFBSSxLQUFLLDBHQUEwRztZQUM1SixzQkFBc0IsRUFBRSxVQUFVLE9BQU8sRUFBRSxFQUFFLElBQUksS0FBSyw4RkFBOEY7WUFDcEosb0JBQW9CLEVBQUUsVUFBVSxPQUFPLEVBQUUsRUFBRSxJQUFJLEtBQUssK0VBQStFO1NBQ3BJO1FBQ0QsTUFBTSxFQUFFLEVBQUU7S0FDWDtJQUNELGNBQWMsRUFBRSxFQUFFO0lBQ2xCLE1BQU0sQ0FBQyxPQUFPO1FBQ1osTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUE7UUFDMUQsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBRXJDLGlDQUFpQztRQUNqQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDakIsT0FBTyxFQUFFLENBQUE7UUFDWCxDQUFDO1FBRUQsT0FBTztZQUNMLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3BCLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBZSxDQUFBO2dCQUU5QyxpREFBaUQ7Z0JBQ2pELElBQUksV0FBVyxLQUFLLFFBQVEsSUFBSSxXQUFXLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxFQUFFLENBQUM7b0JBQ2xFLE9BQU8sQ0FBQyxNQUFNLENBQUM7d0JBQ2IsSUFBSTt3QkFDSixTQUFTLEVBQUUsb0JBQW9CO3FCQUNoQyxDQUFDLENBQUE7Z0JBQ0osQ0FBQztnQkFFRCwrQ0FBK0M7Z0JBQy9DLElBQUksV0FBVyxLQUFLLFlBQVksSUFBSSxXQUFXLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxFQUFFLENBQUM7b0JBQ3RFLE9BQU8sQ0FBQyxNQUFNLENBQUM7d0JBQ2IsSUFBSTt3QkFDSixTQUFTLEVBQUUsd0JBQXdCO3FCQUNwQyxDQUFDLENBQUE7Z0JBQ0osQ0FBQztnQkFFRCxtREFBbUQ7Z0JBQ25ELElBQUksY0FBYyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7b0JBQy9CLE9BQU8sQ0FBQyxNQUFNLENBQUM7d0JBQ2IsSUFBSTt3QkFDSixTQUFTLEVBQUUsc0JBQXNCO3FCQUNsQyxDQUFDLENBQUE7Z0JBQ0osQ0FBQztZQUNILENBQUM7U0FDRixDQUFBO0lBQ0gsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVTTGludFV0aWxzIH0gZnJvbSAnQHR5cGVzY3JpcHQtZXNsaW50L3V0aWxzJ1xuaW1wb3J0IHsgZ2V0Q2Fub25VcmwsIGdldENhbm9uUGF0dGVybiB9IGZyb20gJy4uL3V0aWxzL2Nhbm9uLmpzJ1xuXG5jb25zdCBSVUxFX05BTUUgPSAnbm8tY3Jvc3Mtem9uZS1pbXBvcnRzJ1xuY29uc3QgcGF0dGVybiA9IGdldENhbm9uUGF0dGVybihSVUxFX05BTUUpXG5cbmNvbnN0IGNyZWF0ZVJ1bGUgPSBFU0xpbnRVdGlscy5SdWxlQ3JlYXRvcigoKSA9PiBnZXRDYW5vblVybChSVUxFX05BTUUpKVxuXG50eXBlIE1lc3NhZ2VJZHMgPSAnYmxvY2tzSW1wb3J0QmxvY2tzJyB8ICdjb21wb25lbnRzSW1wb3J0QmxvY2tzJyB8ICdydW50aW1lSW1wb3J0U2NyaXB0cydcblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hpY2ggem9uZSBhIGZpbGUgaXMgaW4gYmFzZWQgb24gaXRzIHBhdGhcbiAqL1xuZnVuY3Rpb24gZ2V0Wm9uZShmaWxlbmFtZTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gIGlmIChmaWxlbmFtZS5pbmNsdWRlcygnL2Jsb2Nrcy8nKSB8fCBmaWxlbmFtZS5pbmNsdWRlcygnL19ibG9ja3MvJykgfHxcbiAgICAgIGZpbGVuYW1lLmluY2x1ZGVzKCdcXFxcYmxvY2tzXFxcXCcpIHx8IGZpbGVuYW1lLmluY2x1ZGVzKCdcXFxcX2Jsb2Nrc1xcXFwnKSkge1xuICAgIHJldHVybiAnYmxvY2tzJ1xuICB9XG4gIGlmIChmaWxlbmFtZS5pbmNsdWRlcygnL2NvbXBvbmVudHMvJykgfHwgZmlsZW5hbWUuaW5jbHVkZXMoJ1xcXFxjb21wb25lbnRzXFxcXCcpKSB7XG4gICAgcmV0dXJuICdjb21wb25lbnRzJ1xuICB9XG4gIGlmIChmaWxlbmFtZS5pbmNsdWRlcygnL2FwcC8nKSB8fCBmaWxlbmFtZS5pbmNsdWRlcygnXFxcXGFwcFxcXFwnKSkge1xuICAgIHJldHVybiAnYXBwJ1xuICB9XG4gIGlmIChmaWxlbmFtZS5pbmNsdWRlcygnL2hvb2tzLycpIHx8IGZpbGVuYW1lLmluY2x1ZGVzKCdcXFxcaG9va3NcXFxcJykpIHtcbiAgICByZXR1cm4gJ2hvb2tzJ1xuICB9XG4gIGlmIChmaWxlbmFtZS5pbmNsdWRlcygnL3V0aWxzLycpIHx8IGZpbGVuYW1lLmluY2x1ZGVzKCdcXFxcdXRpbHNcXFxcJykpIHtcbiAgICByZXR1cm4gJ3V0aWxzJ1xuICB9XG4gIGlmIChmaWxlbmFtZS5pbmNsdWRlcygnL3Rvb2xzLycpIHx8IGZpbGVuYW1lLmluY2x1ZGVzKCdcXFxcdG9vbHNcXFxcJykpIHtcbiAgICByZXR1cm4gJ3Rvb2xzJ1xuICB9XG4gIHJldHVybiBudWxsXG59XG5cbi8qKlxuICogQ2hlY2sgaWYgYW4gaW1wb3J0IHBhdGggdGFyZ2V0cyBhIHNwZWNpZmljIHpvbmVcbiAqL1xuZnVuY3Rpb24gaW1wb3J0c1pvbmUoaW1wb3J0UGF0aDogc3RyaW5nLCB6b25lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgLy8gSGFuZGxlIGFsaWFzIGltcG9ydHMgbGlrZSBAL2Jsb2Nrcy8uLi4gb3IgQC9jb21wb25lbnRzLy4uLlxuICBpZiAoaW1wb3J0UGF0aC5zdGFydHNXaXRoKCdALycpKSB7XG4gICAgcmV0dXJuIGltcG9ydFBhdGguc3RhcnRzV2l0aChgQC8ke3pvbmV9L2ApXG4gIH1cbiAgLy8gSGFuZGxlIHJlbGF0aXZlIGltcG9ydHMgKGluY2x1ZGluZyBfYmxvY2tzLyBhcyBibG9ja3Mgem9uZSlcbiAgaWYgKHpvbmUgPT09ICdibG9ja3MnKSB7XG4gICAgcmV0dXJuIGltcG9ydFBhdGguaW5jbHVkZXMoYC8ke3pvbmV9L2ApIHx8IGltcG9ydFBhdGguaW5jbHVkZXMoYC9fYmxvY2tzL2ApIHx8XG4gICAgICAgICAgIGltcG9ydFBhdGguaW5jbHVkZXMoYFxcXFwke3pvbmV9XFxcXGApIHx8IGltcG9ydFBhdGguaW5jbHVkZXMoYFxcXFxfYmxvY2tzXFxcXGApXG4gIH1cbiAgcmV0dXJuIGltcG9ydFBhdGguaW5jbHVkZXMoYC8ke3pvbmV9L2ApIHx8IGltcG9ydFBhdGguaW5jbHVkZXMoYFxcXFwke3pvbmV9XFxcXGApXG59XG5cbi8qKlxuICogQ2hlY2sgaWYgYW4gaW1wb3J0IHRhcmdldHMgX3NjcmlwdHNcbiAqL1xuZnVuY3Rpb24gaW1wb3J0c1NjcmlwdHMoaW1wb3J0UGF0aDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiAoXG4gICAgaW1wb3J0UGF0aC5pbmNsdWRlcygnX3NjcmlwdHMvJykgfHxcbiAgICBpbXBvcnRQYXRoLmluY2x1ZGVzKCdfc2NyaXB0c1xcXFwnKSB8fFxuICAgIGltcG9ydFBhdGguc3RhcnRzV2l0aCgnQC9fc2NyaXB0cy8nKVxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVJ1bGU8W10sIE1lc3NhZ2VJZHM+KHtcbiAgbmFtZTogUlVMRV9OQU1FLFxuICBtZXRhOiB7XG4gICAgdHlwZTogJ3Byb2JsZW0nLFxuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICBwYXR0ZXJuPy5zdW1tYXJ5IHx8ICdFbmZvcmNlIGltcG9ydCBib3VuZGFyaWVzIGJldHdlZW4gQ2Fub24gem9uZXMnLFxuICAgIH0sXG4gICAgbWVzc2FnZXM6IHtcbiAgICAgIGJsb2Nrc0ltcG9ydEJsb2NrczogYFtDYW5vbiAke3BhdHRlcm4/LmlkIHx8ICcwMjEnfV0gQmxvY2tzIGNhbm5vdCBpbXBvcnQgZnJvbSBvdGhlciBibG9ja3MuIEVhY2ggYmxvY2sgc2hvdWxkIGJlIHNlbGYtY29udGFpbmVkIG9yIGltcG9ydCBmcm9tIGNvbXBvbmVudHMuYCxcbiAgICAgIGNvbXBvbmVudHNJbXBvcnRCbG9ja3M6IGBbQ2Fub24gJHtwYXR0ZXJuPy5pZCB8fCAnMDIxJ31dIENvbXBvbmVudHMgY2Fubm90IGltcG9ydCBmcm9tIGJsb2Nrcy4gQmxvY2tzIGNvbXBvc2UgY29tcG9uZW50cywgbm90IHRoZSBvdGhlciB3YXkgYXJvdW5kLmAsXG4gICAgICBydW50aW1lSW1wb3J0U2NyaXB0czogYFtDYW5vbiAke3BhdHRlcm4/LmlkIHx8ICcwMjEnfV0gUnVudGltZSBjb2RlIGNhbm5vdCBpbXBvcnQgZnJvbSBfc2NyaXB0cy8uIFNjcmlwdHMgYXJlIGZvciBidWlsZC10aW1lIG9ubHkuYCxcbiAgICB9LFxuICAgIHNjaGVtYTogW10sXG4gIH0sXG4gIGRlZmF1bHRPcHRpb25zOiBbXSxcbiAgY3JlYXRlKGNvbnRleHQpIHtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGNvbnRleHQuZmlsZW5hbWUgfHwgY29udGV4dC5nZXRGaWxlbmFtZSgpXG4gICAgY29uc3QgY3VycmVudFpvbmUgPSBnZXRab25lKGZpbGVuYW1lKVxuXG4gICAgLy8gU2tpcCBmaWxlcyBub3QgaW4gYSBrbm93biB6b25lXG4gICAgaWYgKCFjdXJyZW50Wm9uZSkge1xuICAgICAgcmV0dXJuIHt9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIEltcG9ydERlY2xhcmF0aW9uKG5vZGUpIHtcbiAgICAgICAgY29uc3QgaW1wb3J0UGF0aCA9IG5vZGUuc291cmNlLnZhbHVlIGFzIHN0cmluZ1xuXG4gICAgICAgIC8vIFJ1bGUgMTogQmxvY2tzIGNhbm5vdCBpbXBvcnQgZnJvbSBvdGhlciBibG9ja3NcbiAgICAgICAgaWYgKGN1cnJlbnRab25lID09PSAnYmxvY2tzJyAmJiBpbXBvcnRzWm9uZShpbXBvcnRQYXRoLCAnYmxvY2tzJykpIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbWVzc2FnZUlkOiAnYmxvY2tzSW1wb3J0QmxvY2tzJyxcbiAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gUnVsZSAyOiBDb21wb25lbnRzIGNhbm5vdCBpbXBvcnQgZnJvbSBibG9ja3NcbiAgICAgICAgaWYgKGN1cnJlbnRab25lID09PSAnY29tcG9uZW50cycgJiYgaW1wb3J0c1pvbmUoaW1wb3J0UGF0aCwgJ2Jsb2NrcycpKSB7XG4gICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIG1lc3NhZ2VJZDogJ2NvbXBvbmVudHNJbXBvcnRCbG9ja3MnLFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICAvLyBSdWxlIDM6IE5vIHJ1bnRpbWUgY29kZSBjYW4gaW1wb3J0IGZyb20gX3NjcmlwdHNcbiAgICAgICAgaWYgKGltcG9ydHNTY3JpcHRzKGltcG9ydFBhdGgpKSB7XG4gICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIG1lc3NhZ2VJZDogJ3J1bnRpbWVJbXBvcnRTY3JpcHRzJyxcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9LFxuICAgIH1cbiAgfSxcbn0pXG4iXX0=