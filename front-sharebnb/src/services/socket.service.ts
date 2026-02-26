import io, { Socket } from 'socket.io-client'
import { userService } from './user/index.js'

//types
import { Order } from '../types/order.js'
import { LoggedInUser } from '../types/user.js'

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

const baseUrl = import.meta.env.PROD ? '' : '//localhost:3030'


type SocketCallback = (data?: any) => void

function createSocketService() {
  let socket: Socket | null = null

  const socketService = {
    setup() {
      socket = io(baseUrl, {
        autoConnect: true,
      })

      console.log('Socket created, initial connection status:', socket.connected)

      socket.on('connect', () => {
        console.log('Socket connected successfully with ID:', socket!.id)
        const user = userService.getLoggedinUser() as LoggedInUser | null
        if (user?._id) {
          console.log('User logged in, setting socket userId:', user._id)
          this.login(user._id)
        } else {
          console.log('No user logged in')
        }
      })

      socket.on('disconnect', () => {
        console.log('Socket disconnected')
      })

      socket.on('order-updated', (data: Order) => {
        console.log('Received order-updated event:', data)
      })

      socket.on('connect_error', (error: Error) => {
        console.error('Socket connection error:', error)
      })
    },

    on(eventName: string, cb: SocketCallback) {
      if (socket) socket.on(eventName, cb)
    },

    off(eventName: string, cb?: SocketCallback | null) {
      if (!socket) return
      if (!cb) {
        socket.removeAllListeners(eventName)
      } else {
        socket.off(eventName, cb)
      }
    },

    emit(eventName: string, data?: any) {
      if (socket) socket.emit(eventName, data)
    },

    login(userId: string) {
      console.log('Socket login called with userId:', userId)
      if (socket?.connected) {
        socket.emit(SOCKET_EMIT_LOGIN, userId)
        console.log('Login event emitted successfully')
      } else {
        console.log('Socket not connected, cannot emit login event')
      }
    },

    logout() {
      if (socket) socket.emit(SOCKET_EMIT_LOGOUT)
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

      const user = userService.getLoggedinUser() as LoggedInUser | null
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
      const user = userService.getLoggedinUser() as LoggedInUser | null
      if (user?._id && socket?.connected) {
        console.log('Ensuring user is logged in to socket:', user._id)
        this.login(user._id)
      }
    },
  }

  return socketService
}

function createDummySocketService() {
  let listenersMap: Record<string, SocketCallback[]> = {}

  const socketService = {
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

    on(eventName: string, cb: SocketCallback) {
      listenersMap[eventName] = [...(listenersMap[eventName] || []), cb]
    },

    off(eventName: string, cb?: SocketCallback) {
      if (!listenersMap[eventName]) return
      if (!cb) {
        delete listenersMap[eventName]
      } else {
        listenersMap[eventName] = listenersMap[eventName].filter(l => l !== cb)
      }
    },

    emit(eventName: string, data?: any) {
      let listeners = listenersMap[eventName]

      // Special case for chat messages
      if (eventName === 'chat-send-msg') {
        listeners = listenersMap['chat-add-msg']
      }

      if (!listeners) return

      listeners.forEach(listener => listener(data))
    },

    testChatMsg() {
      this.emit('chat-add-msg', { from: 'Someone', txt: 'Aha it worked!' })
    },

    testUserUpdate() {
      const user = userService.getLoggedinUser() as LoggedInUser | null
      if (user) {
        this.emit('user-updated', { ...user, score: 555 })
      }
    },

    testConnection() {
      console.log('Dummy socket: testConnection (no-op)')
    },

    ensureUserLoggedIn() {
      console.log('Dummy socket: ensureUserLoggedIn (no-op)')
    },
  }

  // For debugging
  if (DEV) {
    (window as any).listenersMap = listenersMap
  }

  return socketService
}


export const socketService = import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_SOCKET
  ? createDummySocketService()
  : createSocketService()

if (DEV) {
  (window as any).socketService = socketService
}

socketService.setup()