import { ESLintUtils, TSESTree } from '@typescript-eslint/utils'
import { getCanonUrl, getCanonPattern } from '../utils/canon'

const RULE_NAME = 'prefer-component-props'
const pattern = getCanonPattern(RULE_NAME)

const createRule = ESLintUtils.RuleCreator(() => getCanonUrl(RULE_NAME))

type MessageIds = 'preferComponentProps'

// Map of component names to their style props and corresponding Tailwind patterns
const componentPropMappings: Record<string, Record<string, RegExp>> = {
  Paragraph: {
    margin: /^m([by])?-/, // m- (all), mb- (bottom), my- (y-axis) - all affect bottom margin
    color: /^text-(body|contrast|accent|white|black)/,
    fontSize: /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/,
    lineHeight: /^leading-/,
    textAlign: /^text-(left|center|right|justify)$/,
    fontWeight: /^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/,
  },
  Heading: {
    margin: /^m([by])?-/, // m- (all), mb- (bottom), my- (y-axis) - all affect bottom margin
    color: /^text-(body|contrast|accent|white|black)/,
    fontSize: /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/,
    lineHeight: /^leading-/,
    textAlign: /^text-(left|center|right|justify)$/,
    fontWeight: /^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/,
  },
  Accent: {
    margin: /^m([by])?-/, // m- (all), mb- (bottom), my- (y-axis) - all affect bottom margin
    color: /^text-(body|contrast|accent|white|black)/,
    size: /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/,
    textAlign: /^text-(left|center|right|justify)$/,
  },
  Button: {
    margin: /^m([by])?-/, // m- (all), mb- (bottom), my- (y-axis) - all affect bottom margin
  },
  Label: {
    margin: /^m([by])?-/, // m- (all), mb- (bottom), my- (y-axis) - all affect bottom margin
    color: /^text-(body|contrast|accent|white|black)/,
  },
}

export default createRule<[], MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: pattern?.summary || 'Use props over className for supported styles',
    },
    messages: {
      preferComponentProps: `[Canon ${pattern?.id || '004'}] "{{className}}" in className should use the "{{propName}}" prop instead. Replace className="{{className}}" with {{propName}}="{{className}}".`,
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXOpeningElement(node) {
        // Get the component name
        if (node.name.type !== 'JSXIdentifier') return
        const componentName = node.name.name

        // Check if this component has prop mappings
        const propMappings = componentPropMappings[componentName]
        if (!propMappings) return

        // Find the className attribute
        const classNameAttr = node.attributes.find(
          (attr): attr is TSESTree.JSXAttribute =>
            attr.type === 'JSXAttribute' &&
            attr.name.type === 'JSXIdentifier' &&
            attr.name.name === 'className'
        )

        if (!classNameAttr || !classNameAttr.value) return

        // Extract class string value
        let classValue: string | null = null

        if (classNameAttr.value.type === 'Literal') {
          classValue = String(classNameAttr.value.value)
        } else if (
          classNameAttr.value.type === 'JSXExpressionContainer' &&
          classNameAttr.value.expression.type === 'Literal'
        ) {
          classValue = String(classNameAttr.value.expression.value)
        }

        if (!classValue) return

        // Split into individual classes and check each
        const classes = classValue.split(/\s+/).filter(Boolean)

        for (const cls of classes) {
          for (const [propName, pattern] of Object.entries(propMappings)) {
            if (pattern.test(cls)) {
              context.report({
                node: classNameAttr,
                messageId: 'preferComponentProps',
                data: {
                  className: cls,
                  propName,
                },
              })
              break // Only report once per class
            }
          }
        }
      },
    }
  },
})
