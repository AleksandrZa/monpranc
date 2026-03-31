import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { api } from '@/api';

interface AuthPageProps {
  onLogin: (user: { name: string; email: string }, mode: 'login' | 'register') => void;
  onNavigate: (page: string) => void;
}

export default function AuthPage({ onLogin, onNavigate }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      if (!form.name.trim()) return setError('Введите имя');
      if (form.password.length < 6) return setError('Пароль минимум 6 символов');
      if (form.password !== form.confirm) return setError('Пароли не совпадают');
    }

    if (!form.email.includes('@')) return setError('Введите корректный email');
    if (!form.password) return setError('Введите пароль');

    setLoading(true);
    try {
      let result;
      if (mode === 'register') {
        result = await api.register(form.name, form.email, form.password);
      } else {
        result = await api.login(form.email, form.password);
      }
      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
      onLogin({ id: result.id, name: result.name, email: result.email, is_admin: result.is_admin }, mode);
    } catch {
      setError('Ошибка соединения. Попробуйте ещё раз.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 pb-10 px-6">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-violet/8 blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-56 h-56 rounded-full bg-gold/6 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <button onClick={() => onNavigate('home')} className="inline-flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-lg shadow-gold/30 group-hover:shadow-gold/50 transition-all duration-300">
              <span className="text-background font-playfair font-bold text-2xl leading-none">М</span>
            </div>
            <span className="font-playfair text-lg tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
              МОНПАРНАС
            </span>
          </button>
        </div>

        {/* Card */}
        <div className="card-glass rounded-3xl p-8 animate-scale-in">

          {/* Toggle */}
          <div className="flex rounded-xl bg-muted p-1 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-lg font-golos text-sm transition-all duration-300 ${
                mode === 'login' ? 'bg-gold text-background font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Войти
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 rounded-lg font-golos text-sm transition-all duration-300 ${
                mode === 'register' ? 'bg-gold text-background font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Регистрация
            </button>
          </div>

          <h2 className="font-playfair text-3xl font-light mb-1 text-foreground">
            {mode === 'login' ? 'Добро пожаловать' : 'Создать аккаунт'}
          </h2>
          <p className="text-muted-foreground text-sm font-golos mb-6">
            {mode === 'login' ? 'Войдите в личный кабинет' : 'Станьте частью академии'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-golos text-muted-foreground mb-1.5">Имя</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ваше имя"
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 font-golos text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-golos text-muted-foreground mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 font-golos text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-golos text-muted-foreground mb-1.5">Пароль</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 pr-11 font-golos text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon name={showPass ? 'EyeOff' : 'Eye'} size={16} />
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-golos text-muted-foreground mb-1.5">Подтвердите пароль</label>
                <input
                  type="password"
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 font-golos text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
                />
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                <Icon name="AlertCircle" size={14} className="text-destructive shrink-0" />
                <span className="font-golos text-xs text-destructive">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-3.5 rounded-xl font-golos font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
            >
              {loading ? (
                <>
                  <Icon name="Loader" size={15} className="animate-spin" />
                  {mode === 'login' ? 'Входим...' : 'Создаём аккаунт...'}
                </>
              ) : (
                mode === 'login' ? 'Войти' : 'Создать аккаунт'
              )}
            </button>
          </form>

          {mode === 'login' && (
            <div className="mt-4 text-center">
              <button className="font-golos text-xs text-muted-foreground hover:text-gold transition-colors">
                Забыли пароль?
              </button>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="font-golos text-xs text-muted-foreground">
              {mode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
              <button
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-gold hover:text-gold-light transition-colors"
              >
                {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-muted-foreground/40 text-xs font-golos mt-6">
          г. Москва, ул. Малая Лубянка, дом 16 · info@montparnas.ru
        </p>
      </div>
    </div>
  );
}