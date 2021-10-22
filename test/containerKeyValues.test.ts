import { containerKeyValues } from '../src'

describe('containerKeyValues', () => {
  it('should extract values from an object indexed by container keys', () => {
    const key1 = Symbol('key1')
    const key2 = 'key2'
    const obj = {
      [key1]: 'foo',
      [key2]: 'bar'
    }
    expect(containerKeyValues(obj)).toEqual(['foo', 'bar'])
  })
})
