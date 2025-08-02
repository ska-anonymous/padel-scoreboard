import React from 'react'
import { Navigate } from 'react-router-dom'
import { useGame } from '../hooks/useGame'
import ScoreboardPage from '../pages/ScoreboardPage'

const ScoreboardGuard = () => {
    const { gameStarted } = useGame()

    if (!gameStarted) {
        return <Navigate to="/qr" replace />
    }

    return <ScoreboardPage />
}

export default ScoreboardGuard
