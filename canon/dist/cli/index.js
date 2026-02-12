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
  audit [path]       Check Canon compliance (default: src/blocks/)
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
            const auditPath = args[1] && !args[1].startsWith('--') ? args[1] : 'src/blocks/';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2xpL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0scUJBQXFCLENBQUE7QUFDM0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHdCQUF3QixDQUFBO0FBQ2pELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxhQUFhLENBQUE7QUFFckMsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDbEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBRXZCLDZCQUE2QjtBQUM3QixNQUFNLE1BQU0sR0FBRztJQUNiLEtBQUssRUFBRSxTQUFTO0lBQ2hCLElBQUksRUFBRSxTQUFTO0lBQ2YsR0FBRyxFQUFFLFNBQVM7SUFDZCxHQUFHLEVBQUUsVUFBVTtJQUNmLEtBQUssRUFBRSxVQUFVO0lBQ2pCLE1BQU0sRUFBRSxVQUFVO0lBQ2xCLElBQUksRUFBRSxVQUFVO0lBQ2hCLE9BQU8sRUFBRSxVQUFVO0lBQ25CLElBQUksRUFBRSxVQUFVO0NBQ2pCLENBQUE7QUFFRCxTQUFTLFFBQVE7SUFDZixPQUFPLENBQUMsR0FBRyxDQUFDO0VBQ1osTUFBTSxDQUFDLElBQUksYUFBYSxNQUFNLENBQUMsS0FBSztFQUNwQyxNQUFNLENBQUMsR0FBRyxrQkFBa0IsT0FBTyxHQUFHLE1BQU0sQ0FBQyxLQUFLOztFQUVsRCxNQUFNLENBQUMsSUFBSSxTQUFTLE1BQU0sQ0FBQyxLQUFLOzs7RUFHaEMsTUFBTSxDQUFDLElBQUksWUFBWSxNQUFNLENBQUMsS0FBSzs7Ozs7O0VBTW5DLE1BQU0sQ0FBQyxJQUFJLGlCQUFpQixNQUFNLENBQUMsS0FBSzs7OztFQUl4QyxNQUFNLENBQUMsSUFBSSxvQkFBb0IsTUFBTSxDQUFDLEtBQUs7Ozs7Ozs7RUFPM0Ms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LENBQUM7UUFDZixLQUFLLElBQUksQ0FBQztRQUNWLEtBQUssV0FBVztZQUNkLFdBQVcsRUFBRSxDQUFBO1lBQ2IsTUFBSztRQUVQLEtBQUssTUFBTSxDQUFDO1FBQ1osS0FBSyxJQUFJLENBQUM7UUFDVixLQUFLLFFBQVEsQ0FBQztRQUNkLEtBQUssU0FBUztZQUNaLFFBQVEsRUFBRSxDQUFBO1lBQ1YsTUFBSztRQUVQO1lBQ0UsT0FBTyxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsT0FBTyxFQUFFLENBQUMsQ0FBQTtZQUM1QyxPQUFPLENBQUMsS0FBSyxDQUFDLDBDQUEwQyxDQUFDLENBQUE7WUFDekQsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNuQixDQUFDO0FBQ0gsQ0FBQztBQUVELElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO0lBQ3JCLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUN0QyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ2pCLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuXG5pbXBvcnQgeyBhdWRpdCB9IGZyb20gJy4vY29tbWFuZHMvYXVkaXQuanMnXG5pbXBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gJy4vY29tbWFuZHMvZ2VuZXJhdGUuanMnXG5pbXBvcnQgeyB2ZXJzaW9uIH0gZnJvbSAnLi4vaW5kZXguanMnXG5cbmNvbnN0IGFyZ3MgPSBwcm9jZXNzLmFyZ3Yuc2xpY2UoMilcbmNvbnN0IGNvbW1hbmQgPSBhcmdzWzBdXG5cbi8vIENvbG9ycyBmb3IgdGVybWluYWwgb3V0cHV0XG5jb25zdCBjb2xvcnMgPSB7XG4gIHJlc2V0OiAnXFx4MWJbMG0nLFxuICBib2xkOiAnXFx4MWJbMW0nLFxuICBkaW06ICdcXHgxYlsybScsXG4gIHJlZDogJ1xceDFiWzMxbScsXG4gIGdyZWVuOiAnXFx4MWJbMzJtJyxcbiAgeWVsbG93OiAnXFx4MWJbMzNtJyxcbiAgYmx1ZTogJ1xceDFiWzM0bScsXG4gIG1hZ2VudGE6ICdcXHgxYlszNW0nLFxuICBjeWFuOiAnXFx4MWJbMzZtJyxcbn1cblxuZnVuY3Rpb24gc2hvd0hlbHAoKSB7XG4gIGNvbnNvbGUubG9nKGBcbiR7Y29sb3JzLmJvbGR9R2FsbG9wIENMSSR7Y29sb3JzLnJlc2V0fSAtIENhbm9uIENvbXBsaWFuY2UgVG9vbGluZ1xuJHtjb2xvcnMuZGltfUNhbm9uIFZlcnNpb246ICR7dmVyc2lvbn0ke2NvbG9ycy5yZXNldH1cblxuJHtjb2xvcnMuYm9sZH1Vc2FnZToke2NvbG9ycy5yZXNldH1cbiAgZ2FsbG9wIDxjb21tYW5kPiBbb3B0aW9uc11cblxuJHtjb2xvcnMuYm9sZH1Db21tYW5kczoke2NvbG9ycy5yZXNldH1cbiAgYXVkaXQgW3BhdGhdICAgICAgIENoZWNrIENhbm9uIGNvbXBsaWFuY2UgKGRlZmF1bHQ6IHNyYy9ibG9ja3MvKVxuICBnZW5lcmF0ZSBbb3V0cHV0XSAgR2VuZXJhdGUgQUkgcnVsZXMgZnJvbSBDYW5vblxuICB2ZXJzaW9uICAgICAgICAgICAgU2hvdyB2ZXJzaW9uIGluZm9ybWF0aW9uXG4gIGhlbHAgICAgICAgICAgICAgICBTaG93IHRoaXMgaGVscCBtZXNzYWdlXG5cbiR7Y29sb3JzLmJvbGR9QXVkaXQgT3B0aW9uczoke2NvbG9ycy5yZXNldH1cbiAgLS1zdHJpY3QgICAgICAgICAgIEV4aXQgd2l0aCBlcnJvciBjb2RlIG9uIHZpb2xhdGlvbnNcbiAgLS1qc29uICAgICAgICAgICAgIE91dHB1dCBhcyBKU09OXG5cbiR7Y29sb3JzLmJvbGR9R2VuZXJhdGUgT3B0aW9uczoke2NvbG9ycy5yZXNldH1cbiAgZ2FsbG9wIGdlbmVyYXRlICAgICAgICAgICAgICAgICAgR2VuZXJhdGUgYWxsIGZpbGVzICguY3Vyc29ycnVsZXMsIENMQVVERS5tZCwgY29waWxvdC1pbnN0cnVjdGlvbnMubWQpXG4gIGdhbGxvcCBnZW5lcmF0ZSAuY3Vyc29ycnVsZXMgICAgIEdlbmVyYXRlIC5jdXJzb3JydWxlcyBvbmx5XG4gIGdhbGxvcCBnZW5lcmF0ZSBDTEFVREUubWQgICAgICAgIEdlbmVyYXRlIENMQVVERS5tZCBvbmx5XG4gIGdhbGxvcCBnZW5lcmF0ZSAuZ2l0aHViL2NvcGlsb3QtaW5zdHJ1Y3Rpb25zLm1kXG4gIC0tb3V0cHV0LCAtbyAgICAgICBPdXRwdXQgZmlsZSBwYXRoXG5cbiR7Y29sb3JzLmJvbGR9RXhhbXBsZXM6JHtjb2xvcnMucmVzZXR9XG4gIGdhbGxvcCBhdWRpdFxuICBnYWxsb3AgYXVkaXQgc3JjL2Jsb2Nrcy8gLS1zdHJpY3RcbiAgZ2FsbG9wIGdlbmVyYXRlXG4gIGdhbGxvcCBnZW5lcmF0ZSAuY3Vyc29ycnVsZXNcbiAgZ2FsbG9wIGdlbmVyYXRlIENMQVVERS5tZFxuICBnYWxsb3AgZ2VuZXJhdGUgLS1vdXRwdXQgLmdpdGh1Yi9jb3BpbG90LWluc3RydWN0aW9ucy5tZFxuYClcbn1cblxuZnVuY3Rpb24gc2hvd1ZlcnNpb24oKSB7XG4gIGNvbnNvbGUubG9nKGBHYWxsb3AgQ0xJIHYxLjAuMGApXG4gIGNvbnNvbGUubG9nKGBDYW5vbiB2JHt2ZXJzaW9ufWApXG59XG5cbi8qKlxuICogRGV0ZWN0IG91dHB1dCBmb3JtYXQgZnJvbSBmaWxlbmFtZVxuICovXG5mdW5jdGlvbiBkZXRlY3RGb3JtYXQoZmlsZW5hbWU6IHN0cmluZyk6ICdjdXJzb3JydWxlcycgfCAnY2xhdWRlJyB8ICdjb3BpbG90JyB7XG4gIGNvbnN0IGxvd2VyID0gZmlsZW5hbWUudG9Mb3dlckNhc2UoKVxuICBpZiAobG93ZXIuZW5kc1dpdGgoJ2NsYXVkZS5tZCcpKSByZXR1cm4gJ2NsYXVkZSdcbiAgaWYgKGxvd2VyLmVuZHNXaXRoKCdjb3BpbG90LWluc3RydWN0aW9ucy5tZCcpKSByZXR1cm4gJ2NvcGlsb3QnXG4gIHJldHVybiAnY3Vyc29ycnVsZXMnXG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1haW4oKSB7XG4gIHN3aXRjaCAoY29tbWFuZCkge1xuICAgIGNhc2UgJ2F1ZGl0JzpcbiAgICAgIGNvbnN0IGF1ZGl0UGF0aCA9XG4gICAgICAgIGFyZ3NbMV0gJiYgIWFyZ3NbMV0uc3RhcnRzV2l0aCgnLS0nKSA/IGFyZ3NbMV0gOiAnc3JjL2Jsb2Nrcy8nXG4gICAgICBjb25zdCBhdWRpdE9wdGlvbnMgPSB7XG4gICAgICAgIHN0cmljdDogYXJncy5pbmNsdWRlcygnLS1zdHJpY3QnKSxcbiAgICAgICAganNvbjogYXJncy5pbmNsdWRlcygnLS1qc29uJyksXG4gICAgICAgIGZpeDogYXJncy5pbmNsdWRlcygnLS1maXgnKSxcbiAgICAgIH1cbiAgICAgIGF3YWl0IGF1ZGl0KGF1ZGl0UGF0aCwgYXVkaXRPcHRpb25zKVxuICAgICAgYnJlYWtcblxuICAgIGNhc2UgJ2dlbmVyYXRlJzoge1xuICAgICAgLy8gRmluZCBvdXRwdXQgcGF0aCBmcm9tIGFyZ3NcbiAgICAgIGNvbnN0IG91dHB1dEluZGV4ID0gYXJncy5pbmRleE9mKCctLW91dHB1dCcpXG4gICAgICBjb25zdCBvdXRwdXRJbmRleFNob3J0ID0gYXJncy5pbmRleE9mKCctbycpXG4gICAgICBsZXQgb3V0cHV0UGF0aDogc3RyaW5nIHwgbnVsbCA9IG51bGxcblxuICAgICAgaWYgKG91dHB1dEluZGV4ICE9PSAtMSAmJiBhcmdzW291dHB1dEluZGV4ICsgMV0pIHtcbiAgICAgICAgb3V0cHV0UGF0aCA9IGFyZ3Nbb3V0cHV0SW5kZXggKyAxXVxuICAgICAgfSBlbHNlIGlmIChvdXRwdXRJbmRleFNob3J0ICE9PSAtMSAmJiBhcmdzW291dHB1dEluZGV4U2hvcnQgKyAxXSkge1xuICAgICAgICBvdXRwdXRQYXRoID0gYXJnc1tvdXRwdXRJbmRleFNob3J0ICsgMV1cbiAgICAgIH0gZWxzZSBpZiAoYXJnc1sxXSAmJiAhYXJnc1sxXS5zdGFydHNXaXRoKCctLScpKSB7XG4gICAgICAgIG91dHB1dFBhdGggPSBhcmdzWzFdXG4gICAgICB9XG5cbiAgICAgIGlmIChvdXRwdXRQYXRoKSB7XG4gICAgICAgIC8vIFNpbmdsZS1maWxlIGdlbmVyYXRpb25cbiAgICAgICAgYXdhaXQgZ2VuZXJhdGUoe1xuICAgICAgICAgIG91dHB1dDogb3V0cHV0UGF0aCxcbiAgICAgICAgICBmb3JtYXQ6IGRldGVjdEZvcm1hdChvdXRwdXRQYXRoKSxcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIE5vIGFyZ3Mg4oaSIGdlbmVyYXRlIGFsbCBmaWxlc1xuICAgICAgICBhd2FpdCBnZW5lcmF0ZSh7XG4gICAgICAgICAgb3V0cHV0OiAnYWxsJyxcbiAgICAgICAgICBmb3JtYXQ6ICdjdXJzb3JydWxlcycsIC8vIHVudXNlZCB3aGVuIG91dHB1dCBpcyAnYWxsJ1xuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICBjYXNlICd2ZXJzaW9uJzpcbiAgICBjYXNlICctdic6XG4gICAgY2FzZSAnLS12ZXJzaW9uJzpcbiAgICAgIHNob3dWZXJzaW9uKClcbiAgICAgIGJyZWFrXG5cbiAgICBjYXNlICdoZWxwJzpcbiAgICBjYXNlICctaCc6XG4gICAgY2FzZSAnLS1oZWxwJzpcbiAgICBjYXNlIHVuZGVmaW5lZDpcbiAgICAgIHNob3dIZWxwKClcbiAgICAgIGJyZWFrXG5cbiAgICBkZWZhdWx0OlxuICAgICAgY29uc29sZS5lcnJvcihgVW5rbm93biBjb21tYW5kOiAke2NvbW1hbmR9YClcbiAgICAgIGNvbnNvbGUuZXJyb3IoYFJ1biAnZ2FsbG9wIGhlbHAnIGZvciB1c2FnZSBpbmZvcm1hdGlvbi5gKVxuICAgICAgcHJvY2Vzcy5leGl0KDEpXG4gIH1cbn1cblxubWFpbigpLmNhdGNoKChlcnJvcikgPT4ge1xuICBjb25zb2xlLmVycm9yKCdFcnJvcjonLCBlcnJvci5tZXNzYWdlKVxuICBwcm9jZXNzLmV4aXQoMSlcbn0pXG4iXX0=