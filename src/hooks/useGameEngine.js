import { useSelector, useDispatch } from 'react-redux'
import {
    incrementScore,
    decrementScore,
    resetGame,
    startGame,
    setPlayers,
    setGameConfig,
    resetScore
} from '../features/game/gameSlice'

export const useGameEngine = () => {
    const dispatch = useDispatch()
    const gameState = useSelector((state) => state.game)

    const increment = (team) => dispatch(incrementScore(team))
    const decrement = (team) => dispatch(decrementScore(team))
    const reset = () => dispatch(resetGame())
    const start = () => dispatch(startGame())
    const resetGameScore = () => dispatch(resetScore())
    const setPlayerNames = (teamA, teamB) => dispatch(setPlayers({ teamA, teamB }))
    const updateConfig = (config) => dispatch(setGameConfig(config))

    return {
        ...gameState,
        increment,
        decrement,
        reset,
        start,
        setPlayerNames,
        updateConfig,
        resetGameScore
    }
}
