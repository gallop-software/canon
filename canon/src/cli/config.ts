import * as fs from 'fs'
import * as path from 'path'
import type { CanonTemplateConfig } from '../types/config.js'

const CONFIG_FILENAME = 'canon.config.json'

/**
 * Load canon.config.json from the current working directory.
 * Returns null if no config file is found.
 */
export function loadConfig(cwd?: string): CanonTemplateConfig | null {
  const dir = cwd || process.cwd()
  const configPath = path.join(dir, CONFIG_FILENAME)

  if (!fs.existsSync(configPath)) {
    return null
  }

  const raw = fs.readFileSync(configPath, 'utf-8')
  return JSON.parse(raw) as CanonTemplateConfig
}
