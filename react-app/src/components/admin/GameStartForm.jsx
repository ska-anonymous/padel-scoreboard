import React, { useState } from 'react'

const GameStartForm = ({ onSubmit }) => {
    const [teamA, setTeamA] = useState(['Player 1', 'Player 2'])
    const [teamB, setTeamB] = useState(['Player 3', 'Player 4'])
    const [gameMode, setGameMode] = useState('regular') // 'regular' | 'points'
    const [playStyle, setPlayStyle] = useState('advantage') // 'advantage' | 'golden'
    const [setsToWin, setSetsToWin] = useState('best_of_3')
    const [tiebreaker, setTiebreaker] = useState(true) // <--- NEW: user toggle (regular mode only)
    const [timerEnabled, setTimerEnabled] = useState(false)
    const [timerMinutes, setTimerMinutes] = useState('60')
    const [targetPoints, setTargetPoints] = useState('21')

    const handleSubmit = (e) => {
        e.preventDefault()

        onSubmit({
            teamA,
            teamB,
            // engine config
            gameMode,                            // 'regular' | 'points'
            goldenPoint: playStyle === 'golden', // map playStyle to engine boolean
            tiebreaker,                          // true: TB at 6–6, false: single deciding game
            setsToWin,                           // '1' | '3' | 'best_of_3' | 'best_of_5' | 'unlimited'
            // timer
            timerEnabled,
            timerMinutes: timerEnabled ? parseInt(timerMinutes, 10) : null,
            // points mode
            targetPoints: gameMode === 'points' ? parseInt(targetPoints, 10) : null,
        })
    }

    const isRegular = gameMode === 'regular'

    return (
        <form onSubmit={handleSubmit} className="text-white">
            <h2 className="mb-4">Start New Game</h2>

            {/* Teams */}
            <div className="row mb-3">
                <div className="col">
                    <label className="form-label">Team A - Player 1</label>
                    <input
                        className="form-control"
                        value={teamA[0]}
                        onChange={(e) => setTeamA([e.target.value, teamA[1]])}
                        required
                    />
                </div>
                <div className="col">
                    <label className="form-label">Team A - Player 2</label>
                    <input
                        className="form-control"
                        value={teamA[1]}
                        onChange={(e) => setTeamA([teamA[0], e.target.value])}
                        required
                    />
                </div>
            </div>

            <div className="row mb-3">
                <div className="col">
                    <label className="form-label">Team B - Player 1</label>
                    <input
                        className="form-control"
                        value={teamB[0]}
                        onChange={(e) => setTeamB([e.target.value, teamB[1]])}
                        required
                    />
                </div>
                <div className="col">
                    <label className="form-label">Team B - Player 2</label>
                    <input
                        className="form-control"
                        value={teamB[1]}
                        onChange={(e) => setTeamB([teamB[0], e.target.value])}
                        required
                    />
                </div>
            </div>

            {/* Mode */}
            <div className="mb-3">
                <label className="form-label">Game Mode</label>
                <select
                    className="form-select"
                    value={gameMode}
                    onChange={(e) => setGameMode(e.target.value)}
                >
                    <option value="regular">Regular (Sets)</option>
                    <option value="points">Points Game (First to X)</option>
                </select>
            </div>

            {gameMode === 'points' && (
                <div className="mb-3">
                    <label className="form-label">Target Points</label>
                    <input
                        type="number"
                        className="form-control"
                        value={targetPoints}
                        onChange={(e) => setTargetPoints(e.target.value)}
                        min={1}
                    />
                </div>
            )}

            {/* Play Style */}
            <div className="mb-3">
                <label className="form-label">Play Style</label>
                <select
                    className="form-select"
                    value={playStyle}
                    onChange={(e) => setPlayStyle(e.target.value)}
                >
                    <option value="advantage">Advantage</option>
                    <option value="golden">Golden Point</option>
                </select>
            </div>

            {/* Regular-mode only settings */}
            {isRegular && (
                <>
                    <div className="mb-3">
                        <label className="form-label">Sets to Win</label>
                        <select
                            className="form-select"
                            value={setsToWin}
                            onChange={(e) => setSetsToWin(e.target.value)}
                        >
                            <option value="1">1</option>
                            <option value="3">3</option>
                            <option value="best_of_3">Best of 3</option>
                            <option value="best_of_5">Best of 5</option>
                            <option value="unlimited">Unlimited</option>
                        </select>
                    </div>

                    {/* NEW: Tie-break at 6–6 */}
                    <div className="form-check form-switch mb-2">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="tiebreakerSwitch"
                            checked={tiebreaker}
                            onChange={() => setTiebreaker(!tiebreaker)}
                        />
                        <label className="form-check-label" htmlFor="tiebreakerSwitch">
                            Tie‑break at 6–6
                        </label>
                    </div>
                    <div className="form-text text-light mb-3">
                        {tiebreaker
                            ? 'At 6-6, play a tie-break to 7 (win by 2).'
                            : 'At 6-6, play a single deciding game (winner takes the set).'}
                    </div>
                </>
            )}

            {/* Timer */}
            <div className="form-check form-switch mb-3">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="timerSwitch"
                    checked={timerEnabled}
                    onChange={() => setTimerEnabled(!timerEnabled)}
                />
                <label className="form-check-label" htmlFor="timerSwitch">
                    Enable Timer
                </label>
            </div>

            {timerEnabled && (
                <div className="mb-3">
                    <label className="form-label">Timer Duration (minutes)</label>
                    <input
                        type="number"
                        className="form-control"
                        value={timerMinutes}
                        onChange={(e) => setTimerMinutes(e.target.value)}
                        min={1}
                    />
                </div>
            )}

            <button type="submit" className="btn btn-primary">Start Game</button>
        </form>
    )
}

export default GameStartForm
