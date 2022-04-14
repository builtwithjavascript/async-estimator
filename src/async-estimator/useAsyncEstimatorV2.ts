import { AsyncEstimatorV2 } from '../async-estimator/AsyncEstimatorV2'

const estimators: { [key: string]: AsyncEstimatorV2 } = {}
const setEstimator = (id: string, estimator: AsyncEstimatorV2) => {
  estimators[id] = estimator
}
const getCurrentEstimator = (targetId: string) => {
  return estimators[targetId]
}

export const useAsyncEstimatorV2 = (targetId: string, initialEstimate: number): AsyncEstimatorV2 => {
  let instance = estimators[targetId]
  if (!instance) {
    instance = new AsyncEstimatorV2(initialEstimate)
    setEstimator(targetId, instance)
  }

  return getCurrentEstimator(targetId)
}
