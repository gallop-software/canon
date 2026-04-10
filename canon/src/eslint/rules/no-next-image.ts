import type { Rule } from 'eslint'
import { getCanonUrl, getCanonPattern } from '../utils/canon.js'

const RULE_NAME = 'no-next-image'
const pattern = getCanonPattern(RULE_NAME)

const NEXT_IMAGE_SOURCES = ['next/image', 'next/legacy/image']

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        pattern?.summary || 'Use custom Image component instead of next/image',
      recommended: true,
      url: getCanonUrl(RULE_NAME),
    },
    messages: {
      noNextImage: `[Canon ${pattern?.id || '028'}] Use the custom Image component instead of next/image. Import: import Image from "@/components/image"`,
    },
    schema: [],
  },

  create(context) {
    return {
      ImportDeclaration(node: any) {
        const source = node.source?.value
        if (
          typeof source === 'string' &&
          NEXT_IMAGE_SOURCES.includes(source)
        ) {
          context.report({
            node,
            messageId: 'noNextImage',
          })
        }
      },
      CallExpression(node: any) {
        if (
          node.callee?.name === 'require' &&
          node.arguments?.length === 1 &&
          node.arguments[0]?.type === 'Literal' &&
          typeof node.arguments[0].value === 'string' &&
          NEXT_IMAGE_SOURCES.includes(node.arguments[0].value)
        ) {
          context.report({
            node,
            messageId: 'noNextImage',
          })
        }
      },
    }
  },
}

export default rule
