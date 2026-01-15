import type { Rule } from 'eslint'
import { getCanonUrl, getCanonPattern } from '../utils/canon.js'

const RULE_NAME = 'prefer-layout-components'
const pattern = getCanonPattern(RULE_NAME)

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: pattern?.summary || 'Use Grid/Columns, not raw div with grid',
      recommended: true,
      url: getCanonUrl(RULE_NAME),
    },
    messages: {
      useLayoutComponent: `[Canon ${pattern?.id || '018'}] Use the Grid or Columns component instead of <div className="grid ...">. Import: import { Grid, Columns, Column } from "@/components"`,
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

        // Only check div elements
        if (elementName !== 'div') {
          return
        }

        // Check if className contains 'grid'
        const classNameAttr = node.attributes?.find(
          (attr: any) =>
            attr.type === 'JSXAttribute' &&
            attr.name?.name === 'className'
        )

        if (!classNameAttr) {
          return
        }

        // Handle string literal className
        if (classNameAttr.value?.type === 'Literal') {
          const classValue = classNameAttr.value.value
          if (typeof classValue === 'string' && hasGridClass(classValue)) {
            context.report({
              node,
              messageId: 'useLayoutComponent',
            })
          }
          return
        }

        // Handle template literal className
        if (classNameAttr.value?.type === 'JSXExpressionContainer') {
          const expr = classNameAttr.value.expression

          // Direct template literal: className={`grid ...`}
          if (expr.type === 'TemplateLiteral') {
            const quasis = expr.quasis || []
            for (const quasi of quasis) {
              if (quasi.value?.raw && hasGridClass(quasi.value.raw)) {
                context.report({
                  node,
                  messageId: 'useLayoutComponent',
                })
                return
              }
            }
          }

          // clsx call: className={clsx('grid', ...)}
          if (expr.type === 'CallExpression') {
            const args = expr.arguments || []
            for (const arg of args) {
              if (arg.type === 'Literal' && typeof arg.value === 'string') {
                if (hasGridClass(arg.value)) {
                  context.report({
                    node,
                    messageId: 'useLayoutComponent',
                  })
                  return
                }
              }
              // Check template literals in clsx args
              if (arg.type === 'TemplateLiteral') {
                const quasis = arg.quasis || []
                for (const quasi of quasis) {
                  if (quasi.value?.raw && hasGridClass(quasi.value.raw)) {
                    context.report({
                      node,
                      messageId: 'useLayoutComponent',
                    })
                    return
                  }
                }
              }
            }
          }
        }
      },
    }
  },
}

/**
 * Check if a className string contains grid classes
 * Matches: 'grid', 'grid-cols-', etc.
 * Does NOT match: 'grid-area', component names with 'grid' in them
 */
function hasGridClass(classString: string): boolean {
  // Split by whitespace and check each class
  const classes = classString.split(/\s+/)
  
  for (const cls of classes) {
    // Match standalone 'grid' or 'grid-cols-*' patterns
    if (cls === 'grid' || cls.startsWith('grid-cols-')) {
      return true
    }
  }
  
  return false
}

export default rule
