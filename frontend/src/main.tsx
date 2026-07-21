import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { NumberUtils } from './helpers/NumberUtils.ts';
import 'core-js/stable';
import 'regenerator-runtime/runtime';


NumberUtils.init();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
