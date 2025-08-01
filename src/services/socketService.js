import { sendSyncRequest } from "../features/socket/socketActions"

let socket = null
let reconnectTimeout = null
const listeners = {}
const MAX_RETRIES = 10
let retryCount = 0
const RETRY_INTERVAL = 3000 // 3 seconds
let socketURL = ''

export const connectSocket = (url) => {
    if (socket) return socket

    socketURL = url
    console.log('connecting to websocket:', url)
    socket = new WebSocket(url)

    socket.onopen = () => {
        console.log('[WebSocket] ✅ Connected')
        // upon connection or reconnection send sync request
        sendSyncRequest()
        retryCount = 0
    }

    socket.onmessage = (message) => {
        try {
            const { event, data } = JSON.parse(message.data)
            if (listeners[event]) {
                listeners[event].forEach((cb) => cb(data))
            }
        } catch (err) {
            console.log('socket message error', err)
            console.error('[WebSocket] ❌ Invalid message format:', message.data)
        }
    }

    socket.onerror = (err) => {
        console.error('[WebSocket] ❌ Error:', err.message)
    }

    socket.onclose = () => {
        console.warn('[WebSocket] ⚠️ Disconnected')
        socket = null
        if (retryCount < MAX_RETRIES) {
            retryCount++
            console.log(`[WebSocket] 🔁 Attempting reconnect in ${RETRY_INTERVAL / 1000}s... (try ${retryCount})`)
            reconnectTimeout = setTimeout(() => {
                connectSocket(socketURL)
            }, RETRY_INTERVAL)
        } else {
            console.error('[WebSocket] ❌ Max retries reached. Giving up.')
        }
    }

    return socket
}

export const onSocketEvent = (event, callback) => {
    if (!listeners[event]) {
        listeners[event] = []
    }
    listeners[event].push(callback)
}

export const emitSocketEvent = (event, data) => {
    if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ event, data }))
    } else {
        console.warn(`[WebSocket] ⚠️ Cannot emit event "${event}": socket not open`)
    }
}
