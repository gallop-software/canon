import type { Rule } from 'eslint'
import { getCanonUrl, getCanonPattern } from '../utils/canon.js'

const RULE_NAME = 'background-image-rounded'
const pattern = getCanonPattern(RULE_NAME)

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: pattern?.summary || 'Background images must have rounded="rounded-none"',
      recommended: true,
      url: getCanonUrl(RULE_NAME),
    },
    messages: {
      requireRoundedNone: `[Canon ${pattern?.id || '019'}] Background Image components (with absolute inset-0) must have rounded="rounded-none" to prevent corner clipping.`,
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

        // Only check Image components
        if (elementName !== 'Image') {
          return
        }

        // Check if className contains 'absolute' and 'inset-0'
        const classNameAttr = node.attributes?.find(
          (attr: any) =>
            attr.type === 'JSXAttribute' &&
            attr.name?.name === 'className'
        )

        if (!classNameAttr) {
          return
        }

        const classValue = getClassNameValue(classNameAttr)
        if (!classValue) {
          return
        }

        // Check if this is a background image pattern
        if (!isBackgroundImage(classValue)) {
          return
        }

        // Check if rounded="rounded-none" is set
        const roundedAttr = node.attributes?.find(
          (attr: any) =>
            attr.type === 'JSXAttribute' &&
            attr.name?.name === 'rounded'
        )

        if (!roundedAttr) {
          context.report({
            node,
            messageId: 'requireRoundedNone',
          })
          return
        }

        // Check the value of rounded prop
        const roundedValue = getRoundedValue(roundedAttr)
        if (roundedValue !== 'rounded-none') {
          context.report({
            node,
            messageId: 'requireRoundedNone',
          })
        }
      },
    }
  },
}

/**
 * Extract className value from attribute
 */
function getClassNameValue(attr: any): string | null {
  // Handle string literal
  if (attr.value?.type === 'Literal' && typeof attr.value.value === 'string') {
    return attr.value.value
  }

  // Handle JSX expression container with template literal
  if (attr.value?.type === 'JSXExpressionContainer') {
    const expr = attr.value.expression

    if (expr.type === 'TemplateLiteral') {
      // Combine all quasis
      return expr.quasis?.map((q: any) => q.value?.raw || '').join(' ') || null
    }

    // Handle clsx or other function calls - extract string arguments
    if (expr.type === 'CallExpression') {
      const strings: string[] = []
      for (const arg of expr.arguments || []) {
        if (arg.type === 'Literal' && typeof arg.value === 'string') {
          strings.push(arg.value)
        }
        if (arg.type === 'TemplateLiteral') {
          strings.push(arg.quasis?.map((q: any) => q.value?.raw || '').join(' ') || '')
        }
      }
      return strings.join(' ')
    }
  }

  return null
}

/**
 * Check if className indicates a background image pattern
 */
function isBackgroundImage(classValue: string): boolean {
  const classes = classValue.split(/\s+/)
  const hasAbsolute = classes.includes('absolute')
  const hasInset0 = classes.includes('inset-0')
  
  return hasAbsolute && hasInset0
}

/**
 * Extract rounded prop value
 */
function getRoundedValue(attr: any): string | null {
  if (attr.value?.type === 'Literal' && typeof attr.value.value === 'string') {
    return attr.value.value
  }

  if (attr.value?.type === 'JSXExpressionContainer') {
    const expr = attr.value.expression
    if (expr.type === 'Literal' && typeof expr.value === 'string') {
      return expr.value
    }
  }

  return null
}

export default rule
