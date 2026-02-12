import { getCanonUrl, getCanonPattern } from '../utils/canon.js';
const RULE_NAME = 'prefer-alias-imports';
const pattern = getCanonPattern(RULE_NAME);
const DEFAULT_ZONES = [
    'components',
    'blocks',
    'hooks',
    'utils',
    'tools',
    'template',
    'types',
    'styles',
];
/**
 * Count how many "../" segments a relative path starts with
 */
function countParentSegments(importPath) {
    const matches = importPath.match(/^\.\.\//g) || importPath.match(/^(\.\.\/)+/);
    if (!matches)
        return 0;
    // Count occurrences of ../ at the start
    let count = 0;
    let remaining = importPath;
    while (remaining.startsWith('../')) {
        count++;
        remaining = remaining.slice(3);
    }
    return count;
}
/**
 * Check if an import path targets a Canon zone
 */
function getTargetZone(importPath, zones) {
    // Walk past all ../ segments and check if the next segment is a zone
    let remaining = importPath;
    while (remaining.startsWith('../')) {
        remaining = remaining.slice(3);
    }
    const firstSegment = remaining.split('/')[0];
    if (zones.includes(firstSegment)) {
        return firstSegment;
    }
    return null;
}
const rule = {
    meta: {
        type: 'suggestion',
        docs: {
            description: pattern?.summary || 'Use @/ alias imports instead of deep relative paths',
            recommended: true,
            url: getCanonUrl(RULE_NAME),
        },
        messages: {
            useAlias: `[Canon ${pattern?.id || '007'}] Use "{{alias}}{{zone}}/..." instead of "{{importPath}}".`,
        },
        schema: [
            {
                type: 'object',
                properties: {
                    alias: {
                        type: 'string',
                    },
                    zones: {
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
        const alias = options.alias || '@/';
        const zones = options.zones || DEFAULT_ZONES;
        return {
            ImportDeclaration(node) {
                const importPath = node.source?.value;
                if (typeof importPath !== 'string')
                    return;
                // Only check relative imports
                if (!importPath.startsWith('.'))
                    return;
                // Same-directory imports are fine
                if (importPath.startsWith('./'))
                    return;
                // Check if 2+ parent segments
                const parentCount = countParentSegments(importPath);
                if (parentCount < 2)
                    return;
                // Check if targeting a Canon zone
                const zone = getTargetZone(importPath, zones);
                if (zone) {
                    context.report({
                        node,
                        messageId: 'useAlias',
                        data: { alias, zone, importPath },
                    });
                }
            },
        };
    },
};
export default rule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZmVyLWFsaWFzLWltcG9ydHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZXNsaW50L3J1bGVzL3ByZWZlci1hbGlhcy1pbXBvcnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxXQUFXLEVBQUUsZUFBZSxFQUFFLE1BQU0sbUJBQW1CLENBQUE7QUFFaEUsTUFBTSxTQUFTLEdBQUcsc0JBQXNCLENBQUE7QUFDeEMsTUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBRTFDLE1BQU0sYUFBYSxHQUFHO0lBQ3BCLFlBQVk7SUFDWixRQUFRO0lBQ1IsT0FBTztJQUNQLE9BQU87SUFDUCxPQUFPO0lBQ1AsVUFBVTtJQUNWLE9BQU87SUFDUCxRQUFRO0NBQ1QsQ0FBQTtBQUVEOztHQUVHO0FBQ0gsU0FBUyxtQkFBbUIsQ0FBQyxVQUFrQjtJQUM3QyxNQUFNLE9BQU8sR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUE7SUFDOUUsSUFBSSxDQUFDLE9BQU87UUFBRSxPQUFPLENBQUMsQ0FBQTtJQUN0Qix3Q0FBd0M7SUFDeEMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFBO0lBQ2IsSUFBSSxTQUFTLEdBQUcsVUFBVSxDQUFBO0lBQzFCLE9BQU8sU0FBUyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQ25DLEtBQUssRUFBRSxDQUFBO1FBQ1AsU0FBUyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDaEMsQ0FBQztJQUNELE9BQU8sS0FBSyxDQUFBO0FBQ2QsQ0FBQztBQUVEOztHQUVHO0FBQ0gsU0FBUyxhQUFhLENBQUMsVUFBa0IsRUFBRSxLQUFlO0lBQ3hELHFFQUFxRTtJQUNyRSxJQUFJLFNBQVMsR0FBRyxVQUFVLENBQUE7SUFDMUIsT0FBTyxTQUFTLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDbkMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDaEMsQ0FBQztJQUNELE1BQU0sWUFBWSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDNUMsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUM7UUFDakMsT0FBTyxZQUFZLENBQUE7SUFDckIsQ0FBQztJQUNELE9BQU8sSUFBSSxDQUFBO0FBQ2IsQ0FBQztBQUVELE1BQU0sSUFBSSxHQUFvQjtJQUM1QixJQUFJLEVBQUU7UUFDSixJQUFJLEVBQUUsWUFBWTtRQUNsQixJQUFJLEVBQUU7WUFDSixXQUFXLEVBQUUsT0FBTyxFQUFFLE9BQU8sSUFBSSxxREFBcUQ7WUFDdEYsV0FBVyxFQUFFLElBQUk7WUFDakIsR0FBRyxFQUFFLFdBQVcsQ0FBQyxTQUFTLENBQUM7U0FDNUI7UUFDRCxRQUFRLEVBQUU7WUFDUixRQUFRLEVBQUUsVUFBVSxPQUFPLEVBQUUsRUFBRSxJQUFJLEtBQUssNERBQTREO1NBQ3JHO1FBQ0QsTUFBTSxFQUFFO1lBQ047Z0JBQ0UsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsVUFBVSxFQUFFO29CQUNWLEtBQUssRUFBRTt3QkFDTCxJQUFJLEVBQUUsUUFBUTtxQkFDZjtvQkFDRCxLQUFLLEVBQUU7d0JBQ0wsSUFBSSxFQUFFLE9BQU87d0JBQ2IsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtxQkFDMUI7aUJBQ0Y7Z0JBQ0Qsb0JBQW9CLEVBQUUsS0FBSzthQUM1QjtTQUNGO0tBQ0Y7SUFFRCxNQUFNLENBQUMsT0FBTztRQUNaLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFBO1FBQ3hDLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFBO1FBQ25DLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLElBQUksYUFBYSxDQUFBO1FBRTVDLE9BQU87WUFDTCxpQkFBaUIsQ0FBQyxJQUFTO2dCQUN6QixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQTtnQkFDckMsSUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRO29CQUFFLE9BQU07Z0JBRTFDLDhCQUE4QjtnQkFDOUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDO29CQUFFLE9BQU07Z0JBRXZDLGtDQUFrQztnQkFDbEMsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztvQkFBRSxPQUFNO2dCQUV2Qyw4QkFBOEI7Z0JBQzlCLE1BQU0sV0FBVyxHQUFHLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxDQUFBO2dCQUNuRCxJQUFJLFdBQVcsR0FBRyxDQUFDO29CQUFFLE9BQU07Z0JBRTNCLGtDQUFrQztnQkFDbEMsTUFBTSxJQUFJLEdBQUcsYUFBYSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQTtnQkFDN0MsSUFBSSxJQUFJLEVBQUUsQ0FBQztvQkFDVCxPQUFPLENBQUMsTUFBTSxDQUFDO3dCQUNiLElBQUk7d0JBQ0osU0FBUyxFQUFFLFVBQVU7d0JBQ3JCLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO3FCQUNsQyxDQUFDLENBQUE7Z0JBQ0osQ0FBQztZQUNILENBQUM7U0FDRixDQUFBO0lBQ0gsQ0FBQztDQUNGLENBQUE7QUFFRCxlQUFlLElBQUksQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgUnVsZSB9IGZyb20gJ2VzbGludCdcbmltcG9ydCB7IGdldENhbm9uVXJsLCBnZXRDYW5vblBhdHRlcm4gfSBmcm9tICcuLi91dGlscy9jYW5vbi5qcydcblxuY29uc3QgUlVMRV9OQU1FID0gJ3ByZWZlci1hbGlhcy1pbXBvcnRzJ1xuY29uc3QgcGF0dGVybiA9IGdldENhbm9uUGF0dGVybihSVUxFX05BTUUpXG5cbmNvbnN0IERFRkFVTFRfWk9ORVMgPSBbXG4gICdjb21wb25lbnRzJyxcbiAgJ2Jsb2NrcycsXG4gICdob29rcycsXG4gICd1dGlscycsXG4gICd0b29scycsXG4gICd0ZW1wbGF0ZScsXG4gICd0eXBlcycsXG4gICdzdHlsZXMnLFxuXVxuXG4vKipcbiAqIENvdW50IGhvdyBtYW55IFwiLi4vXCIgc2VnbWVudHMgYSByZWxhdGl2ZSBwYXRoIHN0YXJ0cyB3aXRoXG4gKi9cbmZ1bmN0aW9uIGNvdW50UGFyZW50U2VnbWVudHMoaW1wb3J0UGF0aDogc3RyaW5nKTogbnVtYmVyIHtcbiAgY29uc3QgbWF0Y2hlcyA9IGltcG9ydFBhdGgubWF0Y2goL15cXC5cXC5cXC8vZykgfHwgaW1wb3J0UGF0aC5tYXRjaCgvXihcXC5cXC5cXC8pKy8pXG4gIGlmICghbWF0Y2hlcykgcmV0dXJuIDBcbiAgLy8gQ291bnQgb2NjdXJyZW5jZXMgb2YgLi4vIGF0IHRoZSBzdGFydFxuICBsZXQgY291bnQgPSAwXG4gIGxldCByZW1haW5pbmcgPSBpbXBvcnRQYXRoXG4gIHdoaWxlIChyZW1haW5pbmcuc3RhcnRzV2l0aCgnLi4vJykpIHtcbiAgICBjb3VudCsrXG4gICAgcmVtYWluaW5nID0gcmVtYWluaW5nLnNsaWNlKDMpXG4gIH1cbiAgcmV0dXJuIGNvdW50XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgYW4gaW1wb3J0IHBhdGggdGFyZ2V0cyBhIENhbm9uIHpvbmVcbiAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0Wm9uZShpbXBvcnRQYXRoOiBzdHJpbmcsIHpvbmVzOiBzdHJpbmdbXSk6IHN0cmluZyB8IG51bGwge1xuICAvLyBXYWxrIHBhc3QgYWxsIC4uLyBzZWdtZW50cyBhbmQgY2hlY2sgaWYgdGhlIG5leHQgc2VnbWVudCBpcyBhIHpvbmVcbiAgbGV0IHJlbWFpbmluZyA9IGltcG9ydFBhdGhcbiAgd2hpbGUgKHJlbWFpbmluZy5zdGFydHNXaXRoKCcuLi8nKSkge1xuICAgIHJlbWFpbmluZyA9IHJlbWFpbmluZy5zbGljZSgzKVxuICB9XG4gIGNvbnN0IGZpcnN0U2VnbWVudCA9IHJlbWFpbmluZy5zcGxpdCgnLycpWzBdXG4gIGlmICh6b25lcy5pbmNsdWRlcyhmaXJzdFNlZ21lbnQpKSB7XG4gICAgcmV0dXJuIGZpcnN0U2VnbWVudFxuICB9XG4gIHJldHVybiBudWxsXG59XG5cbmNvbnN0IHJ1bGU6IFJ1bGUuUnVsZU1vZHVsZSA9IHtcbiAgbWV0YToge1xuICAgIHR5cGU6ICdzdWdnZXN0aW9uJyxcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjogcGF0dGVybj8uc3VtbWFyeSB8fCAnVXNlIEAvIGFsaWFzIGltcG9ydHMgaW5zdGVhZCBvZiBkZWVwIHJlbGF0aXZlIHBhdGhzJyxcbiAgICAgIHJlY29tbWVuZGVkOiB0cnVlLFxuICAgICAgdXJsOiBnZXRDYW5vblVybChSVUxFX05BTUUpLFxuICAgIH0sXG4gICAgbWVzc2FnZXM6IHtcbiAgICAgIHVzZUFsaWFzOiBgW0Nhbm9uICR7cGF0dGVybj8uaWQgfHwgJzAwNyd9XSBVc2UgXCJ7e2FsaWFzfX17e3pvbmV9fS8uLi5cIiBpbnN0ZWFkIG9mIFwie3tpbXBvcnRQYXRofX1cIi5gLFxuICAgIH0sXG4gICAgc2NoZW1hOiBbXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgYWxpYXM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgem9uZXM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgICBpdGVtczogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcblxuICBjcmVhdGUoY29udGV4dCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBjb250ZXh0Lm9wdGlvbnNbMF0gfHwge31cbiAgICBjb25zdCBhbGlhcyA9IG9wdGlvbnMuYWxpYXMgfHwgJ0AvJ1xuICAgIGNvbnN0IHpvbmVzID0gb3B0aW9ucy56b25lcyB8fCBERUZBVUxUX1pPTkVTXG5cbiAgICByZXR1cm4ge1xuICAgICAgSW1wb3J0RGVjbGFyYXRpb24obm9kZTogYW55KSB7XG4gICAgICAgIGNvbnN0IGltcG9ydFBhdGggPSBub2RlLnNvdXJjZT8udmFsdWVcbiAgICAgICAgaWYgKHR5cGVvZiBpbXBvcnRQYXRoICE9PSAnc3RyaW5nJykgcmV0dXJuXG5cbiAgICAgICAgLy8gT25seSBjaGVjayByZWxhdGl2ZSBpbXBvcnRzXG4gICAgICAgIGlmICghaW1wb3J0UGF0aC5zdGFydHNXaXRoKCcuJykpIHJldHVyblxuXG4gICAgICAgIC8vIFNhbWUtZGlyZWN0b3J5IGltcG9ydHMgYXJlIGZpbmVcbiAgICAgICAgaWYgKGltcG9ydFBhdGguc3RhcnRzV2l0aCgnLi8nKSkgcmV0dXJuXG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgMisgcGFyZW50IHNlZ21lbnRzXG4gICAgICAgIGNvbnN0IHBhcmVudENvdW50ID0gY291bnRQYXJlbnRTZWdtZW50cyhpbXBvcnRQYXRoKVxuICAgICAgICBpZiAocGFyZW50Q291bnQgPCAyKSByZXR1cm5cblxuICAgICAgICAvLyBDaGVjayBpZiB0YXJnZXRpbmcgYSBDYW5vbiB6b25lXG4gICAgICAgIGNvbnN0IHpvbmUgPSBnZXRUYXJnZXRab25lKGltcG9ydFBhdGgsIHpvbmVzKVxuICAgICAgICBpZiAoem9uZSkge1xuICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICBtZXNzYWdlSWQ6ICd1c2VBbGlhcycsXG4gICAgICAgICAgICBkYXRhOiB7IGFsaWFzLCB6b25lLCBpbXBvcnRQYXRoIH0sXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9XG4gIH0sXG59XG5cbmV4cG9ydCBkZWZhdWx0IHJ1bGVcbiJdfQ==