import * as fs from 'fs'
import * as path from 'path'
import { version, patterns, categories, guarantees } from '../../index.js'

interface GenerateOptions {
  output: string
  format: 'cursorrules' | 'markdown'
}

/**
 * Read a pattern markdown file and extract sections
 */
function readPatternFile(patternFile: string): string | null {
  // Try to find the canon package patterns directory
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

  // Find code blocks after "### Good" or "### Bad" headers
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

/**
 * Generate .cursorrules content from Canon
 */
function generateCursorrules(): string {
  const lines: string[] = []

  // Header
  lines.push(`# Gallop Canon v${version} - AI Rules`)
  lines.push('')
  lines.push('This file is auto-generated from @gallop.software/canon. Do not edit manually.')
  lines.push('Regenerate with: npm run generate:ai-rules')
  lines.push('')

  // Tech stack (Canon-compatible templates)
  lines.push('## Tech Stack')
  lines.push('')
  lines.push('- Next.js 16 with App Router')
  lines.push('- React 19')
  lines.push('- TypeScript')
  lines.push('- Tailwind CSS v4')
  lines.push('- clsx for conditional class names')
  lines.push('')

  // Enforced patterns (ESLint rules)
  lines.push('## Enforced Patterns (ESLint)')
  lines.push('')
  lines.push('These patterns are enforced by `@gallop.software/canon/eslint`. Violations will be flagged.')
  lines.push('')

  const enforcedPatterns = patterns.filter(p => p.enforcement === 'eslint' && p.rule)
  for (const pattern of enforcedPatterns) {
    lines.push(`### ${pattern.id}: ${pattern.title}`)
    lines.push('')
    lines.push(pattern.summary)
    lines.push('')
    lines.push(`- **ESLint Rule:** \`${pattern.rule}\``)
    lines.push(`- **Category:** ${pattern.category}`)
    lines.push('')

    // Try to read and include examples
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

  // Documentation patterns
  lines.push('## Documentation Patterns')
  lines.push('')
  lines.push('These patterns are not enforced by ESLint but should be followed.')
  lines.push('')

  const docPatterns = patterns.filter(p => p.enforcement === 'documentation')
  for (const pattern of docPatterns) {
    lines.push(`### ${pattern.id}: ${pattern.title}`)
    lines.push('')
    lines.push(pattern.summary)
    lines.push('')
  }

  // Guarantees
  lines.push('## Canon Guarantees')
  lines.push('')
  lines.push('Following these patterns provides these guarantees:')
  lines.push('')

  for (const guarantee of guarantees) {
    lines.push(`- **${guarantee.name}** (${guarantee.id}): Patterns ${guarantee.patterns.join(', ')}`)
  }
  lines.push('')

  // Quick reference for components
  lines.push('## Component Quick Reference')
  lines.push('')
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
  lines.push('')

  // Do NOT section
  lines.push('## Do NOT')
  lines.push('')
  lines.push('- Use `\'use client\'` in blocks - extract to components')
  lines.push('- Use raw `<p>` or `<span>` - use Paragraph/Span components')
  lines.push('- Use className for margin/color/fontSize when component has props')
  lines.push('- Use Container inside Section - Section already provides containment')
  lines.push('- Use `classnames` package - use `clsx` instead')
  lines.push('- Use inline styles for hover states - use Tailwind classes')
  lines.push('')

  // File & Folder Authority section
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

  // Post-edit verification
  lines.push('## Post-Edit Verification')
  lines.push('')
  lines.push('After editing files:')
  lines.push('1. Run `npm run lint` to check for errors')
  lines.push('2. Fix any violations before committing')
  lines.push('')
  lines.push('Note: Only lint files you edited, not the entire codebase.')
  lines.push('')

  return lines.join('\n')
}

export async function generate(options: GenerateOptions): Promise<void> {
  const content = generateCursorrules()

  if (options.output === '-') {
    // Output to stdout
    console.log(content)
  } else {
    // Write to file
    const outputPath = path.resolve(process.cwd(), options.output)
    fs.writeFileSync(outputPath, content, 'utf-8')
    console.log(`✓ Generated ${options.output} from Canon v${version}`)
    console.log(`  ${patterns.length} patterns, ${guarantees.length} guarantees`)
  }
}
