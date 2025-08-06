import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { connectSocket } from '../services/socketService'
import { registerSocketListeners } from '../features/socket/socketListener'

import { store } from '../store/store'
import { getSocketURL } from '../lib/utils'


const WebSocketProvider = ({ children }) => {
    const dispatch = useDispatch()

    useEffect(() => {
        const socketURL = getSocketURL()

        if (!socketURL) {
            console.warn('[WebSocket] No socket URL defined. Skipping connection.')
            return
        }

        connectSocket(socketURL)
        registerSocketListeners(store)
    }, [])

    return <>{children}</>
}

export default WebSocketProvider
