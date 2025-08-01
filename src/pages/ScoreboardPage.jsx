import React from 'react'
import { useGameEngine } from '../hooks/useGameEngine'
import Scoreboard from '../components/game/Scoreboard'

const ScoreboardPage = () => {
    const { teamA, teamB, gameConfig } = useGameEngine()

    return (
        <div className="bg-dark min-vh-100 d-flex justify-content-center align-items-center">
            <div className="w-100">
                <Scoreboard teamA={teamA} teamB={teamB} setsToWin={gameConfig.setsToWin} />
            </div>
        </div>
    )
}

export default ScoreboardPage
