import React from 'react'

const getSetCount = (setsToWin, teamA, teamB) => {
    switch (setsToWin) {
        case '1':
        case '3':
            return Number(setsToWin)
        case 'best_of_3':
            return 3
        case 'best_of_5':
            return 5
        case 'unlimited':
            return Math.max(teamA.sets?.length || 0, teamB.sets?.length || 0) || 1
        default:
            return 3
    }
}

const Scoreboard = ({ teamA, teamB, setsToWin = 3, currentSet = 0 }) => {
    const setCount = getSetCount(setsToWin, teamA, teamB)

    const renderSetLabels = () => (
        <div className="row mb-2">
            <div className="col-12 col-md-3" />
            <div className="col d-flex justify-content-center">
                {Array.from({ length: setCount }, (_, index) => (
                    <div key={index} className="col text-center text-uppercase text-secondary fw-semibold fs-5">
                        Set {index + 1}
                    </div>
                ))}
            </div>
            <div className="col-auto" />
        </div>
    )

    const renderSetScores = (team) =>
        Array.from({ length: setCount }, (_, index) => {
            const isCurrent = index === currentSet
            return (
                <div
                    key={index}
                    className={`col text-center fw-bold fs-1 ${isCurrent ? 'border border-3 border-warning rounded' : ''
                        }`}
                >
                    {team.sets?.[index] ?? 0}
                </div>
            )
        })

    return (
        <div className="container-fluid text-white py-2 px-3">
            {/* Header */}
            <div className="row mb-4 justify-content-between">
                <div className="col-auto fs-1">14:27</div>
                <div className="col text-center">
                    <h2 className="fw-bold fs-1 mb-0 text-warning">PADEL SCORE BOARD</h2>
                </div>
                <div className="col-auto fs-1">15:43 h</div>
            </div>

            {/* Set Labels Row */}
            {renderSetLabels()}

            {/* Team A */}
            <div className="row py-3 align-items-center">
                <div className="col-12 col-md-3 text-start">
                    <div className="fs-1 fw-bold">{teamA.players?.[0] || 'Player 1'}</div>
                    <div className="fs-1 fw-bold">{teamA.players?.[1] || 'Player 2'}</div>
                </div>
                <div className="col d-flex">{renderSetScores(teamA)}</div>
                <div className="col-auto text-end">
                    <div className="border border-light px-3 py-1 bg-white text-dark fs-1 fw-bold rounded">
                        {teamA.score ?? 0}
                    </div>
                </div>
            </div>

            {/* Divider */}
            <hr className="my-3 bg-warning" style={{ height: '5px' }} />

            {/* Team B */}
            <div className="row py-3 align-items-center">
                <div className="col-12 col-md-3 text-start">
                    <div className="fs-1 fw-bold">{teamB.players?.[0] || 'Player 3'}</div>
                    <div className="fs-1 fw-bold">{teamB.players?.[1] || 'Player 4'}</div>
                </div>
                <div className="col d-flex">{renderSetScores(teamB)}</div>
                <div className="col-auto text-end">
                    <div className="border border-light px-3 py-1 bg-white text-dark fs-1 fw-bold rounded">
                        {teamB.score ?? 0}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Scoreboard
