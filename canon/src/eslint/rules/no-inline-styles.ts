import { ESLintUtils } from '@typescript-eslint/utils'
import { getCanonUrl, getCanonPattern } from '../utils/canon.js'

const RULE_NAME = 'no-inline-styles'
const pattern = getCanonPattern(RULE_NAME)

const createRule = ESLintUtils.RuleCreator(() => getCanonUrl(RULE_NAME))

type MessageIds = 'noInlineStyles'

export default createRule<[], MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: pattern?.summary || 'No inline styles in blocks, use Tailwind exclusively',
    },
    messages: {
      noInlineStyles: `[Canon ${pattern?.id || '008'}] Avoid inline style attribute in blocks. Use Tailwind CSS classes instead. See: ${pattern?.title || 'Tailwind Only'} pattern.`,
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const filename = context.filename || context.getFilename()
    
    // Only enforce in blocks - components can use inline styles for dynamic values
    const isBlock = filename.includes('/blocks/') || filename.includes('\\blocks\\')
    
    if (!isBlock) {
      return {}
    }

    return {
      JSXAttribute(node) {
        // Check if attribute is "style"
        if (
          node.name.type === 'JSXIdentifier' &&
          node.name.name === 'style'
        ) {
          context.report({
            node,
            messageId: 'noInlineStyles',
          })
        }
      },
    }
  },
})
