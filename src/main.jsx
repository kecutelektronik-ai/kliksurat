import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SuratProvider } from './context/SuratContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SuratProvider>
      <App />
    </SuratProvider>
  </React.StrictMode>,
);
