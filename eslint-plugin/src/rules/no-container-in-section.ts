import { ESLintUtils, TSESTree } from '@typescript-eslint/utils'
import { getCanonUrl, getCanonPattern } from '../utils/canon'

const RULE_NAME = 'no-container-in-section'
const pattern = getCanonPattern(RULE_NAME)

const createRule = ESLintUtils.RuleCreator(() => getCanonUrl(RULE_NAME))

type MessageIds = 'noContainerInSection'

export default createRule<[], MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: pattern?.summary || 'No Container inside Section',
    },
    messages: {
      noContainerInSection: `[Canon ${pattern?.id || '002'}] Container inside Section is redundant. Section already provides max-width containment. Use Section's innerAlign prop or a plain div instead.`,
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    // Track if we're inside a Section component
    let sectionDepth = 0

    function isJSXElementNamed(
      node: TSESTree.JSXOpeningElement,
      name: string
    ): boolean {
      return (
        node.name.type === 'JSXIdentifier' &&
        node.name.name === name
      )
    }

    return {
      JSXOpeningElement(node) {
        // Check if entering a Section
        if (isJSXElementNamed(node, 'Section')) {
          sectionDepth++
        }

        // Check if we're inside a Section and found a Container
        if (sectionDepth > 0 && isJSXElementNamed(node, 'Container')) {
          context.report({
            node,
            messageId: 'noContainerInSection',
          })
        }
      },

      JSXClosingElement(node) {
        // Check if leaving a Section
        if (
          node.name.type === 'JSXIdentifier' &&
          node.name.name === 'Section'
        ) {
          sectionDepth--
        }
      },
    }
  },
})
