import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { saveGameState, loadGameState, clearGameState } from '../lib/persistence/gamePersistence'
import { hydrateGame } from '../features/game/gameSlice'
import { store } from '../store/store'

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

    // Save once on unload
    useEffect(() => {
        const handleUnload = () => {
            const currentGameState = store.getState().game
            saveGameState(currentGameState)
        }

        window.addEventListener('beforeunload', handleUnload)
        return () => window.removeEventListener('beforeunload', handleUnload)
    }, [])

    return children
}

export default GamePersistenceProvider
