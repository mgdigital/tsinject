import { ContainerBuilder, DefinitionNotFoundError } from '../src'
import * as processEnvModule from '../src/modules/processEnvModule'

describe('Container', () => {
  it('should work', () => {
    const container = ContainerBuilder.create()
      .use(processEnvModule.default)
      .decorate(
        processEnvModule.processEnv,
        f => c => ({
          ...f(c),
          foo: 'bar'
        })
      )
      .define(
        'foo',
        () => 'bar'
      )
      .createContainer()
    expect(container.keys).toEqual([processEnvModule.processEnv, 'foo'])
    const env = container.get(processEnvModule.processEnv)
    expect(env).toEqual({
      ...process.env,
      foo: 'bar'
    })
    expect(container.get(processEnvModule.processEnv) === env).toEqual(true)
    expect(container.get('foo')).toEqual('bar')
    expect(() => container.get('oof')).toThrow(new DefinitionNotFoundError('oof'))
  })
})
