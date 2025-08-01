import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.jsx'
import { store } from './store/store'

import { Provider } from 'react-redux'
import GamePersistenceProvider from './providers/GamePersistenceProvider.jsx'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <GamePersistenceProvider>
      <App />
    </GamePersistenceProvider>
  </Provider>
)
