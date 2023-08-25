import * as core from '@actions/core'

import { exec } from '@actions/exec'
import path from 'path'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const exportParam = core.getBooleanInput('export')
    const importParam = core.getBooleanInput('import')
    const from = core.getInput('from')
    const to = core.getInput('to')

    if (exportParam && importParam) {
      throw new Error('export and import options cannot be used together')
    }

    if (exportParam) {
      exec('1cedtcli.sh', [
        '-data',
        '/tmp/ws',
        '-command',
        'export',
        '--project',
        path.resolve(from),
        '--configuration-files',
        path.resolve(to)
      ])
    }

    if (importParam) {
      exec('1cedtcli', [
        '-data',
        '/tmp/ws',
        'export',
        '--import',
        'D:project-1',
        '--configuration-files',
        'D:XML-1'
      ])
    }

    // Set outputs for other workflow steps to use
    //core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run()
