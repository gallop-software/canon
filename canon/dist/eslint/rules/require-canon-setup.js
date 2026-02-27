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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWlyZS1jYW5vbi1zZXR1cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lc2xpbnQvcnVsZXMvcmVxdWlyZS1jYW5vbi1zZXR1cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEtBQUssRUFBRSxNQUFNLElBQUksQ0FBQTtBQUN4QixPQUFPLEtBQUssSUFBSSxNQUFNLE1BQU0sQ0FBQTtBQUM1QixPQUFPLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFBO0FBRWhFLE1BQU0sU0FBUyxHQUFHLHFCQUFxQixDQUFBO0FBQ3ZDLE1BQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUUxQyxvREFBb0Q7QUFDcEQsSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFBO0FBRXZCLDRCQUE0QjtBQUM1QixNQUFNLHFCQUFxQixHQUFHLENBQUMsTUFBTSxFQUFFLHdCQUF3QixDQUFDLENBQUE7QUFFaEUsdUhBQXVIO0FBQ3ZILE1BQU0sZ0JBQWdCLEdBQTZEO0lBQ2pGLE1BQU0sRUFBRTtRQUNOLFFBQVEsRUFBRSxNQUFNO1FBQ2hCLFVBQVUsRUFBRSxrQkFBa0I7S0FDL0I7SUFDRCxLQUFLLEVBQUU7UUFDTCxRQUFRLEVBQUUsU0FBUztRQUNuQixVQUFVLEVBQUUseURBQXlEO0tBQ3RFO0lBQ0QsSUFBSSxFQUFFO1FBQ0osUUFBUSxFQUFFLFFBQVE7UUFDbEIsVUFBVSxFQUFFLHVCQUF1QjtLQUNwQztJQUNELGFBQWEsRUFBRTtRQUNiLFFBQVEsRUFBRSxRQUFRO1FBQ2xCLFVBQVUsRUFBRSxpTEFBaUw7S0FDOUw7SUFDRCxFQUFFLEVBQUU7UUFDRixRQUFRLEVBQUUsS0FBSztRQUNmLFVBQVUsRUFBRSxzQkFBc0I7S0FDbkM7SUFDRCxLQUFLLEVBQUU7UUFDTCxRQUFRLEVBQUUsY0FBYztRQUN4QixVQUFVLEVBQUUseUJBQXlCO0tBQ3RDO0lBQ0QsY0FBYyxFQUFFO1FB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O29CQUNILENBQUM7b0JBRUQsZ0JBQWdCO29CQUNoQixLQUFLLE1BQU0sQ0FBQyxVQUFVLEVBQUUsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQzt3QkFDdEYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDOzRCQUN6QixPQUFPLENBQUMsTUFBTSxDQUFDO2dDQUNiLElBQUk7Z0NBQ0osU0FBUyxFQUFFLGVBQWU7Z0NBQzFCLElBQUksRUFBRSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFOzZCQUN6QyxDQUFDLENBQUE7d0JBQ0osQ0FBQzs2QkFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDOzRCQUNuRCxPQUFPLENBQUMsTUFBTSxDQUFDO2dDQUNiLElBQUk7Z0NBQ0osU0FBUyxFQUFFLGVBQWU7Z0NBQzFCLElBQUksRUFBRSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUU7NkJBQzdELENBQUMsQ0FBQTt3QkFDSixDQUFDO29CQUNILENBQUM7Z0JBQ0gsQ0FBQztnQkFBQyxNQUFNLENBQUM7b0JBQ1Asc0JBQXNCO2dCQUN4QixDQUFDO1lBQ0gsQ0FBQztTQUNGLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQTtBQUVELDhEQUE4RDtBQUM5RCxNQUFNLFVBQVUsYUFBYTtJQUMzQixXQUFXLEdBQUcsS0FBSyxDQUFBO0FBQ3JCLENBQUM7QUFFRCxlQUFlLElBQUksQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgUnVsZSB9IGZyb20gJ2VzbGludCdcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJ1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgZ2V0Q2Fub25VcmwsIGdldENhbm9uUGF0dGVybiB9IGZyb20gJy4uL3V0aWxzL2Nhbm9uLmpzJ1xuXG5jb25zdCBSVUxFX05BTUUgPSAncmVxdWlyZS1jYW5vbi1zZXR1cCdcbmNvbnN0IHBhdHRlcm4gPSBnZXRDYW5vblBhdHRlcm4oUlVMRV9OQU1FKVxuXG4vLyBUcmFjayBpZiB3ZSd2ZSBhbHJlYWR5IHJlcG9ydGVkIGZvciB0aGlzIGxpbnQgcnVuXG5sZXQgaGFzUmVwb3J0ZWQgPSBmYWxzZVxuXG4vLyBSZXF1aXJlZCBkZXYgZGVwZW5kZW5jaWVzXG5jb25zdCBSRVFVSVJFRF9ERVBFTkRFTkNJRVMgPSBbJ2tuaXAnLCAnQGdhbGxvcC5zb2Z0d2FyZS9jYW5vbiddXG5cbi8vIFJlcXVpcmVkIG5wbSBzY3JpcHRzIChrZXkgPSBzY3JpcHQgbmFtZSwgdmFsdWUgPSB7IGNvbnRhaW5zOiBzdHJpbmcgdG8gY2hlY2sgZm9yLCBkZWZpbml0aW9uOiBleGFjdCBzY3JpcHQgdG8gYWRkIH0pXG5jb25zdCBSRVFVSVJFRF9TQ1JJUFRTOiBSZWNvcmQ8c3RyaW5nLCB7IGNvbnRhaW5zOiBzdHJpbmc7IGRlZmluaXRpb246IHN0cmluZyB9PiA9IHtcbiAgdW51c2VkOiB7XG4gICAgY29udGFpbnM6ICdrbmlwJyxcbiAgICBkZWZpbml0aW9uOiAnXCJ1bnVzZWRcIjogXCJrbmlwXCInLFxuICB9LFxuICBjaGVjazoge1xuICAgIGNvbnRhaW5zOiAnbnBtIHJ1bicsXG4gICAgZGVmaW5pdGlvbjogJ1wiY2hlY2tcIjogXCJucG0gcnVuIGxpbnQgJiYgbnBtIHJ1biB0cyAmJiBucG0gcnVuIHVudXNlZFwiJyxcbiAgfSxcbiAgbGludDoge1xuICAgIGNvbnRhaW5zOiAnZXNsaW50JyxcbiAgICBkZWZpbml0aW9uOiAnXCJsaW50XCI6IFwiZXNsaW50IHNyYy9cIicsXG4gIH0sXG4gICdsaW50OmdhbGxvcCc6IHtcbiAgICBjb250YWluczogJ2VzbGludCcsXG4gICAgZGVmaW5pdGlvbjogYFwibGludDpnYWxsb3BcIjogXCJlc2xpbnQgJ3NyYy9hcHAvKiovX2Jsb2Nrcy8nIC0tcnVsZSAnZ2FsbG9wL25vLWNsaWVudC1ibG9ja3M6IHdhcm4nIC0tcnVsZSAnZ2FsbG9wL25vLWNvbnRhaW5lci1pbi1zZWN0aW9uOiB3YXJuJyAtLXJ1bGUgJ2dhbGxvcC9wcmVmZXItY29tcG9uZW50LXByb3BzOiB3YXJuJ1wiYCxcbiAgfSxcbiAgdHM6IHtcbiAgICBjb250YWluczogJ3RzYycsXG4gICAgZGVmaW5pdGlvbjogJ1widHNcIjogXCJ0c2MgLS1ub0VtaXRcIicsXG4gIH0sXG4gIGF1ZGl0OiB7XG4gICAgY29udGFpbnM6ICdnYWxsb3AgYXVkaXQnLFxuICAgIGRlZmluaXRpb246ICdcImF1ZGl0XCI6IFwiZ2FsbG9wIGF1ZGl0XCInLFxuICB9LFxuICAnYXVkaXQ6c3RyaWN0Jzoge1xuICAgIGNvbnRhaW5zOiAnZ2FsbG9wIGF1ZGl0JyxcbiAgICBkZWZpbml0aW9uOiAnXCJhdWRpdDpzdHJpY3RcIjogXCJnYWxsb3AgYXVkaXQgLS1zdHJpY3RcIicsXG4gIH0sXG4gICdhdWRpdDpqc29uJzoge1xuICAgIGNvbnRhaW5zOiAnZ2FsbG9wIGF1ZGl0JyxcbiAgICBkZWZpbml0aW9uOiAnXCJhdWRpdDpqc29uXCI6IFwiZ2FsbG9wIGF1ZGl0IC0tanNvblwiJyxcbiAgfSxcbiAgJ2dlbmVyYXRlOmFpLXJ1bGVzJzoge1xuICAgIGNvbnRhaW5zOiAnZ2FsbG9wIGdlbmVyYXRlJyxcbiAgICBkZWZpbml0aW9uOiAnXCJnZW5lcmF0ZTphaS1ydWxlc1wiOiBcImdhbGxvcCBnZW5lcmF0ZSAuY3Vyc29ycnVsZXMgJiYgZ2FsbG9wIGdlbmVyYXRlIC5naXRodWIvY29waWxvdC1pbnN0cnVjdGlvbnMubWRcIicsXG4gIH0sXG4gICd1cGRhdGU6Y2Fub24nOiB7XG4gICAgY29udGFpbnM6ICdAZ2FsbG9wLnNvZnR3YXJlL2Nhbm9uJyxcbiAgICBkZWZpbml0aW9uOiAnXCJ1cGRhdGU6Y2Fub25cIjogXCJucG0gdXBkYXRlIEBnYWxsb3Auc29mdHdhcmUvY2Fub25cIicsXG4gIH0sXG59XG5cbmNvbnN0IHJ1bGU6IFJ1bGUuUnVsZU1vZHVsZSA9IHtcbiAgbWV0YToge1xuICAgIHR5cGU6ICdzdWdnZXN0aW9uJyxcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjogcGF0dGVybj8uc3VtbWFyeSB8fCAnUmVxdWlyZSBDYW5vbiBzZXR1cCBpbiBwYWNrYWdlLmpzb24nLFxuICAgICAgcmVjb21tZW5kZWQ6IHRydWUsXG4gICAgICB1cmw6IGdldENhbm9uVXJsKFJVTEVfTkFNRSksXG4gICAgfSxcbiAgICBtZXNzYWdlczoge1xuICAgICAgbWlzc2luZ0RlcGVuZGVuY3k6IGBbQ2Fub25dIE1pc3NpbmcgcmVxdWlyZWQgZGVwZW5kZW5jeTogXCJ7e2RlcH19XCIuIFJ1bjogbnBtIGluc3RhbGwgLUQge3tkZXB9fWAsXG4gICAgICBtaXNzaW5nU2NyaXB0OiBgW0Nhbm9uXSBNaXNzaW5nIHJlcXVpcmVkIG5wbSBzY3JpcHQgXCJ7e3NjcmlwdH19XCIuIEFkZCB0byBwYWNrYWdlLmpzb24gc2NyaXB0czoge3tkZWZpbml0aW9ufX1gLFxuICAgICAgaW52YWxpZFNjcmlwdDogYFtDYW5vbl0gU2NyaXB0IFwie3tzY3JpcHR9fVwiIHNob3VsZCBjb250YWluIFwie3tleHBlY3RlZH19XCIuIEV4cGVjdGVkOiB7e2RlZmluaXRpb259fWAsXG4gICAgfSxcbiAgICBzY2hlbWE6IFtdLFxuICB9LFxuXG4gIGNyZWF0ZShjb250ZXh0KSB7XG4gICAgLy8gT25seSBjaGVjayBvbmNlIHBlciBsaW50IHJ1biwgb24gdGhlIGZpcnN0IGZpbGVcbiAgICBpZiAoaGFzUmVwb3J0ZWQpIHtcbiAgICAgIHJldHVybiB7fVxuICAgIH1cblxuICAgIC8vIEZpbmQgdGhlIHByb2plY3Qgcm9vdCAod2hlcmUgcGFja2FnZS5qc29uIGlzKVxuICAgIGNvbnN0IGZpbGVuYW1lID0gY29udGV4dC5maWxlbmFtZSB8fCBjb250ZXh0LmdldEZpbGVuYW1lKClcbiAgICBsZXQgZGlyID0gcGF0aC5kaXJuYW1lKGZpbGVuYW1lKVxuICAgIGxldCBwYWNrYWdlSnNvblBhdGggPSAnJ1xuICAgIFxuICAgIC8vIFdhbGsgdXAgdG8gZmluZCBwYWNrYWdlLmpzb25cbiAgICB3aGlsZSAoZGlyICE9PSBwYXRoLmRpcm5hbWUoZGlyKSkge1xuICAgICAgY29uc3QgY2FuZGlkYXRlID0gcGF0aC5qb2luKGRpciwgJ3BhY2thZ2UuanNvbicpXG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhjYW5kaWRhdGUpKSB7XG4gICAgICAgIHBhY2thZ2VKc29uUGF0aCA9IGNhbmRpZGF0ZVxuICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgZGlyID0gcGF0aC5kaXJuYW1lKGRpcilcbiAgICB9XG5cbiAgICBpZiAoIXBhY2thZ2VKc29uUGF0aCkge1xuICAgICAgcmV0dXJuIHt9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIFByb2dyYW0obm9kZSkge1xuICAgICAgICBpZiAoaGFzUmVwb3J0ZWQpIHJldHVyblxuICAgICAgICBoYXNSZXBvcnRlZCA9IHRydWVcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHBhY2thZ2VKc29uID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMocGFja2FnZUpzb25QYXRoLCAndXRmOCcpKVxuICAgICAgICAgIGNvbnN0IGRldkRlcHMgPSBwYWNrYWdlSnNvbi5kZXZEZXBlbmRlbmNpZXMgfHwge31cbiAgICAgICAgICBjb25zdCBkZXBzID0gcGFja2FnZUpzb24uZGVwZW5kZW5jaWVzIHx8IHt9XG4gICAgICAgICAgY29uc3QgYWxsRGVwcyA9IHsgLi4uZGVwcywgLi4uZGV2RGVwcyB9XG4gICAgICAgICAgY29uc3Qgc2NyaXB0cyA9IHBhY2thZ2VKc29uLnNjcmlwdHMgfHwge31cblxuICAgICAgICAgIC8vIENoZWNrIGRlcGVuZGVuY2llc1xuICAgICAgICAgIGZvciAoY29uc3QgZGVwIG9mIFJFUVVJUkVEX0RFUEVOREVOQ0lFUykge1xuICAgICAgICAgICAgaWYgKCFhbGxEZXBzW2RlcF0pIHtcbiAgICAgICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICAgICAgbWVzc2FnZUlkOiAnbWlzc2luZ0RlcGVuZGVuY3knLFxuICAgICAgICAgICAgICAgIGRhdGE6IHsgZGVwIH0sXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQ2hlY2sgc2NyaXB0c1xuICAgICAgICAgIGZvciAoY29uc3QgW3NjcmlwdE5hbWUsIHsgY29udGFpbnMsIGRlZmluaXRpb24gfV0gb2YgT2JqZWN0LmVudHJpZXMoUkVRVUlSRURfU0NSSVBUUykpIHtcbiAgICAgICAgICAgIGlmICghc2NyaXB0c1tzY3JpcHROYW1lXSkge1xuICAgICAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlSWQ6ICdtaXNzaW5nU2NyaXB0JyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7IHNjcmlwdDogc2NyaXB0TmFtZSwgZGVmaW5pdGlvbiB9LFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIGlmICghc2NyaXB0c1tzY3JpcHROYW1lXS5pbmNsdWRlcyhjb250YWlucykpIHtcbiAgICAgICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICAgICAgbWVzc2FnZUlkOiAnaW52YWxpZFNjcmlwdCcsXG4gICAgICAgICAgICAgICAgZGF0YTogeyBzY3JpcHQ6IHNjcmlwdE5hbWUsIGV4cGVjdGVkOiBjb250YWlucywgZGVmaW5pdGlvbiB9LFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgLy8gSWdub3JlIHBhcnNlIGVycm9yc1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH1cbiAgfSxcbn1cblxuLy8gUmVzZXQgdGhlIGZsYWcgd2hlbiB0aGUgbW9kdWxlIGlzIHJlbG9hZGVkIChmb3Igd2F0Y2ggbW9kZSlcbmV4cG9ydCBmdW5jdGlvbiByZXNldFJlcG9ydGVkKCkge1xuICBoYXNSZXBvcnRlZCA9IGZhbHNlXG59XG5cbmV4cG9ydCBkZWZhdWx0IHJ1bGVcbiJdfQ==