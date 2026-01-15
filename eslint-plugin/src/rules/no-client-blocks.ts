import { ESLintUtils } from '@typescript-eslint/utils'
import { getCanonUrl, getCanonPattern } from '../utils/canon'

const RULE_NAME = 'no-client-blocks'
const pattern = getCanonPattern(RULE_NAME)

const createRule = ESLintUtils.RuleCreator(() => getCanonUrl(RULE_NAME))

type MessageIds = 'noClientBlocks'

export default createRule<[], MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: pattern?.summary || 'Blocks must be server components',
    },
    messages: {
      noClientBlocks: `[Canon ${pattern?.id || '001'}] Block "{{blockName}}" uses 'use client'. Extract hooks and client-side logic into a component in src/components/, then import it here. See: ${pattern?.title || 'Server-First Blocks'} pattern.`,
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

    return {
      // Check for 'use client' directive at the top of the file
      ExpressionStatement(node) {
        if (
          node.expression.type === 'Literal' &&
          node.expression.value === 'use client'
        ) {
          // Extract block name from filename
          const match = filename.match(/([^/\\]+)\.tsx?$/)
          const blockName = match ? match[1] : 'unknown'

          context.report({
            node,
            messageId: 'noClientBlocks',
            data: {
              blockName,
            },
          })
        }
      },
    }
  },
})
