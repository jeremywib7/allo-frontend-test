import React from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router';
import {RocketProvider} from './store.tsx';
import App from './App.tsx';
import './styles.css';
createRoot(document.getElementById('root')!).render(<BrowserRouter><RocketProvider><App/></RocketProvider></BrowserRouter>);
