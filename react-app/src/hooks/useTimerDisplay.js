import { useEffect, useState } from 'react'

const pad = (n) => n.toString().padStart(2, '0')

export const useTimerDisplay = (elapsedSeconds, timerMinutes) => {
    if (!timerMinutes) {
        return { label: '--:--', status: 'inactive' }
    }

    const totalSeconds = timerMinutes * 60
    const remaining = totalSeconds - elapsedSeconds
    const abs = Math.abs(remaining)
    const minutes = Math.floor(abs / 60)
    const seconds = abs % 60

    const label =
        remaining >= 0
            ? `${pad(minutes)}:${pad(seconds)}`
            : `+${pad(minutes)}:${pad(seconds)}`

    return {
        label,
        status: remaining >= 0 ? 'countdown' : 'overrun',
    }
}
