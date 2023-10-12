import { readFileSync, writeFileSync } from 'fs'
import path from 'path'

type Hook = (args: { projectName: string; directoryPath: string }) => void

// <templateName, Hook[]>
export const ON_CREATE_HOOKS = new Map<string, Hook[]>()

export const addOnCreateHook = (templateName: string, hook: Hook) => {
  const hooks = ON_CREATE_HOOKS.get(templateName) || []
  hooks.push(hook)
  ON_CREATE_HOOKS.set(templateName, hooks)
}

const REPLACE_PROJECT_NAME_KEY = '[DYNAMIC_PROJECT_NAME]'

const rewriteWranglerHook: Hook = ({ projectName, directoryPath }) => {
  const wranglerPath = path.join(directoryPath, 'wrangler.toml')
  const wrangler = readFileSync(wranglerPath, 'utf-8')
  const rewritten = wrangler.replace(REPLACE_PROJECT_NAME_KEY, projectName)
  writeFileSync(wranglerPath, rewritten)
}

addOnCreateHook('cloudflare-workers', rewriteWranglerHook)