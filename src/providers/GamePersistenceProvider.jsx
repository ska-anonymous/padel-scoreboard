import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { saveGameState, loadGameState, clearGameState } from '../lib/persistence/gamePersistence'
import { hydrateGame } from '../features/game/gameSlice'

const GamePersistenceProvider = ({ children }) => {
    const dispatch = useDispatch()
    const gameState = useSelector((state) => state.game)

    // Load persisted game on mount
    useEffect(() => {
        const saved = loadGameState()
        if (saved && saved.gameStarted) {
            dispatch(hydrateGame(saved))
        }
    }, [dispatch])

    // Save game state on every change
    useEffect(() => {
        if (gameState.gameStarted) {
            saveGameState(gameState)
        }
    }, [gameState])

    // Optional: auto-clear if game is reset
    useEffect(() => {
        if (!gameState.gameStarted) {
            clearGameState()
        }
    }, [gameState.gameStarted])

    return children
}

export default GamePersistenceProvider
