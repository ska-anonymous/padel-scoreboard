import { useSelector, useDispatch } from 'react-redux'
import {
    processPoint,
    processDecrement,
    resetGame,
    startGame,
    setPlayers,
    setGameConfig,
    resetScore,
} from '../features/game/gameSlice'

export const useGame = () => {
    const dispatch = useDispatch()
    const gameState = useSelector((state) => state.game)

    // New point handler
    const increment = (team) => dispatch(processPoint(team))
    const decrement = (team) => dispatch(processDecrement(team))

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
        resetGameScore,
    }
}
