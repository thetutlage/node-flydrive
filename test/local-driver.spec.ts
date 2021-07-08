/*
 * @slynova/flydrive
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import test from 'japa'
import { join } from 'path'
import { constants } from 'fs'
import { readFile, remove, stat } from 'fs-extra'
import { LocalDriver } from '../src/Drivers/Local'

const TEST_ROOT = join(__dirname, '__app')

/**
 * As mentioned here
 * https://www.martin-brennan.com/nodejs-file-permissions-fstat/
 */
function modeNumberToOctal(mode: number) {
  return '0' + (mode & parseInt('777', 8)).toString(8)
}

test.group('Local driver', (group) => {
  group.afterEach(async () => {
    await remove(TEST_ROOT)
  })

  test('write file to the destination', async (assert) => {
    const driver = new LocalDriver({ driver: 'local', root: TEST_ROOT })
    await driver.put('foo.txt', 'hello world')

    const contents = await readFile(join(TEST_ROOT, 'foo.txt'), 'utf-8')
    assert.equal(contents, 'hello world')
  })

  test('write file to the destination with private visibility', async (assert) => {
    const driver = new LocalDriver({ driver: 'local', root: TEST_ROOT })
    await driver.put('foo.txt', 'hello world')

    const stats = await stat(join(TEST_ROOT, 'foo.txt'))
    assert.equal(modeNumberToOctal(stats.mode), '0600')
  })

  test('write file to the destination with public visibility', async (assert) => {
    const driver = new LocalDriver({ driver: 'local', root: TEST_ROOT })
    await driver.put('foo.txt', 'hello world', { visibility: 'public' })

    const stats = await stat(join(TEST_ROOT, 'foo.txt'))
    assert.equal(modeNumberToOctal(stats.mode), '0644')
  })
})
