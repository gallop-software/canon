import { ESLintUtils } from '@typescript-eslint/utils'
import { getCanonUrl, getCanonPattern } from '../utils/canon.js'

const RULE_NAME = 'no-data-imports'
const pattern = getCanonPattern(RULE_NAME)

const createRule = ESLintUtils.RuleCreator(() => getCanonUrl(RULE_NAME))

type MessageIds = 'noDataImports'

/**
 * Check if an import targets _data
 */
function importsData(importPath: string): boolean {
  return (
    importPath.includes('_data/') ||
    importPath.includes('_data\\') ||
    importPath.startsWith('@/_data/') ||
    importPath === '_data' ||
    importPath === '@/_data'
  )
}

export default createRule<[], MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description:
        pattern?.summary ||
        'Prevent runtime code from directly importing _data/ files',
    },
    messages: {
      noDataImports: `[Canon ${pattern?.id || '022'}] Do not import directly from _data/. Use utility functions or fetch data through proper APIs. _data/ is for generated content only.`,
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const filename = context.filename || context.getFilename()

    // Allow _scripts to import from _data (they generate it)
    if (filename.includes('_scripts/') || filename.includes('_scripts\\')) {
      return {}
    }

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value as string

        if (importsData(importPath)) {
          context.report({
            node,
            messageId: 'noDataImports',
          })
        }
      },
    }
  },
})
