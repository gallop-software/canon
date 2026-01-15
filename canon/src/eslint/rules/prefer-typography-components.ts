import type { Rule } from 'eslint'
import { getCanonUrl, getCanonPattern } from '../utils/canon.js'

const RULE_NAME = 'prefer-typography-components'
const pattern = getCanonPattern(RULE_NAME)

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: pattern?.summary || 'Use Paragraph/Span, not raw tags',
      recommended: true,
      url: getCanonUrl(RULE_NAME),
    },
    messages: {
      useParagraph: `[Canon ${pattern?.id || '003'}] Use the Paragraph component instead of <p>. Import: import { Paragraph } from "@/components"`,
      useSpan: `[Canon ${pattern?.id || '003'}] Use the Span component instead of <span> for text content. Import: import { Span } from "@/components"`,
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

        if (elementName === 'p') {
          context.report({
            node,
            messageId: 'useParagraph',
          })
        }

        if (elementName === 'span') {
          // Skip spans that are inside typography components (Heading, Paragraph, Label, etc.)
          // These are used for inline styling effects like gradient text, emphasis, etc.
          const typographyComponents = ['Heading', 'Paragraph', 'Label', 'Span', 'Quote', 'Subheading', 'Accent']
          
          let parent = node.parent
          while (parent) {
            if (
              parent.type === 'JSXElement' &&
              parent.openingElement?.name?.name &&
              typographyComponents.includes(parent.openingElement.name.name)
            ) {
              // Span is inside a typography component, skip warning
              return
            }
            parent = parent.parent
          }

          // Check className for gradient text (skip these)
          let isGradientText = false
          let isVisualElement = false

          node.attributes?.forEach((attr: any) => {
            if (attr.type === 'JSXAttribute' && attr.name?.name === 'className') {
              const value = attr.value?.value || ''
              // Skip gradient text spans (bg-clip-text is used for gradient text effects)
              if (/\bbg-clip-text\b/.test(value)) {
                isGradientText = true
              }
              // Skip visual elements (dots, decorative elements with w-/h- but no text)
              if (/\b(w-\d|h-\d|rounded-full)\b/.test(value) && !/\btext-/.test(value)) {
                isVisualElement = true
              }
            }
          })

          if (isGradientText) {
            return
          }

          // Check if span contains text content
          const jsxElement = node.parent
          if (jsxElement?.type === 'JSXElement') {
            const children = jsxElement.children || []
            const hasTextContent = children.some((child: any) => {
              // Check for direct text content
              if (child.type === 'JSXText') {
                return child.value.trim().length > 0
              }
              // Check for expression with literal string
              if (child.type === 'JSXExpressionContainer' && child.expression?.type === 'Literal') {
                return typeof child.expression.value === 'string' && child.expression.value.trim().length > 0
              }
              return false
            })

            // Warn if span has text content and is not a visual element
            if (hasTextContent && !isVisualElement) {
              context.report({
                node,
                messageId: 'useSpan',
              })
            }
          }
        }
      },
    }
  },
}

export default rule
