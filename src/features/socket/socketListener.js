import { onSocketEvent } from '../../services/socketService'
import { SOCKET_EVENTS } from './socketEvents'
import {
    setPlayers,
    setGameConfig,
    resetGame,
    startGame,
    incrementScore,
    decrementScore,
    resetScore,
    hydrateGame
} from '../game/gameSlice'

import { clearGameState, saveGameState } from '../../lib/persistence/gamePersistence'
import { sendSyncState } from './socketActions'
import { getSynced, setSynced } from '../../lib/syncStatus'

export const registerSocketListeners = ({ dispatch, getState }) => {
    onSocketEvent(SOCKET_EVENTS.GAME_START, (config) => {
        dispatch(setPlayers({ teamA: config.teamA, teamB: config.teamB }))
        dispatch(setGameConfig(config))
        dispatch(startGame())
    })

    onSocketEvent(SOCKET_EVENTS.GAME_RESET, () => {
        dispatch(resetGame())
    })

    onSocketEvent(SOCKET_EVENTS.SCORE_RESET, () => {
        dispatch(resetScore())
    })

    onSocketEvent(SOCKET_EVENTS.SCORE_INCREMENT, (team) => {
        dispatch(incrementScore(team))
    })

    onSocketEvent(SOCKET_EVENTS.SCORE_DECREMENT, (team) => {
        dispatch(decrementScore(team))
    })

    onSocketEvent(SOCKET_EVENTS.CLEAR_PERSISTED_STATE, () => {
        clearGameState()
    })

    // 🆕 Handle sync request
    onSocketEvent(SOCKET_EVENTS.SYNC_REQUEST, () => {
        const state = getState().game
        sendSyncState(state)
    })

    // 🆕 Handle sync state update
    onSocketEvent(SOCKET_EVENTS.SYNC_STATE, (state) => {
        if (getSynced()) return // ignore duplicate/unrequested syncs

        dispatch(hydrateGame(state))
        saveGameState(state)
        setSynced(true)

    })

}
