// gameSlice.js
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
    setDeciderActive: false,   // <-- NEW (for "no tiebreaker" format)
    matchWinner: null,
    gameStarted: false,
    elapsedSeconds: 0,
    gameConfig: {
        setsToWin: 'best_of_3',  // '1' | '3' | 'best_of_3' | 'best_of_5' | 'unlimited'
        goldenPoint: false,      // If true, deuce is sudden-death
        tiebreaker: true,        // If false, 6–6 triggers a single deciding game
        timerEnabled: false,
        timerMinutes: null,
        gameMode: 'regular',     // 'regular' | 'points'
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
            state.setDeciderActive = false     // <-- ensure cleared
            state.scoreHistory = []            // (harmless if you still use it elsewhere)
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
