import React from 'react'
import { useGame } from '../hooks/useGame'
import Scoreboard from '../components/game/Scoreboard'

const ScoreboardPage = () => {
    const gameState = useGame()

    return (
        <div className="bg-dark min-vh-100 d-flex justify-content-center align-items-center">
            <div className="w-100">
                <Scoreboard gameState={gameState} />
            </div>
        </div>
    )
}

export default ScoreboardPage
