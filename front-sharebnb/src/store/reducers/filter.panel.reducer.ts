export const SET_ACTIVE_FILTER_CELL = 'SET_ACTIVE_FILTER_CELL'
export const CLEAR_ACTIVE_FILTER_CELL = 'CLEAR_ACTIVE_FILTER_CELL'

const filterPanelState: FilterPanelState = {
  activeFilterCell: null,
}

export function FilterPanelReducer(state = filterPanelState, action: FilterPanelAction) {
  switch (action.type) {
    case SET_ACTIVE_FILTER_CELL:
      return { ...state, activeFilterCell: action.cellKey }
    case CLEAR_ACTIVE_FILTER_CELL:
      return { ...state, activeFilterCell: null }
    default:
      return state
  }
}

export const setActiveFilterCell = (cellKey: string) => ({ type: SET_ACTIVE_FILTER_CELL, cellKey })
export const clearActiveFilterCell = () => ({ type: CLEAR_ACTIVE_FILTER_CELL })

interface FilterPanelState {
  activeFilterCell: any
}

type FilterPanelAction =
  | { type: typeof SET_ACTIVE_FILTER_CELL; cellKey: any }
  | { type: typeof CLEAR_ACTIVE_FILTER_CELL }