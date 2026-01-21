import { legacy_createStore as createStore, combineReducers } from 'redux'

import { stayReducer } from './reducers/stay.reducer.js'
import { userReducer } from './reducers/user.reducer.js'
import { reviewReducer } from './reducers/review.reducer.js'
import { systemReducer } from './reducers/system.reducer.js'
import { FilterPanelReducer } from './reducers/filter.panel.reducer.js'
import { orderReducer } from './reducers/order.reducer.js'

const rootReducer = combineReducers({
    stayModule: stayReducer,
    userModule: userReducer,
    systemModule: systemReducer,
    reviewModule: reviewReducer,
    filterPanelModule: FilterPanelReducer,
    orderModule: orderReducer
})


const middleware = (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__() : undefined
export const store = createStore(rootReducer, middleware)

