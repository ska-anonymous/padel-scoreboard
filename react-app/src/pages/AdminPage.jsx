import React from 'react'
import { useGame } from '../hooks/useGame'
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
import { useNavigate } from 'react-router-dom'

const AdminPage = () => {

    const navigate = useNavigate()

    const {
        gameStarted,
        reset,
        start,
        increment,
        decrement,
        setPlayerNames,
        updateConfig,
        resetGameScore
    } = useGame()

    const handleNewGameSubmit = (formConfig) => {
        const normalized = {
            ...formConfig,
            goldenPoint: formConfig.playStyle === 'golden',
            timerMinutes: formConfig.timerEnabled ? formConfig.timerMinutes : null,
            targetPoints: formConfig.gameMode === 'points' ? formConfig.targetPoints : null,
        }

        setPlayerNames(normalized.teamA, normalized.teamB)
        updateConfig(normalized)
        start()
        sendGameStart(normalized)
    }



    const handleNewGame = () => {
        const confirm = window.confirm('Do you really want to start a new game?')
        if (!confirm) return
        reset()
        sendGameReset()
        clearGameState()
        sendClearPersistedState()
    }

    const handleResetScore = () => {
        const confirm = window.confirm('Do you want to reset score?')
        if (!confirm) return
        resetGameScore()
        sendScoreReset()
    }

    return (
        <div className="container py-5">
            {gameStarted ? (
                <>
                    <AdminControls
                        onResetScore={handleResetScore}
                        onNewGame={handleNewGame}
                        onIncrement={(team) => {
                            increment(team)
                            sendScoreIncrement(team)
                        }}
                        onDecrement={(team) => {
                            decrement(team)
                            sendScoreDecrement(team)
                        }}
                    />
                    <div className="text-center pt-3">
                        <button onClick={() => navigate('/')} className='btn btn-sm btn-primary'>&lt;- Scoreboard</button>
                    </div>
                </>
            ) : (
                <GameStartForm onSubmit={handleNewGameSubmit} />
            )}
        </div>
    )
}

export default AdminPage
