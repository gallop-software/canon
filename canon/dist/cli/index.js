#!/usr/bin/env node
import { audit } from './commands/audit.js';
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
  version            Show version information
  help               Show this help message

${colors.bold}Audit Options:${colors.reset}
  --strict           Exit with error code on violations
  --json             Output as JSON

${colors.bold}Examples:${colors.reset}
  gallop audit
  gallop audit src/blocks/ --strict
`);
}
function showVersion() {
    console.log(`Gallop CLI v1.0.0`);
    console.log(`Canon v${version}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2xpL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0scUJBQXFCLENBQUE7QUFDM0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLGFBQWEsQ0FBQTtBQUVyQyxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNsQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFFdkIsNkJBQTZCO0FBQzdCLE1BQU0sTUFBTSxHQUFHO0lBQ2IsS0FBSyxFQUFFLFNBQVM7SUFDaEIsSUFBSSxFQUFFLFNBQVM7SUFDZixHQUFHLEVBQUUsU0FBUztJQUNkLEdBQUcsRUFBRSxVQUFVO0lBQ2YsS0FBSyxFQUFFLFVBQVU7SUFDakIsTUFBTSxFQUFFLFVBQVU7SUFDbEIsSUFBSSxFQUFFLFVBQVU7SUFDaEIsT0FBTyxFQUFFLFVBQVU7SUFDbkIsSUFBSSxFQUFFLFVBQVU7Q0FDakIsQ0FBQTtBQUVELFNBQVMsUUFBUTtJQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUM7RUFDWixNQUFNLENBQUMsSUFBSSxhQUFhLE1BQU0sQ0FBQyxLQUFLO0VBQ3BDLE1BQU0sQ0FBQyxHQUFHLGtCQUFrQixPQUFPLEdBQUcsTUFBTSxDQUFDLEtBQUs7O0VBRWxELE1BQU0sQ0FBQyxJQUFJLFNBQVMsTUFBTSxDQUFDLEtBQUs7OztFQUdoQyxNQUFNLENBQUMsSUFBSSxZQUFZLE1BQU0sQ0FBQyxLQUFLOzs7OztFQUtuQyxNQUFNLENBQUMsSUFBSSxpQkFBaUIsTUFBTSxDQUFDLEtBQUs7Ozs7RUFJeEMsTUFBTSxDQUFDLElBQUksWUFBWSxNQUFNLENBQUMsS0FBSzs7O0NBR3BDLENBQUMsQ0FBQTtBQUNGLENBQUM7QUFFRCxTQUFTLFdBQVc7SUFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO0lBQ2hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxPQUFPLEVBQUUsQ0FBQyxDQUFBO0FBQ2xDLENBQUM7QUFFRCxLQUFLLFVBQVUsSUFBSTtJQUNqQixRQUFRLE9BQU8sRUFBRSxDQUFDO1FBQ2hCLEtBQUssT0FBTztZQUNWLE1BQU0sU0FBUyxHQUNiLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFBO1lBQ3pELE1BQU0sWUFBWSxHQUFHO2dCQUNuQixNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUM7Z0JBQ2pDLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztnQkFDN0IsR0FBRyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO2FBQzVCLENBQUE7WUFDRCxNQUFNLEtBQUssQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUE7WUFDcEMsTUFBSztRQUVQLEtBQUssU0FBUyxDQUFDO1FBQ2YsS0FBSyxJQUFJLENBQUM7UUFDVixLQUFLLFdBQVc7WUFDZCxXQUFXLEVBQUUsQ0FBQTtZQUNiLE1BQUs7UUFFUCxLQUFLLE1BQU0sQ0FBQztRQUNaLEtBQUssSUFBSSxDQUFDO1FBQ1YsS0FBSyxRQUFRLENBQUM7UUFDZCxLQUFLLFNBQVM7WUFDWixRQUFRLEVBQUUsQ0FBQTtZQUNWLE1BQUs7UUFFUDtZQUNFLE9BQU8sQ0FBQyxLQUFLLENBQUMsb0JBQW9CLE9BQU8sRUFBRSxDQUFDLENBQUE7WUFDNUMsT0FBTyxDQUFDLEtBQUssQ0FBQywwQ0FBMEMsQ0FBQyxDQUFBO1lBQ3pELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDbkIsQ0FBQztBQUNILENBQUM7QUFFRCxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtJQUNyQixPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDdEMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNqQixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcblxuaW1wb3J0IHsgYXVkaXQgfSBmcm9tICcuL2NvbW1hbmRzL2F1ZGl0LmpzJ1xuaW1wb3J0IHsgdmVyc2lvbiB9IGZyb20gJy4uL2luZGV4LmpzJ1xuXG5jb25zdCBhcmdzID0gcHJvY2Vzcy5hcmd2LnNsaWNlKDIpXG5jb25zdCBjb21tYW5kID0gYXJnc1swXVxuXG4vLyBDb2xvcnMgZm9yIHRlcm1pbmFsIG91dHB1dFxuY29uc3QgY29sb3JzID0ge1xuICByZXNldDogJ1xceDFiWzBtJyxcbiAgYm9sZDogJ1xceDFiWzFtJyxcbiAgZGltOiAnXFx4MWJbMm0nLFxuICByZWQ6ICdcXHgxYlszMW0nLFxuICBncmVlbjogJ1xceDFiWzMybScsXG4gIHllbGxvdzogJ1xceDFiWzMzbScsXG4gIGJsdWU6ICdcXHgxYlszNG0nLFxuICBtYWdlbnRhOiAnXFx4MWJbMzVtJyxcbiAgY3lhbjogJ1xceDFiWzM2bScsXG59XG5cbmZ1bmN0aW9uIHNob3dIZWxwKCkge1xuICBjb25zb2xlLmxvZyhgXG4ke2NvbG9ycy5ib2xkfUdhbGxvcCBDTEkke2NvbG9ycy5yZXNldH0gLSBDYW5vbiBDb21wbGlhbmNlIFRvb2xpbmdcbiR7Y29sb3JzLmRpbX1DYW5vbiBWZXJzaW9uOiAke3ZlcnNpb259JHtjb2xvcnMucmVzZXR9XG5cbiR7Y29sb3JzLmJvbGR9VXNhZ2U6JHtjb2xvcnMucmVzZXR9XG4gIGdhbGxvcCA8Y29tbWFuZD4gW29wdGlvbnNdXG5cbiR7Y29sb3JzLmJvbGR9Q29tbWFuZHM6JHtjb2xvcnMucmVzZXR9XG4gIGF1ZGl0IFtwYXRoXSAgICAgICBDaGVjayBDYW5vbiBjb21wbGlhbmNlIChkZWZhdWx0OiBzcmMvKVxuICB2ZXJzaW9uICAgICAgICAgICAgU2hvdyB2ZXJzaW9uIGluZm9ybWF0aW9uXG4gIGhlbHAgICAgICAgICAgICAgICBTaG93IHRoaXMgaGVscCBtZXNzYWdlXG5cbiR7Y29sb3JzLmJvbGR9QXVkaXQgT3B0aW9uczoke2NvbG9ycy5yZXNldH1cbiAgLS1zdHJpY3QgICAgICAgICAgIEV4aXQgd2l0aCBlcnJvciBjb2RlIG9uIHZpb2xhdGlvbnNcbiAgLS1qc29uICAgICAgICAgICAgIE91dHB1dCBhcyBKU09OXG5cbiR7Y29sb3JzLmJvbGR9RXhhbXBsZXM6JHtjb2xvcnMucmVzZXR9XG4gIGdhbGxvcCBhdWRpdFxuICBnYWxsb3AgYXVkaXQgc3JjL2Jsb2Nrcy8gLS1zdHJpY3RcbmApXG59XG5cbmZ1bmN0aW9uIHNob3dWZXJzaW9uKCkge1xuICBjb25zb2xlLmxvZyhgR2FsbG9wIENMSSB2MS4wLjBgKVxuICBjb25zb2xlLmxvZyhgQ2Fub24gdiR7dmVyc2lvbn1gKVxufVxuXG5hc3luYyBmdW5jdGlvbiBtYWluKCkge1xuICBzd2l0Y2ggKGNvbW1hbmQpIHtcbiAgICBjYXNlICdhdWRpdCc6XG4gICAgICBjb25zdCBhdWRpdFBhdGggPVxuICAgICAgICBhcmdzWzFdICYmICFhcmdzWzFdLnN0YXJ0c1dpdGgoJy0tJykgPyBhcmdzWzFdIDogJ3NyYy8nXG4gICAgICBjb25zdCBhdWRpdE9wdGlvbnMgPSB7XG4gICAgICAgIHN0cmljdDogYXJncy5pbmNsdWRlcygnLS1zdHJpY3QnKSxcbiAgICAgICAganNvbjogYXJncy5pbmNsdWRlcygnLS1qc29uJyksXG4gICAgICAgIGZpeDogYXJncy5pbmNsdWRlcygnLS1maXgnKSxcbiAgICAgIH1cbiAgICAgIGF3YWl0IGF1ZGl0KGF1ZGl0UGF0aCwgYXVkaXRPcHRpb25zKVxuICAgICAgYnJlYWtcblxuICAgIGNhc2UgJ3ZlcnNpb24nOlxuICAgIGNhc2UgJy12JzpcbiAgICBjYXNlICctLXZlcnNpb24nOlxuICAgICAgc2hvd1ZlcnNpb24oKVxuICAgICAgYnJlYWtcblxuICAgIGNhc2UgJ2hlbHAnOlxuICAgIGNhc2UgJy1oJzpcbiAgICBjYXNlICctLWhlbHAnOlxuICAgIGNhc2UgdW5kZWZpbmVkOlxuICAgICAgc2hvd0hlbHAoKVxuICAgICAgYnJlYWtcblxuICAgIGRlZmF1bHQ6XG4gICAgICBjb25zb2xlLmVycm9yKGBVbmtub3duIGNvbW1hbmQ6ICR7Y29tbWFuZH1gKVxuICAgICAgY29uc29sZS5lcnJvcihgUnVuICdnYWxsb3AgaGVscCcgZm9yIHVzYWdlIGluZm9ybWF0aW9uLmApXG4gICAgICBwcm9jZXNzLmV4aXQoMSlcbiAgfVxufVxuXG5tYWluKCkuY2F0Y2goKGVycm9yKSA9PiB7XG4gIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOicsIGVycm9yLm1lc3NhZ2UpXG4gIHByb2Nlc3MuZXhpdCgxKVxufSlcbiJdfQ==