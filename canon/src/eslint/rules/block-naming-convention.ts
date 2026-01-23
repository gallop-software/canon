import { ESLintUtils } from '@typescript-eslint/utils'
import { getCanonUrl, getCanonPattern } from '../utils/canon.js'

const RULE_NAME = 'block-naming-convention'
const pattern = getCanonPattern(RULE_NAME)

const createRule = ESLintUtils.RuleCreator(() => getCanonUrl(RULE_NAME))

type MessageIds = 'blockNamingMismatch'

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

export default createRule<[], MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: pattern?.summary || 'Block export names must match filename pattern',
    },
    messages: {
      blockNamingMismatch: `[Canon ${pattern?.id || '006'}] Block export "{{actual}}" should be "{{expected}}" to match the filename "{{filename}}". See: ${pattern?.title || 'Block Naming'} pattern.`,
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
            context.report({
              node: node.declaration.id,
              messageId: 'blockNamingMismatch',
              data: {
                actual: actualName,
                expected: expectedName,
                filename: blockFilename,
              },
            })
          }
        }
      },
    }
  },
})
