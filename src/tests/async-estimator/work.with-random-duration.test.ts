import { test } from 'vitest'
import { useAsyncEstimator, IAsyncEstimatorOptions } from '@/async-estimator'

// helper that returns a random integer within an range
const randomIntegerWithinRange = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min

describe('AsyncEstimator: work: consuming a promise that executes with a variable duration within a rnadom range', async () => {
  // need to increase the default test timeout for this unit test to work
  const testTimeout = 20000

  // the duration of the async function being invoked might be within a random range within this group of tests
  const minPromiseDuration = 1250
  const maxPromiseDuration = 2500

  // A promise factory helper for the unit tests in here.
  // This returns a new promise that resolves after a random timeout value
  const createNewPromise = (): Promise<string> => {
    return new Promise<string>((resolve) => {
      const randomDuration = randomIntegerWithinRange(minPromiseDuration, maxPromiseDuration) // maxPromiseDuration will be the max possible length of execution
      setTimeout(() => {
        resolve(`myPromise results were returned in ${randomDuration}`)
      }, randomDuration)
    })
  }

  const targetId = 'my-test-promise'

  test(
    'should estimate as expected when initial estimate is above max possible duration',
    async () => {
      const logs: any[] = []

      const options: IAsyncEstimatorOptions = {
        targetId,
        initialEstimate: 5000, // initial guess, but will be adjusted by the estimator internal after the promise has competed with the actual execution time so next time will be more precise
        interval: 100,
        intervalHandler: async (current: number) => {
          logs.push({ current })
        }
      }

      const asyncEstimator = useAsyncEstimator(options)

      const estimatorResponse1 = await asyncEstimator.work(createNewPromise())
      console.info('1st promise response', estimatorResponse1)
      const estimatorResponse2 = await asyncEstimator.work(createNewPromise())
      console.info('2nd promise response', estimatorResponse2)

      //console.info('estimator final estimate', asyncEstimator.getCurrentEstimate())
      expect(asyncEstimator.getCurrentEstimate()).toBeGreaterThan(minPromiseDuration - 20) // padding a bit the boundary as it will never estimate perfectly at 100%
      expect(asyncEstimator.getCurrentEstimate()).toBeLessThan(maxPromiseDuration + 20) // padding a bit the boundary as it will never estimate perfectly at 100%

      //console.info('logs', logs)
    },
    testTimeout
  )

  test(
    'should estimate as expected when initial estimate is above min possible duration',
    async () => {
      const logs: any[] = []

      const options: IAsyncEstimatorOptions = {
        targetId,
        initialEstimate: 1000, // initial guess, but will be adjusted by the estimator internal after the promise has competed with the actual execution time so next time will be more precise
        interval: 100,
        intervalHandler: async (current: number) => {
          logs.push({ current })
        }
      }

      const asyncEstimator = useAsyncEstimator(options)

      const estimatorResponse1 = await asyncEstimator.work(createNewPromise())
      console.info('1st promise response', estimatorResponse1)
      const estimatorResponse2 = await asyncEstimator.work(createNewPromise())
      console.info('2nd promise response', estimatorResponse2)

      //console.info('estimator final estimate', asyncEstimator.getCurrentEstimate())
      expect(asyncEstimator.getCurrentEstimate()).toBeGreaterThan(minPromiseDuration - 20) // padding a bit the boundary as it will never estimate perfectly at 100%
      expect(asyncEstimator.getCurrentEstimate()).toBeLessThan(maxPromiseDuration + 20) // padding a bit the boundary as it will never estimate perfectly at 100%

      console.info('logs', logs)
    },
    testTimeout
  )
})
