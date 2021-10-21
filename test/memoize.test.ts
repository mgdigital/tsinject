import memoize from '../src/memoize'

describe('memoize', () => {
  it('should memoize a function', () => {
    let n = 0
    const fn = (): number => {
      n += 1
      return n
    }
    const memfn = memoize(fn)
    expect(memfn()).toEqual(1)
    expect(memfn()).toEqual(1)
    expect(n).toEqual(1)
    expect(fn()).toEqual(2)
    expect(memfn()).toEqual(1)
    expect(n).toEqual(2)
  })
})
