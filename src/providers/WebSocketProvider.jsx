import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { connectSocket } from '../services/socketService'
import { registerSocketListeners } from '../features/socket/socketListener'

import { store } from '../store/store'

const socketURL = 'wss://10.31.104.24:8080/ws'

const WebSocketProvider = ({ children }) => {
    const dispatch = useDispatch()

    useEffect(() => {
        connectSocket(socketURL)
        registerSocketListeners(store)
    }, [])

    return <>{children}</>
}

export default WebSocketProvider
