import { Rule } from 'eslint'

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Prevent exporting component functions from block files - reusable components should be in the components folder',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      noComponentInBlocks:
        '[Canon 025] Exported component functions should not be defined in block files. Move this component to src/components/ and import it. Non-exported content components are allowed.',
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
    // Track named exports
    const namedExports = new Set<string>()

    return {
      // Track the default export
      ExportDefaultDeclaration(node) {
        if (node.declaration.type === 'FunctionDeclaration' && node.declaration.id) {
          defaultExportName = node.declaration.id.name
        } else if (node.declaration.type === 'Identifier') {
          defaultExportName = node.declaration.name
        }
      },

      // Track named exports: export function Foo() {} or export const Foo = () => {}
      ExportNamedDeclaration(node) {
        if (node.declaration) {
          if (node.declaration.type === 'FunctionDeclaration' && node.declaration.id) {
            namedExports.add(node.declaration.id.name)
          } else if (node.declaration.type === 'VariableDeclaration') {
            for (const declarator of node.declaration.declarations) {
              if (declarator.id.type === 'Identifier') {
                namedExports.add(declarator.id.name)
              }
            }
          }
        }
        // Handle: export { Foo, Bar }
        if (node.specifiers) {
          for (const specifier of node.specifiers) {
            if (specifier.exported.type === 'Identifier') {
              namedExports.add(specifier.exported.name)
            }
          }
        }
      },

      // Check for exported function declarations that look like components (PascalCase)
      'Program:exit'() {
        // Now check all named exports that are PascalCase
        // The actual flagging happens in the ExportNamedDeclaration handler
      },

      // Check for function declarations that look like components (PascalCase)
      FunctionDeclaration(node) {
        if (!node.id) return

        const name = node.id.name

        // Skip the default export (the block itself)
        if (name === defaultExportName) return

        // Only flag if it's exported (named export)
        // Non-exported content components are allowed
        if (!namedExports.has(name)) return

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

            // Only flag if it's exported (named export)
            // Non-exported content components are allowed
            if (!namedExports.has(name)) return

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
