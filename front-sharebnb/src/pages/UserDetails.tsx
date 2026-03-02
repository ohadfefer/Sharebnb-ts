import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

import { loadUser } from '../store/actions/user.actions.js'
import { store } from '../store/store.js'
import { showSuccessMsg } from '../services/event-bus.service.js'
import { socketService, SOCKET_EVENT_USER_UPDATED, SOCKET_EMIT_USER_WATCH } from '../services/socket.service.js'
import { useAppSelector } from '../store/hooks.js'

import { WatchedUser } from '../types/user.js'

export function UserDetails() {
  const params = useParams()
  const user = useAppSelector(storeState => storeState.userModule.watchedUser)
  const loggedInUser = useAppSelector(storeState => storeState.userModule.user)
  const isOwnProfile = loggedInUser && user && loggedInUser._id === user._id

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

  if (!user) return <div className="user-details-loading">Loading...</div>

  const initial = user.fullname?.charAt(0)?.toUpperCase() || '?'

  return (
    <section className="user-details">
      <div className="ud-card">
        <div className="ud-avatar-section">
          {user.imgUrl ? (
            <img className="ud-avatar" src={user.imgUrl} alt={user.fullname} />
          ) : (
            <div className="ud-avatar-placeholder">{initial}</div>
          )}
          <h1 className="ud-name">{user.fullname}</h1>
        </div>

        <div className="ud-info">
          {user.username && (
            <div className="ud-info-row">
              <span className="ud-info-label">Username</span>
              <span className="ud-info-value">@{user.username}</span>
            </div>
          )}
          {user.email && (
            <div className="ud-info-row">
              <span className="ud-info-label">Email</span>
              <span className="ud-info-value">{user.email}</span>
            </div>
          )}
        </div>

        {isOwnProfile && (
          <div className="ud-actions">
            <Link to="/dashboard/reservations" className="ud-btn-primary">
              Manage reservations
            </Link>
            <Link to="/dashboard/listings" className="ud-btn-secondary">
              Manage listings
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
