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
    'lint:gallop': {
        contains: 'eslint',
        definition: `"lint:gallop": "eslint 'src/app/**/_blocks/' --rule 'gallop/no-client-blocks: warn' --rule 'gallop/no-container-in-section: warn' --rule 'gallop/prefer-component-props: warn'"`,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWlyZS1jYW5vbi1zZXR1cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lc2xpbnQvcnVsZXMvcmVxdWlyZS1jYW5vbi1zZXR1cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEtBQUssRUFBRSxNQUFNLElBQUksQ0FBQTtBQUN4QixPQUFPLEtBQUssSUFBSSxNQUFNLE1BQU0sQ0FBQTtBQUM1QixPQUFPLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFBO0FBRWhFLE1BQU0sU0FBUyxHQUFHLHFCQUFxQixDQUFBO0FBQ3ZDLE1BQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUUxQyxvREFBb0Q7QUFDcEQsSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFBO0FBRXZCLDRCQUE0QjtBQUM1QixNQUFNLHFCQUFxQixHQUFHLENBQUMsTUFBTSxFQUFFLHdCQUF3QixDQUFDLENBQUE7QUFFaEUsdUhBQXVIO0FBQ3ZILE1BQU0sZ0JBQWdCLEdBQTZEO0lBQ2pGLE1BQU0sRUFBRTtRQUNOLFFBQVEsRUFBRSxNQUFNO1FBQ2hCLFVBQVUsRUFBRSxrQkFBa0I7S0FDL0I7SUFDRCxLQUFLLEVBQUU7UUFDTCxRQUFRLEVBQUUsU0FBUztRQUNuQixVQUFVLEVBQUUseURBQXlEO0tBQ3RFO0lBQ0QsSUFBSSxFQUFFO1FBQ0osUUFBUSxFQUFFLFFBQVE7UUFDbEIsVUFBVSxFQUFFLHVCQUF1QjtLQUNwQztJQUNELGFBQWEsRUFBRTtRQUNiLFFBQVEsRUFBRSxRQUFRO1FBQ2xCLFVBQVUsRUFBRSxpTEFBaUw7S0FDOUw7SUFDRCxFQUFFLEVBQUU7UUFDRixRQUFRLEVBQUUsS0FBSztRQUNmLFVBQVUsRUFBRSxzQkFBc0I7S0FDbkM7SUFDRCxLQUFLLEVBQUU7UUFDTCxRQUFRLEVBQUUsY0FBYztRQUN4QixVQUFVLEVBQUUseUJBQXlCO0tBQ3RDO0lBQ0QsY0FBYyxFQUFFO1FB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QkFDdEYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDOzRCQUN6QixPQUFPLENBQUMsTUFBTSxDQUFDO2dDQUNiLElBQUk7Z0NBQ0osU0FBUyxFQUFFLGVBQWU7Z0NBQzFCLElBQUksRUFBRSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFOzZCQUN6QyxDQUFDLENBQUE7d0JBQ0osQ0FBQzs2QkFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDOzRCQUNuRCxPQUFPLENBQUMsTUFBTSxDQUFDO2dDQUNiLElBQUk7Z0NBQ0osU0FBUyxFQUFFLGVBQWU7Z0NBQzFCLElBQUksRUFBRSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUU7NkJBQzdELENBQUMsQ0FBQTt3QkFDSixDQUFDO29CQUNILENBQUM7Z0JBQ0gsQ0FBQztnQkFBQyxNQUFNLENBQUM7b0JBQ1Asc0JBQXNCO2dCQUN4QixDQUFDO1lBQ0gsQ0FBQztTQUNGLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQTtBQUVELDhEQUE4RDtBQUM5RCxNQUFNLFVBQVUsYUFBYTtJQUMzQixXQUFXLEdBQUcsS0FBSyxDQUFBO0FBQ3JCLENBQUM7QUFFRCxlQUFlLElBQUksQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgUnVsZSB9IGZyb20gJ2VzbGludCdcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJ1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgZ2V0Q2Fub25VcmwsIGdldENhbm9uUGF0dGVybiB9IGZyb20gJy4uL3V0aWxzL2Nhbm9uLmpzJ1xuXG5jb25zdCBSVUxFX05BTUUgPSAncmVxdWlyZS1jYW5vbi1zZXR1cCdcbmNvbnN0IHBhdHRlcm4gPSBnZXRDYW5vblBhdHRlcm4oUlVMRV9OQU1FKVxuXG4vLyBUcmFjayBpZiB3ZSd2ZSBhbHJlYWR5IHJlcG9ydGVkIGZvciB0aGlzIGxpbnQgcnVuXG5sZXQgaGFzUmVwb3J0ZWQgPSBmYWxzZVxuXG4vLyBSZXF1aXJlZCBkZXYgZGVwZW5kZW5jaWVzXG5jb25zdCBSRVFVSVJFRF9ERVBFTkRFTkNJRVMgPSBbJ2tuaXAnLCAnQGdhbGxvcC5zb2Z0d2FyZS9jYW5vbiddXG5cbi8vIFJlcXVpcmVkIG5wbSBzY3JpcHRzIChrZXkgPSBzY3JpcHQgbmFtZSwgdmFsdWUgPSB7IGNvbnRhaW5zOiBzdHJpbmcgdG8gY2hlY2sgZm9yLCBkZWZpbml0aW9uOiBleGFjdCBzY3JpcHQgdG8gYWRkIH0pXG5jb25zdCBSRVFVSVJFRF9TQ1JJUFRTOiBSZWNvcmQ8c3RyaW5nLCB7IGNvbnRhaW5zOiBzdHJpbmc7IGRlZmluaXRpb246IHN0cmluZyB9PiA9IHtcbiAgdW51c2VkOiB7XG4gICAgY29udGFpbnM6ICdrbmlwJyxcbiAgICBkZWZpbml0aW9uOiAnXCJ1bnVzZWRcIjogXCJrbmlwXCInLFxuICB9LFxuICBjaGVjazoge1xuICAgIGNvbnRhaW5zOiAnbnBtIHJ1bicsXG4gICAgZGVmaW5pdGlvbjogJ1wiY2hlY2tcIjogXCJucG0gcnVuIGxpbnQgJiYgbnBtIHJ1biB0cyAmJiBucG0gcnVuIHVudXNlZFwiJyxcbiAgfSxcbiAgbGludDoge1xuICAgIGNvbnRhaW5zOiAnZXNsaW50JyxcbiAgICBkZWZpbml0aW9uOiAnXCJsaW50XCI6IFwiZXNsaW50IHNyYy9cIicsXG4gIH0sXG4gICdsaW50OmdhbGxvcCc6IHtcbiAgICBjb250YWluczogJ2VzbGludCcsXG4gICAgZGVmaW5pdGlvbjogYFwibGludDpnYWxsb3BcIjogXCJlc2xpbnQgJ3NyYy9hcHAvKiovX2Jsb2Nrcy8nIC0tcnVsZSAnZ2FsbG9wL25vLWNsaWVudC1ibG9ja3M6IHdhcm4nIC0tcnVsZSAnZ2FsbG9wL25vLWNvbnRhaW5lci1pbi1zZWN0aW9uOiB3YXJuJyAtLXJ1bGUgJ2dhbGxvcC9wcmVmZXItY29tcG9uZW50LXByb3BzOiB3YXJuJ1wiYCxcbiAgfSxcbiAgdHM6IHtcbiAgICBjb250YWluczogJ3RzYycsXG4gICAgZGVmaW5pdGlvbjogJ1widHNcIjogXCJ0c2MgLS1ub0VtaXRcIicsXG4gIH0sXG4gIGF1ZGl0OiB7XG4gICAgY29udGFpbnM6ICdnYWxsb3AgYXVkaXQnLFxuICAgIGRlZmluaXRpb246ICdcImF1ZGl0XCI6IFwiZ2FsbG9wIGF1ZGl0XCInLFxuICB9LFxuICAnYXVkaXQ6c3RyaWN0Jzoge1xuICAgIGNvbnRhaW5zOiAnZ2FsbG9wIGF1ZGl0JyxcbiAgICBkZWZpbml0aW9uOiAnXCJhdWRpdDpzdHJpY3RcIjogXCJnYWxsb3AgYXVkaXQgLS1zdHJpY3RcIicsXG4gIH0sXG4gICdhdWRpdDpqc29uJzoge1xuICAgIGNvbnRhaW5zOiAnZ2FsbG9wIGF1ZGl0JyxcbiAgICBkZWZpbml0aW9uOiAnXCJhdWRpdDpqc29uXCI6IFwiZ2FsbG9wIGF1ZGl0IC0tanNvblwiJyxcbiAgfSxcbn1cblxuY29uc3QgcnVsZTogUnVsZS5SdWxlTW9kdWxlID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiBwYXR0ZXJuPy5zdW1tYXJ5IHx8ICdSZXF1aXJlIENhbm9uIHNldHVwIGluIHBhY2thZ2UuanNvbicsXG4gICAgICByZWNvbW1lbmRlZDogdHJ1ZSxcbiAgICAgIHVybDogZ2V0Q2Fub25VcmwoUlVMRV9OQU1FKSxcbiAgICB9LFxuICAgIG1lc3NhZ2VzOiB7XG4gICAgICBtaXNzaW5nRGVwZW5kZW5jeTogYFtDYW5vbl0gTWlzc2luZyByZXF1aXJlZCBkZXBlbmRlbmN5OiBcInt7ZGVwfX1cIi4gUnVuOiBucG0gaW5zdGFsbCAtRCB7e2RlcH19YCxcbiAgICAgIG1pc3NpbmdTY3JpcHQ6IGBbQ2Fub25dIE1pc3NpbmcgcmVxdWlyZWQgbnBtIHNjcmlwdCBcInt7c2NyaXB0fX1cIi4gQWRkIHRvIHBhY2thZ2UuanNvbiBzY3JpcHRzOiB7e2RlZmluaXRpb259fWAsXG4gICAgICBpbnZhbGlkU2NyaXB0OiBgW0Nhbm9uXSBTY3JpcHQgXCJ7e3NjcmlwdH19XCIgc2hvdWxkIGNvbnRhaW4gXCJ7e2V4cGVjdGVkfX1cIi4gRXhwZWN0ZWQ6IHt7ZGVmaW5pdGlvbn19YCxcbiAgICB9LFxuICAgIHNjaGVtYTogW10sXG4gIH0sXG5cbiAgY3JlYXRlKGNvbnRleHQpIHtcbiAgICAvLyBPbmx5IGNoZWNrIG9uY2UgcGVyIGxpbnQgcnVuLCBvbiB0aGUgZmlyc3QgZmlsZVxuICAgIGlmIChoYXNSZXBvcnRlZCkge1xuICAgICAgcmV0dXJuIHt9XG4gICAgfVxuXG4gICAgLy8gRmluZCB0aGUgcHJvamVjdCByb290ICh3aGVyZSBwYWNrYWdlLmpzb24gaXMpXG4gICAgY29uc3QgZmlsZW5hbWUgPSBjb250ZXh0LmZpbGVuYW1lIHx8IGNvbnRleHQuZ2V0RmlsZW5hbWUoKVxuICAgIGxldCBkaXIgPSBwYXRoLmRpcm5hbWUoZmlsZW5hbWUpXG4gICAgbGV0IHBhY2thZ2VKc29uUGF0aCA9ICcnXG4gICAgXG4gICAgLy8gV2FsayB1cCB0byBmaW5kIHBhY2thZ2UuanNvblxuICAgIHdoaWxlIChkaXIgIT09IHBhdGguZGlybmFtZShkaXIpKSB7XG4gICAgICBjb25zdCBjYW5kaWRhdGUgPSBwYXRoLmpvaW4oZGlyLCAncGFja2FnZS5qc29uJylcbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKGNhbmRpZGF0ZSkpIHtcbiAgICAgICAgcGFja2FnZUpzb25QYXRoID0gY2FuZGlkYXRlXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICBkaXIgPSBwYXRoLmRpcm5hbWUoZGlyKVxuICAgIH1cblxuICAgIGlmICghcGFja2FnZUpzb25QYXRoKSB7XG4gICAgICByZXR1cm4ge31cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgUHJvZ3JhbShub2RlKSB7XG4gICAgICAgIGlmIChoYXNSZXBvcnRlZCkgcmV0dXJuXG4gICAgICAgIGhhc1JlcG9ydGVkID0gdHJ1ZVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgcGFja2FnZUpzb24gPSBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhwYWNrYWdlSnNvblBhdGgsICd1dGY4JykpXG4gICAgICAgICAgY29uc3QgZGV2RGVwcyA9IHBhY2thZ2VKc29uLmRldkRlcGVuZGVuY2llcyB8fCB7fVxuICAgICAgICAgIGNvbnN0IGRlcHMgPSBwYWNrYWdlSnNvbi5kZXBlbmRlbmNpZXMgfHwge31cbiAgICAgICAgICBjb25zdCBhbGxEZXBzID0geyAuLi5kZXBzLCAuLi5kZXZEZXBzIH1cbiAgICAgICAgICBjb25zdCBzY3JpcHRzID0gcGFja2FnZUpzb24uc2NyaXB0cyB8fCB7fVxuXG4gICAgICAgICAgLy8gQ2hlY2sgZGVwZW5kZW5jaWVzXG4gICAgICAgICAgZm9yIChjb25zdCBkZXAgb2YgUkVRVUlSRURfREVQRU5ERU5DSUVTKSB7XG4gICAgICAgICAgICBpZiAoIWFsbERlcHNbZGVwXSkge1xuICAgICAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlSWQ6ICdtaXNzaW5nRGVwZW5kZW5jeScsXG4gICAgICAgICAgICAgICAgZGF0YTogeyBkZXAgfSxcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBDaGVjayBzY3JpcHRzXG4gICAgICAgICAgZm9yIChjb25zdCBbc2NyaXB0TmFtZSwgeyBjb250YWlucywgZGVmaW5pdGlvbiB9XSBvZiBPYmplY3QuZW50cmllcyhSRVFVSVJFRF9TQ1JJUFRTKSkge1xuICAgICAgICAgICAgaWYgKCFzY3JpcHRzW3NjcmlwdE5hbWVdKSB7XG4gICAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2VJZDogJ21pc3NpbmdTY3JpcHQnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHsgc2NyaXB0OiBzY3JpcHROYW1lLCBkZWZpbml0aW9uIH0sXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFzY3JpcHRzW3NjcmlwdE5hbWVdLmluY2x1ZGVzKGNvbnRhaW5zKSkge1xuICAgICAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlSWQ6ICdpbnZhbGlkU2NyaXB0JyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7IHNjcmlwdDogc2NyaXB0TmFtZSwgZXhwZWN0ZWQ6IGNvbnRhaW5zLCBkZWZpbml0aW9uIH0sXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAvLyBJZ25vcmUgcGFyc2UgZXJyb3JzXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfVxuICB9LFxufVxuXG4vLyBSZXNldCB0aGUgZmxhZyB3aGVuIHRoZSBtb2R1bGUgaXMgcmVsb2FkZWQgKGZvciB3YXRjaCBtb2RlKVxuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0UmVwb3J0ZWQoKSB7XG4gIGhhc1JlcG9ydGVkID0gZmFsc2Vcbn1cblxuZXhwb3J0IGRlZmF1bHQgcnVsZVxuIl19