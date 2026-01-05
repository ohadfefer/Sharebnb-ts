import { stayService } from '../../services/stay'
import { store } from '../store'
import {
    ADD_STAY,
    REMOVE_STAY,
    SET_STAYS,
    SET_STAY,
    UPDATE_STAY,
    ADD_STAY_MSG,
    SET_FILTER_BY,
    SET_IS_LOADING,
} from '../reducers/stay.reducer.js'

export async function loadStays() {
    const { filterBy } = store.getState().stayModule
    
    try {
        store.dispatch({ type: SET_IS_LOADING, isLoading: true })
        console.log('loadStays -> filterBy:', filterBy)
        const stays = await stayService.query(filterBy)
        console.log('loadStays -> stays returned:', stays.length, 'stays')
        
        store.dispatch({ type: SET_STAYS, stays })
        return stays
    } catch (err) {
        console.log('stay action -> Cannot load stays')
        throw err
    } finally {
        store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    }
}

export async function removeStay(stayId) {
    try {
        await stayService.remove(stayId)
        store.dispatch(getCmdRemoveStay(stayId))
    } catch (err) {
        console.log('Cannot remove stay', err)
        throw err
    }
}

export async function addStay(stay) {
    try {
        const savedStay = await stayService.save(stay)
        store.dispatch(getCmdAddStay(savedStay))
        return savedStay
    } catch (err) {
        console.log('Cannot add stay', err)
        throw err
    }
}

export async function updateStay(stay) {
    try {
        const savedStay = await stayService.save(stay)
        store.dispatch(getCmdUpdateStay(savedStay))
        return savedStay
    } catch (err) {
        console.log('Cannot save stay', err)
        throw err
    }
}

export async function addStayMsg(stayId, txt) {
    try {
        const msg = await stayService.addStayMsg(stayId, txt)
        store.dispatch(getCmdAddStayMsg(msg))
        return msg
    } catch (err) {
        console.log('Cannot add stay msg', err)
        throw err
    }
}

export function setFilter(filterBy) {
    console.log('from action:', filterBy);
    
    store.dispatch({ type: SET_FILTER_BY, filterBy })
}


export function getCmdSetStays(stays) {
    return {
        type: SET_STAYS,
        stays
    }
}
export function getCmdSetStay(stay) {
    return {
        type: SET_STAY,
        stay
    }
}
export function getCmdRemoveStay(stayId) {
    return {
        type: REMOVE_STAY,
        stayId
    }
}
export function getCmdAddStay(stay) {
    return {
        type: ADD_STAY,
        stay
    }
}
export function getCmdUpdateStay(stay) {
    return {
        type: UPDATE_STAY,
        stay
    }
}
export function getCmdAddStayMsg(msg) {
    return {
        type: ADD_STAY_MSG,
        msg
    }
}

async function unitTestActions() {
    await loadStays()
    await addStay(stayService.getEmptyStay())
    await updateStay({
        _id: 'eQXRn',
        name: 'Stay-Good',
        price: 333
    })
   
}
