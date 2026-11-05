import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AmbientBackground } from './layout/AmbientBackground';
import { AppShell } from './layout/AppShell';
import { HomePage } from './pages/HomePage';

// Halaman lain dimuat hanya saat dibuka (code-splitting per rute).
const page = <T extends string>(
  loader: () => Promise<Record<T, React.ComponentType>>,
  name: T,
) => lazy(() => loader().then((m) => ({ default: m[name] })));

const TasksPage = page(() => import('./pages/TasksPage'), 'TasksPage');
const CalendarPage = page(() => import('./pages/CalendarPage'), 'CalendarPage');
const ProfilePage = page(() => import('./pages/ProfilePage'), 'ProfilePage');
const SettingsPage = page(() => import('./pages/SettingsPage'), 'SettingsPage');
const LoginPage = page(() => import('./pages/LoginPage'), 'LoginPage');
const NotFoundPage = page(() => import('./pages/NotFoundPage'), 'NotFoundPage');

export default function App() {
  return (
    <>
      <AmbientBackground />
      <Suspense fallback={<p className="caption loading">Memuat...</p>}>
        <Routes>
          <Route path="/masuk" element={<LoginPage />} />
          <Route element={<AppShell />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/tugas" element={<TasksPage />} />
            <Route path="/kalender" element={<CalendarPage />} />
            <Route path="/profil" element={<ProfilePage />} />
            <Route path="/pengaturan" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
