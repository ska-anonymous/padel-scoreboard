import React from 'react'
import { useGame } from '../hooks/useGame'
import Scoreboard from '../components/game/Scoreboard'
import { useNavigate } from 'react-router-dom'

const ScoreboardPage = () => {

    const navigate = useNavigate()

    const gameState = useGame()

    return (
        <div className="d-flex justify-content-center align-items-center">
            <div className="w-100">
                <div className="text-end py-1 px-1">
                    <button onClick={() => navigate('/admin')} className='btn btn-sm btn-primary'>Admin -&gt;</button>
                </div>
                <Scoreboard gameState={gameState} />
            </div>
        </div>
    )
}

export default ScoreboardPage
