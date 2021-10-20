/**
 * Memoize a function so that it is called only once, caching its result for future calls.
 *
 * @param fn - The function to be memoized.
 * @returns The memoized function.
 */
const memoize = <T>(fn: () => T): () => T => {
  let result: { value: T } | undefined
  return () => {
    if (result === undefined) {
      result = { value: fn() }
    }
    return result.value
  }
}

export default memoize
