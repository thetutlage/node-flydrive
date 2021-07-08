import { DriverContract } from './src/Contracts'

interface FooContract extends DriverContract {
  read(path: string, options: { mtime: string }): Promise<string>
}

class Foo implements FooContract {
  public async read(path: string, options: { mtime: string }): Promise<string> {
    return 'hello'
  }
}

new Foo()
