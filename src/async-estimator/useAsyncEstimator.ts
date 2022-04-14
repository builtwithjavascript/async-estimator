import { AsyncEstimator } from './AsyncEstimator'
import { IAsyncEstimatorOptions } from './IAsyncEstimatorOptions'
import { IAsyncEstimator } from './IAsyncEstimator'

const estimators: { [key: string]: IAsyncEstimator } = {}
const setEstimator = (id: string, estimator: IAsyncEstimator) => {
  estimators[id] = estimator
}
const getCurrentEstimator = (targetId: string) => {
  return estimators[targetId]
}

export const useAsyncEstimator = (options: IAsyncEstimatorOptions): IAsyncEstimator => {
  // cache it by target id
  const { targetId } = options
  let instance = estimators[targetId]
  if (!instance) {
    instance = new AsyncEstimator(options)
    setEstimator(targetId, instance)
  } else {
    instance.setOptions(options)
  }

  return getCurrentEstimator(targetId)
}
