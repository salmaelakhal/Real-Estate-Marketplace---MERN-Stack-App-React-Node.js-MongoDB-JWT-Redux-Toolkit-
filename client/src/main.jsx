import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { store } from './redux/store.js'
import { Provider } from 'react-redux'// Corrected import for Provider



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
       <App />
    </Provider>
   
  </StrictMode>,
)



