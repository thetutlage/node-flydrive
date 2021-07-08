/*
 * @slynova/flydrive
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import * as fsExtra from 'fs-extra'

/**
 * Options for writing, moving and copying
 * files
 */
export type WriteOptions = {
  visibility?: string
}

/**
 * Shape of the generic driver
 */
export interface DriverContract {
  /**
   * Name of the driver
   */
  name: string

  /**
   * A boolean to find if the location path exists or not
   */
  exists(location: string): Promise<boolean>

  /**
   * Returns the file contents as a buffer. The buffer return
   * value allows you to self choose the encoding when
   * converting the buffer to a string.
   */
  get(location: string): Promise<Buffer>

  /**
   * Returns the file contents as a stream
   */
  getStream(location: string): Promise<NodeJS.ReadableStream>

  /**
   * Returns the location path visibility status
   */
  getVisibility(location: string): Promise<string>

  /**
   * Returns the location path stats
   */
  getStats(location: string): Promise<{ size: number; modified: Date }>

  /**
   * Returns a signed URL for a given location path
   */
  getSignedUrl(location: string): Promise<string>

  /**
   * Returns a URL for a given location path
   */
  getUrl(location: string): Promise<string>

  /**
   * Write string|buffer contents to a destination. The missing
   * intermediate directories will be created (if required).
   */
  put(location: string, contents: Buffer | string, options?: WriteOptions): Promise<void>

  /**
   * Write a stream to a destination. The missing intermediate
   * directories will be created (if required).
   */
  putStream(
    location: string,
    contents: NodeJS.ReadableStream,
    options?: WriteOptions
  ): Promise<void>

  /**
   * Update the visibility of the file
   */
  setVisibility(location: string, visibility: string): Promise<void>

  /**
   * Remove a given location path
   */
  delete(location: string): Promise<void>

  /**
   * Copy a given location path from the source to the desination.
   * The missing intermediate directories will be created (if required)
   */
  copy(source: string, destination: string, options?: WriteOptions): Promise<void>

  /**
   * Move a given location path from the source to the desination.
   * The missing intermediate directories will be created (if required)
   */
  move(source: string, destination: string, options?: WriteOptions): Promise<void>
}

/**
 * Config accepted by the local disk driver
 */
export type LocalDriverConfig = {
  driver: 'local'
  root: string
}

/**
 * Shape of the local disk driver
 */
export interface LocalDriverContract extends DriverContract {
  name: 'local'
  adapter: typeof fsExtra
}
