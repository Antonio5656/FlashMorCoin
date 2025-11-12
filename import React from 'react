import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// 🔧 CONFIGURACIÓN AUTOMÁTICA GLOBAL
import autoConfigSystem from './utils/autoConfig.js'

// Polyfill para compatibilidad
window.global = window;
window.Buffer = window.Buffer || require('buffer').Buffer;

// 🚀 INICIALIZACIÓN AUTOMÁTICA AL CARGAR
autoConfigSystem.autoInitialize()
  .then(result => {
    console.log('🎯 Auto-configuration result:', result);
    
    // Renderizar la app
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  })
  .catch(error => {
    console.warn('Auto-init warning:', error);
    
    // Renderizar la app incluso si falla la auto-configuración
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  });