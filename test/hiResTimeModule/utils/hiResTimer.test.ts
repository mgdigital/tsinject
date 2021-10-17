import { hiResTimer } from '../../../src/modules/hiResTimeModule/utils'

describe('hiResTimer', () => {
  it('should time duration in high resolution', () => {
    const startTime = process.hrtime.bigint()
    const duration = 1234
    const endTime = startTime + BigInt(duration)
    const getHiResTime = jest.fn()
    getHiResTime.mockReturnValueOnce(startTime).mockReturnValueOnce(endTime)
    const timer = hiResTimer(getHiResTime)
    const getEndTime = timer()
    expect(getEndTime()).toEqual(duration)
  })
})
