import { ESLintUtils } from '@typescript-eslint/utils'
import { getCanonUrl, getCanonPattern } from '../utils/canon.js'

const RULE_NAME = 'block-naming-convention'
const pattern = getCanonPattern(RULE_NAME)

const createRule = ESLintUtils.RuleCreator(() => getCanonUrl(RULE_NAME))

type MessageIds = 'blockNamingMismatch' | 'blockNamingNoNumber'

/**
 * Converts a block filename to its expected PascalCase export name
 * e.g., "hero-5" -> "Hero5", "section-10" -> "Section10", "content-39" -> "Content39"
 */
function filenameToPascalCase(filename: string): string {
  // Remove extension and split by hyphens
  const baseName = filename.replace(/\.tsx?$/, '')
  
  // Split by hyphens and convert each part
  return baseName
    .split('-')
    .map((part) => {
      // Capitalize first letter of each part
      return part.charAt(0).toUpperCase() + part.slice(1)
    })
    .join('')
}

/**
 * Converts a PascalCase export name to kebab-case filename
 * e.g., "Content" -> "content", "Hero5" -> "hero-5", "CallToAction1" -> "call-to-action-1"
 */
function pascalCaseToFilename(name: string): string {
  return name
    // Insert hyphen before uppercase letters (but not at start)
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    // Insert hyphen before numbers
    .replace(/([a-zA-Z])(\d)/g, '$1-$2')
    .toLowerCase()
}

/**
 * Check if a name ends with a number
 */
function hasTrailingNumber(name: string): boolean {
  return /\d+$/.test(name)
}

export default createRule<[], MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: pattern?.summary || 'Block export names must match filename pattern',
    },
    messages: {
      blockNamingMismatch: `[Canon ${pattern?.id || '006'}] Block export "{{actual}}" should be "{{expected}}" to match the filename "{{filename}}". Or rename the file to "{{suggestedFilename}}.tsx". See: ${pattern?.title || 'Block Naming'} pattern.`,
      blockNamingNoNumber: `[Canon ${pattern?.id || '006'}] Block export "{{actual}}" must end with a number (e.g., "{{actual}}1"). Rename to "{{suggested}}" or rename file to "{{suggestedFilename}}-{n}.tsx". See: ${pattern?.title || 'Block Naming'} pattern.`,
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const filename = context.filename || context.getFilename()

    // Only check files in src/blocks/
    if (!filename.includes('/blocks/') && !filename.includes('\\blocks\\')) {
      return {}
    }

    // Extract just the filename (e.g., "hero-5.tsx")
    const match = filename.match(/([^/\\]+\.tsx?)$/)
    if (!match) {
      return {}
    }

    const blockFilename = match[1]
    const expectedName = filenameToPascalCase(blockFilename)

    return {
      // Check export default function declarations
      ExportDefaultDeclaration(node) {
        if (node.declaration.type === 'FunctionDeclaration' && node.declaration.id) {
          const actualName = node.declaration.id.name
          
          if (actualName !== expectedName) {
            // Check if the export name has a trailing number
            if (!hasTrailingNumber(actualName)) {
              // No number - suggest adding one
              const suggestedFilename = pascalCaseToFilename(actualName)
              context.report({
                node: node.declaration.id,
                messageId: 'blockNamingNoNumber',
                data: {
                  actual: actualName,
                  suggested: `${actualName}1`,
                  suggestedFilename,
                },
              })
            } else {
              // Has number but doesn't match filename
              const suggestedFilename = pascalCaseToFilename(actualName)
              context.report({
                node: node.declaration.id,
                messageId: 'blockNamingMismatch',
                data: {
                  actual: actualName,
                  expected: expectedName,
                  filename: blockFilename,
                  suggestedFilename,
                },
              })
            }
          }
        }
      },
    }
  },
})
