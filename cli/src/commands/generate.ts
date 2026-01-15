import * as fs from 'fs'
import * as path from 'path'
import { version, patterns, categories, guarantees } from '@gallop/canon'

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
    path.join(process.cwd(), 'packages/canon', patternFile),
    path.join(process.cwd(), 'node_modules/@gallop/canon', patternFile),
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
  lines.push('This file is auto-generated from @gallop/canon. Do not edit manually.')
  lines.push('Regenerate with: npm run generate:ai-rules')
  lines.push('')

  // Tech stack (from speedwell context)
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
  lines.push('These patterns are enforced by `@gallop/eslint-plugin`. Violations will be flagged.')
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
