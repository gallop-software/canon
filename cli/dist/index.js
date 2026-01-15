#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const audit_1 = require("./commands/audit");
const generate_1 = require("./commands/generate");
const canon_1 = require("@gallop/canon");
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
${colors.dim}Canon Version: ${canon_1.version}${colors.reset}

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
    console.log(`Canon v${canon_1.version}`);
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
            await (0, audit_1.audit)(auditPath, auditOptions);
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
            await (0, generate_1.generate)(generateOptions);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsNENBQXdDO0FBQ3hDLGtEQUE4QztBQUM5Qyx5Q0FBdUM7QUFFdkMsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDbEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBRXZCLDZCQUE2QjtBQUM3QixNQUFNLE1BQU0sR0FBRztJQUNiLEtBQUssRUFBRSxTQUFTO0lBQ2hCLElBQUksRUFBRSxTQUFTO0lBQ2YsR0FBRyxFQUFFLFNBQVM7SUFDZCxHQUFHLEVBQUUsVUFBVTtJQUNmLEtBQUssRUFBRSxVQUFVO0lBQ2pCLE1BQU0sRUFBRSxVQUFVO0lBQ2xCLElBQUksRUFBRSxVQUFVO0lBQ2hCLE9BQU8sRUFBRSxVQUFVO0lBQ25CLElBQUksRUFBRSxVQUFVO0NBQ2pCLENBQUE7QUFFRCxTQUFTLFFBQVE7SUFDZixPQUFPLENBQUMsR0FBRyxDQUFDO0VBQ1osTUFBTSxDQUFDLElBQUksYUFBYSxNQUFNLENBQUMsS0FBSztFQUNwQyxNQUFNLENBQUMsR0FBRyxrQkFBa0IsZUFBTyxHQUFHLE1BQU0sQ0FBQyxLQUFLOztFQUVsRCxNQUFNLENBQUMsSUFBSSxTQUFTLE1BQU0sQ0FBQyxLQUFLOzs7RUFHaEMsTUFBTSxDQUFDLElBQUksWUFBWSxNQUFNLENBQUMsS0FBSzs7Ozs7O0VBTW5DLE1BQU0sQ0FBQyxJQUFJLGlCQUFpQixNQUFNLENBQUMsS0FBSzs7OztFQUl4QyxNQUFNLENBQUMsSUFBSSxvQkFBb0IsTUFBTSxDQUFDLEtBQUs7OztFQUczQyxNQUFNLENBQUMsSUFBSSxZQUFZLE1BQU0sQ0FBQyxLQUFLOzs7Ozs7Q0FNcEMsQ0FBQyxDQUFBO0FBQ0YsQ0FBQztBQUVELFNBQVMsV0FBVztJQUNsQixPQUFPLENBQUMs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c291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuXG5pbXBvcnQgeyBhdWRpdCB9IGZyb20gJy4vY29tbWFuZHMvYXVkaXQnXG5pbXBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gJy4vY29tbWFuZHMvZ2VuZXJhdGUnXG5pbXBvcnQgeyB2ZXJzaW9uIH0gZnJvbSAnQGdhbGxvcC9jYW5vbidcblxuY29uc3QgYXJncyA9IHByb2Nlc3MuYXJndi5zbGljZSgyKVxuY29uc3QgY29tbWFuZCA9IGFyZ3NbMF1cblxuLy8gQ29sb3JzIGZvciB0ZXJtaW5hbCBvdXRwdXRcbmNvbnN0IGNvbG9ycyA9IHtcbiAgcmVzZXQ6ICdcXHgxYlswbScsXG4gIGJvbGQ6ICdcXHgxYlsxbScsXG4gIGRpbTogJ1xceDFiWzJtJyxcbiAgcmVkOiAnXFx4MWJbMzFtJyxcbiAgZ3JlZW46ICdcXHgxYlszMm0nLFxuICB5ZWxsb3c6ICdcXHgxYlszM20nLFxuICBibHVlOiAnXFx4MWJbMzRtJyxcbiAgbWFnZW50YTogJ1xceDFiWzM1bScsXG4gIGN5YW46ICdcXHgxYlszNm0nLFxufVxuXG5mdW5jdGlvbiBzaG93SGVscCgpIHtcbiAgY29uc29sZS5sb2coYFxuJHtjb2xvcnMuYm9sZH1HYWxsb3AgQ0xJJHtjb2xvcnMucmVzZXR9IC0gQ2Fub24gQ29tcGxpYW5jZSBUb29saW5nXG4ke2NvbG9ycy5kaW19Q2Fub24gVmVyc2lvbjogJHt2ZXJzaW9ufSR7Y29sb3JzLnJlc2V0fVxuXG4ke2NvbG9ycy5ib2xkfVVzYWdlOiR7Y29sb3JzLnJlc2V0fVxuICBnYWxsb3AgPGNvbW1hbmQ+IFtvcHRpb25zXVxuXG4ke2NvbG9ycy5ib2xkfUNvbW1hbmRzOiR7Y29sb3JzLnJlc2V0fVxuICBhdWRpdCBbcGF0aF0gICAgICAgQ2hlY2sgQ2Fub24gY29tcGxpYW5jZSAoZGVmYXVsdDogc3JjL2Jsb2Nrcy8pXG4gIGdlbmVyYXRlIFtvdXRwdXRdICBHZW5lcmF0ZSBBSSBydWxlcyBmcm9tIENhbm9uIChkZWZhdWx0OiAuY3Vyc29ycnVsZXMpXG4gIHZlcnNpb24gICAgICAgICAgICBTaG93IHZlcnNpb24gaW5mb3JtYXRpb25cbiAgaGVscCAgICAgICAgICAgICAgIFNob3cgdGhpcyBoZWxwIG1lc3NhZ2VcblxuJHtjb2xvcnMuYm9sZH1BdWRpdCBPcHRpb25zOiR7Y29sb3JzLnJlc2V0fVxuICAtLXN0cmljdCAgICAgICAgICAgRXhpdCB3aXRoIGVycm9yIGNvZGUgb24gdmlvbGF0aW9uc1xuICAtLWpzb24gICAgICAgICAgICAgT3V0cHV0IGFzIEpTT05cblxuJHtjb2xvcnMuYm9sZH1HZW5lcmF0ZSBPcHRpb25zOiR7Y29sb3JzLnJlc2V0fVxuICAtLW91dHB1dCwgLW8gICAgICAgT3V0cHV0IGZpbGUgcGF0aCAoZGVmYXVsdDogLmN1cnNvcnJ1bGVzKVxuXG4ke2NvbG9ycy5ib2xkfUV4YW1wbGVzOiR7Y29sb3JzLnJlc2V0fVxuICBnYWxsb3AgYXVkaXRcbiAgZ2FsbG9wIGF1ZGl0IHNyYy9ibG9ja3MvIC0tc3RyaWN0XG4gIGdhbGxvcCBnZW5lcmF0ZVxuICBnYWxsb3AgZ2VuZXJhdGUgLmN1cnNvcnJ1bGVzXG4gIGdhbGxvcCBnZW5lcmF0ZSAtLW91dHB1dCAuZ2l0aHViL2NvcGlsb3QtaW5zdHJ1Y3Rpb25zLm1kXG5gKVxufVxuXG5mdW5jdGlvbiBzaG93VmVyc2lvbigpIHtcbiAgY29uc29sZS5sb2coYEdhbGxvcCBDTEkgdjEuMC4wYClcbiAgY29uc29sZS5sb2coYENhbm9uIHYke3ZlcnNpb259YClcbn1cblxuYXN5bmMgZnVuY3Rpb24gbWFpbigpIHtcbiAgc3dpdGNoIChjb21tYW5kKSB7XG4gICAgY2FzZSAnYXVkaXQnOlxuICAgICAgY29uc3QgYXVkaXRQYXRoID1cbiAgICAgICAgYXJnc1sxXSAmJiAhYXJnc1sxXS5zdGFydHNXaXRoKCctLScpID8gYXJnc1sxXSA6ICdzcmMvYmxvY2tzLydcbiAgICAgIGNvbnN0IGF1ZGl0T3B0aW9ucyA9IHtcbiAgICAgICAgc3RyaWN0OiBhcmdzLmluY2x1ZGVzKCctLXN0cmljdCcpLFxuICAgICAgICBqc29uOiBhcmdzLmluY2x1ZGVzKCctLWpzb24nKSxcbiAgICAgICAgZml4OiBhcmdzLmluY2x1ZGVzKCctLWZpeCcpLFxuICAgICAgfVxuICAgICAgYXdhaXQgYXVkaXQoYXVkaXRQYXRoLCBhdWRpdE9wdGlvbnMpXG4gICAgICBicmVha1xuXG4gICAgY2FzZSAnZ2VuZXJhdGUnOlxuICAgICAgLy8gRmluZCBvdXRwdXQgcGF0aCBmcm9tIGFyZ3NcbiAgICAgIGxldCBvdXRwdXRQYXRoID0gJy5jdXJzb3JydWxlcydcbiAgICAgIGNvbnN0IG91dHB1dEluZGV4ID0gYXJncy5pbmRleE9mKCctLW91dHB1dCcpXG4gICAgICBjb25zdCBvdXRwdXRJbmRleFNob3J0ID0gYXJncy5pbmRleE9mKCctbycpXG4gICAgICBpZiAob3V0cHV0SW5kZXggIT09IC0xICYmIGFyZ3Nbb3V0cHV0SW5kZXggKyAxXSkge1xuICAgICAgICBvdXRwdXRQYXRoID0gYXJnc1tvdXRwdXRJbmRleCArIDFdXG4gICAgICB9IGVsc2UgaWYgKG91dHB1dEluZGV4U2hvcnQgIT09IC0xICYmIGFyZ3Nbb3V0cHV0SW5kZXhTaG9ydCArIDFdKSB7XG4gICAgICAgIG91dHB1dFBhdGggPSBhcmdzW291dHB1dEluZGV4U2hvcnQgKyAxXVxuICAgICAgfSBlbHNlIGlmIChhcmdzWzFdICYmICFhcmdzWzFdLnN0YXJ0c1dpdGgoJy0tJykpIHtcbiAgICAgICAgb3V0cHV0UGF0aCA9IGFyZ3NbMV1cbiAgICAgIH1cbiAgICAgIGNvbnN0IGdlbmVyYXRlT3B0aW9ucyA9IHtcbiAgICAgICAgb3V0cHV0OiBvdXRwdXRQYXRoLFxuICAgICAgICBmb3JtYXQ6ICdjdXJzb3JydWxlcycgYXMgY29uc3QsXG4gICAgICB9XG4gICAgICBhd2FpdCBnZW5lcmF0ZShnZW5lcmF0ZU9wdGlvbnMpXG4gICAgICBicmVha1xuXG4gICAgY2FzZSAndmVyc2lvbic6XG4gICAgY2FzZSAnLXYnOlxuICAgIGNhc2UgJy0tdmVyc2lvbic6XG4gICAgICBzaG93VmVyc2lvbigpXG4gICAgICBicmVha1xuXG4gICAgY2FzZSAnaGVscCc6XG4gICAgY2FzZSAnLWgnOlxuICAgIGNhc2UgJy0taGVscCc6XG4gICAgY2FzZSB1bmRlZmluZWQ6XG4gICAgICBzaG93SGVscCgpXG4gICAgICBicmVha1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIGNvbnNvbGUuZXJyb3IoYFVua25vd24gY29tbWFuZDogJHtjb21tYW5kfWApXG4gICAgICBjb25zb2xlLmVycm9yKGBSdW4gJ2dhbGxvcCBoZWxwJyBmb3IgdXNhZ2UgaW5mb3JtYXRpb24uYClcbiAgICAgIHByb2Nlc3MuZXhpdCgxKVxuICB9XG59XG5cbm1haW4oKS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgY29uc29sZS5lcnJvcignRXJyb3I6JywgZXJyb3IubWVzc2FnZSlcbiAgcHJvY2Vzcy5leGl0KDEpXG59KVxuIl19