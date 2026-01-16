import { ESLintUtils } from '@typescript-eslint/utils'
import { getCanonUrl, getCanonPattern } from '../utils/canon.js'

const RULE_NAME = 'no-arbitrary-colors'
const pattern = getCanonPattern(RULE_NAME)

const createRule = ESLintUtils.RuleCreator(() => getCanonUrl(RULE_NAME))

type MessageIds = 'noArbitraryColors'

// Patterns that indicate arbitrary color values in Tailwind classes
const COLOR_PREFIXES = [
  'bg',
  'text',
  'border',
  'ring',
  'outline',
  'shadow',
  'accent',
  'caret',
  'fill',
  'stroke',
  'decoration',
  'divide',
  'from',
  'via',
  'to',
]

// Regex to match arbitrary color values like bg-[#fff], text-[rgb(...)], border-[hsl(...)]
const ARBITRARY_COLOR_REGEX = new RegExp(
  `\\b(${COLOR_PREFIXES.join('|')})-\\[(?:#[0-9a-fA-F]{3,8}|rgb[a]?\\(|hsl[a]?\\(|color\\(|oklch\\(|oklab\\()`,
  'i'
)

// Also match var() references to non-color custom properties in color contexts
const ARBITRARY_VAR_COLOR_REGEX = new RegExp(
  `\\b(${COLOR_PREFIXES.join('|')})-\\[var\\(--(?!color-)`,
  'i'
)

export default createRule<[], MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description:
        pattern?.summary || 'Use defined color tokens, not arbitrary color values',
    },
    messages: {
      noArbitraryColors: `[Canon ${pattern?.id || '020'}] Avoid arbitrary color values. Use defined Tailwind color tokens (e.g., bg-accent, text-contrast) instead of hardcoded colors. See: ${pattern?.title || 'No Arbitrary Colors'} pattern.`,
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXAttribute(node) {
        // Only check className attributes
        if (
          node.name.type !== 'JSXIdentifier' ||
          node.name.name !== 'className'
        ) {
          return
        }

        // Get the className value
        let classValue = ''

        if (node.value?.type === 'Literal' && typeof node.value.value === 'string') {
          classValue = node.value.value
        } else if (
          node.value?.type === 'JSXExpressionContainer' &&
          node.value.expression.type === 'Literal' &&
          typeof node.value.expression.value === 'string'
        ) {
          classValue = node.value.expression.value
        } else if (
          node.value?.type === 'JSXExpressionContainer' &&
          node.value.expression.type === 'TemplateLiteral'
        ) {
          // Extract string parts from template literal
          classValue = node.value.expression.quasis
            .map((quasi) => quasi.value.raw)
            .join(' ')
        }

        if (!classValue) return

        // Check for arbitrary color values
        if (
          ARBITRARY_COLOR_REGEX.test(classValue) ||
          ARBITRARY_VAR_COLOR_REGEX.test(classValue)
        ) {
          context.report({
            node,
            messageId: 'noArbitraryColors',
          })
        }
      },
    }
  },
})
