import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    teamA: {
        players: ['', ''],
        score: 0,
        sets: [],
    },
    teamB: {
        players: ['', ''],
        score: 0,
        sets: [],
    },
    currentSet: 0,
    gameStarted: false,
    gameConfig: {
        setsToWin: 3,
        goldenPoint: false,
        timerEnabled: false,
        endTime: null,
    },
}

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setPlayers(state, action) {
            const { teamA, teamB } = action.payload
            state.teamA.players = teamA
            state.teamB.players = teamB
        },
        setGameConfig(state, action) {
            state.gameConfig = { ...state.gameConfig, ...action.payload }
        },
        incrementScore(state, action) {
            const team = action.payload
            state[team].score += 1
        },
        decrementScore(state, action) {
            const team = action.payload
            if (state[team].score > 0) state[team].score -= 1
        },
        resetGame(state) {
            Object.assign(state, initialState)
        },
        startGame(state) {
            state.gameStarted = true
        },
        resetScore(state) {
            state.teamA.score = 0
            state.teamB.score = 0
            state.teamA.sets = []
            state.teamB.sets = []
            state.currentSet = 0
        },
        hydrateGame(state, action) {
            return { ...state, ...action.payload }
        }
    },
})

export const {
    setPlayers,
    setGameConfig,
    incrementScore,
    decrementScore,
    resetGame,
    startGame,
    resetScore,
    hydrateGame
} = gameSlice.actions

export default gameSlice.reducer
