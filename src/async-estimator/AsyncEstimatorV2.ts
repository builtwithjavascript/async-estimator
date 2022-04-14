export class AsyncEstimatorV2 {
  private estimate: number = 0

  constructor(initialEstimate: number) {
    this.setEstimate(initialEstimate)
  }

  private setEstimate(estimate: number) {
    this.estimate = estimate
  }

  public getCurrentEstimate() {
    return this.estimate
  }

  work<T>(targetAsyncFunction: Promise<T>): Promise<T> {
    return new Promise<T>((resolve) => {
      const startTime = Date.now()
      targetAsyncFunction.then(async (targetReturnValue) => {
        // update the estimate with the actual duration so next time we have a better idea of
        // how long a Promise with the same key should tak
        this.setEstimate(Date.now() - startTime)
        resolve(targetReturnValue)
      })
    })
  }
}
