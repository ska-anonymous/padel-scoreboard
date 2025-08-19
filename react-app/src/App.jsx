import React from 'react'
import AppRouter from './routes/AppRouter'
import WebSocketProvider from './providers/WebSocketProvider'
import TimerManager from './components/app/TimerManager'
import GameAnnouncerProvider from './providers/GameAnnouncerProvider'

const App = () => {
  return (
    <WebSocketProvider>
      <TimerManager />
      <GameAnnouncerProvider>
        <AppRouter />
      </GameAnnouncerProvider>
    </WebSocketProvider>
  )
}

export default App
