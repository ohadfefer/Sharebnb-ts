export const SHOW_MSG = 'show-msg'
export const OPEN_REVIEWS_MODAL = 'open-reviews-modal'

function createEventEmitter() {
    const listenersMap = {}
    return {
        on(evName, listener){
            listenersMap[evName] = (listenersMap[evName])? [...listenersMap[evName], listener] : [listener]
            return ()=>{
                listenersMap[evName] = listenersMap[evName].filter(func => func !== listener)
            }
        },
        emit(evName, data) {
            if (!listenersMap[evName]) return
            listenersMap[evName].forEach(listener => listener(data))
        }
    }
}

export const eventBus = createEventEmitter()

export function showUserMsg(msg) {
    eventBus.emit(SHOW_MSG, msg)
}

export function showSuccessMsg(txt, stay = null) {
    showUserMsg({txt, type: 'success', stay})
}

export function showRemoveMsg(txt, stay = null) {
    showUserMsg({txt, type: 'remove', stay})
}

export function showErrorMsg(txt) {
    showUserMsg({txt, type: 'error'})
}

window.showUserMsg = showUserMsg