import type { Rule } from 'eslint'
import { getCanonUrl, getCanonPattern } from '../utils/canon.js'

const RULE_NAME = 'no-classnames-package'
const pattern = getCanonPattern(RULE_NAME)

const CLASSNAMES_SOURCES = ['classnames', 'classnames/bind', 'classnames/dedupe']

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: pattern?.summary || 'Use clsx instead of classnames',
      recommended: true,
      url: getCanonUrl(RULE_NAME),
    },
    messages: {
      noClassnames: `[Canon ${pattern?.id || '014'}] Use "clsx" instead of "classnames". Import: import { clsx } from "clsx"`,
    },
    schema: [],
  },

  create(context) {
    return {
      ImportDeclaration(node: any) {
        const source = node.source?.value
        if (typeof source === 'string' && CLASSNAMES_SOURCES.includes(source)) {
          context.report({
            node,
            messageId: 'noClassnames',
          })
        }
      },
      CallExpression(node: any) {
        // Check for require('classnames')
        if (
          node.callee?.name === 'require' &&
          node.arguments?.length === 1 &&
          node.arguments[0]?.type === 'Literal' &&
          typeof node.arguments[0].value === 'string' &&
          CLASSNAMES_SOURCES.includes(node.arguments[0].value)
        ) {
          context.report({
            node,
            messageId: 'noClassnames',
          })
        }
      },
    }
  },
}

export default rule
