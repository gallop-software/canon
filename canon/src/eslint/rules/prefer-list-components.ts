import type { Rule } from 'eslint'
import { getCanonUrl, getCanonPattern } from '../utils/canon.js'

const RULE_NAME = 'prefer-list-components'
const pattern = getCanonPattern(RULE_NAME)

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: pattern?.summary || 'Use List/Li, not raw ul/li tags',
      recommended: true,
      url: getCanonUrl(RULE_NAME),
    },
    messages: {
      useList: `[Canon ${pattern?.id || '026'}] Use the List component instead of <ul>. Import: import { List } from "@/components"`,
      useLi: `[Canon ${pattern?.id || '026'}] Use the Li component instead of <li>. Import: import { Li } from "@/components"`,
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

        // Check <ul> tags
        if (elementName === 'ul') {
          context.report({
            node,
            messageId: 'useList',
          })
          return
        }

        // Check <li> tags
        if (elementName === 'li') {
          context.report({
            node,
            messageId: 'useLi',
          })
          return
        }
      },
    }
  },
}

export default rule
