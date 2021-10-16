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
