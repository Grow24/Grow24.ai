import { spawn } from 'node:child_process'

const baseUrl = process.env.ROOT_APP_URL || 'http://localhost:5173'
const openDelayMs = Number(process.env.OPEN_TABS_DELAY_MS || '15000')

const appPaths = [
  '/',
  '/app_manager/',
  '/docs/',
  '/Google/',
  '/HBMP_AgentBot/',
  '/HBMP_DOCS_PLATFORM/',
  '/hbmp_form_manager/',
  '/HBMP_One/',
  '/ImageProcessing/',
  '/ivvychainv2/',
  '/mcp_server/',
  '/Microsoft/',
  '/OpenStreetMaps/',
  '/univer/',
]

function getOpenCommand() {
  if (process.platform === 'darwin') return { cmd: 'open', prefixArgs: [] }
  if (process.platform === 'win32') {
    return {
      cmd: 'cmd',
      prefixArgs: ['/c', 'start', ''],
    }
  }
  return { cmd: 'xdg-open', prefixArgs: [] }
}

function openUrl(url) {
  const { cmd, prefixArgs } = getOpenCommand()
  const child = spawn(cmd, [...prefixArgs, url], {
    detached: true,
    stdio: 'ignore',
  })
  child.unref()
}

console.log(`Waiting ${openDelayMs}ms before opening app tabs...`)

setTimeout(() => {
  for (const path of appPaths) {
    openUrl(`${baseUrl}${path}`)
  }
  console.log(`Opened ${appPaths.length} tabs from ${baseUrl}`)
}, openDelayMs)
