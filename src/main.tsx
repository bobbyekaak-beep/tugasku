import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-700.css';
import '@fontsource/inter/latin-800.css';
import App from './App';
import { AppProvider } from './context/AppContext';
import { TaskProvider } from './context/TaskContext';
import './styles/variables.css';
import './styles/global.css';
import './styles/components.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <TaskProvider>
          <App />
        </TaskProvider>
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
);

// PWA: daftarkan service worker hanya pada hasil build (bukan server pengembangan).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .catch((err) => console.error('Service worker gagal didaftarkan', err));
  });
}
