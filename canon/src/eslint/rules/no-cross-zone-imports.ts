import { ESLintUtils } from '@typescript-eslint/utils'
import { getCanonUrl, getCanonPattern } from '../utils/canon.js'

const RULE_NAME = 'no-cross-zone-imports'
const pattern = getCanonPattern(RULE_NAME)

const createRule = ESLintUtils.RuleCreator(() => getCanonUrl(RULE_NAME))

type MessageIds = 'blocksImportBlocks' | 'componentsImportBlocks' | 'runtimeImportScripts'

/**
 * Determine which zone a file is in based on its path
 */
function getZone(filename: string): string | null {
  if (filename.includes('/blocks/') || filename.includes('\\blocks\\')) {
    return 'blocks'
  }
  if (filename.includes('/components/') || filename.includes('\\components\\')) {
    return 'components'
  }
  if (filename.includes('/app/') || filename.includes('\\app\\')) {
    return 'app'
  }
  if (filename.includes('/hooks/') || filename.includes('\\hooks\\')) {
    return 'hooks'
  }
  if (filename.includes('/utils/') || filename.includes('\\utils\\')) {
    return 'utils'
  }
  if (filename.includes('/tools/') || filename.includes('\\tools\\')) {
    return 'tools'
  }
  return null
}

/**
 * Check if an import path targets a specific zone
 */
function importsZone(importPath: string, zone: string): boolean {
  // Handle alias imports like @/blocks/... or @/components/...
  if (importPath.startsWith('@/')) {
    return importPath.startsWith(`@/${zone}/`)
  }
  // Handle relative imports
  return importPath.includes(`/${zone}/`) || importPath.includes(`\\${zone}\\`)
}

/**
 * Check if an import targets _scripts
 */
function importsScripts(importPath: string): boolean {
  return (
    importPath.includes('_scripts/') ||
    importPath.includes('_scripts\\') ||
    importPath.startsWith('@/_scripts/')
  )
}

export default createRule<[], MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description:
        pattern?.summary || 'Enforce import boundaries between Canon zones',
    },
    messages: {
      blocksImportBlocks: `[Canon ${pattern?.id || '021'}] Blocks cannot import from other blocks. Each block should be self-contained or import from components.`,
      componentsImportBlocks: `[Canon ${pattern?.id || '021'}] Components cannot import from blocks. Blocks compose components, not the other way around.`,
      runtimeImportScripts: `[Canon ${pattern?.id || '021'}] Runtime code cannot import from _scripts/. Scripts are for build-time only.`,
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const filename = context.filename || context.getFilename()
    const currentZone = getZone(filename)

    // Skip files not in a known zone
    if (!currentZone) {
      return {}
    }

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value as string

        // Rule 1: Blocks cannot import from other blocks
        if (currentZone === 'blocks' && importsZone(importPath, 'blocks')) {
          context.report({
            node,
            messageId: 'blocksImportBlocks',
          })
        }

        // Rule 2: Components cannot import from blocks
        if (currentZone === 'components' && importsZone(importPath, 'blocks')) {
          context.report({
            node,
            messageId: 'componentsImportBlocks',
          })
        }

        // Rule 3: No runtime code can import from _scripts
        if (importsScripts(importPath)) {
          context.report({
            node,
            messageId: 'runtimeImportScripts',
          })
        }
      },
    }
  },
})
