/*
 * @slynova/flydrive
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import * as fsExtra from 'fs-extra'
import { dirname, join } from 'path/posix'
import { pipeline } from 'stream/promises'
import { LocalDriverContract, LocalDriverConfig, WriteOptions } from '../Contracts'
import { MethodNotSupportedException } from '../Exceptions/MethodNotSupportedException'

export class LocalDriver implements LocalDriverContract {
  /**
   * Reference to the underlying adapter. Which is
   * fs-extra
   */
  public adapter = fsExtra

  /**
   * Name of the driver
   */
  public name: 'local' = 'local'

  constructor(private config: LocalDriverConfig) {}

  /**
   * Make absolute path to a given location
   */
  private makePath(location: string) {
    return join(this.config.root, location)
  }

  /**
   * Returns the mode for the file visibility
   */
  private getVisibilityMode(visibility: string) {
    return visibility === 'public' ? 0o644 : 0o600
  }

  private modeNumberToOctal(mode: number) {
    return '0' + (mode & parseInt('777', 8)).toString(8)
  }

  /**
   * Returns the file contents as a buffer. The buffer return
   * value allows you to self choose the encoding when
   * converting the buffer to a string.
   */
  public async get(location: string): Promise<Buffer> {
    return this.adapter.readFile(this.makePath(location))
  }

  /**
   * Returns the file contents as a stream
   */
  public async getStream(location: string): Promise<NodeJS.ReadableStream> {
    return this.adapter.createReadStream(this.makePath(location))
  }

  /**
   * A boolean to find if the location path exists or not
   */
  public exists(location: string): Promise<boolean> {
    return this.adapter.pathExists(this.makePath(location))
  }

  /**
   * Not supported
   */
  public getVisibility(): Promise<string> {
    throw MethodNotSupportedException.invoke('getVisibility', this.name)
  }

  /**
   * Returns the file stats
   */
  public async getStats(location: string): Promise<{ size: number; modified: Date }> {
    const stats = await this.adapter.stat(this.makePath(location))
    return {
      modified: stats.mtime,
      size: stats.size,
    }
  }

  /**
   * Not supported
   */
  public async getSignedUrl(): Promise<string> {
    throw MethodNotSupportedException.invoke('getSignedUrl', this.name)
  }

  /**
   * Not supported
   */
  public getUrl(): Promise<string> {
    throw MethodNotSupportedException.invoke('getSignedUrl', this.name)
  }

  /**
   * Write string|buffer contents to a destination. The missing
   * intermediate directories will be created (if required).
   */
  public async put(
    location: string,
    contents: Buffer | string,
    options?: WriteOptions
  ): Promise<void> {
    return this.adapter.outputFile(this.makePath(location), contents, {
      mode: this.getVisibilityMode(options?.visibility || 'private'),
    })
  }

  /**
   * Write a stream to a destination. The missing intermediate
   * directories will be created (if required).
   */
  public async putStream(location: string, contents: NodeJS.ReadableStream): Promise<void> {
    const absolutePath = this.makePath(location)

    const dir = dirname(absolutePath)
    this.adapter.ensureDir(dir)
    const writeStream = this.adapter.createWriteStream(absolutePath, {
      mode: this.getVisibilityMode(options?.visibility || 'private'),
    })
    await pipeline(contents, writeStream)
  }

  /**
   * Not supported
   */
  public setVisibility(): Promise<void> {
    throw MethodNotSupportedException.invoke('getSignedUrl', this.name)
  }

  /**
   * Remove a given location path
   */
  public delete(location: string): Promise<void> {
    return this.adapter.remove(this.makePath(location))
  }

  /**
   * Copy a given location path from the source to the desination.
   * The missing intermediate directories will be created (if required)
   */
  public copy(source: string, destination: string): Promise<void> {
    return this.adapter.copy(source, this.makePath(destination), { overwrite: true })
  }

  /**
   * Move a given location path from the source to the desination.
   * The missing intermediate directories will be created (if required)
   */
  public move(source: string, destination: string): Promise<void> {
    return this.adapter.move(source, this.makePath(destination), { overwrite: true })
  }
}
