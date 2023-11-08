import nightwind from 'nightwind/helper';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import ProtectedRoute from './components/app/ProtectedRoute';
import AppHeader from './components/AppHeader';
import MainPage from './pages/MainPage';
import { Suspense, lazy } from 'react';
import './App.css';

const SettingPage = lazy(() => import('./pages/SettingPage'));
const MorePage = lazy(() => import('./pages/MorePage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));

const isDarkMode = (localStorage.getItem('nightwind-mode') ?? 'dark') === 'dark';
if (isDarkMode) {
  nightwind.enable(true);
}

export default () => {
  return (
    <BrowserRouter>
      <div className="bg-white text-black min-h-screen mb-[200px]">
        <AppHeader />

        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route
            path="/more"
            element={
              <Suspense fallback={<></>}>
                <MorePage />
              </Suspense>
            }
          />
          <Route
            path="/settings"
            element={
              <Suspense fallback={<></>}>
                <SettingPage />
              </Suspense>
            }
          />
          <Route
            path="/terms-of-service"
            element={
              <Suspense fallback={<></>}>
                <TermsPage />
              </Suspense>
            }
          />

          <Route path="profile" element={<ProtectedRoute>Protected Profile</ProtectedRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};
