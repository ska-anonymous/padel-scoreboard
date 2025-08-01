import React from 'react'
import { useGameEngine } from '../hooks/useGameEngine'
import GameStartForm from '../components/admin/GameStartForm'
import AdminControls from '../components/admin/AdminControls'
import {
    sendGameStart,
    sendGameReset,
    sendScoreIncrement,
    sendScoreDecrement,
    sendScoreReset,
    sendClearPersistedState,
} from '../features/socket/socketActions'
import { clearGameState } from '../lib/persistence/gamePersistence'

const AdminPage = () => {
    const {
        gameStarted,
        reset,
        start,
        increment,
        decrement,
        setPlayerNames,
        updateConfig,
        resetGameScore
    } = useGameEngine()

    const handleNewGameSubmit = (config) => {
        // 1. Locally update Redux state
        setPlayerNames(config.teamA, config.teamB)
        updateConfig(config)
        start()

        // 2. Emit over socket (centralized)
        sendGameStart(config)
    }

    const handleNewGame = () => {
        const confirm = window.confirm('Do you really want to start a new game?')
        if (!confirm) return;
        // Reset Redux state
        reset() //reset state locally
        sendGameReset()             // Broadcast to others
        clearGameState()            // Clear local storage
        sendClearPersistedState()   // Tell others to clear theirs
    }

    const handleResetScore = () => {
        const confirm = window.confirm('Do you want to reset score?')
        if (!confirm) return;
        resetGameScore()
        sendScoreReset()
    }

    return (
        <div className="container py-5">
            {gameStarted ? (
                <AdminControls
                    onResetScore={handleResetScore}
                    onNewGame={handleNewGame} // Or show a reset confirmation later
                    onIncrement={(team) => {
                        increment(team)
                        sendScoreIncrement(team)
                    }}
                    onDecrement={(team) => {
                        decrement(team)
                        sendScoreDecrement(team)
                    }}
                />
            ) : (
                <GameStartForm onSubmit={handleNewGameSubmit} />
            )}
        </div>
    )
}

export default AdminPage
