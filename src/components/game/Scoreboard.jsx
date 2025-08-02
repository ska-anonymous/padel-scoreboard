import React from 'react'
import { useTimerDisplay } from '../../hooks/useTimerDisplay'


const Scoreboard = ({ gameState }) => {
    const {
        teamA,
        teamB,
        currentSet,
        matchWinner,
        gameConfig,
        tiebreakActive,
        elapsedSeconds
    } = gameState

    const { timerEnabled, timerMinutes, setsToWin } = gameConfig || {}
    const { label: timerLabel } = useTimerDisplay(elapsedSeconds, timerMinutes)

    const getSetCount = (setsToWin, teamA, teamB, currentSet) => {
        switch (setsToWin) {
            case '1':
            case '3':
                return Number(setsToWin)
            case 'best_of_3':
                return 3
            case 'best_of_5':
                return 5
            case 'unlimited':
                return Math.max(
                    teamA.games?.length ?? 0,
                    teamB.games?.length ?? 0,
                    currentSet + 1,
                    1
                )
            default:
                return 3
        }
    }

    const getSetWinners = (teamA, teamB, currentSet, totalSets) => {
        const winners = Array(totalSets).fill(null)
        for (let i = 0; i < totalSets; i++) {
            const a = teamA.games?.[i]
            const b = teamB.games?.[i]

            // ✅ Only evaluate past sets
            if (i < currentSet && typeof a === 'number' && typeof b === 'number') {
                if (a > b) winners[i] = 'teamA'
                else if (b > a) winners[i] = 'teamB'
            }
        }
        return winners
    }



    const setCount = getSetCount(setsToWin, teamA, teamB, currentSet)
    const setWinners = getSetWinners(teamA, teamB, currentSet, setCount)


    const renderSetLabels = (setWinners) => (
        <div className="row mb-2">
            <div className="col-12 col-md-3" />
            <div className="col d-flex justify-content-center">
                {Array.from({ length: setCount }, (_, index) => {
                    const isCurrent = index === currentSet
                    const winner = setWinners[index]
                    return (
                        <div key={index} className="col text-center">
                            {/* 🏆 Winner Name */}
                            {winner && (
                                <div
                                    className="text-success fw-bold"
                                    style={{ fontSize: '1rem', marginBottom: '0.25rem' }}
                                >
                                    {winner === 'teamA'
                                        ? `${'Team A'}`
                                        : `${'Team B'}`}
                                </div>
                            )}
                            {/* Set Label */}
                            <div
                                className={`text-secondary text-uppercase fw-semibold fs-5 ${isCurrent ? 'text-warning' : ''
                                    }`}
                            >
                                Set {index + 1}
                            </div>
                        </div>
                    )
                })}
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
                    {team.games?.[index] ?? 0}
                </div>
            )
        })

    return (
        <div className="container-fluid text-white py-2 px-5">

            {/* Header */}
            <div className="row mb-4 justify-content-between">
                {/* Timer */}
                <div className="col-auto fs-1">
                    {timerEnabled ? timerLabel : '--:--'}
                </div>

                {/* Title */}
                <div className="col text-center">
                    <h2 className="fw-bold fs-1 mb-0 text-warning">PADEL SCORE BOARD</h2>
                    {matchWinner && (
                        <div className="text-light bg-success fw-bold fs-2 mt-1">
                            🏆 Match Winner: {matchWinner === 'teamA' ? 'Team A' : 'Team B'}
                        </div>
                    )}
                    {tiebreakActive && !matchWinner && (
                        <div className="text-warning fs-5 mt-1">Tiebreaker Activated</div>
                    )}
                </div>

                <div className="col-auto" />
            </div>

            {/* Set Labels */}
            {renderSetLabels(setWinners)}

            {/* Team A */}
            <div className="row py-3 align-items-center">
                <div className="col-12 col-md-3 text-start">
                    <div className="fs-1 fw-bold">{teamA.players?.[0] || 'Player 1'}</div>
                    <div className="fs-1 fw-bold">{teamA.players?.[1] || 'Player 2'}</div>
                </div>
                <div className="col d-flex">{renderSetScores(teamA)}</div>
                <div className="col-auto text-end">
                    <div className="border border-light px-3 py-1 bg-white text-dark fs-1 fw-bold rounded">
                        {teamA.points ?? 0}
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
                        {teamB.points ?? 0}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Scoreboard
