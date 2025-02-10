import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './utils/pwaInstall';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Enregistrement du service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/serviceWorker.js', {
        scope: '/'
      })
      .then(registration => {
        console.log('SW registered:', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed:', registrationError);
      });
  });
}