import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import useTTS from '../hooks/useTTS'

const formatTeamName = (team) => {
    return team === 'teamA' ? 'Team A' : 'Team B'
}

export default function GameAnnouncerProvider({ children }) {
    const game = useSelector(state => state.game)
    const { speak } = useTTS()

    const prevSetsWonRef = useRef({ teamA: 0, teamB: 0 })

    // 🎾 Point announcements
    useEffect(() => {
        if (game.gameStarted) {
            const teamAPoints = game.teamA.points
            const teamBPoints = game.teamB.points
            speak(`${teamAPoints === 0 ? 'love' : teamAPoints} ${teamBPoints === 0 ? 'love' : teamBPoints}`)
        }
    }, [game.teamA.points, game.teamB.points])

    // 🏆 Match winner
    useEffect(() => {
        if (game.gameStarted && game.matchWinner) {
            speak(`Match winner is ${formatTeamName(game.matchWinner)}`)
        }
    }, [game.matchWinner])

    // 📣 Set winner
    // useEffect(() => {
    //     const prev = prevSetsWonRef.current
    //     const current = {
    //         teamA: game.teamA.setsWon,
    //         teamB: game.teamB.setsWon
    //     }

    //     if (game.gameStarted) {
    //         if (current.teamA > prev.teamA) {
    //             const setNumber = prev.teamA + prev.teamB + 1
    //             speak(`set ${setNumber} won by ${formatTeamName('teamA')}`)
    //         } else if (current.teamB > prev.teamB) {
    //             const setNumber = prev.teamA + prev.teamB + 1
    //             speak(`set ${setNumber} won by ${formatTeamName('teamB')}`)
    //         }
    //     }

    //     prevSetsWonRef.current = current
    // }, [game.teamA.setsWon, game.teamB.setsWon])

    return children
}
