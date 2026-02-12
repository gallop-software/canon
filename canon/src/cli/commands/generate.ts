import * as fs from 'fs'
import * as path from 'path'
import { version, patterns, guarantees } from '../../index.js'
import { loadConfig } from '../config.js'
import type { CanonTemplateConfig } from '../../types/config.js'

type OutputFormat = 'cursorrules' | 'claude' | 'copilot'

interface GenerateOptions {
  output: string
  format: OutputFormat
}

/**
 * Detect output format from filename
 */
function detectFormat(filename: string): OutputFormat {
  const base = path.basename(filename).toLowerCase()
  if (base === 'claude.md') return 'claude'
  if (base === 'copilot-instructions.md') return 'copilot'
  return 'cursorrules'
}

/**
 * Get all output targets when generating all files
 */
function getAllTargets(): GenerateOptions[] {
  return [
    { output: '.cursorrules', format: 'cursorrules' },
    { output: 'CLAUDE.md', format: 'claude' },
    { output: '.github/copilot-instructions.md', format: 'copilot' },
  ]
}

/**
 * Read a pattern markdown file and extract sections
 */
function readPatternFile(patternFile: string): string | null {
  const possiblePaths = [
    path.join(process.cwd(), 'node_modules/@gallop.software/canon', patternFile),
    // Fallback for development
    path.join(import.meta.dirname, '../../../', patternFile),
  ]

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf-8')
    }
  }

  return null
}

/**
 * Extract examples from pattern markdown
 */
function extractExamples(content: string): { good: string[]; bad: string[] } {
  const good: string[] = []
  const bad: string[] = []

  const goodMatch = content.match(/### Good\s*\n```[\s\S]*?```/g)
  const badMatch = content.match(/### Bad\s*\n```[\s\S]*?```/g)

  if (goodMatch) {
    for (const match of goodMatch) {
      const code = match.replace(/### Good\s*\n/, '').trim()
      good.push(code)
    }
  }

  if (badMatch) {
    for (const match of badMatch) {
      const code = match.replace(/### Bad\s*\n/, '').trim()
      bad.push(code)
    }
  }

  return { good, bad }
}

// ─── Shared section generators ────────────────────────────────────────────

function generateHeader(format: OutputFormat): string[] {
  const lines: string[] = []

  if (format === 'claude') {
    lines.push(`# CLAUDE.md — Project-Specific Intelligence`)
    lines.push('')
    lines.push(`> Auto-generated from Gallop Canon v${version}. Do not edit manually.`)
    lines.push(`> Regenerate with: npm run generate:ai-rules`)
  } else if (format === 'copilot') {
    lines.push(`# Gallop Canon v${version} - Copilot Instructions`)
    lines.push('')
    lines.push('This file is auto-generated from @gallop.software/canon. Do not edit manually.')
    lines.push('Regenerate with: npm run generate:ai-rules')
  } else {
    lines.push(`# Gallop Canon v${version} - AI Rules`)
    lines.push('')
    lines.push('This file is auto-generated from @gallop.software/canon. Do not edit manually.')
    lines.push('Regenerate with: npm run generate:ai-rules')
  }

  lines.push('')
  return lines
}

function generateTechStack(): string[] {
  return [
    '## Tech Stack',
    '',
    '- Next.js 16 with App Router',
    '- React 19',
    '- TypeScript',
    '- Tailwind CSS v4',
    '- clsx for conditional class names',
    '',
  ]
}

function generateEnforcedPatterns(format: OutputFormat): string[] {
  const lines: string[] = []
  const enforcedPatterns = patterns.filter(p => p.enforcement === 'eslint' && p.rule)

  lines.push('## Enforced Patterns (ESLint)')
  lines.push('')
  lines.push('These patterns are enforced by `@gallop.software/canon/eslint`. Violations will be flagged.')
  lines.push('')

  if (format === 'claude') {
    // Claude can run lint — brief list with rule names
    for (const pattern of enforcedPatterns) {
      lines.push(`- **${pattern.id}: ${pattern.title}** — \`${pattern.rule}\` — ${pattern.summary}`)
    }
    lines.push('')
  } else {
    // Cursorrules and Copilot: full examples
    for (const pattern of enforcedPatterns) {
      lines.push(`### ${pattern.id}: ${pattern.title}`)
      lines.push('')
      lines.push(pattern.summary)
      lines.push('')
      lines.push(`- **ESLint Rule:** \`${pattern.rule}\``)
      lines.push(`- **Category:** ${pattern.category}`)
      lines.push('')

      if (format === 'cursorrules') {
        const content = readPatternFile(pattern.file)
        if (content) {
          const { good, bad } = extractExamples(content)
          if (bad.length > 0) {
            lines.push('**Bad:**')
            lines.push('')
            lines.push(bad[0])
            lines.push('')
          }
          if (good.length > 0) {
            lines.push('**Good:**')
            lines.push('')
            lines.push(good[0])
            lines.push('')
          }
        }
      }
    }
  }

  return lines
}

function generateDocPatterns(): string[] {
  const lines: string[] = []
  const docPatterns = patterns.filter(p => p.enforcement === 'documentation')

  lines.push('## Documentation Patterns')
  lines.push('')
  lines.push('These patterns are not enforced by ESLint but should be followed.')
  lines.push('')

  for (const pattern of docPatterns) {
    lines.push(`### ${pattern.id}: ${pattern.title}`)
    lines.push('')
    lines.push(pattern.summary)
    lines.push('')
  }

  return lines
}

function generateGuarantees(): string[] {
  const lines: string[] = []

  lines.push('## Canon Guarantees')
  lines.push('')
  lines.push('Following these patterns provides these guarantees:')
  lines.push('')

  for (const guarantee of guarantees) {
    lines.push(`- **${guarantee.name}** (${guarantee.id}): Patterns ${guarantee.patterns.join(', ')}`)
  }
  lines.push('')

  return lines
}

function generateComponentReference(config: CanonTemplateConfig | null): string[] {
  const lines: string[] = []

  lines.push('## Component Quick Reference')
  lines.push('')

  if (config?.components?.length) {
    for (const comp of config.components) {
      const propsStr = comp.props?.length ? ` - props: ${comp.props.map(p => `\`${p}\``).join(', ')}` : ''
      const noteStr = comp.notes ? ` (${comp.notes})` : ''
      lines.push(`- \`${comp.name}\`${propsStr}${noteStr}`)
    }
  } else {
    // Fallback: hardcoded component list
    lines.push('### Typography')
    lines.push('- `Heading` - props: `as`, `color`, `margin`, `fontSize`, `fontWeight`, `textAlign`')
    lines.push('- `Paragraph` - props: `color`, `margin`, `fontSize`, `lineHeight`, `textAlign`')
    lines.push('- `Span` - props: `color`, `margin`, `fontSize` (inline text, mb-0 default)')
    lines.push('- `Label` - props: `color`, `margin`, `fontSize`, `fontWeight`, `textAlign`')
    lines.push('- `Quote` - props: `variant`, `color`, `margin`, `fontSize`, `fontWeight`, `textAlign`')
    lines.push('')
    lines.push('### Layout')
    lines.push('- `Section` - semantic section wrapper')
    lines.push('- `Columns` - grid layout, props: `cols`, `gap`, `align`')
    lines.push('- `Column` - column child')
    lines.push('')
    lines.push('### Interactive')
    lines.push('- `Button` - props: `href`, `variant`, `icon`, `iconPlacement`, `margin`')
    lines.push('- `Icon` - Iconify icon wrapper')
  }

  lines.push('')
  return lines
}

function generateDoNotSection(config: CanonTemplateConfig | null): string[] {
  const lines: string[] = []

  lines.push('## Do NOT')
  lines.push('')

  // Default rules always present
  lines.push("- Use `'use client'` in blocks - extract to components")
  lines.push('- Use raw `<p>`, `<span>`, or `<h1>`–`<h6>` - use Paragraph/Span/Heading components')
  lines.push('- Use className for margin/color/fontSize when component has props')
  lines.push('- Use Container inside Section - Section already provides containment')
  lines.push('- Use `classnames` package - use `clsx` instead')
  lines.push('- Use inline styles for hover states - use Tailwind classes')
  lines.push('- Use native `IntersectionObserver` - use `react-intersection-observer` package')
  lines.push('- Use inline `<svg>` in blocks - use the Icon component with Iconify icons')
  lines.push('- Use deep relative imports (`../../`) - use `@/` alias imports')

  // Template-specific rules
  if (config?.rules) {
    for (const rule of config.rules) {
      if (rule.type === 'doNot') {
        lines.push(`- ${rule.rule}`)
      }
    }
  }

  lines.push('')
  return lines
}

function generateFileAuthority(): string[] {
  const lines: string[] = []

  lines.push('## File & Folder Authority')
  lines.push('')
  lines.push('These rules govern what AI is allowed and forbidden to do when creating, moving, or modifying files and folders.')
  lines.push('')

  lines.push('### Defined `/src` Structure')
  lines.push('')
  lines.push('```')
  lines.push('src/')
  lines.push('├── app/          # Routes, layouts, metadata (Next.js App Router)')
  lines.push('├── blocks/       # Page-level content sections')
  lines.push('├── blog/         # Blog content (archive content type)')
  lines.push('├── components/   # Reusable UI primitives')
  lines.push('├── hooks/        # Custom React hooks')
  lines.push('├── styles/       # CSS, Tailwind, fonts')
  lines.push('├── template/     # Template-level components')
  lines.push('├── tools/        # Utility tools')
  lines.push('├── types/        # TypeScript types')
  lines.push('├── utils/        # Utility functions')
  lines.push('└── state.ts      # Global state')
  lines.push('```')
  lines.push('')

  lines.push('### App Router Structure')
  lines.push('')
  lines.push('Routes must use Next.js route groups. At minimum, `(default)` must exist:')
  lines.push('')
  lines.push('```')
  lines.push('src/app/')
  lines.push('├── (default)/        # Required - default layout group')
  lines.push('│   ├── layout.tsx')
  lines.push('│   └── {routes}/')
  lines.push('├── (hero)/           # Optional - hero layout variant')
  lines.push('├── api/              # API routes (exception - no grouping)')
  lines.push('├── layout.tsx        # Root layout')
  lines.push('└── metadata.tsx      # Shared metadata')
  lines.push('```')
  lines.push('')
  lines.push('- All page routes must be inside a route group (parentheses folder)')
  lines.push('- Never create routes directly under `src/app/` (except `api/`, root files)')
  lines.push('- New route groups are allowed freely when a new layout variant is needed')
  lines.push('')

  lines.push('### File Structure Rules')
  lines.push('')
  lines.push('**Blocks:**')
  lines.push('- Always single files directly in `src/blocks/`')
  lines.push('- Never create folders inside `src/blocks/`')
  lines.push('- Example: `src/blocks/hero-1.tsx`, `src/blocks/testimonial-3.tsx`')
  lines.push('')
  lines.push('**Components:**')
  lines.push('- Simple components: Single file in `src/components/`')
  lines.push('- Complex components: Folder with `index.tsx`')
  lines.push('- Use folders when component has multiple sub-files')
  lines.push('')

  lines.push('### DO - What AI IS Allowed To Do')
  lines.push('')
  lines.push('- Create files only inside existing Canon-defined zones')
  lines.push('- Place new files in the zone that matches their architectural role')
  lines.push('- Follow existing folder conventions within a zone')
  lines.push('- Reuse existing folders when possible')
  lines.push('- Create new route groups in `src/app/` when new layouts are needed')
  lines.push('- Create new archive content folders (like `blog/`, `portfolio/`) in `/src`')
  lines.push('- Create dotfiles/directories at project root (`.github/`, `.cursor/`, etc.)')
  lines.push('- Ask for confirmation if the correct zone is ambiguous')
  lines.push('')

  lines.push('### DO NOT - What AI Is Forbidden To Do')
  lines.push('')
  lines.push('- Create new top-level directories (except dotfiles)')
  lines.push('- Create new folders in `/src` (except archive content or route groups)')
  lines.push('- Place files outside Canon-defined zones')
  lines.push('- Mix responsibilities across zones (components importing blocks, etc.)')
  lines.push('- Reorganize or move folders without explicit instruction')
  lines.push('- Invent new organizational conventions')
  lines.push('- Create placeholder or speculative files')
  lines.push('- Import from `_scripts/` or `_data/` in runtime code')
  lines.push('- Manually edit files in `_data/` (generated only)')
  lines.push('')

  return lines
}

function generateVerification(config: CanonTemplateConfig | null): string[] {
  const lines: string[] = []

  lines.push('## Post-Edit Verification')
  lines.push('')
  lines.push('After editing files:')

  if (config?.verification?.length) {
    let step = 1
    for (const cmd of config.verification) {
      lines.push(`${step}. Run \`${cmd}\``)
      step++
    }
    lines.push(`${step}. Fix any violations before committing`)
  } else {
    lines.push('1. Run `npm run lint` to check for errors')
    lines.push('2. Fix any violations before committing')
  }

  lines.push('')
  lines.push('Note: Only lint files you edited, not the entire codebase.')
  lines.push('')

  return lines
}

// ─── Claude-specific sections ─────────────────────────────────────────────

function generateAutoGenFiles(config: CanonTemplateConfig | null): string[] {
  if (!config?.generatedFiles?.length) return []

  const lines: string[] = []

  lines.push('## Auto-Generated Files — Never Edit Manually')
  lines.push('')
  lines.push('| File | Regenerate With | Triggered By |')
  lines.push('|---|---|---|')

  for (const file of config.generatedFiles) {
    lines.push(`| \`${file.path}\` | \`${file.command}\` | ${file.trigger} |`)
  }

  lines.push('')
  return lines
}

function generateBuildCommands(config: CanonTemplateConfig | null): string[] {
  if (!config?.buildCommands?.length) return []

  const lines: string[] = []

  lines.push('## Build Commands')
  lines.push('')
  lines.push('| Command | Purpose |')
  lines.push('|---|---|')

  for (const cmd of config.buildCommands) {
    lines.push(`| \`${cmd.script}\` | ${cmd.description} |`)
  }

  lines.push('')
  return lines
}

function generateColorTokens(config: CanonTemplateConfig | null): string[] {
  if (!config?.colorTokens) return []

  const lines: string[] = []
  const ct = config.colorTokens

  lines.push('## Color Token System')
  lines.push('')
  lines.push('All colors use semantic tokens defined in `src/styles/tailwind.css` `@theme`:')
  lines.push('')

  if (ct.surface?.length) {
    lines.push(`- **Surface**: ${ct.surface.map(s => `\`${s}\``).join(', ')}`)
  }
  if (ct.text?.length) {
    lines.push(`- **Text**: ${ct.text.map(s => `\`${s}\``).join(', ')}`)
  }
  if (ct.overlay?.length) {
    lines.push(`- **Overlay** (fixed — don't flip in dark mode): ${ct.overlay.map(s => `\`${s}\``).join(', ')}`)
  }
  if (ct.accents?.length) {
    lines.push(`- **Accents**: ${ct.accents.map(s => `\`${s}\``).join(', ')}`)
  }

  lines.push('')

  lines.push('**Never use**: `gray-*`, `white`, `black`, `slate-*` — always map to a semantic token.')
  lines.push('')

  return lines
}

function generateStateManagement(config: CanonTemplateConfig | null): string[] {
  if (!config?.state) return []

  const lines: string[] = []
  const st = config.state

  lines.push('## State Management')
  lines.push('')
  lines.push(`${st.library} store at \`${st.file}\`. Read with \`${st.readPattern}\`, write with \`${st.writePattern}\`.`)
  lines.push('')

  if (st.properties?.length) {
    lines.push(`Available state: ${st.properties.map(p => `\`${p}\``).join(', ')}.`)
    lines.push('')
  }

  return lines
}

function generateTemplateRules(config: CanonTemplateConfig | null): string[] {
  if (!config?.rules?.length) return []

  const doRules = config.rules.filter(r => r.type === 'do')
  if (!doRules.length) return []

  const lines: string[] = []

  lines.push('## Template-Specific Rules')
  lines.push('')

  for (const rule of doRules) {
    lines.push(`- ${rule.rule}`)
  }

  lines.push('')
  return lines
}

// ─── Format generators ────────────────────────────────────────────────────

function generateCursorrules(config: CanonTemplateConfig | null): string {
  const lines: string[] = [
    ...generateHeader('cursorrules'),
    ...generateTechStack(),
    ...generateEnforcedPatterns('cursorrules'),
    ...generateDocPatterns(),
    ...generateGuarantees(),
    ...generateComponentReference(config),
    ...generateDoNotSection(config),
    ...generateFileAuthority(),
    ...generateVerification(config),
  ]

  return lines.join('\n')
}

function generateClaudeMd(config: CanonTemplateConfig | null): string {
  const lines: string[] = [
    ...generateHeader('claude'),
    ...generateAutoGenFiles(config),
    ...generateBuildCommands(config),
    ...generateEnforcedPatterns('claude'),
    ...generateDocPatterns(),
    ...generateColorTokens(config),
    ...generateComponentReference(config),
    ...generateStateManagement(config),
    ...generateTemplateRules(config),
    ...generateDoNotSection(config),
    ...generateVerification(config),
  ]

  return lines.join('\n')
}

function generateCopilotInstructions(config: CanonTemplateConfig | null): string {
  const lines: string[] = [
    ...generateHeader('copilot'),
    ...generateTechStack(),
    ...generateEnforcedPatterns('copilot'),
    ...generateDocPatterns(),
    ...generateComponentReference(config),
    ...generateDoNotSection(config),
    ...generateVerification(config),
  ]

  return lines.join('\n')
}

function generateContent(format: OutputFormat, config: CanonTemplateConfig | null): string {
  switch (format) {
    case 'claude':
      return generateClaudeMd(config)
    case 'copilot':
      return generateCopilotInstructions(config)
    case 'cursorrules':
    default:
      return generateCursorrules(config)
  }
}

function writeOutput(content: string, outputPath: string): void {
  const dir = path.dirname(outputPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(outputPath, content, 'utf-8')
}

// ─── Public API ───────────────────────────────────────────────────────────

export async function generate(options: GenerateOptions): Promise<void> {
  const config = loadConfig()

  if (options.output === 'all') {
    // Generate all targets
    const targets = getAllTargets()
    for (const target of targets) {
      const content = generateContent(target.format, config)
      const outputPath = path.resolve(process.cwd(), target.output)
      writeOutput(content, outputPath)
      console.log(`✓ Generated ${target.output}`)
    }
    console.log(`  Canon v${version} — ${patterns.length} patterns, ${guarantees.length} guarantees`)
    if (config) {
      console.log(`  Template config: ${config.name}`)
    }
  } else if (options.output === '-') {
    const content = generateContent(options.format, config)
    console.log(content)
  } else {
    const content = generateContent(options.format, config)
    const outputPath = path.resolve(process.cwd(), options.output)
    writeOutput(content, outputPath)
    console.log(`✓ Generated ${options.output} from Canon v${version}`)
    console.log(`  ${patterns.length} patterns, ${guarantees.length} guarantees`)
    if (config) {
      console.log(`  Template config: ${config.name}`)
    }
  }
}
