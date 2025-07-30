// File: src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import PlateContainer from './components/PlateContainer';
import './index.css'; // Ensure this exists and contains global styles

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <PlateContainer />
    </React.StrictMode>
  );
} else {
  console.error('Root element not found.');
}
