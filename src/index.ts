import * as core from '@actions/core'

import { exec } from '@actions/exec'
import path from 'path'
import * as os from 'os'

const PLATFORM_WIN = 'win32'
const PLATFORM_LIN = 'linux'
const PLATFORM_MAC = 'darwin'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const isWindows = process.platform === PLATFORM_WIN

    const isExport = core.getBooleanInput('export')
    const isImport = core.getBooleanInput('import')
    const from = core.getInput('from')
    const to = core.getInput('to')
    const timeout = parseFloat(core.getInput('timeout') || '1') * 60
    const workspace = path.join(process.env.RUNNER_TEMP || os.tmpdir(), 'ws')
    const commandLine = isWindows ? '1cedtcli.bat' : '1cedtcli.sh'

    if (isExport && isImport) {
      throw new Error('export and import options cannot be used together')
    } else if (!isExport && !isImport) {
      throw new Error('set export or import option')
    }

    const command = isExport ? 'export' : 'import'
    const configurationFiles = isExport ? path.resolve(to) : path.resolve(from)
    const projectFiles = isExport ? path.resolve(from) : path.resolve(to)

    exec(commandLine, [
      '-data',
      workspace,
      '-timeout',
      timeout.toString(),
      '-command',
      command,
      '--configuration-files',
      configurationFiles,
      '--project',
      projectFiles
    ])

    // Set outputs for other workflow steps to use
    //core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run()
