const STORAGE_KEY = 'padel-game-state'

export const saveGameState = (state) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (e) {
        console.warn('[Persistence] Failed to save game state', e)
    }
}

export const loadGameState = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY)
        return data ? JSON.parse(data) : null
    } catch {
        return null
    }
}

export const clearGameState = () => {
    try {
        localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
        console.warn('[Persistence] Failed to clear game state', e)
    }
}
