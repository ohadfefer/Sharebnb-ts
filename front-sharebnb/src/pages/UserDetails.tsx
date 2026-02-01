import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { loadUser } from '../store/actions/user.actions.js'
import { store } from '../store/store.js'
import { showSuccessMsg } from '../services/event-bus.service.js'
import { socketService, SOCKET_EVENT_USER_UPDATED, SOCKET_EMIT_USER_WATCH } from '../services/socket.service.js'
import { useAppSelector } from '../store/hooks.js'

import { WatchedUser } from '../types/user.js'

export function UserDetails() {

  const params = useParams()
  const user = useAppSelector(storeState => storeState.userModule.watchedUser)

  useEffect(() => {
    if (params.id) loadUser(params.id)

    socketService.emit(SOCKET_EMIT_USER_WATCH, params.id)
    socketService.on(SOCKET_EVENT_USER_UPDATED, onUserUpdate)

    return () => {
      socketService.off(SOCKET_EVENT_USER_UPDATED, onUserUpdate as any)
    }

  }, [params.id])

  function onUserUpdate(user: WatchedUser) {
    showSuccessMsg(`This user ${user.fullname} just got updated from socket, new score: ${user.score}`)
    store.dispatch({ type: 'SET_WATCHED_USER', user })
  }

  return (
    <section className="user-details">
      <h1>User Details</h1>
      {user && <div>
        <h3>
          {user.fullname}
        </h3>
        <img src={user.imgUrl} style={{ width: '100px' }} />
        <pre> {JSON.stringify(user, null, 2)} </pre>
      </div>}
    </section>
  )
}