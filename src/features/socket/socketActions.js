import { setSynced } from '../../lib/syncStatus'
import { emitSocketEvent } from '../../services/socketService'
import { SOCKET_EVENTS } from './socketEvents'

export const sendGameStart = (config) => {
    emitSocketEvent(SOCKET_EVENTS.GAME_START, config)
}

export const sendGameReset = () => {
    emitSocketEvent(SOCKET_EVENTS.GAME_RESET)
}

export const sendScoreReset = () => {
    emitSocketEvent(SOCKET_EVENTS.SCORE_RESET)
}

export const sendScoreIncrement = (team) => {
    emitSocketEvent(SOCKET_EVENTS.SCORE_INCREMENT, team)
}

export const sendScoreDecrement = (team) => {
    emitSocketEvent(SOCKET_EVENTS.SCORE_DECREMENT, team)
}

export const sendClearPersistedState = () => {
    emitSocketEvent(SOCKET_EVENTS.CLEAR_PERSISTED_STATE)
}

export const sendSyncRequest = () => {
    setSynced(false)
    emitSocketEvent(SOCKET_EVENTS.SYNC_REQUEST)
}

export const sendSyncState = (state) => {
    emitSocketEvent(SOCKET_EVENTS.SYNC_STATE, state)
}
