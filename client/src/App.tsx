import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ToastProvider } from './components/Toast';
import ScrollToTop from './components/ScrollToTop';
import PageTransition from './components/PageTransition';
import Navbar from './components/Navbar';
import BackToTop from './components/BackToTop';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import GameDetail from './pages/GameDetail';
import Auth from './pages/Auth';
import UserProfile from './pages/UserProfile';
import News from './pages/News';
import Community from './pages/Community';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ScrollToTop />
          <Navbar />
          <PageTransition>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/games" element={<Catalog />} />
              <Route path="/games/:id" element={<GameDetail />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/user/:id" element={<UserProfile />} />
              <Route path="/news" element={<News />} />
              <Route path="/community" element={<Community />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageTransition>
          <BackToTop />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
