// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './assets/global.css'; // <-- Import global styles here
import 'aos/dist/aos.css';
import AOS from 'aos';

AOS.init({ duration: 600, easing: 'ease-out-cubic', once: true });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);