export const LOADING_START = 'LOADING_START'
export const LOADING_DONE = 'LOADING_DONE'

const systemState: SystemState = {
  isLoading: false
}

export function systemReducer(state = systemState, action: SystemAction) {
  switch (action.type) {
    case LOADING_START:
      return { ...state, isLoading: true }
    case LOADING_DONE:
      return { ...state, isLoading: false }
    default: return state
  }
}

interface SystemState {
  isLoading: boolean
}

type SystemAction =
  | { type: typeof LOADING_START }
  | { type: typeof LOADING_DONE }

