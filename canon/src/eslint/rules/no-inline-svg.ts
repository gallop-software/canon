import type { Rule } from 'eslint'
import { getCanonUrl, getCanonPattern } from '../utils/canon.js'

const RULE_NAME = 'no-inline-svg'
const pattern = getCanonPattern(RULE_NAME)

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: pattern?.summary || 'Use Icon component instead of inline SVGs',
      recommended: true,
      url: getCanonUrl(RULE_NAME),
    },
    messages: {
      noInlineSvg: `[Canon ${pattern?.id || '012'}] Use the Icon component with Iconify icons instead of inline <svg>. Import: import { Icon } from "@/components/icon"`,
    },
    schema: [],
  },

  create(context) {
    const filename = context.filename || context.getFilename()

    // Only apply to block files
    if (!filename.includes('/blocks/')) {
      return {}
    }

    return {
      JSXOpeningElement(node: any) {
        const elementName = node.name?.name

        if (elementName === 'svg') {
          context.report({
            node,
            messageId: 'noInlineSvg',
          })
        }
      },
    }
  },
}

export default rule
