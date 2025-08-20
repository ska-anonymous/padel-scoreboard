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
        setDeciderActive,
        advantage,
        elapsedSeconds,
        serving,
    } = gameState

    const {
        timerEnabled,
        timerMinutes,
        setsToWin,
        goldenPoint,
        tiebreaker,
        gameMode,
        targetPoints,
    } = gameConfig || {}

    const { label: timerLabel } = useTimerDisplay(elapsedSeconds, timerMinutes)

    // --- helpers ---------------------------------------------------------------

    const isServing = (teamKey, playerIdx) =>
        serving?.current?.team === teamKey && serving?.current?.idx === playerIdx

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

    const setCount = getSetCount(setsToWin, teamA, teamB, currentSet)

    const getSetWinners = (teamA, teamB, currentSet, totalSets) => {
        const winners = Array(totalSets).fill(null)
        for (let i = 0; i < totalSets; i++) {
            const a = teamA.games?.[i]
            const b = teamB.games?.[i]
            // only evaluate past (completed) sets
            if (i < currentSet && typeof a === 'number' && typeof b === 'number') {
                if (a > b) winners[i] = 'teamA'
                else if (b > a) winners[i] = 'teamB'
            }
        }
        return winners
    }

    const setWinners = getSetWinners(teamA, teamB, currentSet, setCount)

    // Format points:
    // - Tiebreak: show integers
    // - Regular: 0/15/30/40, Deuce handling, Advantage ("AD"), Golden Point banner
    const formatPoints = (teamKey) => {
        if (gameMode === 'points') return String(gameState[teamKey].points ?? 0)
        if (tiebreakActive) return String(gameState[teamKey].points ?? 0)

        const me = gameState[teamKey].points ?? 0
        const otherKey = teamKey === 'teamA' ? 'teamB' : 'teamA'
        const opp = gameState[otherKey].points ?? 0

        // Deuce territory
        if (me === 40 && opp === 40) {
            if (goldenPoint) return '40' // banner will show GOLDEN POINT
            if (advantage === teamKey) return 'AD'
            if (advantage && advantage !== teamKey) return '40'
            return '40' // plain deuce (no adv yet)
        }

        // Someone at 40 vs below 40 - still show the 0/15/30/40 value
        return String(me)
    }

    const showDeuce = () => {
        if (gameMode === 'points' || tiebreakActive) return false
        const a = teamA.points ?? 0
        const b = teamB.points ?? 0
        return a === 40 && b === 40
    }

    const totalTBPoints = (teamA.points ?? 0) + (teamB.points ?? 0)
    const shouldSwitchEndsNow =
        tiebreakActive && totalTBPoints > 0 && totalTBPoints % 6 === 0

    // --- sub-views -------------------------------------------------------------

    const renderSetLabels = (setWinners) => (
        <div className="row mb-2">
            <div className="col-12 col-md-3" />
            <div className="col d-flex justify-content-center">
                {Array.from({ length: setCount }, (_, index) => {
                    const isCurrent = index === currentSet
                    const winner = setWinners[index]
                    return (
                        <div key={index} className="col text-center">
                            {/* winner badge (for completed sets) */}
                            {winner && (
                                <div
                                    className="fw-bold"
                                    style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}
                                >
                                    <span className="bg-light p-1 rounded text-success">
                                        {winner === 'teamA' ? 'Team A' : 'Team B'}
                                    </span>
                                </div>
                            )}
                            {/* Set label */}
                            <div
                                className={`text-uppercase fs-set-label ${isCurrent ? 'text-warning' : 'text-secondary'
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
                    className={`col text-center fs-set-score ${isCurrent ? 'border border-3 border-warning rounded' : ''
                        }`}
                >
                    {team.games?.[index] ?? 0}
                </div>
            )
        })

    // --- render ----------------------------------------------------------------

    return (
        <div className="container-fluid text-white py-2 px-5">

            {/* Header */}
            <div className="row mb-3 justify-content-between align-items-center">
                <div className="col-auto fs-1">{timerEnabled ? timerLabel : '--:--'}</div>

                <div className="col text-center">
                    <h2 className="fs-title mb-0 text-warning">PADEL SCORE BOARD</h2>

                    {/* Mode / status banners */}
                    {matchWinner && (
                        <div className="text-light bg-success fs-winner mt-1 px-2 py-1 rounded">
                            🏆 Match Winner: {matchWinner === 'teamA' ? 'Team A' : 'Team B'}
                        </div>
                    )}

                    {!matchWinner && gameMode === 'points' && (
                        <div className="text-info bg-dark mt-1 px-2 py-1 rounded">
                            Points Game — First to {targetPoints ?? 21}
                        </div>
                    )}

                    {!matchWinner && tiebreakActive && (
                        <div className="text-warning bg-dark mt-1 px-2 py-1 rounded">
                            TIEBREAK ACTIVE — First to 7, win by 2
                            {shouldSwitchEndsNow && <span className="ms-2">(Switch Ends)</span>}
                        </div>
                    )}

                    {!matchWinner && !tiebreakActive && setDeciderActive && (
                        <div className="text-warning bg-dark mt-1 px-2 py-1 rounded">
                            SET DECIDER — Next game wins the set
                        </div>
                    )}

                    {!matchWinner && !tiebreakActive && showDeuce() && goldenPoint && (
                        <div className="text-danger bg-dark mt-1 px-2 py-1 rounded">
                            GOLDEN POINT — Next point wins the game
                        </div>
                    )}

                    {!matchWinner && !tiebreakActive && showDeuce() && !goldenPoint && advantage === null && (
                        <div className="text-warning bg-dark mt-1 px-2 py-1 rounded">
                            DEUCE
                        </div>
                    )}
                </div>

                {/* Best-of label (informative) */}
                <div className="col-auto text-end">
                    <div className="small text-secondary">
                        {setsToWin === 'best_of_3' && 'Best of 3'}
                        {setsToWin === 'best_of_5' && 'Best of 5'}
                        {setsToWin === '1' && '1 Set'}
                        {setsToWin === '3' && 'First to 3 Sets'}
                        {setsToWin === 'unlimited' && 'Unlimited Sets'}
                    </div>
                    {tiebreaker ? (
                        <div className="small text-secondary">6–6 → Tiebreak</div>
                    ) : (
                        <div className="small text-secondary">6–6 → Set Decider</div>
                    )}
                </div>
            </div>

            {/* Set Labels */}
            {renderSetLabels(setWinners)}

            {/* Team A Row */}
            <div className="row py-3 align-items-center">
                <div className="col-12 col-md-3 text-start">
                    <div className="fs-player-name">
                        {teamA.players?.[0] || 'Player 1'}
                        {isServing('teamA', 0) && <span className="me-1" aria-label="server">🎾</span>}
                    </div>
                    <div className="fs-player-name">
                        {teamA.players?.[1] || 'Player 2'}
                        {isServing('teamA', 1) && <span className="me-1" aria-label="server">🎾</span>}
                    </div>
                </div>

                <div className="col d-flex">{renderSetScores(teamA)}</div>

                <div className="col-auto text-end">
                    <div className="fs-points border border-light px-3 py-1 bg-white text-dark rounded">
                        {formatPoints('teamA')}
                    </div>
                    {/* subtle adv indicator for A */}
                    {!tiebreakActive && !goldenPoint && advantage === 'teamA' && (
                        <div className="small text-warning mt-1">Advantage</div>
                    )}
                </div>
            </div>

            {/* Divider */}
            <hr className="my-3 bg-warning" style={{ height: '5px' }} />

            {/* Team B Row */}
            <div className="row py-3 align-items-center">
                <div className="col-12 col-md-3 text-start">
                    <div className="fs-player-name">
                        {teamB.players?.[0] || 'Player 3'}
                        {isServing('teamB', 0) && <span className="me-1" aria-label="server">🎾</span>}
                    </div>
                    <div className="fs-player-name">
                        {teamB.players?.[1] || 'Player 4'}
                        {isServing('teamB', 1) && <span className="me-1" aria-label="server">🎾</span>}
                    </div>
                </div>

                <div className="col d-flex">{renderSetScores(teamB)}</div>

                <div className="col-auto text-end">
                    <div className="fs-points border border-light px-3 py-1 bg-white text-dark rounded">
                        {formatPoints('teamB')}
                    </div>
                    {/* subtle adv indicator for B */}
                    {!tiebreakActive && !goldenPoint && advantage === 'teamB' && (
                        <div className="small text-warning mt-1">Advantage</div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Scoreboard
