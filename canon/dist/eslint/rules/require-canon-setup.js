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
        contains: 'eslint src/blocks/',
        definition: `"lint:gallop": "eslint src/blocks/ --rule 'gallop/no-client-blocks: warn' --rule 'gallop/no-container-in-section: warn' --rule 'gallop/prefer-component-props: warn'"`,
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
    'generate:ai-rules': {
        contains: 'gallop generate',
        definition: '"generate:ai-rules": "gallop generate .cursorrules && gallop generate .github/copilot-instructions.md"',
    },
    'update:canon': {
        contains: '@gallop.software/canon',
        definition: '"update:canon": "npm update @gallop.software/canon"',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWlyZS1jYW5vbi1zZXR1cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lc2xpbnQvcnVsZXMvcmVxdWlyZS1jYW5vbi1zZXR1cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEtBQUssRUFBRSxNQUFNLElBQUksQ0FBQTtBQUN4QixPQUFPLEtBQUssSUFBSSxNQUFNLE1BQU0sQ0FBQTtBQUM1QixPQUFPLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFBO0FBRWhFLE1BQU0sU0FBUyxHQUFHLHFCQUFxQixDQUFBO0FBQ3ZDLE1BQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUUxQyxvREFBb0Q7QUFDcEQsSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFBO0FBRXZCLDRCQUE0QjtBQUM1QixNQUFNLHFCQUFxQixHQUFHLENBQUMsTUFBTSxFQUFFLHdCQUF3QixDQUFDLENBQUE7QUFFaEUsdUhBQXVIO0FBQ3ZILE1BQU0sZ0JBQWdCLEdBQTZEO0lBQ2pGLE1BQU0sRUFBRTtRQUNOLFFBQVEsRUFBRSxNQUFNO1FBQ2hCLFVBQVUsRUFBRSxrQkFBa0I7S0FDL0I7SUFDRCxLQUFLLEVBQUU7UUFDTCxRQUFRLEVBQUUsU0FBUztRQUNuQixVQUFVLEVBQUUseURBQXlEO0tBQ3RFO0lBQ0QsSUFBSSxFQUFFO1FBQ0osUUFBUSxFQUFFLFFBQVE7UUFDbEIsVUFBVSxFQUFFLHVCQUF1QjtLQUNwQztJQUNELGFBQWEsRUFBRTtRQUNiLFFBQVEsRUFBRSxvQkFBb0I7UUFDOUIsVUFBVSxFQUFFLHVLQUF1SztLQUNwTDtJQUNELEVBQUUsRUFBRTtRQUNGLFFBQVEsRUFBRSxLQUFLO1FBQ2YsVUFBVSxFQUFFLHNCQUFzQjtLQUNuQztJQUNELEtBQUssRUFBRTtRQUNMLFFBQVEsRUFBRSxjQUFjO1FBQ3hCLFVBQVUsRUFBRSx5QkFBeUI7S0FDdEM7SUFDRCxjQUFjLEVBQUU7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QUM7b0JBQ0gsQ0FBQztvQkFFRCxnQkFBZ0I7b0JBQ2hCLEtBQUssTUFBTSxDQUFDLFVBQVUsRUFBRSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDO3dCQUN0RixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7NEJBQ3pCLE9BQU8sQ0FBQyxNQUFNLENBQUM7Z0NBQ2IsSUFBSTtnQ0FDSixTQUFTLEVBQUUsZUFBZTtnQ0FDMUIsSUFBSSxFQUFFLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUU7NkJBQ3pDLENBQUMsQ0FBQTt3QkFDSixDQUFDOzZCQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7NEJBQ25ELE9BQU8sQ0FBQyxNQUFNLENBQUM7Z0NBQ2IsSUFBSTtnQ0FDSixTQUFTLEVBQUUsZUFBZTtnQ0FDMUIsSUFBSSxFQUFFLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRTs2QkFDN0QsQ0FBQyxDQUFBO3dCQUNKLENBQUM7b0JBQ0gsQ0FBQztnQkFDSCxDQUFDO2dCQUFDLE1BQU0sQ0FBQztvQkFDUCxzQkFBc0I7Z0JBQ3hCLENBQUM7WUFDSCxDQUFDO1NBQ0YsQ0FBQTtJQUNILENBQUM7Q0FDRixDQUFBO0FBRUQsOERBQThEO0FBQzlELE1BQU0sVUFBVSxhQUFhO0lBQzNCLFdBQVcsR0FBRyxLQUFLLENBQUE7QUFDckIsQ0FBQztBQUVELGVBQWUsSUFBSSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBSdWxlIH0gZnJvbSAnZXNsaW50J1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBnZXRDYW5vblVybCwgZ2V0Q2Fub25QYXR0ZXJuIH0gZnJvbSAnLi4vdXRpbHMvY2Fub24uanMnXG5cbmNvbnN0IFJVTEVfTkFNRSA9ICdyZXF1aXJlLWNhbm9uLXNldHVwJ1xuY29uc3QgcGF0dGVybiA9IGdldENhbm9uUGF0dGVybihSVUxFX05BTUUpXG5cbi8vIFRyYWNrIGlmIHdlJ3ZlIGFscmVhZHkgcmVwb3J0ZWQgZm9yIHRoaXMgbGludCBydW5cbmxldCBoYXNSZXBvcnRlZCA9IGZhbHNlXG5cbi8vIFJlcXVpcmVkIGRldiBkZXBlbmRlbmNpZXNcbmNvbnN0IFJFUVVJUkVEX0RFUEVOREVOQ0lFUyA9IFsna25pcCcsICdAZ2FsbG9wLnNvZnR3YXJlL2Nhbm9uJ11cblxuLy8gUmVxdWlyZWQgbnBtIHNjcmlwdHMgKGtleSA9IHNjcmlwdCBuYW1lLCB2YWx1ZSA9IHsgY29udGFpbnM6IHN0cmluZyB0byBjaGVjayBmb3IsIGRlZmluaXRpb246IGV4YWN0IHNjcmlwdCB0byBhZGQgfSlcbmNvbnN0IFJFUVVJUkVEX1NDUklQVFM6IFJlY29yZDxzdHJpbmcsIHsgY29udGFpbnM6IHN0cmluZzsgZGVmaW5pdGlvbjogc3RyaW5nIH0+ID0ge1xuICB1bnVzZWQ6IHtcbiAgICBjb250YWluczogJ2tuaXAnLFxuICAgIGRlZmluaXRpb246ICdcInVudXNlZFwiOiBcImtuaXBcIicsXG4gIH0sXG4gIGNoZWNrOiB7XG4gICAgY29udGFpbnM6ICducG0gcnVuJyxcbiAgICBkZWZpbml0aW9uOiAnXCJjaGVja1wiOiBcIm5wbSBydW4gbGludCAmJiBucG0gcnVuIHRzICYmIG5wbSBydW4gdW51c2VkXCInLFxuICB9LFxuICBsaW50OiB7XG4gICAgY29udGFpbnM6ICdlc2xpbnQnLFxuICAgIGRlZmluaXRpb246ICdcImxpbnRcIjogXCJlc2xpbnQgc3JjL1wiJyxcbiAgfSxcbiAgJ2xpbnQ6Z2FsbG9wJzoge1xuICAgIGNvbnRhaW5zOiAnZXNsaW50IHNyYy9ibG9ja3MvJyxcbiAgICBkZWZpbml0aW9uOiBgXCJsaW50OmdhbGxvcFwiOiBcImVzbGludCBzcmMvYmxvY2tzLyAtLXJ1bGUgJ2dhbGxvcC9uby1jbGllbnQtYmxvY2tzOiB3YXJuJyAtLXJ1bGUgJ2dhbGxvcC9uby1jb250YWluZXItaW4tc2VjdGlvbjogd2FybicgLS1ydWxlICdnYWxsb3AvcHJlZmVyLWNvbXBvbmVudC1wcm9wczogd2FybidcImAsXG4gIH0sXG4gIHRzOiB7XG4gICAgY29udGFpbnM6ICd0c2MnLFxuICAgIGRlZmluaXRpb246ICdcInRzXCI6IFwidHNjIC0tbm9FbWl0XCInLFxuICB9LFxuICBhdWRpdDoge1xuICAgIGNvbnRhaW5zOiAnZ2FsbG9wIGF1ZGl0JyxcbiAgICBkZWZpbml0aW9uOiAnXCJhdWRpdFwiOiBcImdhbGxvcCBhdWRpdFwiJyxcbiAgfSxcbiAgJ2F1ZGl0OnN0cmljdCc6IHtcbiAgICBjb250YWluczogJ2dhbGxvcCBhdWRpdCcsXG4gICAgZGVmaW5pdGlvbjogJ1wiYXVkaXQ6c3RyaWN0XCI6IFwiZ2FsbG9wIGF1ZGl0IC0tc3RyaWN0XCInLFxuICB9LFxuICAnYXVkaXQ6anNvbic6IHtcbiAgICBjb250YWluczogJ2dhbGxvcCBhdWRpdCcsXG4gICAgZGVmaW5pdGlvbjogJ1wiYXVkaXQ6anNvblwiOiBcImdhbGxvcCBhdWRpdCAtLWpzb25cIicsXG4gIH0sXG4gICdnZW5lcmF0ZTphaS1ydWxlcyc6IHtcbiAgICBjb250YWluczogJ2dhbGxvcCBnZW5lcmF0ZScsXG4gICAgZGVmaW5pdGlvbjogJ1wiZ2VuZXJhdGU6YWktcnVsZXNcIjogXCJnYWxsb3AgZ2VuZXJhdGUgLmN1cnNvcnJ1bGVzICYmIGdhbGxvcCBnZW5lcmF0ZSAuZ2l0aHViL2NvcGlsb3QtaW5zdHJ1Y3Rpb25zLm1kXCInLFxuICB9LFxuICAndXBkYXRlOmNhbm9uJzoge1xuICAgIGNvbnRhaW5zOiAnQGdhbGxvcC5zb2Z0d2FyZS9jYW5vbicsXG4gICAgZGVmaW5pdGlvbjogJ1widXBkYXRlOmNhbm9uXCI6IFwibnBtIHVwZGF0ZSBAZ2FsbG9wLnNvZnR3YXJlL2Nhbm9uXCInLFxuICB9LFxufVxuXG5jb25zdCBydWxlOiBSdWxlLlJ1bGVNb2R1bGUgPSB7XG4gIG1ldGE6IHtcbiAgICB0eXBlOiAnc3VnZ2VzdGlvbicsXG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246IHBhdHRlcm4/LnN1bW1hcnkgfHwgJ1JlcXVpcmUgQ2Fub24gc2V0dXAgaW4gcGFja2FnZS5qc29uJyxcbiAgICAgIHJlY29tbWVuZGVkOiB0cnVlLFxuICAgICAgdXJsOiBnZXRDYW5vblVybChSVUxFX05BTUUpLFxuICAgIH0sXG4gICAgbWVzc2FnZXM6IHtcbiAgICAgIG1pc3NpbmdEZXBlbmRlbmN5OiBgW0Nhbm9uXSBNaXNzaW5nIHJlcXVpcmVkIGRlcGVuZGVuY3k6IFwie3tkZXB9fVwiLiBSdW46IG5wbSBpbnN0YWxsIC1EIHt7ZGVwfX1gLFxuICAgICAgbWlzc2luZ1NjcmlwdDogYFtDYW5vbl0gTWlzc2luZyByZXF1aXJlZCBucG0gc2NyaXB0IFwie3tzY3JpcHR9fVwiLiBBZGQgdG8gcGFja2FnZS5qc29uIHNjcmlwdHM6IHt7ZGVmaW5pdGlvbn19YCxcbiAgICAgIGludmFsaWRTY3JpcHQ6IGBbQ2Fub25dIFNjcmlwdCBcInt7c2NyaXB0fX1cIiBzaG91bGQgY29udGFpbiBcInt7ZXhwZWN0ZWR9fVwiLiBFeHBlY3RlZDoge3tkZWZpbml0aW9ufX1gLFxuICAgIH0sXG4gICAgc2NoZW1hOiBbXSxcbiAgfSxcblxuICBjcmVhdGUoY29udGV4dCkge1xuICAgIC8vIE9ubHkgY2hlY2sgb25jZSBwZXIgbGludCBydW4sIG9uIHRoZSBmaXJzdCBmaWxlXG4gICAgaWYgKGhhc1JlcG9ydGVkKSB7XG4gICAgICByZXR1cm4ge31cbiAgICB9XG5cbiAgICAvLyBGaW5kIHRoZSBwcm9qZWN0IHJvb3QgKHdoZXJlIHBhY2thZ2UuanNvbiBpcylcbiAgICBjb25zdCBmaWxlbmFtZSA9IGNvbnRleHQuZmlsZW5hbWUgfHwgY29udGV4dC5nZXRGaWxlbmFtZSgpXG4gICAgbGV0IGRpciA9IHBhdGguZGlybmFtZShmaWxlbmFtZSlcbiAgICBsZXQgcGFja2FnZUpzb25QYXRoID0gJydcbiAgICBcbiAgICAvLyBXYWxrIHVwIHRvIGZpbmQgcGFja2FnZS5qc29uXG4gICAgd2hpbGUgKGRpciAhPT0gcGF0aC5kaXJuYW1lKGRpcikpIHtcbiAgICAgIGNvbnN0IGNhbmRpZGF0ZSA9IHBhdGguam9pbihkaXIsICdwYWNrYWdlLmpzb24nKVxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoY2FuZGlkYXRlKSkge1xuICAgICAgICBwYWNrYWdlSnNvblBhdGggPSBjYW5kaWRhdGVcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICAgIGRpciA9IHBhdGguZGlybmFtZShkaXIpXG4gICAgfVxuXG4gICAgaWYgKCFwYWNrYWdlSnNvblBhdGgpIHtcbiAgICAgIHJldHVybiB7fVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBQcm9ncmFtKG5vZGUpIHtcbiAgICAgICAgaWYgKGhhc1JlcG9ydGVkKSByZXR1cm5cbiAgICAgICAgaGFzUmVwb3J0ZWQgPSB0cnVlXG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCBwYWNrYWdlSnNvbiA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHBhY2thZ2VKc29uUGF0aCwgJ3V0ZjgnKSlcbiAgICAgICAgICBjb25zdCBkZXZEZXBzID0gcGFja2FnZUpzb24uZGV2RGVwZW5kZW5jaWVzIHx8IHt9XG4gICAgICAgICAgY29uc3QgZGVwcyA9IHBhY2thZ2VKc29uLmRlcGVuZGVuY2llcyB8fCB7fVxuICAgICAgICAgIGNvbnN0IGFsbERlcHMgPSB7IC4uLmRlcHMsIC4uLmRldkRlcHMgfVxuICAgICAgICAgIGNvbnN0IHNjcmlwdHMgPSBwYWNrYWdlSnNvbi5zY3JpcHRzIHx8IHt9XG5cbiAgICAgICAgICAvLyBDaGVjayBkZXBlbmRlbmNpZXNcbiAgICAgICAgICBmb3IgKGNvbnN0IGRlcCBvZiBSRVFVSVJFRF9ERVBFTkRFTkNJRVMpIHtcbiAgICAgICAgICAgIGlmICghYWxsRGVwc1tkZXBdKSB7XG4gICAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2VJZDogJ21pc3NpbmdEZXBlbmRlbmN5JyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7IGRlcCB9LFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIENoZWNrIHNjcmlwdHNcbiAgICAgICAgICBmb3IgKGNvbnN0IFtzY3JpcHROYW1lLCB7IGNvbnRhaW5zLCBkZWZpbml0aW9uIH1dIG9mIE9iamVjdC5lbnRyaWVzKFJFUVVJUkVEX1NDUklQVFMpKSB7XG4gICAgICAgICAgICBpZiAoIXNjcmlwdHNbc2NyaXB0TmFtZV0pIHtcbiAgICAgICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICAgICAgbWVzc2FnZUlkOiAnbWlzc2luZ1NjcmlwdCcsXG4gICAgICAgICAgICAgICAgZGF0YTogeyBzY3JpcHQ6IHNjcmlwdE5hbWUsIGRlZmluaXRpb24gfSxcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXNjcmlwdHNbc2NyaXB0TmFtZV0uaW5jbHVkZXMoY29udGFpbnMpKSB7XG4gICAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2VJZDogJ2ludmFsaWRTY3JpcHQnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHsgc2NyaXB0OiBzY3JpcHROYW1lLCBleHBlY3RlZDogY29udGFpbnMsIGRlZmluaXRpb24gfSxcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgIC8vIElnbm9yZSBwYXJzZSBlcnJvcnNcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9XG4gIH0sXG59XG5cbi8vIFJlc2V0IHRoZSBmbGFnIHdoZW4gdGhlIG1vZHVsZSBpcyByZWxvYWRlZCAoZm9yIHdhdGNoIG1vZGUpXG5leHBvcnQgZnVuY3Rpb24gcmVzZXRSZXBvcnRlZCgpIHtcbiAgaGFzUmVwb3J0ZWQgPSBmYWxzZVxufVxuXG5leHBvcnQgZGVmYXVsdCBydWxlXG4iXX0=