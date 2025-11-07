import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';

// Impor CSS
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap dulu
import './App.css'; // <-- CSS Kustom kita (HARUS SETELAH Bootstrap)

import { AuthProvider } from './context/AuthContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Pindahkan BrowserRouter ke sini */}
    <BrowserRouter> 
      <AuthProvider> {/* <-- Bungkus App */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)