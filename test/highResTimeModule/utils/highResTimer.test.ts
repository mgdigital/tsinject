import { highResTimer } from '../../../src/modules/highResTimeModule/utils'

describe('highResTimer', () => {
  it('should time duration in high resolution', () => {
    const startTime = BigInt(Math.pow(11, 14)) // Some number roughly as large as the current microtime
    const duration = 1234
    const endTime = startTime + BigInt(duration)
    const getHighResTime = jest.fn()
      .mockReturnValueOnce(startTime)
      .mockReturnValueOnce(endTime)
    const startTimer = highResTimer(getHighResTime)
    const getDuration = startTimer()
    expect(getDuration()).toEqual(duration)
  })
})
