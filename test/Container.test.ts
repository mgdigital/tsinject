import { ServiceNotFoundError, newContainerBuilder } from '../src'
import * as highResTimer from '../examples/highResTimer'
import * as processEnv from '../examples/processEnv'

describe('Container', () => {
  it('should work', () => {
    const container = newContainerBuilder()
      .use(processEnv.processEnvModule)
      .decorate(
        processEnv.keys.processEnv,
        f => c => ({
          ...f(c),
          foo: 'bar'
        })
      )
      .define(
        'foo',
        () => 'bar'
      )
      .use(highResTimer.highResTimerModule)
      .createContainer()
    expect(container.keys).toEqual([
      processEnv.keys.processEnv,
      highResTimer.keys.getHighResTime,
      highResTimer.keys.highResTimer,
      'foo'
    ])
    const env = container.get(processEnv.keys.processEnv)
    expect(env).toEqual({
      ...process.env,
      foo: 'bar'
    })
    expect(container.get(processEnv.keys.processEnv) === env).toEqual(true)
    expect(process.hrtime.bigint()).toBeLessThan(container.get(highResTimer.keys.getHighResTime)())
    expect(typeof container.get(highResTimer.keys.highResTimer)).toEqual('function')
    expect(container.get('foo')).toEqual('bar')
    expect(container.has(processEnv.keys.processEnv)).toEqual(true)
    expect(container.has('foo')).toEqual(true)
    expect(container.has('oof')).toEqual(false)
    expect(() => container.get('oof')).toThrow(new ServiceNotFoundError('oof'))
  })
})
