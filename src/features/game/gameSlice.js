import { createSlice } from '@reduxjs/toolkit'
import { processPoint as runGameLogic, processDecrement as runDecrement } from '../../services/gameEngine'

const initialState = {
    teamA: {
        players: ['', ''],
        points: 0,
        games: [],
        setsWon: 0,
    },
    teamB: {
        players: ['', ''],
        points: 0,
        games: [],
        setsWon: 0,
    },
    currentSet: 0,
    advantage: null,
    tiebreakActive: false,
    matchWinner: null,
    gameStarted: false,
    scoreHistory: [],
    elapsedSeconds: 0,
    gameConfig: {
        setsToWin: 'best_of_3',
        goldenPoint: false,
        tiebreaker: true,
        timerEnabled: false,
        timerMinutes: null,
        gameMode: 'regular',
        targetPoints: 21
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
        startGame(state) {
            state.gameStarted = true
            state.elapsedSeconds = 0
        },
        resetGame(state) {
            Object.assign(state, initialState)
        },
        resetScore(state) {
            state.teamA.points = 0
            state.teamB.points = 0
            state.teamA.games = []
            state.teamB.games = []
            state.teamA.setsWon = 0
            state.teamB.setsWon = 0
            state.currentSet = 0
            state.advantage = null
            state.matchWinner = null
            state.tiebreakActive = false
            state.scoreHistory = []
            state.elapsedSeconds = 0
        },
        tickTimer(state) {
            if (state.gameStarted && state.gameConfig.timerEnabled) {
                state.elapsedSeconds += 1
            }
        },
        hydrateGame(state, action) {
            return { ...state, ...action.payload }
        },
        processPoint(state, action) {
            const team = action.payload
            runGameLogic(state, team)
        },
        processDecrement(state, action) {
            const team = action.payload
            runDecrement(state, team)
        }

    },
})

export const {
    setPlayers,
    setGameConfig,
    startGame,
    resetGame,
    resetScore,
    hydrateGame,
    tickTimer,
    processPoint,
    processDecrement,
} = gameSlice.actions

export default gameSlice.reducer
