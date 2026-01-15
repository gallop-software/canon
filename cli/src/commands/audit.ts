import { spawn } from 'child_process'
import { version, patterns, getPattern } from '@gallop/canon'

interface AuditOptions {
  strict: boolean
  json: boolean
  fix: boolean
}

interface Violation {
  file: string
  line: number
  column: number
  message: string
  ruleId: string
  canonPattern: string | null
  patternTitle: string | null
}

interface AuditResult {
  version: string
  timestamp: string
  path: string
  totalFiles: number
  violations: Violation[]
  summary: {
    total: number
    byPattern: Record<string, number>
  }
}

// Colors for terminal output
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

// Build rule-to-pattern mapping from Canon schema (single source of truth)
const ruleToPattern: Record<string, string> = {}
for (const pattern of patterns) {
  if (pattern.rule) {
    ruleToPattern[pattern.rule] = pattern.id
  }
}

function parseCanonFromMessage(message: string): string | null {
  const match = message.match(/\[Canon (\d{3})\]/)
  return match ? match[1] : null
}

function extractViolations(eslintOutput: string): Violation[] {
  const violations: Violation[] = []
  const lines = eslintOutput.split('\n')
  
  let currentFile = ''
  
  for (const line of lines) {
    // File path line (starts with /)
    if (line.startsWith('/') && !line.includes(':')) {
      currentFile = line.trim()
      continue
    }
    
    // Violation line (starts with spaces, has line:col pattern)
    const match = line.match(/^\s+(\d+):(\d+)\s+(warning|error)\s+(.+?)\s{2,}([\w/-]+)$/)
    if (match && currentFile) {
      const [, lineNum, column, , message, ruleId] = match
      const canonPattern = ruleToPattern[ruleId] || parseCanonFromMessage(message)
      const pattern = canonPattern ? getPattern(canonPattern) : null
      
      violations.push({
        file: currentFile,
        line: parseInt(lineNum, 10),
        column: parseInt(column, 10),
        message: message.trim(),
        ruleId,
        canonPattern,
        patternTitle: pattern?.title || null,
      })
    }
  }
  
  return violations
}

function countByPattern(violations: Violation[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const v of violations) {
    const key = v.canonPattern || 'other'
    counts[key] = (counts[key] || 0) + 1
  }
  return counts
}

function groupByFile(violations: Violation[]): Map<string, Violation[]> {
  const groups = new Map<string, Violation[]>()
  for (const v of violations) {
    const existing = groups.get(v.file) || []
    existing.push(v)
    groups.set(v.file, existing)
  }
  return groups
}

function printReport(result: AuditResult, options: AuditOptions) {
  if (options.json) {
    console.log(JSON.stringify(result, null, 2))
    return
  }

  // Header
  console.log('')
  console.log(`${c.bold}╔════════════════════════════════════════════════════════════╗${c.reset}`)
  console.log(`${c.bold}║${c.reset}           ${c.cyan}Gallop Canon${c.reset} ${c.dim}v${result.version}${c.reset} ${c.bold}Compliance Report${c.reset}           ${c.bold}║${c.reset}`)
  console.log(`${c.bold}╚════════════════════════════════════════════════════════════╝${c.reset}`)
  console.log('')

  if (result.violations.length === 0) {
    console.log(`  ${c.green}✓${c.reset} ${c.bold}All files pass Canon compliance checks${c.reset}`)
    console.log(`  ${c.dim}Path: ${result.path}${c.reset}`)
    console.log('')
    return
  }

  // Summary
  const filesWithViolations = new Set(result.violations.map(v => v.file)).size
  console.log(`  ${c.red}✗${c.reset} ${c.bold}${result.violations.length} violation${result.violations.length === 1 ? '' : 's'}${c.reset} in ${filesWithViolations} file${filesWithViolations === 1 ? '' : 's'}`)
  console.log(`  ${c.dim}Path: ${result.path}${c.reset}`)
  console.log('')

  // Violations by pattern
  console.log(`${c.bold}  Violations by Pattern:${c.reset}`)
  for (const [patternId, count] of Object.entries(result.summary.byPattern).sort()) {
    const pattern = getPattern(patternId)
    const title = pattern?.title || 'Other'
    console.log(`    ${c.yellow}${patternId}${c.reset} ${title}: ${c.bold}${count}${c.reset}`)
  }
  console.log('')

  // Detailed violations by file
  console.log(`${c.bold}  Details:${c.reset}`)
  console.log('')

  const byFile = groupByFile(result.violations)
  for (const [file, violations] of byFile) {
    // Shorten file path for display
    const shortPath = file.replace(process.cwd() + '/', '')
    console.log(`  ${c.cyan}${shortPath}${c.reset}`)
    
    for (const v of violations) {
      const patternLabel = v.canonPattern 
        ? `${c.yellow}[${v.canonPattern}]${c.reset}` 
        : `${c.dim}[---]${c.reset}`
      const location = `${c.dim}${v.line}:${v.column}${c.reset}`
      
      // Clean up message (remove [Canon XXX] prefix since we show it separately)
      const cleanMessage = v.message.replace(/\[Canon \d{3}\]\s*/, '')
      
      console.log(`    ${location} ${patternLabel} ${cleanMessage}`)
    }
    console.log('')
  }

  // Footer
  console.log(`${c.dim}  ─────────────────────────────────────────────────────────${c.reset}`)
  console.log(`  ${c.dim}Fix violations manually following the Canon patterns${c.reset}`)
  console.log('')
}

export async function audit(path: string, options: AuditOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    const args = [
      'eslint',
      path,
      '--format', 'stylish',
    ]

    if (options.fix) {
      args.push('--fix')
    }

    const eslint = spawn('npx', args, {
      cwd: process.cwd(),
      stdio: ['inherit', 'pipe', 'pipe'],
      shell: true,
    })

    let stdout = ''
    let stderr = ''

    eslint.stdout?.on('data', (data) => {
      stdout += data.toString()
    })

    eslint.stderr?.on('data', (data) => {
      stderr += data.toString()
    })

    eslint.on('close', (code) => {
      const violations = extractViolations(stdout)
      
      const result: AuditResult = {
        version,
        timestamp: new Date().toISOString(),
        path,
        totalFiles: 0, // ESLint stylish format doesn't give us this easily
        violations,
        summary: {
          total: violations.length,
          byPattern: countByPattern(violations),
        },
      }

      printReport(result, options)

      if (options.strict && violations.length > 0) {
        process.exit(1)
      }

      resolve()
    })

    eslint.on('error', (error) => {
      reject(error)
    })
  })
}
