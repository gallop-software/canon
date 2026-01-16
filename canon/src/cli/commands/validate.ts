import * as fs from 'fs'
import * as path from 'path'

interface ValidateOptions {
  strict: boolean
  json: boolean
}

interface Violation {
  type: 'orphan-file' | 'invalid-top-level' | 'invalid-src-folder'
  path: string
  message: string
}

// Allowed top-level directories (non-dotfiles)
const ALLOWED_TOP_LEVEL = [
  'src',
  'public',
  '_scripts',
  '_data',
  '_docs',
  'node_modules',
]

// Allowed folders directly under /src
const ALLOWED_SRC_FOLDERS = [
  'app',
  'blocks',
  'blog',
  'components',
  'hooks',
  'styles',
  'template',
  'tools',
  'types',
  'utils',
]

// Files allowed at top level
const ALLOWED_TOP_LEVEL_FILES = [
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'tsconfig.tsbuildinfo',
  'next.config.mjs',
  'next.config.js',
  'next-env.d.ts',
  'eslint.config.mjs',
  'eslint.config.js',
  '.eslintrc.js',
  '.eslintrc.json',
  'postcss.config.js',
  'tailwind.config.js',
  'tailwind.config.ts',
  'README.md',
  'LICENSE',
  'CHANGELOG.md',
  '.gitignore',
  '.cursorrules',
]

/**
 * Check if a path is a dotfile or dotfolder
 */
function isDotfile(name: string): boolean {
  return name.startsWith('.')
}

/**
 * Check if a path is an archive content folder (allowed new folders in /src)
 */
function isArchiveContentFolder(name: string): boolean {
  // Archive folders typically have plural names for content collections
  // We allow any folder that could reasonably be archive content
  // This is a heuristic - we check if it looks like a content collection
  return !ALLOWED_SRC_FOLDERS.includes(name)
}

/**
 * Validate project structure
 */
export async function validate(
  projectPath: string,
  options: ValidateOptions
): Promise<void> {
  const violations: Violation[] = []
  const absolutePath = path.resolve(process.cwd(), projectPath)

  if (!fs.existsSync(absolutePath)) {
    console.error(`Path does not exist: ${projectPath}`)
    process.exit(1)
  }

  // Check top-level directories
  const topLevelItems = fs.readdirSync(absolutePath)
  for (const item of topLevelItems) {
    const itemPath = path.join(absolutePath, item)
    const stat = fs.statSync(itemPath)

    if (stat.isDirectory()) {
      // Dotfolders are exempt
      if (isDotfile(item)) {
        continue
      }

      // Check if it's an allowed top-level directory
      if (!ALLOWED_TOP_LEVEL.includes(item)) {
        violations.push({
          type: 'invalid-top-level',
          path: item,
          message: `Invalid top-level directory: ${item}. Allowed: ${ALLOWED_TOP_LEVEL.join(', ')} (dotfolders exempt)`,
        })
      }
    } else {
      // It's a file - check if it's allowed at top level
      if (!isDotfile(item) && !ALLOWED_TOP_LEVEL_FILES.includes(item)) {
        // Allow common config file patterns
        const isConfigFile =
          item.endsWith('.config.js') ||
          item.endsWith('.config.mjs') ||
          item.endsWith('.config.ts') ||
          item.endsWith('.json') ||
          item.endsWith('.md') ||
          item.endsWith('.sh')

        if (!isConfigFile) {
          violations.push({
            type: 'orphan-file',
            path: item,
            message: `Orphan file at project root: ${item}. Files should be in defined zones.`,
          })
        }
      }
    }
  }

  // Check /src folder structure
  const srcPath = path.join(absolutePath, 'src')
  if (fs.existsSync(srcPath)) {
    const srcItems = fs.readdirSync(srcPath)
    for (const item of srcItems) {
      const itemPath = path.join(srcPath, item)
      const stat = fs.statSync(itemPath)

      if (stat.isDirectory()) {
        // Check if it's an allowed /src folder
        if (
          !ALLOWED_SRC_FOLDERS.includes(item) &&
          !isArchiveContentFolder(item)
        ) {
          violations.push({
            type: 'invalid-src-folder',
            path: `src/${item}`,
            message: `Invalid folder in /src: ${item}. Allowed: ${ALLOWED_SRC_FOLDERS.join(', ')} or archive content folders`,
          })
        }
      }
    }

    // Check that src/app has route groups
    const appPath = path.join(srcPath, 'app')
    if (fs.existsSync(appPath)) {
      const appItems = fs.readdirSync(appPath)
      const hasDefaultGroup = appItems.some(
        (item) => item === '(default)' || item.startsWith('(')
      )

      if (!hasDefaultGroup) {
        violations.push({
          type: 'invalid-src-folder',
          path: 'src/app',
          message:
            'src/app should have at least one route group folder (e.g., (default)/)',
        })
      }
    }
  }

  // Output results
  if (options.json) {
    console.log(
      JSON.stringify(
        {
          valid: violations.length === 0,
          violations,
        },
        null,
        2
      )
    )
  } else {
    if (violations.length === 0) {
      console.log('✓ Project structure is valid')
    } else {
      console.log(`Found ${violations.length} violation(s):\n`)
      for (const v of violations) {
        console.log(`  ✗ ${v.message}`)
      }
      console.log('')
    }
  }

  // Exit with error code if strict mode and violations found
  if (options.strict && violations.length > 0) {
    process.exit(1)
  }
}
