import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'

import { store } from '@store/store'
import Layout from '@components/Layout'
import './index.css'

const persistor = persistStore(store)

ReactDOM.createRoot(document.getElementById('root') as HTMLDivElement).render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        <PersistGate persistor={persistor}>
          <Layout />
        </PersistGate>
      </BrowserRouter>
    </React.StrictMode>
  </Provider>
)
