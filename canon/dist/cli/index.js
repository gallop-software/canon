#!/usr/bin/env node
import { audit } from './commands/audit.js';
import { generate } from './commands/generate.js';
import { validate } from './commands/validate.js';
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
  validate [path]    Validate project folder structure (default: .)
  version            Show version information
  help               Show this help message

${colors.bold}Audit Options:${colors.reset}
  --strict           Exit with error code on violations
  --json             Output as JSON

${colors.bold}Generate Options:${colors.reset}
  --output, -o       Output file path (default: .cursorrules)

${colors.bold}Validate Options:${colors.reset}
  --strict           Exit with error code on violations
  --json             Output as JSON

${colors.bold}Examples:${colors.reset}
  gallop audit
  gallop audit src/blocks/ --strict
  gallop generate
  gallop generate .cursorrules
  gallop generate --output .github/copilot-instructions.md
  gallop validate
  gallop validate . --strict
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
        case 'validate':
            const validatePath = args[1] && !args[1].startsWith('--') ? args[1] : '.';
            const validateOptions = {
                strict: args.includes('--strict'),
                json: args.includes('--json'),
            };
            await validate(validatePath, validateOptions);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2xpL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0scUJBQXFCLENBQUE7QUFDM0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHdCQUF3QixDQUFBO0FBQ2pELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQTtBQUNqRCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sYUFBYSxDQUFBO0FBRXJDLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ2xDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUV2Qiw2QkFBNkI7QUFDN0IsTUFBTSxNQUFNLEdBQUc7SUFDYixLQUFLLEVBQUUsU0FBUztJQUNoQixJQUFJLEVBQUUsU0FBUztJQUNmLEdBQUcsRUFBRSxTQUFTO0lBQ2QsR0FBRyxFQUFFLFVBQVU7SUFDZixLQUFLLEVBQUUsVUFBVTtJQUNqQixNQUFNLEVBQUUsVUFBVTtJQUNsQixJQUFJLEVBQUUsVUFBVTtJQUNoQixPQUFPLEVBQUUsVUFBVTtJQUNuQixJQUFJLEVBQUUsVUFBVTtDQUNqQixDQUFBO0FBRUQsU0FBUyxRQUFRO0lBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQztFQUNaLE1BQU0sQ0FBQyxJQUFJLGFBQWEsTUFBTSxDQUFDLEtBQUs7RUFDcEMsTUFBTSxDQUFDLEdBQUcsa0JBQWtCLE9BQU8sR0FBRyxNQUFNLENBQUMsS0FBSzs7RUFFbEQsTUFBTSxDQUFDLElBQUksU0FBUyxNQUFNLENBQUMsS0FBSzs7O0VBR2hDLE1BQU0sQ0FBQyxJQUFJLFlBQVksTUFBTSxDQUFDLEtBQUs7Ozs7Ozs7RUFPbkMsTUFBTSxDQUFDLElBQUksaUJBQWlCLE1BQU0sQ0FBQyxLQUFLOzs7O0VBSXhDLE1BQU0s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UUFFUCxLQUFLLFNBQVMsQ0FBQztRQUNmLEtBQUssSUFBSSxDQUFDO1FBQ1YsS0FBSyxXQUFXO1lBQ2QsV0FBVyxFQUFFLENBQUE7WUFDYixNQUFLO1FBRVAsS0FBSyxNQUFNLENBQUM7UUFDWixLQUFLLElBQUksQ0FBQztRQUNWLEtBQUssUUFBUSxDQUFDO1FBQ2QsS0FBSyxTQUFTO1lBQ1osUUFBUSxFQUFFLENBQUE7WUFDVixNQUFLO1FBRVA7WUFDRSxPQUFPLENBQUMsS0FBSyxDQUFDLG9CQUFvQixPQUFPLEVBQUUsQ0FBQyxDQUFBO1lBQzVDLE9BQU8sQ0FBQyxLQUFLLENBQUMsMENBQTBDLENBQUMsQ0FBQTtZQUN6RCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ25CLENBQUM7QUFDSCxDQUFDO0FBRUQsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7SUFDckIsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ3RDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDakIsQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5cbmltcG9ydCB7IGF1ZGl0IH0gZnJvbSAnLi9jb21tYW5kcy9hdWRpdC5qcydcbmltcG9ydCB7IGdlbmVyYXRlIH0gZnJvbSAnLi9jb21tYW5kcy9nZW5lcmF0ZS5qcydcbmltcG9ydCB7IHZhbGlkYXRlIH0gZnJvbSAnLi9jb21tYW5kcy92YWxpZGF0ZS5qcydcbmltcG9ydCB7IHZlcnNpb24gfSBmcm9tICcuLi9pbmRleC5qcydcblxuY29uc3QgYXJncyA9IHByb2Nlc3MuYXJndi5zbGljZSgyKVxuY29uc3QgY29tbWFuZCA9IGFyZ3NbMF1cblxuLy8gQ29sb3JzIGZvciB0ZXJtaW5hbCBvdXRwdXRcbmNvbnN0IGNvbG9ycyA9IHtcbiAgcmVzZXQ6ICdcXHgxYlswbScsXG4gIGJvbGQ6ICdcXHgxYlsxbScsXG4gIGRpbTogJ1xceDFiWzJtJyxcbiAgcmVkOiAnXFx4MWJbMzFtJyxcbiAgZ3JlZW46ICdcXHgxYlszMm0nLFxuICB5ZWxsb3c6ICdcXHgxYlszM20nLFxuICBibHVlOiAnXFx4MWJbMzRtJyxcbiAgbWFnZW50YTogJ1xceDFiWzM1bScsXG4gIGN5YW46ICdcXHgxYlszNm0nLFxufVxuXG5mdW5jdGlvbiBzaG93SGVscCgpIHtcbiAgY29uc29sZS5sb2coYFxuJHtjb2xvcnMuYm9sZH1HYWxsb3AgQ0xJJHtjb2xvcnMucmVzZXR9IC0gQ2Fub24gQ29tcGxpYW5jZSBUb29saW5nXG4ke2NvbG9ycy5kaW19Q2Fub24gVmVyc2lvbjogJHt2ZXJzaW9ufSR7Y29sb3JzLnJlc2V0fVxuXG4ke2NvbG9ycy5ib2xkfVVzYWdlOiR7Y29sb3JzLnJlc2V0fVxuICBnYWxsb3AgPGNvbW1hbmQ+IFtvcHRpb25zXVxuXG4ke2NvbG9ycy5ib2xkfUNvbW1hbmRzOiR7Y29sb3JzLnJlc2V0fVxuICBhdWRpdCBbcGF0aF0gICAgICAgQ2hlY2sgQ2Fub24gY29tcGxpYW5jZSAoZGVmYXVsdDogc3JjL2Jsb2Nrcy8pXG4gIGdlbmVyYXRlIFtvdXRwdXRdICBHZW5lcmF0ZSBBSSBydWxlcyBmcm9tIENhbm9uIChkZWZhdWx0OiAuY3Vyc29ycnVsZXMpXG4gIHZhbGlkYXRlIFtwYXRoXSAgICBWYWxpZGF0ZSBwcm9qZWN0IGZvbGRlciBzdHJ1Y3R1cmUgKGRlZmF1bHQ6IC4pXG4gIHZlcnNpb24gICAgICAgICAgICBTaG93IHZlcnNpb24gaW5mb3JtYXRpb25cbiAgaGVscCAgICAgICAgICAgICAgIFNob3cgdGhpcyBoZWxwIG1lc3NhZ2VcblxuJHtjb2xvcnMuYm9sZH1BdWRpdCBPcHRpb25zOiR7Y29sb3JzLnJlc2V0fVxuICAtLXN0cmljdCAgICAgICAgICAgRXhpdCB3aXRoIGVycm9yIGNvZGUgb24gdmlvbGF0aW9uc1xuICAtLWpzb24gICAgICAgICAgICAgT3V0cHV0IGFzIEpTT05cblxuJHtjb2xvcnMuYm9sZH1HZW5lcmF0ZSBPcHRpb25zOiR7Y29sb3JzLnJlc2V0fVxuICAtLW91dHB1dCwgLW8gICAgICAgT3V0cHV0IGZpbGUgcGF0aCAoZGVmYXVsdDogLmN1cnNvcnJ1bGVzKVxuXG4ke2NvbG9ycy5ib2xkfVZhbGlkYXRlIE9wdGlvbnM6JHtjb2xvcnMucmVzZXR9XG4gIC0tc3RyaWN0ICAgICAgICAgICBFeGl0IHdpdGggZXJyb3IgY29kZSBvbiB2aW9sYXRpb25zXG4gIC0tanNvbiAgICAgICAgICAgICBPdXRwdXQgYXMgSlNPTlxuXG4ke2NvbG9ycy5ib2xkfUV4YW1wbGVzOiR7Y29sb3JzLnJlc2V0fVxuICBnYWxsb3AgYXVkaXRcbiAgZ2FsbG9wIGF1ZGl0IHNyYy9ibG9ja3MvIC0tc3RyaWN0XG4gIGdhbGxvcCBnZW5lcmF0ZVxuICBnYWxsb3AgZ2VuZXJhdGUgLmN1cnNvcnJ1bGVzXG4gIGdhbGxvcCBnZW5lcmF0ZSAtLW91dHB1dCAuZ2l0aHViL2NvcGlsb3QtaW5zdHJ1Y3Rpb25zLm1kXG4gIGdhbGxvcCB2YWxpZGF0ZVxuICBnYWxsb3AgdmFsaWRhdGUgLiAtLXN0cmljdFxuYClcbn1cblxuZnVuY3Rpb24gc2hvd1ZlcnNpb24oKSB7XG4gIGNvbnNvbGUubG9nKGBHYWxsb3AgQ0xJIHYxLjAuMGApXG4gIGNvbnNvbGUubG9nKGBDYW5vbiB2JHt2ZXJzaW9ufWApXG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1haW4oKSB7XG4gIHN3aXRjaCAoY29tbWFuZCkge1xuICAgIGNhc2UgJ2F1ZGl0JzpcbiAgICAgIGNvbnN0IGF1ZGl0UGF0aCA9XG4gICAgICAgIGFyZ3NbMV0gJiYgIWFyZ3NbMV0uc3RhcnRzV2l0aCgnLS0nKSA/IGFyZ3NbMV0gOiAnc3JjL2Jsb2Nrcy8nXG4gICAgICBjb25zdCBhdWRpdE9wdGlvbnMgPSB7XG4gICAgICAgIHN0cmljdDogYXJncy5pbmNsdWRlcygnLS1zdHJpY3QnKSxcbiAgICAgICAganNvbjogYXJncy5pbmNsdWRlcygnLS1qc29uJyksXG4gICAgICAgIGZpeDogYXJncy5pbmNsdWRlcygnLS1maXgnKSxcbiAgICAgIH1cbiAgICAgIGF3YWl0IGF1ZGl0KGF1ZGl0UGF0aCwgYXVkaXRPcHRpb25zKVxuICAgICAgYnJlYWtcblxuICAgIGNhc2UgJ2dlbmVyYXRlJzpcbiAgICAgIC8vIEZpbmQgb3V0cHV0IHBhdGggZnJvbSBhcmdzXG4gICAgICBsZXQgb3V0cHV0UGF0aCA9ICcuY3Vyc29ycnVsZXMnXG4gICAgICBjb25zdCBvdXRwdXRJbmRleCA9IGFyZ3MuaW5kZXhPZignLS1vdXRwdXQnKVxuICAgICAgY29uc3Qgb3V0cHV0SW5kZXhTaG9ydCA9IGFyZ3MuaW5kZXhPZignLW8nKVxuICAgICAgaWYgKG91dHB1dEluZGV4ICE9PSAtMSAmJiBhcmdzW291dHB1dEluZGV4ICsgMV0pIHtcbiAgICAgICAgb3V0cHV0UGF0aCA9IGFyZ3Nbb3V0cHV0SW5kZXggKyAxXVxuICAgICAgfSBlbHNlIGlmIChvdXRwdXRJbmRleFNob3J0ICE9PSAtMSAmJiBhcmdzW291dHB1dEluZGV4U2hvcnQgKyAxXSkge1xuICAgICAgICBvdXRwdXRQYXRoID0gYXJnc1tvdXRwdXRJbmRleFNob3J0ICsgMV1cbiAgICAgIH0gZWxzZSBpZiAoYXJnc1sxXSAmJiAhYXJnc1sxXS5zdGFydHNXaXRoKCctLScpKSB7XG4gICAgICAgIG91dHB1dFBhdGggPSBhcmdzWzFdXG4gICAgICB9XG4gICAgICBjb25zdCBnZW5lcmF0ZU9wdGlvbnMgPSB7XG4gICAgICAgIG91dHB1dDogb3V0cHV0UGF0aCxcbiAgICAgICAgZm9ybWF0OiAnY3Vyc29ycnVsZXMnIGFzIGNvbnN0LFxuICAgICAgfVxuICAgICAgYXdhaXQgZ2VuZXJhdGUoZ2VuZXJhdGVPcHRpb25zKVxuICAgICAgYnJlYWtcblxuICAgIGNhc2UgJ3ZhbGlkYXRlJzpcbiAgICAgIGNvbnN0IHZhbGlkYXRlUGF0aCA9XG4gICAgICAgIGFyZ3NbMV0gJiYgIWFyZ3NbMV0uc3RhcnRzV2l0aCgnLS0nKSA/IGFyZ3NbMV0gOiAnLidcbiAgICAgIGNvbnN0IHZhbGlkYXRlT3B0aW9ucyA9IHtcbiAgICAgICAgc3RyaWN0OiBhcmdzLmluY2x1ZGVzKCctLXN0cmljdCcpLFxuICAgICAgICBqc29uOiBhcmdzLmluY2x1ZGVzKCctLWpzb24nKSxcbiAgICAgIH1cbiAgICAgIGF3YWl0IHZhbGlkYXRlKHZhbGlkYXRlUGF0aCwgdmFsaWRhdGVPcHRpb25zKVxuICAgICAgYnJlYWtcblxuICAgIGNhc2UgJ3ZlcnNpb24nOlxuICAgIGNhc2UgJy12JzpcbiAgICBjYXNlICctLXZlcnNpb24nOlxuICAgICAgc2hvd1ZlcnNpb24oKVxuICAgICAgYnJlYWtcblxuICAgIGNhc2UgJ2hlbHAnOlxuICAgIGNhc2UgJy1oJzpcbiAgICBjYXNlICctLWhlbHAnOlxuICAgIGNhc2UgdW5kZWZpbmVkOlxuICAgICAgc2hvd0hlbHAoKVxuICAgICAgYnJlYWtcblxuICAgIGRlZmF1bHQ6XG4gICAgICBjb25zb2xlLmVycm9yKGBVbmtub3duIGNvbW1hbmQ6ICR7Y29tbWFuZH1gKVxuICAgICAgY29uc29sZS5lcnJvcihgUnVuICdnYWxsb3AgaGVscCcgZm9yIHVzYWdlIGluZm9ybWF0aW9uLmApXG4gICAgICBwcm9jZXNzLmV4aXQoMSlcbiAgfVxufVxuXG5tYWluKCkuY2F0Y2goKGVycm9yKSA9PiB7XG4gIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOicsIGVycm9yLm1lc3NhZ2UpXG4gIHByb2Nlc3MuZXhpdCgxKVxufSlcbiJdfQ==