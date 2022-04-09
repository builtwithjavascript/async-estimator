import { test } from 'vitest'
import { useAsyncEstimator, IAsyncEstimatorOptions } from '@/async-estimator'

describe('AsyncEstimator: work: consuming a promise that executes always with the same duration', async () => {
  // need to increase the default test timeout for this unit test to work
  const testTimeout = 20000

  // the duration of the async function being invoked
  // the duration of the async function being invoked will always be the same within this group of tests
  const promiseDuration = 3125

  // A promise factory helper for the unit tests in here.
  // This returns a new promise that always resolves after a fixed duration (timeout)
  const createNewPromise = (): Promise<string> => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(`myPromise results were returned in ${promiseDuration}`)
      }, promiseDuration)
    })
  }

  const targetId = 'my-test-promise'

  test(
    'should estimate as expected when initial estimate is above the promise duration',
    async () => {
      const logs: any[] = []

      const options: IAsyncEstimatorOptions = {
        targetId,
        initialEstimate: 5000, // initial guess, but will be adjusted by the estimator internal after the promise has competed with the actual execution time so next time will be more precise
        interval: 100,
        intervalHandler: async (current: number) => {
          logs.push({ current, info: asyncEstimator.getCurrentEstimate() })
        }
      }

      const asyncEstimator = useAsyncEstimator(options)

      const estimatorResponse1 = await asyncEstimator.work(createNewPromise())
      console.info('1st promise response', estimatorResponse1)
      const estimatorResponse2 = await asyncEstimator.work(createNewPromise())
      console.info('2nd promise response', estimatorResponse2)

      //console.info('estimator final estimate', asyncEstimator.getCurrentEstimate())
      expect(asyncEstimator.getCurrentEstimate()).toBeGreaterThan(promiseDuration - 15) // padding a bit the boundary as it will never estimate perfectly at 100%
      expect(asyncEstimator.getCurrentEstimate()).toBeLessThan(promiseDuration + 15) // padding a bit the boundary as it will never estimate perfectly at 100%

      //console.info('logs', logs)
    },
    testTimeout
  )

  test(
    'should estimate as expected when initial estimate is below the promise duration',
    async () => {
      const logs: any[] = []

      const options: IAsyncEstimatorOptions = {
        targetId,
        initialEstimate: 2000, // initial guess, but will be adjusted by the estimator internal after the promise has competed with the actual execution time so next time will be more precise
        interval: 100,
        intervalHandler: async (current: number) => {
          logs.push({ current, info: asyncEstimator.getCurrentEstimate() })
        }
      }

      const asyncEstimator = useAsyncEstimator(options)

      const estimatorResponse1 = await asyncEstimator.work(createNewPromise())
      console.info('1st promise response', estimatorResponse1)
      const estimatorResponse2 = await asyncEstimator.work(createNewPromise())
      console.info('2nd promise response', estimatorResponse2)

      //console.info('estimator final estimate', asyncEstimator.getCurrentEstimate())
      expect(asyncEstimator.getCurrentEstimate()).toBeGreaterThan(promiseDuration - 15) // padding a bit the boundary as it will never estimate perfectly at 100%
      expect(asyncEstimator.getCurrentEstimate()).toBeLessThan(promiseDuration + 15) // padding a bit the boundary as it will never estimate perfectly at 100%

      //console.info('logs', logs)
    },
    testTimeout
  )

  test(
    'should estimate as expected when initial estimate is exactly like the promise duration',
    async () => {
      // a promise factory to help with this unit test
      // this returns a new promise that always resolves after a fixed timeout value
      const createNewPromise = (): Promise<string> => {
        return new Promise<string>((resolve) => {
          const timeout = 3125
          setTimeout(() => {
            resolve(`myPromise results were returned in ${timeout}`)
          }, timeout)
        })
      }

      const logs: any[] = []

      const options: IAsyncEstimatorOptions = {
        targetId,
        initialEstimate: 3125, // initial guess, but will be adjusted by the estimator internal after the promise has competed with the actual execution time so next time will be more precise
        interval: 100,
        intervalHandler: async (current: number) => {
          logs.push({ current, info: asyncEstimator.getCurrentEstimate() })
        }
      }

      const asyncEstimator = useAsyncEstimator(options)

      const estimatorResponse1 = await asyncEstimator.work(createNewPromise())
      console.info('1st promise response', estimatorResponse1)
      const estimatorResponse2 = await asyncEstimator.work(createNewPromise())
      console.info('2nd promise response', estimatorResponse2)

      //console.info('estimator final estimate', asyncEstimator.getCurrentEstimate())
      expect(asyncEstimator.getCurrentEstimate()).toBeGreaterThan(promiseDuration - 20) // padding a bit the boundary as it will never estimate perfectly at 100%
      expect(asyncEstimator.getCurrentEstimate()).toBeLessThan(promiseDuration + 20) // padding a bit the boundary as it will never estimate perfectly at 100%

      //console.info('logs', logs)
    },
    testTimeout
  )
})
