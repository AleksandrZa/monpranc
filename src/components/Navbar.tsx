import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isLoggedIn: boolean;
  isAdmin?: boolean;
}

const navItems = [
  { id: 'home', label: 'Главная' },
  { id: 'about', label: 'Об академии' },
  { id: 'courses', label: 'Курсы' },
  { id: 'gallery', label: 'Фото и видео' },
];

export default function Navbar({ currentPage, onNavigate, isLoggedIn, isAdmin }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-background/95 backdrop-blur-xl border-b border-border shadow-lg shadow-black/20' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-18 py-4">

        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 group"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-lg shadow-gold/30 group-hover:shadow-gold/50 transition-all duration-300">
            <span className="text-background font-playfair font-bold text-lg leading-none">М</span>
          </div>
          <span className="font-playfair font-semibold text-xl tracking-widest text-foreground group-hover:text-gold transition-all duration-300">
            МОНПАРНАС
          </span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative font-golos text-sm tracking-wide transition-all duration-300 ${
                currentPage === item.id
                  ? 'text-gold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
              {currentPage === item.id && (
                <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-gold to-gold-light" />
              )}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={() => onNavigate('admin')}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-gold/20 text-gold/70 hover:text-gold hover:bg-gold/10 transition-all duration-300 text-sm font-golos"
            >
              <Icon name="Shield" size={14} />
              Админ
            </button>
          )}
          {isLoggedIn ? (
            <button
              onClick={() => onNavigate('profile')}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 text-gold hover:bg-gold/10 transition-all duration-300 text-sm font-golos"
            >
              <Icon name="User" size={15} />
              Профиль
            </button>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="px-4 py-2 text-sm font-golos text-muted-foreground hover:text-foreground transition-colors"
            >
              Войти
            </button>
          )}
          <button
            onClick={() => onNavigate('enroll')}
            className="px-5 py-2 rounded-full btn-gold text-sm font-golos"
          >
            Записаться
          </button>
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Icon name={menuOpen ? 'X' : 'Menu'} size={22} />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-background/98 backdrop-blur-xl border-b border-border px-6 py-6 flex flex-col gap-4 animate-fade-in">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); setMenuOpen(false); }}
              className={`text-left font-golos text-base py-2 transition-colors ${
                currentPage === item.id ? 'text-gold' : 'text-foreground'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="section-divider my-2" />
          {isAdmin && (
            <button onClick={() => { onNavigate('admin'); setMenuOpen(false); }} className="text-left text-gold/70 font-golos flex items-center gap-2">
              <Icon name="Shield" size={14} /> Панель администратора
            </button>
          )}
          {isLoggedIn ? (
            <button onClick={() => { onNavigate('profile'); setMenuOpen(false); }} className="text-left text-gold font-golos">
              Профиль
            </button>
          ) : (
            <button onClick={() => { onNavigate('login'); setMenuOpen(false); }} className="text-left text-muted-foreground font-golos">Войти</button>
          )}
          <button onClick={() => { onNavigate('enroll'); setMenuOpen(false); }} className="btn-gold px-5 py-2.5 rounded-full text-sm w-full font-golos">Записаться</button>
        </div>
      )}
    </nav>
  );
}