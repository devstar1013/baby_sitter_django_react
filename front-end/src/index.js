import React from 'react';
import ReactDOM from 'react-dom/client';

import App from '@components/App';

import './index.css';
import './styles/buttons.css';
import './styles/layouts.css';
import './styles/titles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
