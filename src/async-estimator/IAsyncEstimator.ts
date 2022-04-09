import { IAsyncEstimatorOptions } from './IAsyncEstimatorOptions'

export interface IAsyncEstimator {
  work<T = void>(targetAsyncFunction: Promise<T>): Promise<T>
  setOptions(options: IAsyncEstimatorOptions): void
  getCurrentEstimate(): number
}
