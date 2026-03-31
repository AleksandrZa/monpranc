import { useState } from 'react';
import Navbar from '@/components/Navbar';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import CoursesPage from '@/pages/CoursesPage';
import GalleryPage from '@/pages/GalleryPage';
import EnrollPage from '@/pages/EnrollPage';
import AuthPage from '@/pages/AuthPage';
import ProfilePage from '@/pages/ProfilePage';
import ReviewsPage from '@/pages/ReviewsPage';
import AdminPage from '@/pages/AdminPage';
import TeacherPage from '@/pages/TeacherPage';
import AllTeachersPage from '@/pages/AllTeachersPage';
import Icon from '@/components/ui/icon';

type Page = 'home' | 'about' | 'courses' | 'gallery' | 'enroll' | 'login' | 'profile' | 'reviews' | 'admin' | string;

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  is_admin?: boolean;
}

interface Toast {
  message: string;
  visible: boolean;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [teacherId, setTeacherId] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [toast, setToast] = useState<Toast>({ message: '', visible: false });

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 3500);
  };

  const handleNavigate = (page: string) => {
    if (page === 'profile' && !user) {
      setCurrentPage('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (page.startsWith('teacher:')) {
      setTeacherId(page.replace('teacher:', ''));
      setCurrentPage('teacher');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (userData: User, mode: 'login' | 'register') => {
    setUser(userData);
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      showToast(mode === 'login' ? `С возвращением, ${userData.name.split(' ')[0]}!` : `Добро пожаловать в академию, ${userData.name.split(' ')[0]}!`);
    }, 400);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  const handleUpdateUser = (updated: User) => {
    setUser(updated);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isLoggedIn={!!user}
        isAdmin={!!user?.is_admin}
      />
      <main key={currentPage + teacherId} className="animate-fade-in">
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}
        {currentPage === 'courses' && <CoursesPage onNavigate={handleNavigate} />}
        {currentPage === 'gallery' && <GalleryPage onNavigate={handleNavigate} />}
        {currentPage === 'enroll' && <EnrollPage user={user} onNavigate={handleNavigate} />}
        {currentPage === 'reviews' && <ReviewsPage onNavigate={handleNavigate} user={user} />}
        {currentPage === 'login' && (
          <AuthPage onLogin={handleLogin} onNavigate={handleNavigate} />
        )}
        {currentPage === 'profile' && user && (
          <ProfilePage user={user} onLogout={handleLogout} onNavigate={handleNavigate} onUpdateUser={handleUpdateUser} />
        )}
        {currentPage === 'admin' && (
          <AdminPage onNavigate={handleNavigate} />
        )}
        {currentPage === 'teacher' && (
          <TeacherPage teacherId={teacherId} onNavigate={handleNavigate} />
        )}
        {currentPage === 'all-teachers' && (
          <AllTeachersPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* Toast */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
          toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3 px-6 py-4 rounded-2xl card-glass border border-gold/30 shadow-xl shadow-gold/10">
          <div className="w-7 h-7 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center flex-shrink-0">
            <Icon name="Sparkles" size={14} className="text-gold" />
          </div>
          <span className="font-golos text-sm text-foreground">{toast.message}</span>
        </div>
      </div>
    </div>
  );
}