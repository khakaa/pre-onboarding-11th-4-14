import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SickProvider } from './api/SickContext';
import { httpClient } from './api/HttpClient';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
const HttpClient = new httpClient();

root.render(
  // <React.StrictMode>
  <SickProvider httpClient={HttpClient}>
    <App />
  </SickProvider>,
  // </React.StrictMode>,
);
