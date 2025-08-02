import ttsService from "./ttsService"

const POINT_SEQUENCE = [0, 15, 30, 40]
const POINTS_MODE_DEFAULT_TARGET = 21

export function processPoint(state, team) {
    const opponent = team === 'teamA' ? 'teamB' : 'teamA'
    const config = state.gameConfig

    if (state.matchWinner) return

    const teamPoints = state[team].points
    const opponentPoints = state[opponent].points

    // === POINTS GAME MODE ===
    if (config.gameMode === 'points') {
        const target = config.targetPoints || 21
        state[team].points += 1
        if (state[team].points >= target) {
            state.matchWinner = team
        }
        return
    }

    // === TIEBREAK MODE ===
    if (state.tiebreakActive) {
        state[team].points += 1
        const tp = state[team].points
        const op = state[opponent].points
        if (tp >= 7 && tp - op >= 2) {
            winSet(state, team)
        }
        return
    }

    // === REGULAR GAME SCORING ===
    if (teamPoints === 40 && opponentPoints === 40) {
        if (config.goldenPoint) {
            winGame(state, team)
        } else {
            if (state.advantage === team) {
                winGame(state, team)
            } else if (state.advantage === opponent) {
                state.advantage = null
            } else {
                state.advantage = team
            }
        }
        return
    }

    if (teamPoints === 40 && opponentPoints < 40) {
        winGame(state, team)
        return
    }

    const nextPoint = nextPointAfter(teamPoints)
    if (nextPoint !== null) {
        state[team].points = nextPoint
    }
}

function nextPointAfter(current) {
    const POINT_SEQUENCE = [0, 15, 30, 40]
    const idx = POINT_SEQUENCE.indexOf(current)
    return idx >= 0 && idx < POINT_SEQUENCE.length - 1
        ? POINT_SEQUENCE[idx + 1]
        : null
}


function winGame(state, team) {
    const opponent = team === 'teamA' ? 'teamB' : 'teamA'
    const currentSet = state.currentSet

    state[team].games[currentSet] = (state[team].games[currentSet] || 0) + 1
    state.teamA.points = 0
    state.teamB.points = 0
    state.advantage = null

    const tg = state[team].games[currentSet]
    const og = state[opponent].games[currentSet]

    // 6–6 case
    if (tg === 6 && og === 6) {
        if (state.gameConfig.tiebreaker) {
            state.tiebreakActive = true
        } else {
            winSet(state, team) // Golden game mode
        }
        return
    }

    if (tg >= 6 && tg - og >= 2) {
        winSet(state, team)
    }
}

function winSet(state, team) {
    const setsNeeded = setsToWin(state.gameConfig.setsToWin)

    state[team].setsWon += 1
    state.currentSet += 1
    state.teamA.games.push(0)
    state.teamB.games.push(0)
    state.teamA.points = 0
    state.teamB.points = 0
    state.advantage = null
    state.tiebreakActive = false

    if (state[team].setsWon >= setsNeeded) {
        state.matchWinner = team
    }
}

function setsToWin(val) {
    switch (val) {
        case '1': return 1
        case '3': return 3
        case 'best_of_3': return 2
        case 'best_of_5': return 3
        case 'unlimited': return Infinity
        default: return 2
    }
}


export function processDecrement(state, team) {
    const opponent = team === 'teamA' ? 'teamB' : 'teamA'
    const config = state.gameConfig

    // Remove match winner if score corrected
    state.matchWinner = null

    // === POINTS GAME MODE ===
    if (config.gameMode === 'points') {
        state[team].points = Math.max(0, state[team].points - 1)
        return
    }

    // === TIEBREAK MODE ===
    if (state.tiebreakActive) {
        state[team].points = Math.max(0, state[team].points - 1)
        return
    }

    // === ADVANTAGE CASE ===
    if (state.advantage === team) {
        state.advantage = null
        return
    }

    if (state.advantage === opponent) {
        state.advantage = team
        return
    }

    const teamPoints = state[team].points

    // === REGULAR POINT DECREMENT ===
    const prevPoint = prevPointBefore(teamPoints)
    if (prevPoint !== null) {
        state[team].points = prevPoint
    }
}



function prevPointBefore(current) {
    const POINT_SEQUENCE = [0, 15, 30, 40]
    const idx = POINT_SEQUENCE.indexOf(current)
    return idx > 0 ? POINT_SEQUENCE[idx - 1] : 0
}
