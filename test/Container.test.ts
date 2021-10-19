import { ServiceNotFoundError, newContainerBuilder } from '../src'
import * as highResTimeModule from '../examples/modules/highResTimeModule'
import * as processEnvModule from '../examples/modules/processEnvModule'

describe('Container', () => {
  it('should work', () => {
    const container = newContainerBuilder()
      .use(processEnvModule.default)
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
      .use(highResTimeModule.default)
      .createContainer()
    expect(container.keys).toEqual([
      processEnvModule.keys.processEnv,
      highResTimeModule.keys.getHighResTime,
      highResTimeModule.keys.highResTimer,
      'foo'
    ])
    const env = container.get(processEnvModule.keys.processEnv)
    expect(env).toEqual({
      ...process.env,
      foo: 'bar'
    })
    expect(container.get(processEnvModule.keys.processEnv) === env).toEqual(true)
    expect(process.hrtime.bigint()).toBeLessThan(container.get(highResTimeModule.keys.getHighResTime)())
    expect(typeof container.get(highResTimeModule.keys.highResTimer)).toEqual('function')
    expect(container.get('foo')).toEqual('bar')
    expect(container.has(processEnvModule.keys.processEnv)).toEqual(true)
    expect(container.has('foo')).toEqual(true)
    expect(container.has('oof')).toEqual(false)
    expect(() => container.get('oof')).toThrow(new ServiceNotFoundError('oof'))
  })
})
