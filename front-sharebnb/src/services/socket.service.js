import io from 'socket.io-client'
import { userService } from './user'
const { VITE_LOCAL, DEV } = import.meta.env

export const SOCKET_EMIT_SEND_MSG = 'chat-send-msg'
export const SOCKET_EMIT_SET_TOPIC = 'chat-set-topic'
export const SOCKET_EMIT_USER_WATCH = 'user-watch'
export const SOCKET_EVENT_ADD_MSG = 'chat-add-msg'
export const SOCKET_EVENT_USER_UPDATED = 'user-updated'
export const SOCKET_EVENT_REVIEW_ADDED = 'review-added'
export const SOCKET_EVENT_REVIEW_REMOVED = 'review-removed'
export const SOCKET_EVENT_REVIEW_ABOUT_YOU = 'review-about-you'
export const SOCKET_EVENT_ORDER_UPDATED = 'order-updated'

const SOCKET_EMIT_LOGIN = 'set-user-socket'
const SOCKET_EMIT_LOGOUT = 'unset-user-socket'

const baseUrl = (process.env.NODE_ENV === 'production') ? '' : '//localhost:3030'

// Use real socket service for order updates
export const socketService = createSocketService()

if (DEV) window.socketService = socketService

socketService.setup()


function createSocketService() {
  var socket = null
  const socketService = {
    setup() {
      socket = io(baseUrl)
      console.log('Socket created, initial connection status:', socket.connected)
      
      socket.on('connect', () => {
        console.log('Socket connected successfully with ID:', socket.id)
        const user = userService.getLoggedinUser()
        if (user) {
          console.log('User logged in, setting socket userId:', user._id)
          this.login(user._id)
        } else {
          console.log('No user logged in')
        }
      })
      
      socket.on('disconnect', () => {
        console.log('Socket disconnected')
      })
      
      socket.on('order-updated', (data) => {
        console.log('Received order-updated event:', data)
      })
      
      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error)
      })
    },
    on(eventName, cb) {
      socket.on(eventName, cb)
    },
    off(eventName, cb = null) {
      if (!socket) return
      if (!cb) socket.removeAllListeners(eventName)
      else socket.off(eventName, cb)
    },
    emit(eventName, data) {
      socket.emit(eventName, data)
    },
    login(userId) {
      console.log('Socket login called with userId:', userId)
      if (socket?.connected) {
        socket.emit(SOCKET_EMIT_LOGIN, userId)
        console.log('Login event emitted successfully')
      } else {
        console.log('Socket not connected, cannot emit login event')
      }
    },
    logout() {
      socket.emit(SOCKET_EMIT_LOGOUT)
    },
    terminate() {
      socket = null
    },
    reconnect() {
      if (socket) {
        socket.disconnect()
      }
      this.setup()
    },
    testConnection() {
      console.log('=== Socket Connection Test ===')
      console.log('Socket exists:', !!socket)
      console.log('Socket connection status:', socket?.connected)
      console.log('Socket ID:', socket?.id)
      const user = userService.getLoggedinUser()
      console.log('Current user:', user)
      if (user && socket?.connected) {
        console.log('Attempting to login user to socket...')
        this.login(user._id)
      } else if (!socket?.connected) {
        console.log('Socket not connected, cannot login user')
      } else {
        console.log('No user logged in')
      }
      console.log('=== End Socket Test ===')
    },
    ensureUserLoggedIn() {
      const user = userService.getLoggedinUser()
      if (user && socket?.connected) {
        console.log('Ensuring user is logged in to socket:', user._id)
        this.login(user._id)
      }
    },

  }
  return socketService
}

function createDummySocketService() {
  var listenersMap = {}
  const socketService = {
    listenersMap,
    setup() {
      listenersMap = {}
    },
    terminate() {
      this.setup()
    },
    login() {
      console.log('Dummy socket service here, login - got it')
    },
    logout() {
      console.log('Dummy socket service here, logout - got it')
    },
    on(eventName, cb) {
      listenersMap[eventName] = [...(listenersMap[eventName]) || [], cb]
    },
    off(eventName, cb) {
      if (!listenersMap[eventName]) return
      if (!cb) delete listenersMap[eventName]
      else listenersMap[eventName] = listenersMap[eventName].filter(l => l !== cb)
    },
    emit(eventName, data) {
      var listeners = listenersMap[eventName]
      if (eventName === SOCKET_EMIT_SEND_MSG) {
        listeners = listenersMap[SOCKET_EVENT_ADD_MSG]
      }

      if (!listeners) return

      listeners.forEach(listener => {
        listener(data)
      })
    },
    testChatMsg() {
      this.emit(SOCKET_EVENT_ADD_MSG, { from: 'Someone', txt: 'Aha it worked!' })
    },
    testUserUpdate() {
      this.emit(SOCKET_EVENT_USER_UPDATED, { ...userService.getLoggedinUser(), score: 555 })
    }
  }
  window.listenersMap = listenersMap
  return socketService
}

