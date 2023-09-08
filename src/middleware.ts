import { AnyAction, Middleware, MiddlewareAPI, isRejected, isRejectedWithValue } from '@reduxjs/toolkit'
import { isErrorWithMessage } from 'utils/helpers'
import { toast } from 'react-toastify'

function isPayloadErrorMessage(payload: unknown): payload is {
  data: {
    error: string
  }
  status: number
} {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'data' in payload &&
    typeof (payload as any).data?.error === 'string'
  )
}

export const rtkQueryErrorLogger: Middleware = (api: MiddlewareAPI) => (next) => (action: AnyAction) => {
  if (isRejected(action)) {
    if (action.error.name === 'CustomError') {
      toast.warn(action.error.message)
    }
  }
  if (isRejectedWithValue(action)) {
    console.log(action)
    if (isPayloadErrorMessage(action.payload)) {
      toast.warning(action.payload.data.error)
    }
  }

  return next(action)
}
