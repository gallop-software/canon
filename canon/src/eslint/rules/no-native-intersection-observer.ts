import { Rule } from 'eslint'

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce using react-intersection-observer package instead of native IntersectionObserver',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      usePackage:
        '[Canon 024] Use react-intersection-observer package instead of native IntersectionObserver. Install with: npm install react-intersection-observer',
    },
    schema: [],
  },
  create(context: Rule.RuleContext) {
    return {
      // Detect: new IntersectionObserver(...)
      NewExpression(node) {
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'IntersectionObserver'
        ) {
          context.report({
            node,
            messageId: 'usePackage',
          })
        }
      },
    }
  },
}

export default rule
