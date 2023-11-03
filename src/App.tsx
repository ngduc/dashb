import nightwind from 'nightwind/helper';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/app/ProtectedRoute';
import AppHeader from './components/AppHeader';
import './App.css';
import MainPage from './pages/MainPage';
import MorePage from './pages/MorePage';
import { TermsPage } from './pages/TermsPage';

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
          <Route path="/more" element={<MorePage />} />
          <Route path="/terms-of-service" element={<TermsPage />} />

          <Route path="profile" element={<ProtectedRoute>Protected Profile</ProtectedRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};
