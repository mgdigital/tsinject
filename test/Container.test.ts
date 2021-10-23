import type { ContainerModule } from '../src'
import { ServiceNotFoundError, newContainerBuilder } from '../src'
import * as processEnvModule from '../examples/container/processEnvModule'

describe('Container', () => {
  it('should work', () => {
    const build: ContainerModule['build'] = builder => builder.define('foo', () => 'bar')
    const testModule = {
      key: Symbol('testModule'),
      build: jest.fn(build)
    }
    const container = newContainerBuilder()
      .use(processEnvModule.default)
      .use(testModule)
      .use(testModule)
      .decorate(
        processEnvModule.keys.processEnv,
        f => c => ({
          ...f(c),
          foo: 'bar'
        })
      )
      .define(
        'foo',
        () => 'bar'
      )
      .define(
        'foo',
        () => 'foo'
      )
      .createContainer()
    expect(container.keys).toEqual([
      processEnvModule.keys.processEnv,
      'foo'
    ])
    const env = container.get(processEnvModule.keys.processEnv)
    expect(env).toEqual({
      ...process.env,
      foo: 'bar'
    })
    expect(container.get(processEnvModule.keys.processEnv) === env).toEqual(true)
    expect(container.get('foo')).toEqual('foo')
    expect(container.has(processEnvModule.keys.processEnv)).toEqual(true)
    expect(container.has('foo')).toEqual(true)
    expect(container.has('oof')).toEqual(false)
    expect(() => container.get('oof')).toThrow(new ServiceNotFoundError('oof'))
    expect(testModule.build).toHaveBeenCalledTimes(1)
  })
})
