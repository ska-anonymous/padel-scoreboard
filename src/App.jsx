import React from 'react'
import AppRouter from './routes/AppRouter'
import WebSocketProvider from './providers/WebSocketProvider'

const App = () => {
  return (
    <WebSocketProvider>
      <AppRouter />
    </WebSocketProvider>
  )
}

export default App
