// src/providers/GameAnnouncerProvider.jsx
import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import useTTS from '../hooks/useTTS'

const formatTeamName = (team) => (team === 'teamA' ? 'Team A' : 'Team B')

// >>> ADDED: helpers to detect deuce and format point calls
const isRegularDeuce = (game) => {
    if (game.gameConfig?.gameMode === 'points') return false
    if (game.tiebreakActive) return false
    const a = game.teamA.points ?? 0
    const b = game.teamB.points ?? 0
    return a === 40 && b === 40
}

const sayScoreRegular = (a, b) => {
    const n = (v) => (v === 0 ? 'love' : String(v))
    return `${n(a)} ${n(b)}`
}

export default function GameAnnouncerProvider({ children }) {
    const game = useSelector((state) => state.game)
    const { speak } = useTTS()

    const prevSetsWonRef = useRef({ teamA: 0, teamB: 0 })
    // >>> ADDED: track previous game counts per set to call “Game Team X”
    const prevGamesRef = useRef({ set: 0, a: 0, b: 0 })
    // >>> ADDED: track transitions for deuce/adv/golden point/tiebreak/set-decider
    const prevDeuceRef = useRef(false)
    const prevAdvRef = useRef(null)
    const prevTBRef = useRef(false)
    const prevSetDeciderRef = useRef(false)

    // 🎾 Points / running score
    useEffect(() => {
        if (!game.gameStarted) return

        // Tiebreak score callouts
        if (game.tiebreakActive) {
            const a = game.teamA.points ?? 0
            const b = game.teamB.points ?? 0
            // >>> CHANGED: announce tiebreak-specific score
            speak(`Tiebreak, ${a} ${b}`)
            return
        }

        // Deuce/Advantage are handled by their own effect — avoid duplicate calls here
        if (isRegularDeuce(game)) return

        // Points game mode: simple integers
        if (game.gameConfig?.gameMode === 'points') {
            const a = game.teamA.points ?? 0
            const b = game.teamB.points ?? 0
            speak(`${a} ${b}`)
            return
        }

        // Regular (0/15/30/40)
        const a = game.teamA.points ?? 0
        const b = game.teamB.points ?? 0
        speak(sayScoreRegular(a, b))
    }, [game.gameStarted, game.tiebreakActive, game.gameConfig?.gameMode, game.teamA.points, game.teamB.points, speak])

    // 🅰️/🅱️ Advantage, Deuce & Golden Point announcements
    useEffect(() => {
        if (!game.gameStarted) return
        if (game.gameConfig?.gameMode === 'points') return
        if (game.tiebreakActive) return

        const nowDeuce = isRegularDeuce(game)
        const wasDeuce = prevDeuceRef.current
        const adv = game.advantage // 'teamA' | 'teamB' | null
        const prevAdv = prevAdvRef.current
        const golden = !!game.gameConfig?.goldenPoint

        // Entering deuce
        if (nowDeuce && !wasDeuce) {
            // >>> ADDED: golden point vs classic deuce
            if (golden) {
                speak('Golden point')
            } else {
                speak('Deuce')
            }
        }

        // Advantage changes (only meaningful outside golden point)
        if (nowDeuce && !golden) {
            if (adv === 'teamA' && prevAdv !== 'teamA') speak(`Advantage ${formatTeamName('teamA')}`)
            if (adv === 'teamB' && prevAdv !== 'teamB') speak(`Advantage ${formatTeamName('teamB')}`)
            if (adv === null && prevAdv && nowDeuce) speak('Back to deuce')
        }

        prevDeuceRef.current = nowDeuce
        prevAdvRef.current = adv
    }, [
        game.gameStarted,
        game.gameConfig?.gameMode,
        game.tiebreakActive,
        game.teamA.points,
        game.teamB.points,
        game.advantage,
        game.gameConfig?.goldenPoint,
        speak,
    ])

    // 🧮 Game winner (after each game inside a set)
    useEffect(() => {
        if (!game.gameStarted) return

        const set = game.currentSet
        const a = game.teamA.games?.[set] ?? 0
        const b = game.teamB.games?.[set] ?? 0

        const { set: prevSet, a: pa, b: pb } = prevGamesRef.current

        // If we moved to a new set, reset baseline for comparisons
        if (set !== prevSet) {
            prevGamesRef.current = { set, a, b }
            return
        }

        // Detect increment
        if (a > pa) {
            // >>> ADDED: announce game winner with set score context
            speak(`Game ${formatTeamName('teamA')}. ${a} ${b}`)
        } else if (b > pb) {
            speak(`Game ${formatTeamName('teamB')}. ${a} ${b}`)
        }

        prevGamesRef.current = { set, a, b }
    }, [game.gameStarted, game.currentSet, game.teamA.games, game.teamB.games, speak])

    // 🧵 Tiebreak start
    useEffect(() => {
        if (!game.gameStarted) return
        const wasTB = prevTBRef.current
        if (game.tiebreakActive && !wasTB) {
            // >>> ADDED: announce start of tiebreak
            speak('Tiebreak. First to seven, win by two')
        }
        prevTBRef.current = game.tiebreakActive
    }, [game.gameStarted, game.tiebreakActive, speak])

    // ⚖️ Set decider (6–6 with no tiebreaker)
    useEffect(() => {
        if (!game.gameStarted) return
        const was = prevSetDeciderRef.current
        if (game.setDeciderActive && !was) {
            // >>> ADDED: announce set decider
            speak('Set decider. Next game wins the set')
        }
        prevSetDeciderRef.current = game.setDeciderActive
    }, [game.gameStarted, game.setDeciderActive, speak])

    // 🏆 Match winner
    useEffect(() => {
        if (game.gameStarted && game.matchWinner) {
            speak(`Match winner is ${formatTeamName(game.matchWinner)}`)
        }
    }, [game.gameStarted, game.matchWinner, speak])

    // 🧱 Set winner (uncommented + refined)
    useEffect(() => {
        const prev = prevSetsWonRef.current
        const current = {
            teamA: game.teamA.setsWon,
            teamB: game.teamB.setsWon,
        }

        if (game.gameStarted) {
            if (current.teamA > prev.teamA) {
                const setNumber = prev.teamA + prev.teamB + 1
                // >>> CHANGED: clearer set call
                speak(`Set ${setNumber} won by ${formatTeamName('teamA')}`)
            } else if (current.teamB > prev.teamB) {
                const setNumber = prev.teamA + prev.teamB + 1
                speak(`Set ${setNumber} won by ${formatTeamName('teamB')}`)
            }
        }

        prevSetsWonRef.current = current
    }, [game.gameStarted, game.teamA.setsWon, game.teamB.setsWon, speak])

    // >>> ADDED: keep prevGamesRef in sync if game state is hydrated/reset externally
    useEffect(() => {
        prevGamesRef.current = {
            set: game.currentSet,
            a: game.teamA.games?.[game.currentSet] ?? 0,
            b: game.teamB.games?.[game.currentSet] ?? 0,
        }
        prevDeuceRef.current = isRegularDeuce(game)
        prevAdvRef.current = game.advantage
        prevTBRef.current = !!game.tiebreakActive
        prevSetDeciderRef.current = !!game.setDeciderActive
    }, [game.hydratedAt /* optional: add a timestamp in hydrateGame if you have it */])

    return children
}
