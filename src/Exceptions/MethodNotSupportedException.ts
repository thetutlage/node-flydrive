/*
 * @slynova/flydrive
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '@poppinss/utils'

export class MethodNotSupportedException extends Exception {
  public static invoke(method: string, driver: string) {
    return new this(
      `Method "${method}" is not supported by the "${driver}" driver`,
      500,
      'E_METHOD_NOT_SUPPORTED'
    )
  }
}
