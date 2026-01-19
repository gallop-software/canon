import type { Rule } from 'eslint'
import { getCanonUrl, getCanonPattern } from '../utils/canon.js'

const RULE_NAME = 'no-native-date'
const pattern = getCanonPattern(RULE_NAME)

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        pattern?.summary || 'Use Luxon DateTime, not native JavaScript Date',
      recommended: true,
      url: getCanonUrl(RULE_NAME),
    },
    messages: {
      noNewDate: `[Canon ${pattern?.id || '027'}] Use Luxon's DateTime instead of new Date(). Native Date operates in the user's local timezone, causing inconsistencies. Import: import { DateTime } from 'luxon'`,
      noDateNow: `[Canon ${pattern?.id || '027'}] Use Luxon's DateTime.now() instead of Date.now(). Import: import { DateTime } from 'luxon'`,
      noDateParse: `[Canon ${pattern?.id || '027'}] Use Luxon's DateTime.fromISO() or DateTime.fromFormat() instead of Date.parse(). Import: import { DateTime } from 'luxon'`,
    },
    schema: [],
  },

  create(context) {
    const filename = context.filename || context.getFilename()

    // Only check files in src/ (blocks, components, hooks, etc.)
    if (!filename.includes('/src/')) {
      return {}
    }

    // Skip _scripts and _data folders
    if (filename.includes('/_scripts/') || filename.includes('/_data/')) {
      return {}
    }

    return {
      // Catch: new Date()
      NewExpression(node: any) {
        if (node.callee?.name === 'Date') {
          context.report({
            node,
            messageId: 'noNewDate',
          })
        }
      },

      // Catch: Date.now() and Date.parse()
      CallExpression(node: any) {
        if (
          node.callee?.type === 'MemberExpression' &&
          node.callee?.object?.name === 'Date'
        ) {
          const methodName = node.callee?.property?.name

          if (methodName === 'now') {
            context.report({
              node,
              messageId: 'noDateNow',
            })
          } else if (methodName === 'parse') {
            context.report({
              node,
              messageId: 'noDateParse',
            })
          }
        }
      },
    }
  },
}

export default rule
