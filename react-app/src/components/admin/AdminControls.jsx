import React from 'react'

const AdminControls = ({ onResetScore, onNewGame, onIncrement, onDecrement }) => {
    return (
        <div className="text-white text-center">
            <h2 className="mb-4">Game Controls</h2>
            <div className="d-flex flex-wrap justify-content-center gap-3">
                <button className="btn btn-warning" onClick={onResetScore}>Reset Score</button>
                <button className="btn btn-danger" onClick={onNewGame}>Start New Game</button>
                <button className="btn btn-success" onClick={() => onIncrement('teamA')}>Team A +</button>
                <button className="btn btn-success" onClick={() => onIncrement('teamB')}>Team B +</button>
                <button className="btn btn-outline-light" onClick={() => onDecrement('teamA')}>Team A-</button>
                <button className="btn btn-outline-light" onClick={() => onDecrement('teamB')}>Team B-</button>
            </div>
        </div>
    )
}

export default AdminControls
