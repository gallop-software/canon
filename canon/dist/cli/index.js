#!/usr/bin/env node
import { audit } from './commands/audit.js';
import { generate } from './commands/generate.js';
import { version } from '../index.js';
const args = process.argv.slice(2);
const command = args[0];
// Colors for terminal output
const colors = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
};
function showHelp() {
    console.log(`
${colors.bold}Gallop CLI${colors.reset} - Canon Compliance Tooling
${colors.dim}Canon Version: ${version}${colors.reset}

${colors.bold}Usage:${colors.reset}
  gallop <command> [options]

${colors.bold}Commands:${colors.reset}
  audit [path]       Check Canon compliance (default: src/)
  generate [output]  Generate AI rules from Canon
  version            Show version information
  help               Show this help message

${colors.bold}Audit Options:${colors.reset}
  --strict           Exit with error code on violations
  --json             Output as JSON

${colors.bold}Generate Options:${colors.reset}
  gallop generate                  Generate all files (.cursorrules, CLAUDE.md, copilot-instructions.md)
  gallop generate .cursorrules     Generate .cursorrules only
  gallop generate CLAUDE.md        Generate CLAUDE.md only
  gallop generate .github/copilot-instructions.md
  --output, -o       Output file path

${colors.bold}Examples:${colors.reset}
  gallop audit
  gallop audit src/blocks/ --strict
  gallop generate
  gallop generate .cursorrules
  gallop generate CLAUDE.md
  gallop generate --output .github/copilot-instructions.md
`);
}
function showVersion() {
    console.log(`Gallop CLI v1.0.0`);
    console.log(`Canon v${version}`);
}
/**
 * Detect output format from filename
 */
function detectFormat(filename) {
    const lower = filename.toLowerCase();
    if (lower.endsWith('claude.md'))
        return 'claude';
    if (lower.endsWith('copilot-instructions.md'))
        return 'copilot';
    return 'cursorrules';
}
async function main() {
    switch (command) {
        case 'audit':
            const auditPath = args[1] && !args[1].startsWith('--') ? args[1] : 'src/';
            const auditOptions = {
                strict: args.includes('--strict'),
                json: args.includes('--json'),
                fix: args.includes('--fix'),
            };
            await audit(auditPath, auditOptions);
            break;
        case 'generate': {
            // Find output path from args
            const outputIndex = args.indexOf('--output');
            const outputIndexShort = args.indexOf('-o');
            let outputPath = null;
            if (outputIndex !== -1 && args[outputIndex + 1]) {
                outputPath = args[outputIndex + 1];
            }
            else if (outputIndexShort !== -1 && args[outputIndexShort + 1]) {
                outputPath = args[outputIndexShort + 1];
            }
            else if (args[1] && !args[1].startsWith('--')) {
                outputPath = args[1];
            }
            if (outputPath) {
                // Single-file generation
                await generate({
                    output: outputPath,
                    format: detectFormat(outputPath),
                });
            }
            else {
                // No args → generate all files
                await generate({
                    output: 'all',
                    format: 'cursorrules', // unused when output is 'all'
                });
            }
            break;
        }
        case 'version':
        case '-v':
        case '--version':
            showVersion();
            break;
        case 'help':
        case '-h':
        case '--help':
        case undefined:
            showHelp();
            break;
        default:
            console.error(`Unknown command: ${command}`);
            console.error(`Run 'gallop help' for usage information.`);
            process.exit(1);
    }
}
main().catch((error) => {
    console.error('Error:', error.message);
    process.exit(1);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2xpL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0scUJBQXFCLENBQUE7QUFDM0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHdCQUF3QixDQUFBO0FBQ2pELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxhQUFhLENBQUE7QUFFckMsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDbEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBRXZCLDZCQUE2QjtBQUM3QixNQUFNLE1BQU0sR0FBRztJQUNiLEtBQUssRUFBRSxTQUFTO0lBQ2hCLElBQUksRUFBRSxTQUFTO0lBQ2YsR0FBRyxFQUFFLFNBQVM7SUFDZCxHQUFHLEVBQUUsVUFBVTtJQUNmLEtBQUssRUFBRSxVQUFVO0lBQ2pCLE1BQU0sRUFBRSxVQUFVO0lBQ2xCLElBQUksRUFBRSxVQUFVO0lBQ2hCLE9BQU8sRUFBRSxVQUFVO0lBQ25CLElBQUksRUFBRSxVQUFVO0NBQ2pCLENBQUE7QUFFRCxTQUFTLFFBQVE7SUFDZixPQUFPLENBQUMsR0FBRyxDQUFDO0VBQ1osTUFBTSxDQUFDLElBQUksYUFBYSxNQUFNLENBQUMsS0FBSztFQUNwQyxNQUFNLENBQUMsR0FBRyxrQkFBa0IsT0FBTyxHQUFHLE1BQU0sQ0FBQyxLQUFLOztFQUVsRCxNQUFNLENBQUMsSUFBSSxTQUFTLE1BQU0sQ0FBQyxLQUFLOzs7RUFHaEMsTUFBTSxDQUFDLElBQUksWUFBWSxNQUFNLENBQUMsS0FBSzs7Ozs7O0VBTW5DLE1BQU0sQ0FBQyxJQUFJLGlCQUFpQixNQUFNLENBQUMsS0FBSzs7OztFQUl4QyxNQUFNLENBQUMsSUFBSSxvQkFBb0IsTUFBTSxDQUFDLEtBQUs7Ozs7Ozs7RUFPM0Ms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LENBQUM7UUFDZixLQUFLLElBQUksQ0FBQztRQUNWLEtBQUssV0FBVztZQUNkLFdBQVcsRUFBRSxDQUFBO1lBQ2IsTUFBSztRQUVQLEtBQUssTUFBTSxDQUFDO1FBQ1osS0FBSyxJQUFJLENBQUM7UUFDVixLQUFLLFFBQVEsQ0FBQztRQUNkLEtBQUssU0FBUztZQUNaLFFBQVEsRUFBRSxDQUFBO1lBQ1YsTUFBSztRQUVQO1lBQ0UsT0FBTyxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsT0FBTyxFQUFFLENBQUMsQ0FBQTtZQUM1QyxPQUFPLENBQUMsS0FBSyxDQUFDLDBDQUEwQyxDQUFDLENBQUE7WUFDekQsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNuQixDQUFDO0FBQ0gsQ0FBQztBQUVELElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO0lBQ3JCLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUN0QyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ2pCLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuXG5pbXBvcnQgeyBhdWRpdCB9IGZyb20gJy4vY29tbWFuZHMvYXVkaXQuanMnXG5pbXBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gJy4vY29tbWFuZHMvZ2VuZXJhdGUuanMnXG5pbXBvcnQgeyB2ZXJzaW9uIH0gZnJvbSAnLi4vaW5kZXguanMnXG5cbmNvbnN0IGFyZ3MgPSBwcm9jZXNzLmFyZ3Yuc2xpY2UoMilcbmNvbnN0IGNvbW1hbmQgPSBhcmdzWzBdXG5cbi8vIENvbG9ycyBmb3IgdGVybWluYWwgb3V0cHV0XG5jb25zdCBjb2xvcnMgPSB7XG4gIHJlc2V0OiAnXFx4MWJbMG0nLFxuICBib2xkOiAnXFx4MWJbMW0nLFxuICBkaW06ICdcXHgxYlsybScsXG4gIHJlZDogJ1xceDFiWzMxbScsXG4gIGdyZWVuOiAnXFx4MWJbMzJtJyxcbiAgeWVsbG93OiAnXFx4MWJbMzNtJyxcbiAgYmx1ZTogJ1xceDFiWzM0bScsXG4gIG1hZ2VudGE6ICdcXHgxYlszNW0nLFxuICBjeWFuOiAnXFx4MWJbMzZtJyxcbn1cblxuZnVuY3Rpb24gc2hvd0hlbHAoKSB7XG4gIGNvbnNvbGUubG9nKGBcbiR7Y29sb3JzLmJvbGR9R2FsbG9wIENMSSR7Y29sb3JzLnJlc2V0fSAtIENhbm9uIENvbXBsaWFuY2UgVG9vbGluZ1xuJHtjb2xvcnMuZGltfUNhbm9uIFZlcnNpb246ICR7dmVyc2lvbn0ke2NvbG9ycy5yZXNldH1cblxuJHtjb2xvcnMuYm9sZH1Vc2FnZToke2NvbG9ycy5yZXNldH1cbiAgZ2FsbG9wIDxjb21tYW5kPiBbb3B0aW9uc11cblxuJHtjb2xvcnMuYm9sZH1Db21tYW5kczoke2NvbG9ycy5yZXNldH1cbiAgYXVkaXQgW3BhdGhdICAgICAgIENoZWNrIENhbm9uIGNvbXBsaWFuY2UgKGRlZmF1bHQ6IHNyYy8pXG4gIGdlbmVyYXRlIFtvdXRwdXRdICBHZW5lcmF0ZSBBSSBydWxlcyBmcm9tIENhbm9uXG4gIHZlcnNpb24gICAgICAgICAgICBTaG93IHZlcnNpb24gaW5mb3JtYXRpb25cbiAgaGVscCAgICAgICAgICAgICAgIFNob3cgdGhpcyBoZWxwIG1lc3NhZ2VcblxuJHtjb2xvcnMuYm9sZH1BdWRpdCBPcHRpb25zOiR7Y29sb3JzLnJlc2V0fVxuICAtLXN0cmljdCAgICAgICAgICAgRXhpdCB3aXRoIGVycm9yIGNvZGUgb24gdmlvbGF0aW9uc1xuICAtLWpzb24gICAgICAgICAgICAgT3V0cHV0IGFzIEpTT05cblxuJHtjb2xvcnMuYm9sZH1HZW5lcmF0ZSBPcHRpb25zOiR7Y29sb3JzLnJlc2V0fVxuICBnYWxsb3AgZ2VuZXJhdGUgICAgICAgICAgICAgICAgICBHZW5lcmF0ZSBhbGwgZmlsZXMgKC5jdXJzb3JydWxlcywgQ0xBVURFLm1kLCBjb3BpbG90LWluc3RydWN0aW9ucy5tZClcbiAgZ2FsbG9wIGdlbmVyYXRlIC5jdXJzb3JydWxlcyAgICAgR2VuZXJhdGUgLmN1cnNvcnJ1bGVzIG9ubHlcbiAgZ2FsbG9wIGdlbmVyYXRlIENMQVVERS5tZCAgICAgICAgR2VuZXJhdGUgQ0xBVURFLm1kIG9ubHlcbiAgZ2FsbG9wIGdlbmVyYXRlIC5naXRodWIvY29waWxvdC1pbnN0cnVjdGlvbnMubWRcbiAgLS1vdXRwdXQsIC1vICAgICAgIE91dHB1dCBmaWxlIHBhdGhcblxuJHtjb2xvcnMuYm9sZH1FeGFtcGxlczoke2NvbG9ycy5yZXNldH1cbiAgZ2FsbG9wIGF1ZGl0XG4gIGdhbGxvcCBhdWRpdCBzcmMvYmxvY2tzLyAtLXN0cmljdFxuICBnYWxsb3AgZ2VuZXJhdGVcbiAgZ2FsbG9wIGdlbmVyYXRlIC5jdXJzb3JydWxlc1xuICBnYWxsb3AgZ2VuZXJhdGUgQ0xBVURFLm1kXG4gIGdhbGxvcCBnZW5lcmF0ZSAtLW91dHB1dCAuZ2l0aHViL2NvcGlsb3QtaW5zdHJ1Y3Rpb25zLm1kXG5gKVxufVxuXG5mdW5jdGlvbiBzaG93VmVyc2lvbigpIHtcbiAgY29uc29sZS5sb2coYEdhbGxvcCBDTEkgdjEuMC4wYClcbiAgY29uc29sZS5sb2coYENhbm9uIHYke3ZlcnNpb259YClcbn1cblxuLyoqXG4gKiBEZXRlY3Qgb3V0cHV0IGZvcm1hdCBmcm9tIGZpbGVuYW1lXG4gKi9cbmZ1bmN0aW9uIGRldGVjdEZvcm1hdChmaWxlbmFtZTogc3RyaW5nKTogJ2N1cnNvcnJ1bGVzJyB8ICdjbGF1ZGUnIHwgJ2NvcGlsb3QnIHtcbiAgY29uc3QgbG93ZXIgPSBmaWxlbmFtZS50b0xvd2VyQ2FzZSgpXG4gIGlmIChsb3dlci5lbmRzV2l0aCgnY2xhdWRlLm1kJykpIHJldHVybiAnY2xhdWRlJ1xuICBpZiAobG93ZXIuZW5kc1dpdGgoJ2NvcGlsb3QtaW5zdHJ1Y3Rpb25zLm1kJykpIHJldHVybiAnY29waWxvdCdcbiAgcmV0dXJuICdjdXJzb3JydWxlcydcbn1cblxuYXN5bmMgZnVuY3Rpb24gbWFpbigpIHtcbiAgc3dpdGNoIChjb21tYW5kKSB7XG4gICAgY2FzZSAnYXVkaXQnOlxuICAgICAgY29uc3QgYXVkaXRQYXRoID1cbiAgICAgICAgYXJnc1sxXSAmJiAhYXJnc1sxXS5zdGFydHNXaXRoKCctLScpID8gYXJnc1sxXSA6ICdzcmMvJ1xuICAgICAgY29uc3QgYXVkaXRPcHRpb25zID0ge1xuICAgICAgICBzdHJpY3Q6IGFyZ3MuaW5jbHVkZXMoJy0tc3RyaWN0JyksXG4gICAgICAgIGpzb246IGFyZ3MuaW5jbHVkZXMoJy0tanNvbicpLFxuICAgICAgICBmaXg6IGFyZ3MuaW5jbHVkZXMoJy0tZml4JyksXG4gICAgICB9XG4gICAgICBhd2FpdCBhdWRpdChhdWRpdFBhdGgsIGF1ZGl0T3B0aW9ucylcbiAgICAgIGJyZWFrXG5cbiAgICBjYXNlICdnZW5lcmF0ZSc6IHtcbiAgICAgIC8vIEZpbmQgb3V0cHV0IHBhdGggZnJvbSBhcmdzXG4gICAgICBjb25zdCBvdXRwdXRJbmRleCA9IGFyZ3MuaW5kZXhPZignLS1vdXRwdXQnKVxuICAgICAgY29uc3Qgb3V0cHV0SW5kZXhTaG9ydCA9IGFyZ3MuaW5kZXhPZignLW8nKVxuICAgICAgbGV0IG91dHB1dFBhdGg6IHN0cmluZyB8IG51bGwgPSBudWxsXG5cbiAgICAgIGlmIChvdXRwdXRJbmRleCAhPT0gLTEgJiYgYXJnc1tvdXRwdXRJbmRleCArIDFdKSB7XG4gICAgICAgIG91dHB1dFBhdGggPSBhcmdzW291dHB1dEluZGV4ICsgMV1cbiAgICAgIH0gZWxzZSBpZiAob3V0cHV0SW5kZXhTaG9ydCAhPT0gLTEgJiYgYXJnc1tvdXRwdXRJbmRleFNob3J0ICsgMV0pIHtcbiAgICAgICAgb3V0cHV0UGF0aCA9IGFyZ3Nbb3V0cHV0SW5kZXhTaG9ydCArIDFdXG4gICAgICB9IGVsc2UgaWYgKGFyZ3NbMV0gJiYgIWFyZ3NbMV0uc3RhcnRzV2l0aCgnLS0nKSkge1xuICAgICAgICBvdXRwdXRQYXRoID0gYXJnc1sxXVxuICAgICAgfVxuXG4gICAgICBpZiAob3V0cHV0UGF0aCkge1xuICAgICAgICAvLyBTaW5nbGUtZmlsZSBnZW5lcmF0aW9uXG4gICAgICAgIGF3YWl0IGdlbmVyYXRlKHtcbiAgICAgICAgICBvdXRwdXQ6IG91dHB1dFBhdGgsXG4gICAgICAgICAgZm9ybWF0OiBkZXRlY3RGb3JtYXQob3V0cHV0UGF0aCksXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBObyBhcmdzIOKGkiBnZW5lcmF0ZSBhbGwgZmlsZXNcbiAgICAgICAgYXdhaXQgZ2VuZXJhdGUoe1xuICAgICAgICAgIG91dHB1dDogJ2FsbCcsXG4gICAgICAgICAgZm9ybWF0OiAnY3Vyc29ycnVsZXMnLCAvLyB1bnVzZWQgd2hlbiBvdXRwdXQgaXMgJ2FsbCdcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIGJyZWFrXG4gICAgfVxuXG4gICAgY2FzZSAndmVyc2lvbic6XG4gICAgY2FzZSAnLXYnOlxuICAgIGNhc2UgJy0tdmVyc2lvbic6XG4gICAgICBzaG93VmVyc2lvbigpXG4gICAgICBicmVha1xuXG4gICAgY2FzZSAnaGVscCc6XG4gICAgY2FzZSAnLWgnOlxuICAgIGNhc2UgJy0taGVscCc6XG4gICAgY2FzZSB1bmRlZmluZWQ6XG4gICAgICBzaG93SGVscCgpXG4gICAgICBicmVha1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIGNvbnNvbGUuZXJyb3IoYFVua25vd24gY29tbWFuZDogJHtjb21tYW5kfWApXG4gICAgICBjb25zb2xlLmVycm9yKGBSdW4gJ2dhbGxvcCBoZWxwJyBmb3IgdXNhZ2UgaW5mb3JtYXRpb24uYClcbiAgICAgIHByb2Nlc3MuZXhpdCgxKVxuICB9XG59XG5cbm1haW4oKS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgY29uc29sZS5lcnJvcignRXJyb3I6JywgZXJyb3IubWVzc2FnZSlcbiAgcHJvY2Vzcy5leGl0KDEpXG59KVxuIl19