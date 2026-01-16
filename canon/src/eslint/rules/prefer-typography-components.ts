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
      useQuote: `[Canon ${pattern?.id || '003'}] Use the Quote component instead of <blockquote>. Import: import { Quote } from "@/components"`,
      useTypographyForDiv: `[Canon ${pattern?.id || '003'}] Use a typography component (Heading, Paragraph, Label, etc.) instead of <div> with text content.`,
    },
    schema: [],
  },

  create(context) {
    const filename = context.filename || context.getFilename()

    // Only apply to block files
    if (!filename.includes('/blocks/')) {
      return {}
    }

    const typographyComponents = ['Heading', 'Paragraph', 'Label', 'Span', 'Quote', 'Subheading', 'Accent']

    /**
     * Check if element is inside a typography component
     */
    function isInsideTypographyComponent(node: any): boolean {
      let parent = node.parent
      while (parent) {
        if (
          parent.type === 'JSXElement' &&
          parent.openingElement?.name?.name &&
          typographyComponents.includes(parent.openingElement.name.name)
        ) {
          return true
        }
        parent = parent.parent
      }
      return false
    }

    /**
     * Check if element has direct text content
     */
    function hasDirectTextContent(node: any): boolean {
      const jsxElement = node.parent
      if (jsxElement?.type !== 'JSXElement') return false

      const children = jsxElement.children || []
      return children.some((child: any) => {
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
    }

    /**
     * Check className for specific patterns
     */
    function getClassNameInfo(node: any): { isGradientText: boolean; isVisualElement: boolean; hasTextClasses: boolean } {
      let isGradientText = false
      let isVisualElement = false
      let hasTextClasses = false

      node.attributes?.forEach((attr: any) => {
        if (attr.type === 'JSXAttribute' && attr.name?.name === 'className') {
          const value = attr.value?.value || ''
          // Skip gradient text (bg-clip-text is used for gradient text effects)
          if (/\bbg-clip-text\b/.test(value)) {
            isGradientText = true
          }
          // Visual elements (dots, decorative elements with w-/h- but no text classes)
          if (/\b(w-\d|h-\d|rounded-full)\b/.test(value) && !/\btext-/.test(value)) {
            isVisualElement = true
          }
          // Has text-related classes
          if (/\b(text-|font-|leading-|tracking-)/.test(value)) {
            hasTextClasses = true
          }
        }
      })

      return { isGradientText, isVisualElement, hasTextClasses }
    }

    return {
      JSXOpeningElement(node: any) {
        const elementName = node.name?.name

        // Check <p> tags
        if (elementName === 'p') {
          context.report({
            node,
            messageId: 'useParagraph',
          })
          return
        }

        // Check <blockquote> tags
        if (elementName === 'blockquote') {
          context.report({
            node,
            messageId: 'useQuote',
          })
          return
        }

        // Check <span> tags
        if (elementName === 'span') {
          if (isInsideTypographyComponent(node)) {
            return
          }

          const { isGradientText, isVisualElement } = getClassNameInfo(node)

          if (isGradientText || isVisualElement) {
            return
          }

          if (hasDirectTextContent(node)) {
            context.report({
              node,
              messageId: 'useSpan',
            })
          }
          return
        }

        // Check <div> tags with text content and text styling
        if (elementName === 'div') {
          if (isInsideTypographyComponent(node)) {
            return
          }

          const { hasTextClasses } = getClassNameInfo(node)

          // Only flag divs that have both text content AND text-related classes
          // This indicates it's being used for typography rather than layout
          if (hasTextClasses && hasDirectTextContent(node)) {
            context.report({
              node,
              messageId: 'useTypographyForDiv',
            })
          }
        }
      },
    }
  },
}

export default rule
