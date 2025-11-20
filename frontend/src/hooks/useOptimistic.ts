import { useState } from 'react'

interface OptimisticConfig<R> {
  // eslint-disable-next-line no-unused-vars
  onSuccess?: (result: R) => void
  // eslint-disable-next-line no-unused-vars
  onError?: (err: Error) => void
}

interface OptimisticResult<R> {
  success: boolean
  result?: R
  err?: Error
}

export function useOptimistic<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState)
  const [snapshot, setSnapshot] = useState<T | null>(null)
  const [isOptimistic, setIsOptimistic] = useState(false)

  const applyOptimistic = async <R>(
    optimisticUpdate: T,
    actualUpdate: () => Promise<R>,
    config?: OptimisticConfig<R>
  ): Promise<OptimisticResult<R>> => {
    setSnapshot(state)
    setIsOptimistic(true)
    setState(optimisticUpdate)

    try {
      const result = await actualUpdate()

      setIsOptimistic(false)
      setSnapshot(null)
      config?.onSuccess?.(result)

      return { success: true, result }
    } catch (error) {
      setIsOptimistic(false)
      setState(snapshot as T)
      setSnapshot(null)
      config?.onError?.(error as Error)

      return { success: false, err: error as Error }
    }
  }

  return {
    state,
    setState,
    applyOptimistic,
    isOptimistic,
  }
}
