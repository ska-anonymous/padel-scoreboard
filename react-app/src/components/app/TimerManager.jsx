import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { store } from '../../store/store'
import { tickTimer } from '../../features/game/gameSlice'

const TimerManager = () => {
    const timerEnabled = useSelector((state) => state.game.gameConfig.timerEnabled)
    const gameStarted = useSelector((state) => state.game.gameStarted)

    useEffect(() => {
        if (!timerEnabled || !gameStarted) return

        const interval = setInterval(() => {
            store.dispatch(tickTimer())
        }, 1000)

        return () => clearInterval(interval)
    }, [timerEnabled, gameStarted])

    return null
}

export default TimerManager
