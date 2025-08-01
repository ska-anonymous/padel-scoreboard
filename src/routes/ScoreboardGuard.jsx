import React from 'react'
import { Navigate } from 'react-router-dom'
import { useGameEngine } from '../hooks/useGameEngine'
import ScoreboardPage from '../pages/ScoreboardPage'

const ScoreboardGuard = () => {
    const { gameStarted } = useGameEngine()

    if (!gameStarted) {
        return <Navigate to="/qr" replace />
    }

    return <ScoreboardPage />
}

export default ScoreboardGuard
