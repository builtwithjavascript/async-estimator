import { IAsyncEstimatorOptions } from './IAsyncEstimatorOptions'
import { IAsyncEstimator } from './IAsyncEstimator'

export class AsyncEstimator implements IAsyncEstimator {
  private options!: IAsyncEstimatorOptions
  private estimate: number = 0

  constructor(options: IAsyncEstimatorOptions) {
    this.setOptions(options)
  }

  private setEstimate(estimate: number) {
    this.estimate = estimate
  }

  public getCurrentEstimate() {
    return this.estimate
  }

  public setOptions(options: IAsyncEstimatorOptions) {
    this.options = options
  }

  work<T>(targetAsyncFunction: Promise<T>): Promise<T> {
    return new Promise<T>((resolve) => {
      // get initial guess estimate passed with the option
      const { interval, intervalHandler, initialEstimate } = this.options

      // set initial estimate
      if (!this.estimate) {
        this.setEstimate(initialEstimate || 1000) // if initialEstimate is zero or undefined, default to 1000
      }

      // get existing estimate
      const estimate = this.getCurrentEstimate()

      const startTime = Date.now()

      let intervalId = setInterval(async () => {
        if (estimate > 0) {
          const elapsedTime = Date.now() - startTime
          const remainingTime = estimate - elapsedTime
          if (remainingTime > 0) {
            await intervalHandler(Number((elapsedTime / estimate).toFixed(2)))
          } else {
            clearInterval(intervalId)
            intervalHandler(0.99)
          }
        }
      }, interval)

      targetAsyncFunction.then(async (targetReturnValue) => {
        clearInterval(intervalId)
        await intervalHandler(1)
        const actualDuration = Date.now() - startTime
        // update the estimate with the actual duration so next time we have a better idea of
        // how long a Promise with the same key should tak
        this.setEstimate(actualDuration)
        resolve(targetReturnValue)
      })
    })
  }
}
