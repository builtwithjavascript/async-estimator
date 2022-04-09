export interface IAsyncEstimatorOptions {
  targetId: string
  initialEstimate: number
  interval: number
  intervalHandler: (current: number) => Promise<void> | void
}
