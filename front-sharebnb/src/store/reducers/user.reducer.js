import { userService } from '../../services/user'

export const INCREMENT = 'INCREMENT'
export const DECREMENT = 'DECREMENT'
export const CHANGE_COUNT = 'CHANGE_COUNT'
export const SET_USER = 'SET_USER'
export const SET_WATCHED_USER = 'SET_WATCHED_USER'
export const REMOVE_USER = 'REMOVE_USER'
export const SET_USERS = 'SET_USERS'
export const SET_SCORE = 'SET_SCORE'
export const INIT_USER = 'INIT_USER'

const initialState = {
    count: 10,
    user: userService.getLoggedinUser(), // Don't initialize from service here, use INIT_USER action instead
    users: [],
    watchedUser : null
}

export function userReducer(state = initialState, action) {
    // console.log('userReducer called with action:', action.type, action)
    var newState = state
    switch (action.type) {
        case INIT_USER:
            // console.log('userReducer - INIT_USER case, setting user:', action.user)
            newState = { ...state, user: action.user }
            break
        case INCREMENT:
            newState = { ...state, count: state.count + 1 }
            break
        case DECREMENT:
            newState = { ...state, count: state.count - 1 }
            break
        case CHANGE_COUNT:
            newState = { ...state, count: state.count + action.diff }
            break
        case SET_USER:
            // console.log('userReducer - SET_USER case, setting user:', action.user)
            newState = { ...state, user: action.user }
            break
        case SET_WATCHED_USER:
            newState = { ...state, watchedUser: action.user }
            break
        case REMOVE_USER:
            newState = {
                ...state,
                users: state.users.filter(user => user._id !== action.userId)
            }
            break
        case SET_USERS:
            newState = { ...state, users: action.users }
            break
        case SET_SCORE:
            const user = { ...state.user, score: action.score }
            newState = { ...state, user }
            userService.saveLoggedinUser(user)
            break
        default:
    }
    
    // console.log('userReducer - new state:', newState)
    return newState

}
