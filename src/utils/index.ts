/*
 * @slynova/flydrive
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { promisify } from 'util'
import { pipeline } from 'stream'

export const pipelinePromise = promisify(pipeline)

/**
 * As mentioned here
 * https://www.martin-brennan.com/nodejs-file-permissions-fstat/
 */
export function modeNumberToOctal(mode: number) {
  return '0' + (mode & parseInt('777', 8)).toString(8)
}
