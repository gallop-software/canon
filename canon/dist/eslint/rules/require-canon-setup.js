import * as fs from 'fs';
import * as path from 'path';
import { getCanonUrl, getCanonPattern } from '../utils/canon.js';
const RULE_NAME = 'require-canon-setup';
const pattern = getCanonPattern(RULE_NAME);
// Track if we've already reported for this lint run
let hasReported = false;
// Required dev dependencies
const REQUIRED_DEPENDENCIES = ['knip', '@gallop.software/canon'];
// Required npm scripts (key = script name, value = { contains: string to check for, definition: exact script to add })
const REQUIRED_SCRIPTS = {
    unused: {
        contains: 'knip',
        definition: '"unused": "knip"',
    },
    check: {
        contains: 'npm run',
        definition: '"check": "npm run lint && npm run ts && npm run unused"',
    },
    lint: {
        contains: 'eslint',
        definition: '"lint": "eslint src/"',
    },
    ts: {
        contains: 'tsc',
        definition: '"ts": "tsc --noEmit"',
    },
    audit: {
        contains: 'gallop audit',
        definition: '"audit": "gallop audit"',
    },
    'audit:strict': {
        contains: 'gallop audit',
        definition: '"audit:strict": "gallop audit --strict"',
    },
    'audit:json': {
        contains: 'gallop audit',
        definition: '"audit:json": "gallop audit --json"',
    },
};
const rule = {
    meta: {
        type: 'suggestion',
        docs: {
            description: pattern?.summary || 'Require Canon setup in package.json',
            recommended: true,
            url: getCanonUrl(RULE_NAME),
        },
        messages: {
            missingDependency: `[Canon] Missing required dependency: "{{dep}}". Run: npm install -D {{dep}}`,
            missingScript: `[Canon] Missing required npm script "{{script}}". Add to package.json scripts: {{definition}}`,
            invalidScript: `[Canon] Script "{{script}}" should contain "{{expected}}". Expected: {{definition}}`,
        },
        schema: [],
    },
    create(context) {
        // Only check once per lint run, on the first file
        if (hasReported) {
            return {};
        }
        // Find the project root (where package.json is)
        const filename = context.filename || context.getFilename();
        let dir = path.dirname(filename);
        let packageJsonPath = '';
        // Walk up to find package.json
        while (dir !== path.dirname(dir)) {
            const candidate = path.join(dir, 'package.json');
            if (fs.existsSync(candidate)) {
                packageJsonPath = candidate;
                break;
            }
            dir = path.dirname(dir);
        }
        if (!packageJsonPath) {
            return {};
        }
        return {
            Program(node) {
                if (hasReported)
                    return;
                hasReported = true;
                try {
                    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
                    const devDeps = packageJson.devDependencies || {};
                    const deps = packageJson.dependencies || {};
                    const allDeps = { ...deps, ...devDeps };
                    const scripts = packageJson.scripts || {};
                    // Check dependencies
                    for (const dep of REQUIRED_DEPENDENCIES) {
                        if (!allDeps[dep]) {
                            context.report({
                                node,
                                messageId: 'missingDependency',
                                data: { dep },
                            });
                        }
                    }
                    // Check scripts
                    for (const [scriptName, { contains, definition }] of Object.entries(REQUIRED_SCRIPTS)) {
                        if (!scripts[scriptName]) {
                            context.report({
                                node,
                                messageId: 'missingScript',
                                data: { script: scriptName, definition },
                            });
                        }
                        else if (!scripts[scriptName].includes(contains)) {
                            context.report({
                                node,
                                messageId: 'invalidScript',
                                data: { script: scriptName, expected: contains, definition },
                            });
                        }
                    }
                }
                catch {
                    // Ignore parse errors
                }
            },
        };
    },
};
// Reset the flag when the module is reloaded (for watch mode)
export function resetReported() {
    hasReported = false;
}
export default rule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWlyZS1jYW5vbi1zZXR1cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lc2xpbnQvcnVsZXMvcmVxdWlyZS1jYW5vbi1zZXR1cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEtBQUssRUFBRSxNQUFNLElBQUksQ0FBQTtBQUN4QixPQUFPLEtBQUssSUFBSSxNQUFNLE1BQU0sQ0FBQTtBQUM1QixPQUFPLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFBO0FBRWhFLE1BQU0sU0FBUyxHQUFHLHFCQUFxQixDQUFBO0FBQ3ZDLE1BQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUUxQyxvREFBb0Q7QUFDcEQsSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFBO0FBRXZCLDRCQUE0QjtBQUM1QixNQUFNLHFCQUFxQixHQUFHLENBQUMsTUFBTSxFQUFFLHdCQUF3QixDQUFDLENBQUE7QUFFaEUsdUhBQXVIO0FBQ3ZILE1BQU0sZ0JBQWdCLEdBQTZEO0lBQ2pGLE1BQU0sRUFBRTtRQUNOLFFBQVEsRUFBRSxNQUFNO1FBQ2hCLFVBQVUsRUFBRSxrQkFBa0I7S0FDL0I7SUFDRCxLQUFLLEVBQUU7UUFDTCxRQUFRLEVBQUUsU0FBUztRQUNuQixVQUFVLEVBQUUseURBQXlEO0tBQ3RFO0lBQ0QsSUFBSSxFQUFFO1FBQ0osUUFBUSxFQUFFLFFBQVE7UUFDbEIsVUFBVSxFQUFFLHVCQUF1QjtLQUNwQztJQUNELEVBQUUsRUFBRTtRQUNGLFFBQVEsRUFBRSxLQUFLO1FBQ2YsVUFBVSxFQUFFLHNCQUFzQjtLQUNuQztJQUNELEtBQUssRUFBRTtRQUNMLFFBQVEsRUFBRSxjQUFjO1FBQ3hCLFVBQVUsRUFBRSx5QkFBeUI7S0FDdEM7SUFDRCxjQUFjLEVBQUU7UUFDZCxRQUFRLEVBQUUsY0FBYztRQUN4QixVQUFVLEVBQUUseUNBQXlDO0tBQ3REO0lBQ0QsWUFBWSxFQUFFO1FB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QUFNLENBQUM7Z0NBQ2IsSUFBSTtnQ0FDSixTQUFTLEVBQUUsZUFBZTtnQ0FDMUIsSUFBSSxFQUFFLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUU7NkJBQ3pDLENBQUMsQ0FBQTt3QkFDSixDQUFDOzZCQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7NEJBQ25ELE9BQU8sQ0FBQyxNQUFNLENBQUM7Z0NBQ2IsSUFBSTtnQ0FDSixTQUFTLEVBQUUsZUFBZTtnQ0FDMUIsSUFBSSxFQUFFLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRTs2QkFDN0QsQ0FBQyxDQUFBO3dCQUNKLENBQUM7b0JBQ0gsQ0FBQztnQkFDSCxDQUFDO2dCQUFDLE1BQU0sQ0FBQztvQkFDUCxzQkFBc0I7Z0JBQ3hCLENBQUM7WUFDSCxDQUFDO1NBQ0YsQ0FBQTtJQUNILENBQUM7Q0FDRixDQUFBO0FBRUQsOERBQThEO0FBQzlELE1BQU0sVUFBVSxhQUFhO0lBQzNCLFdBQVcsR0FBRyxLQUFLLENBQUE7QUFDckIsQ0FBQztBQUVELGVBQWUsSUFBSSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBSdWxlIH0gZnJvbSAnZXNsaW50J1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBnZXRDYW5vblVybCwgZ2V0Q2Fub25QYXR0ZXJuIH0gZnJvbSAnLi4vdXRpbHMvY2Fub24uanMnXG5cbmNvbnN0IFJVTEVfTkFNRSA9ICdyZXF1aXJlLWNhbm9uLXNldHVwJ1xuY29uc3QgcGF0dGVybiA9IGdldENhbm9uUGF0dGVybihSVUxFX05BTUUpXG5cbi8vIFRyYWNrIGlmIHdlJ3ZlIGFscmVhZHkgcmVwb3J0ZWQgZm9yIHRoaXMgbGludCBydW5cbmxldCBoYXNSZXBvcnRlZCA9IGZhbHNlXG5cbi8vIFJlcXVpcmVkIGRldiBkZXBlbmRlbmNpZXNcbmNvbnN0IFJFUVVJUkVEX0RFUEVOREVOQ0lFUyA9IFsna25pcCcsICdAZ2FsbG9wLnNvZnR3YXJlL2Nhbm9uJ11cblxuLy8gUmVxdWlyZWQgbnBtIHNjcmlwdHMgKGtleSA9IHNjcmlwdCBuYW1lLCB2YWx1ZSA9IHsgY29udGFpbnM6IHN0cmluZyB0byBjaGVjayBmb3IsIGRlZmluaXRpb246IGV4YWN0IHNjcmlwdCB0byBhZGQgfSlcbmNvbnN0IFJFUVVJUkVEX1NDUklQVFM6IFJlY29yZDxzdHJpbmcsIHsgY29udGFpbnM6IHN0cmluZzsgZGVmaW5pdGlvbjogc3RyaW5nIH0+ID0ge1xuICB1bnVzZWQ6IHtcbiAgICBjb250YWluczogJ2tuaXAnLFxuICAgIGRlZmluaXRpb246ICdcInVudXNlZFwiOiBcImtuaXBcIicsXG4gIH0sXG4gIGNoZWNrOiB7XG4gICAgY29udGFpbnM6ICducG0gcnVuJyxcbiAgICBkZWZpbml0aW9uOiAnXCJjaGVja1wiOiBcIm5wbSBydW4gbGludCAmJiBucG0gcnVuIHRzICYmIG5wbSBydW4gdW51c2VkXCInLFxuICB9LFxuICBsaW50OiB7XG4gICAgY29udGFpbnM6ICdlc2xpbnQnLFxuICAgIGRlZmluaXRpb246ICdcImxpbnRcIjogXCJlc2xpbnQgc3JjL1wiJyxcbiAgfSxcbiAgdHM6IHtcbiAgICBjb250YWluczogJ3RzYycsXG4gICAgZGVmaW5pdGlvbjogJ1widHNcIjogXCJ0c2MgLS1ub0VtaXRcIicsXG4gIH0sXG4gIGF1ZGl0OiB7XG4gICAgY29udGFpbnM6ICdnYWxsb3AgYXVkaXQnLFxuICAgIGRlZmluaXRpb246ICdcImF1ZGl0XCI6IFwiZ2FsbG9wIGF1ZGl0XCInLFxuICB9LFxuICAnYXVkaXQ6c3RyaWN0Jzoge1xuICAgIGNvbnRhaW5zOiAnZ2FsbG9wIGF1ZGl0JyxcbiAgICBkZWZpbml0aW9uOiAnXCJhdWRpdDpzdHJpY3RcIjogXCJnYWxsb3AgYXVkaXQgLS1zdHJpY3RcIicsXG4gIH0sXG4gICdhdWRpdDpqc29uJzoge1xuICAgIGNvbnRhaW5zOiAnZ2FsbG9wIGF1ZGl0JyxcbiAgICBkZWZpbml0aW9uOiAnXCJhdWRpdDpqc29uXCI6IFwiZ2FsbG9wIGF1ZGl0IC0tanNvblwiJyxcbiAgfSxcbn1cblxuY29uc3QgcnVsZTogUnVsZS5SdWxlTW9kdWxlID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiBwYXR0ZXJuPy5zdW1tYXJ5IHx8ICdSZXF1aXJlIENhbm9uIHNldHVwIGluIHBhY2thZ2UuanNvbicsXG4gICAgICByZWNvbW1lbmRlZDogdHJ1ZSxcbiAgICAgIHVybDogZ2V0Q2Fub25VcmwoUlVMRV9OQU1FKSxcbiAgICB9LFxuICAgIG1lc3NhZ2VzOiB7XG4gICAgICBtaXNzaW5nRGVwZW5kZW5jeTogYFtDYW5vbl0gTWlzc2luZyByZXF1aXJlZCBkZXBlbmRlbmN5OiBcInt7ZGVwfX1cIi4gUnVuOiBucG0gaW5zdGFsbCAtRCB7e2RlcH19YCxcbiAgICAgIG1pc3NpbmdTY3JpcHQ6IGBbQ2Fub25dIE1pc3NpbmcgcmVxdWlyZWQgbnBtIHNjcmlwdCBcInt7c2NyaXB0fX1cIi4gQWRkIHRvIHBhY2thZ2UuanNvbiBzY3JpcHRzOiB7e2RlZmluaXRpb259fWAsXG4gICAgICBpbnZhbGlkU2NyaXB0OiBgW0Nhbm9uXSBTY3JpcHQgXCJ7e3NjcmlwdH19XCIgc2hvdWxkIGNvbnRhaW4gXCJ7e2V4cGVjdGVkfX1cIi4gRXhwZWN0ZWQ6IHt7ZGVmaW5pdGlvbn19YCxcbiAgICB9LFxuICAgIHNjaGVtYTogW10sXG4gIH0sXG5cbiAgY3JlYXRlKGNvbnRleHQpIHtcbiAgICAvLyBPbmx5IGNoZWNrIG9uY2UgcGVyIGxpbnQgcnVuLCBvbiB0aGUgZmlyc3QgZmlsZVxuICAgIGlmIChoYXNSZXBvcnRlZCkge1xuICAgICAgcmV0dXJuIHt9XG4gICAgfVxuXG4gICAgLy8gRmluZCB0aGUgcHJvamVjdCByb290ICh3aGVyZSBwYWNrYWdlLmpzb24gaXMpXG4gICAgY29uc3QgZmlsZW5hbWUgPSBjb250ZXh0LmZpbGVuYW1lIHx8IGNvbnRleHQuZ2V0RmlsZW5hbWUoKVxuICAgIGxldCBkaXIgPSBwYXRoLmRpcm5hbWUoZmlsZW5hbWUpXG4gICAgbGV0IHBhY2thZ2VKc29uUGF0aCA9ICcnXG4gICAgXG4gICAgLy8gV2FsayB1cCB0byBmaW5kIHBhY2thZ2UuanNvblxuICAgIHdoaWxlIChkaXIgIT09IHBhdGguZGlybmFtZShkaXIpKSB7XG4gICAgICBjb25zdCBjYW5kaWRhdGUgPSBwYXRoLmpvaW4oZGlyLCAncGFja2FnZS5qc29uJylcbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKGNhbmRpZGF0ZSkpIHtcbiAgICAgICAgcGFja2FnZUpzb25QYXRoID0gY2FuZGlkYXRlXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICBkaXIgPSBwYXRoLmRpcm5hbWUoZGlyKVxuICAgIH1cblxuICAgIGlmICghcGFja2FnZUpzb25QYXRoKSB7XG4gICAgICByZXR1cm4ge31cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgUHJvZ3JhbShub2RlKSB7XG4gICAgICAgIGlmIChoYXNSZXBvcnRlZCkgcmV0dXJuXG4gICAgICAgIGhhc1JlcG9ydGVkID0gdHJ1ZVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgcGFja2FnZUpzb24gPSBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhwYWNrYWdlSnNvblBhdGgsICd1dGY4JykpXG4gICAgICAgICAgY29uc3QgZGV2RGVwcyA9IHBhY2thZ2VKc29uLmRldkRlcGVuZGVuY2llcyB8fCB7fVxuICAgICAgICAgIGNvbnN0IGRlcHMgPSBwYWNrYWdlSnNvbi5kZXBlbmRlbmNpZXMgfHwge31cbiAgICAgICAgICBjb25zdCBhbGxEZXBzID0geyAuLi5kZXBzLCAuLi5kZXZEZXBzIH1cbiAgICAgICAgICBjb25zdCBzY3JpcHRzID0gcGFja2FnZUpzb24uc2NyaXB0cyB8fCB7fVxuXG4gICAgICAgICAgLy8gQ2hlY2sgZGVwZW5kZW5jaWVzXG4gICAgICAgICAgZm9yIChjb25zdCBkZXAgb2YgUkVRVUlSRURfREVQRU5ERU5DSUVTKSB7XG4gICAgICAgICAgICBpZiAoIWFsbERlcHNbZGVwXSkge1xuICAgICAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlSWQ6ICdtaXNzaW5nRGVwZW5kZW5jeScsXG4gICAgICAgICAgICAgICAgZGF0YTogeyBkZXAgfSxcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBDaGVjayBzY3JpcHRzXG4gICAgICAgICAgZm9yIChjb25zdCBbc2NyaXB0TmFtZSwgeyBjb250YWlucywgZGVmaW5pdGlvbiB9XSBvZiBPYmplY3QuZW50cmllcyhSRVFVSVJFRF9TQ1JJUFRTKSkge1xuICAgICAgICAgICAgaWYgKCFzY3JpcHRzW3NjcmlwdE5hbWVdKSB7XG4gICAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2VJZDogJ21pc3NpbmdTY3JpcHQnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHsgc2NyaXB0OiBzY3JpcHROYW1lLCBkZWZpbml0aW9uIH0sXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFzY3JpcHRzW3NjcmlwdE5hbWVdLmluY2x1ZGVzKGNvbnRhaW5zKSkge1xuICAgICAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlSWQ6ICdpbnZhbGlkU2NyaXB0JyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7IHNjcmlwdDogc2NyaXB0TmFtZSwgZXhwZWN0ZWQ6IGNvbnRhaW5zLCBkZWZpbml0aW9uIH0sXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAvLyBJZ25vcmUgcGFyc2UgZXJyb3JzXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfVxuICB9LFxufVxuXG4vLyBSZXNldCB0aGUgZmxhZyB3aGVuIHRoZSBtb2R1bGUgaXMgcmVsb2FkZWQgKGZvciB3YXRjaCBtb2RlKVxuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0UmVwb3J0ZWQoKSB7XG4gIGhhc1JlcG9ydGVkID0gZmFsc2Vcbn1cblxuZXhwb3J0IGRlZmF1bHQgcnVsZVxuIl19