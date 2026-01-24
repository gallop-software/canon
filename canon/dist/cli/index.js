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
  generate [output]  Generate AI rules from Canon (default: .cursorrules)
  version            Show version information
  help               Show this help message

${colors.bold}Audit Options:${colors.reset}
  --strict           Exit with error code on violations
  --json             Output as JSON

${colors.bold}Generate Options:${colors.reset}
  --output, -o       Output file path (default: .cursorrules)

${colors.bold}Examples:${colors.reset}
  gallop audit
  gallop audit src/blocks/ --strict
  gallop generate
  gallop generate .cursorrules
  gallop generate --output .github/copilot-instructions.md
`);
}
function showVersion() {
    console.log(`Gallop CLI v1.0.0`);
    console.log(`Canon v${version}`);
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
        case 'generate':
            // Find output path from args
            let outputPath = '.cursorrules';
            const outputIndex = args.indexOf('--output');
            const outputIndexShort = args.indexOf('-o');
            if (outputIndex !== -1 && args[outputIndex + 1]) {
                outputPath = args[outputIndex + 1];
            }
            else if (outputIndexShort !== -1 && args[outputIndexShort + 1]) {
                outputPath = args[outputIndexShort + 1];
            }
            else if (args[1] && !args[1].startsWith('--')) {
                outputPath = args[1];
            }
            const generateOptions = {
                output: outputPath,
                format: 'cursorrules',
            };
            await generate(generateOptions);
            break;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2xpL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0scUJBQXFCLENBQUE7QUFDM0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHdCQUF3QixDQUFBO0FBQ2pELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxhQUFhLENBQUE7QUFFckMsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDbEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBRXZCLDZCQUE2QjtBQUM3QixNQUFNLE1BQU0sR0FBRztJQUNiLEtBQUssRUFBRSxTQUFTO0lBQ2hCLElBQUksRUFBRSxTQUFTO0lBQ2YsR0FBRyxFQUFFLFNBQVM7SUFDZCxHQUFHLEVBQUUsVUFBVTtJQUNmLEtBQUssRUFBRSxVQUFVO0lBQ2pCLE1BQU0sRUFBRSxVQUFVO0lBQ2xCLElBQUksRUFBRSxVQUFVO0lBQ2hCLE9BQU8sRUFBRSxVQUFVO0lBQ25CLElBQUksRUFBRSxVQUFVO0NBQ2pCLENBQUE7QUFFRCxTQUFTLFFBQVE7SUFDZixPQUFPLENBQUMsR0FBRyxDQUFDO0VBQ1osTUFBTSxDQUFDLElBQUksYUFBYSxNQUFNLENBQUMsS0FBSztFQUNwQyxNQUFNLENBQUMsR0FBRyxrQkFBa0IsT0FBTyxHQUFHLE1BQU0sQ0FBQyxLQUFLOztFQUVsRCxNQUFNLENBQUMsSUFBSSxTQUFTLE1BQU0sQ0FBQyxLQUFLOzs7RUFHaEMsTUFBTSxDQUFDLElBQUksWUFBWSxNQUFNLENBQUMsS0FBSzs7Ozs7O0VBTW5DLE1BQU0sQ0FBQyxJQUFJLGlCQUFpQixNQUFNLENBQUMsS0FBSzs7OztFQUl4QyxNQUFNLENBQUMsSUFBSSxvQkFBb0IsTUFBTSxDQUFDLEtBQUs7OztFQUczQyxNQUFN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QUMsT0FBTyxDQUFDLENBQUE7SUFDdEMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNqQixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcblxuaW1wb3J0IHsgYXVkaXQgfSBmcm9tICcuL2NvbW1hbmRzL2F1ZGl0LmpzJ1xuaW1wb3J0IHsgZ2VuZXJhdGUgfSBmcm9tICcuL2NvbW1hbmRzL2dlbmVyYXRlLmpzJ1xuaW1wb3J0IHsgdmVyc2lvbiB9IGZyb20gJy4uL2luZGV4LmpzJ1xuXG5jb25zdCBhcmdzID0gcHJvY2Vzcy5hcmd2LnNsaWNlKDIpXG5jb25zdCBjb21tYW5kID0gYXJnc1swXVxuXG4vLyBDb2xvcnMgZm9yIHRlcm1pbmFsIG91dHB1dFxuY29uc3QgY29sb3JzID0ge1xuICByZXNldDogJ1xceDFiWzBtJyxcbiAgYm9sZDogJ1xceDFiWzFtJyxcbiAgZGltOiAnXFx4MWJbMm0nLFxuICByZWQ6ICdcXHgxYlszMW0nLFxuICBncmVlbjogJ1xceDFiWzMybScsXG4gIHllbGxvdzogJ1xceDFiWzMzbScsXG4gIGJsdWU6ICdcXHgxYlszNG0nLFxuICBtYWdlbnRhOiAnXFx4MWJbMzVtJyxcbiAgY3lhbjogJ1xceDFiWzM2bScsXG59XG5cbmZ1bmN0aW9uIHNob3dIZWxwKCkge1xuICBjb25zb2xlLmxvZyhgXG4ke2NvbG9ycy5ib2xkfUdhbGxvcCBDTEkke2NvbG9ycy5yZXNldH0gLSBDYW5vbiBDb21wbGlhbmNlIFRvb2xpbmdcbiR7Y29sb3JzLmRpbX1DYW5vbiBWZXJzaW9uOiAke3ZlcnNpb259JHtjb2xvcnMucmVzZXR9XG5cbiR7Y29sb3JzLmJvbGR9VXNhZ2U6JHtjb2xvcnMucmVzZXR9XG4gIGdhbGxvcCA8Y29tbWFuZD4gW29wdGlvbnNdXG5cbiR7Y29sb3JzLmJvbGR9Q29tbWFuZHM6JHtjb2xvcnMucmVzZXR9XG4gIGF1ZGl0IFtwYXRoXSAgICAgICBDaGVjayBDYW5vbiBjb21wbGlhbmNlIChkZWZhdWx0OiBzcmMvYmxvY2tzLylcbiAgZ2VuZXJhdGUgW291dHB1dF0gIEdlbmVyYXRlIEFJIHJ1bGVzIGZyb20gQ2Fub24gKGRlZmF1bHQ6IC5jdXJzb3JydWxlcylcbiAgdmVyc2lvbiAgICAgICAgICAgIFNob3cgdmVyc2lvbiBpbmZvcm1hdGlvblxuICBoZWxwICAgICAgICAgICAgICAgU2hvdyB0aGlzIGhlbHAgbWVzc2FnZVxuXG4ke2NvbG9ycy5ib2xkfUF1ZGl0IE9wdGlvbnM6JHtjb2xvcnMucmVzZXR9XG4gIC0tc3RyaWN0ICAgICAgICAgICBFeGl0IHdpdGggZXJyb3IgY29kZSBvbiB2aW9sYXRpb25zXG4gIC0tanNvbiAgICAgICAgICAgICBPdXRwdXQgYXMgSlNPTlxuXG4ke2NvbG9ycy5ib2xkfUdlbmVyYXRlIE9wdGlvbnM6JHtjb2xvcnMucmVzZXR9XG4gIC0tb3V0cHV0LCAtbyAgICAgICBPdXRwdXQgZmlsZSBwYXRoIChkZWZhdWx0OiAuY3Vyc29ycnVsZXMpXG5cbiR7Y29sb3JzLmJvbGR9RXhhbXBsZXM6JHtjb2xvcnMucmVzZXR9XG4gIGdhbGxvcCBhdWRpdFxuICBnYWxsb3AgYXVkaXQgc3JjL2Jsb2Nrcy8gLS1zdHJpY3RcbiAgZ2FsbG9wIGdlbmVyYXRlXG4gIGdhbGxvcCBnZW5lcmF0ZSAuY3Vyc29ycnVsZXNcbiAgZ2FsbG9wIGdlbmVyYXRlIC0tb3V0cHV0IC5naXRodWIvY29waWxvdC1pbnN0cnVjdGlvbnMubWRcbmApXG59XG5cbmZ1bmN0aW9uIHNob3dWZXJzaW9uKCkge1xuICBjb25zb2xlLmxvZyhgR2FsbG9wIENMSSB2MS4wLjBgKVxuICBjb25zb2xlLmxvZyhgQ2Fub24gdiR7dmVyc2lvbn1gKVxufVxuXG5hc3luYyBmdW5jdGlvbiBtYWluKCkge1xuICBzd2l0Y2ggKGNvbW1hbmQpIHtcbiAgICBjYXNlICdhdWRpdCc6XG4gICAgICBjb25zdCBhdWRpdFBhdGggPVxuICAgICAgICBhcmdzWzFdICYmICFhcmdzWzFdLnN0YXJ0c1dpdGgoJy0tJykgPyBhcmdzWzFdIDogJ3NyYy9ibG9ja3MvJ1xuICAgICAgY29uc3QgYXVkaXRPcHRpb25zID0ge1xuICAgICAgICBzdHJpY3Q6IGFyZ3MuaW5jbHVkZXMoJy0tc3RyaWN0JyksXG4gICAgICAgIGpzb246IGFyZ3MuaW5jbHVkZXMoJy0tanNvbicpLFxuICAgICAgICBmaXg6IGFyZ3MuaW5jbHVkZXMoJy0tZml4JyksXG4gICAgICB9XG4gICAgICBhd2FpdCBhdWRpdChhdWRpdFBhdGgsIGF1ZGl0T3B0aW9ucylcbiAgICAgIGJyZWFrXG5cbiAgICBjYXNlICdnZW5lcmF0ZSc6XG4gICAgICAvLyBGaW5kIG91dHB1dCBwYXRoIGZyb20gYXJnc1xuICAgICAgbGV0IG91dHB1dFBhdGggPSAnLmN1cnNvcnJ1bGVzJ1xuICAgICAgY29uc3Qgb3V0cHV0SW5kZXggPSBhcmdzLmluZGV4T2YoJy0tb3V0cHV0JylcbiAgICAgIGNvbnN0IG91dHB1dEluZGV4U2hvcnQgPSBhcmdzLmluZGV4T2YoJy1vJylcbiAgICAgIGlmIChvdXRwdXRJbmRleCAhPT0gLTEgJiYgYXJnc1tvdXRwdXRJbmRleCArIDFdKSB7XG4gICAgICAgIG91dHB1dFBhdGggPSBhcmdzW291dHB1dEluZGV4ICsgMV1cbiAgICAgIH0gZWxzZSBpZiAob3V0cHV0SW5kZXhTaG9ydCAhPT0gLTEgJiYgYXJnc1tvdXRwdXRJbmRleFNob3J0ICsgMV0pIHtcbiAgICAgICAgb3V0cHV0UGF0aCA9IGFyZ3Nbb3V0cHV0SW5kZXhTaG9ydCArIDFdXG4gICAgICB9IGVsc2UgaWYgKGFyZ3NbMV0gJiYgIWFyZ3NbMV0uc3RhcnRzV2l0aCgnLS0nKSkge1xuICAgICAgICBvdXRwdXRQYXRoID0gYXJnc1sxXVxuICAgICAgfVxuICAgICAgY29uc3QgZ2VuZXJhdGVPcHRpb25zID0ge1xuICAgICAgICBvdXRwdXQ6IG91dHB1dFBhdGgsXG4gICAgICAgIGZvcm1hdDogJ2N1cnNvcnJ1bGVzJyBhcyBjb25zdCxcbiAgICAgIH1cbiAgICAgIGF3YWl0IGdlbmVyYXRlKGdlbmVyYXRlT3B0aW9ucylcbiAgICAgIGJyZWFrXG5cbiAgICBjYXNlICd2ZXJzaW9uJzpcbiAgICBjYXNlICctdic6XG4gICAgY2FzZSAnLS12ZXJzaW9uJzpcbiAgICAgIHNob3dWZXJzaW9uKClcbiAgICAgIGJyZWFrXG5cbiAgICBjYXNlICdoZWxwJzpcbiAgICBjYXNlICctaCc6XG4gICAgY2FzZSAnLS1oZWxwJzpcbiAgICBjYXNlIHVuZGVmaW5lZDpcbiAgICAgIHNob3dIZWxwKClcbiAgICAgIGJyZWFrXG5cbiAgICBkZWZhdWx0OlxuICAgICAgY29uc29sZS5lcnJvcihgVW5rbm93biBjb21tYW5kOiAke2NvbW1hbmR9YClcbiAgICAgIGNvbnNvbGUuZXJyb3IoYFJ1biAnZ2FsbG9wIGhlbHAnIGZvciB1c2FnZSBpbmZvcm1hdGlvbi5gKVxuICAgICAgcHJvY2Vzcy5leGl0KDEpXG4gIH1cbn1cblxubWFpbigpLmNhdGNoKChlcnJvcikgPT4ge1xuICBjb25zb2xlLmVycm9yKCdFcnJvcjonLCBlcnJvci5tZXNzYWdlKVxuICBwcm9jZXNzLmV4aXQoMSlcbn0pXG4iXX0=