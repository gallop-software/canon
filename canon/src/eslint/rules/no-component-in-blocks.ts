import { Rule } from 'eslint'

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Prevent defining component functions inside block files - components should be in the components folder',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      noComponentInBlocks:
        '[Canon 025] Component functions should not be defined in block files. Move this component to src/components/ and import it.',
    },
    schema: [],
  },
  create(context: Rule.RuleContext) {
    const filename = context.filename || context.getFilename()

    // Only check block files
    const isBlock = filename.includes('/blocks/') || filename.includes('\\blocks\\')
    if (!isBlock) {
      return {}
    }

    // Track the default export name to allow it
    let defaultExportName: string | null = null

    return {
      // Track the default export
      ExportDefaultDeclaration(node) {
        if (node.declaration.type === 'FunctionDeclaration' && node.declaration.id) {
          defaultExportName = node.declaration.id.name
        } else if (node.declaration.type === 'Identifier') {
          defaultExportName = node.declaration.name
        }
      },

      // Check for function declarations that look like components (PascalCase)
      FunctionDeclaration(node) {
        if (!node.id) return

        const name = node.id.name

        // Skip the default export (the block itself)
        if (name === defaultExportName) return

        // Check if it's PascalCase (likely a component)
        if (/^[A-Z]/.test(name)) {
          context.report({
            node,
            messageId: 'noComponentInBlocks',
          })
        }
      },

      // Check for arrow function components: const MyComponent = () => {}
      VariableDeclaration(node) {
        for (const declarator of node.declarations) {
          if (
            declarator.id.type === 'Identifier' &&
            declarator.init &&
            (declarator.init.type === 'ArrowFunctionExpression' ||
              declarator.init.type === 'FunctionExpression')
          ) {
            const name = declarator.id.name

            // Skip the default export
            if (name === defaultExportName) return

            // Check if it's PascalCase (likely a component)
            if (/^[A-Z]/.test(name)) {
              context.report({
                node: declarator,
                messageId: 'noComponentInBlocks',
              })
            }
          }
        }
      },
    }
  },
}

export default rule
