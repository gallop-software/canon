#!/usr/bin/env node

import { audit } from './commands/audit'
import { generate } from './commands/generate'
import { version } from '@gallop/canon'

const args = process.argv.slice(2)
const command = args[0]

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
}

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
`)
}

function showVersion() {
  console.log(`Gallop CLI v1.0.0`)
  console.log(`Canon v${version}`)
}

async function main() {
  switch (command) {
    case 'audit':
      const auditPath =
        args[1] && !args[1].startsWith('--') ? args[1] : 'src/blocks/'
      const auditOptions = {
        strict: args.includes('--strict'),
        json: args.includes('--json'),
        fix: args.includes('--fix'),
      }
      await audit(auditPath, auditOptions)
      break

    case 'generate':
      // Find output path from args
      let outputPath = '.cursorrules'
      const outputIndex = args.indexOf('--output')
      const outputIndexShort = args.indexOf('-o')
      if (outputIndex !== -1 && args[outputIndex + 1]) {
        outputPath = args[outputIndex + 1]
      } else if (outputIndexShort !== -1 && args[outputIndexShort + 1]) {
        outputPath = args[outputIndexShort + 1]
      } else if (args[1] && !args[1].startsWith('--')) {
        outputPath = args[1]
      }
      const generateOptions = {
        output: outputPath,
        format: 'cursorrules' as const,
      }
      await generate(generateOptions)
      break

    case 'version':
    case '-v':
    case '--version':
      showVersion()
      break

    case 'help':
    case '-h':
    case '--help':
    case undefined:
      showHelp()
      break

    default:
      console.error(`Unknown command: ${command}`)
      console.error(`Run 'gallop help' for usage information.`)
      process.exit(1)
  }
}

main().catch((error) => {
  console.error('Error:', error.message)
  process.exit(1)
})
