import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { api } from '@/api';

interface AdminPageProps {
  onNavigate: (page: string) => void;
}

type Tab = 'enrollments' | 'reviews' | 'users';

interface Enrollment {
  id: number;
  user_name: string;
  user_email: string;
  user_phone: string;
  course_title: string;
  message: string;
  status: string;
  schedule: string | null;
  created_at: string;
}

interface Review {
  id: number;
  user_name: string;
  course_title: string;
  text: string;
  rating: number;
  approved: boolean;
  created_at: string;
}

interface UserRow {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  created_at: string;
}

export default function AdminPage({ onNavigate }: AdminPageProps) {
  const [key, setKey] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [tab, setTab] = useState<Tab>('enrollments');
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scheduleEdit, setScheduleEdit] = useState<Record<number, string>>({});

  const login = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.admin.getEnrollments(keyInput);
      if (res.error === 'Forbidden') {
        setError('Неверный ключ администратора');
      } else {
        setKey(keyInput);
        setEnrollments(res);
      }
    } catch {
      setError('Ошибка соединения');
    }
    setLoading(false);
  };

  const loadTab = async (t: Tab) => {
    setTab(t);
    setLoading(true);
    try {
      if (t === 'enrollments') {
        const res = await api.admin.getEnrollments(key);
        setEnrollments(res);
      } else if (t === 'reviews') {
        const res = await api.admin.getReviews(key);
        setReviews(res);
      } else {
        const res = await api.admin.getUsers(key);
        setUsers(res);
      }
    } catch { /* ignore */ }
    setLoading(false);
  };

  const [savingSchedule, setSavingSchedule] = useState<Record<number, boolean>>({});

  const approveEnrollment = async (id: number) => {
    const schedule = scheduleEdit[id] || '';
    await api.admin.updateEnrollment(key, id, 'approved', schedule);
    setEnrollments(prev => prev.map(e => e.id === id ? { ...e, status: 'approved', schedule } : e));
  };

  const rejectEnrollment = async (id: number) => {
    await api.admin.updateEnrollment(key, id, 'rejected', '');
    setEnrollments(prev => prev.map(e => e.id === id ? { ...e, status: 'rejected' } : e));
  };

  const saveSchedule = async (id: number, currentStatus: string) => {
    setSavingSchedule(prev => ({ ...prev, [id]: true }));
    const schedule = scheduleEdit[id] ?? '';
    await api.admin.updateEnrollment(key, id, currentStatus, schedule);
    setEnrollments(prev => prev.map(e => e.id === id ? { ...e, schedule } : e));
    setSavingSchedule(prev => ({ ...prev, [id]: false }));
  };

  const approveReview = async (id: number) => {
    await api.admin.approveReview(key, id);
    setReviews(prev => prev.map(r => r.id === id ? { ...r, approved: true } : r));
  };

  const rejectReview = async (id: number) => {
    await api.admin.rejectReview(key, id);
    setReviews(prev => prev.map(r => r.id === id ? { ...r, approved: false } : r));
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      approved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      rejected: 'bg-red-500/15 text-red-400 border-red-500/30',
    };
    const labels: Record<string, string> = { pending: 'Ожидает', approved: 'Принята', rejected: 'Отклонена' };
    return (
      <span className={`px-2.5 py-1 rounded-full border text-xs font-golos ${map[status] || map.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  if (!key) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-4">
              <Icon name="Shield" size={24} className="text-gold" />
            </div>
            <h1 className="font-playfair text-3xl font-light text-foreground">Панель администратора</h1>
            <p className="text-muted-foreground font-golos text-sm mt-2">Академия кино Монпарнас</p>
          </div>
          <div className="card-glass rounded-2xl p-6 space-y-4">
            <div>
              <label className="block text-xs font-golos text-muted-foreground mb-1.5">Ключ доступа</label>
              <input
                type="password"
                value={keyInput}
                onChange={e => setKeyInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && login()}
                placeholder="••••••••••••"
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 font-golos text-sm text-foreground focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30"
              />
            </div>
            {error && (
              <p className="text-red-400 text-xs font-golos flex items-center gap-2">
                <Icon name="AlertCircle" size={13} /> {error}
              </p>
            )}
            <button
              onClick={login}
              disabled={loading}
              className="btn-gold w-full py-3 rounded-xl font-golos font-semibold text-sm flex items-center justify-center gap-2"
            >
              {loading ? <Icon name="Loader" size={14} className="animate-spin" /> : <Icon name="LogIn" size={14} />}
              Войти
            </button>
            <button onClick={() => onNavigate('home')} className="w-full text-center font-golos text-xs text-muted-foreground hover:text-gold transition-colors">
              ← На сайт
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: string; count?: number }[] = [
    { id: 'enrollments', label: 'Заявки', icon: 'ClipboardList', count: enrollments.filter(e => e.status === 'pending').length },
    { id: 'reviews', label: 'Отзывы', icon: 'MessageSquare', count: reviews.filter(r => !r.approved).length },
    { id: 'users', label: 'Пользователи', icon: 'Users' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-playfair text-3xl font-light text-foreground">Панель администратора</h1>
            <p className="text-muted-foreground font-golos text-sm mt-1">Академия кино Монпарнас</p>
          </div>
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors font-golos text-sm">
            <Icon name="ArrowLeft" size={14} /> На сайт
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => loadTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-golos text-sm transition-all ${
                tab === t.id ? 'bg-gold text-background font-semibold' : 'card-glass text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={t.icon} fallback="Circle" size={14} />
              {t.label}
              {t.count !== undefined && t.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${tab === t.id ? 'bg-background text-gold' : 'bg-gold/20 text-gold'}`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Icon name="Loader" size={32} className="text-gold animate-spin" />
          </div>
        ) : tab === 'enrollments' ? (
          <div className="space-y-4">
            {enrollments.length === 0 && (
              <div className="card-glass rounded-2xl p-10 text-center text-muted-foreground font-golos">Заявок пока нет</div>
            )}
            {enrollments.map(e => (
              <div key={e.id} className="card-glass rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-golos font-semibold text-foreground">{e.user_name}</h3>
                      {statusBadge(e.status)}
                    </div>
                    <p className="font-golos text-sm text-gold mb-1">{e.course_title}</p>
                    <div className="flex flex-wrap gap-4 text-xs font-golos text-muted-foreground">
                      <span className="flex items-center gap-1"><Icon name="Mail" size={11} />{e.user_email}</span>
                      <span className="flex items-center gap-1"><Icon name="Phone" size={11} />{e.user_phone}</span>
                    </div>
                    {e.message && <p className="font-golos text-sm text-muted-foreground mt-2 italic">«{e.message}»</p>}
                  </div>
                  <span className="text-xs text-muted-foreground font-golos flex-shrink-0">{new Date(e.created_at).toLocaleDateString('ru')}</span>
                </div>
                {e.status === 'pending' && (
                  <div className="border-t border-border pt-4 space-y-3">
                    <div>
                      <label className="block text-xs font-golos text-muted-foreground mb-1.5">Расписание для студента</label>
                      <input
                        type="text"
                        placeholder="Например: Вт, Чт 19:00–21:00, начало 1 апреля"
                        value={scheduleEdit[e.id] ?? ''}
                        onChange={ev => setScheduleEdit(prev => ({ ...prev, [e.id]: ev.target.value }))}
                        className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 font-golos text-sm text-foreground focus:outline-none focus:border-gold/50"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => approveEnrollment(e.id)}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all font-golos text-sm"
                      >
                        <Icon name="Check" size={14} /> Принять
                      </button>
                      <button
                        onClick={() => rejectEnrollment(e.id)}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all font-golos text-sm"
                      >
                        <Icon name="X" size={14} /> Отклонить
                      </button>
                    </div>
                  </div>
                )}
                {e.status === 'approved' && (
                  <div className="border-t border-border pt-4 space-y-3">
                    <div>
                      <label className="block text-xs font-golos text-muted-foreground mb-1.5 flex items-center gap-1.5">
                        <Icon name="Calendar" size={12} className="text-gold" /> Расписание занятий
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Введите или обновите расписание..."
                          value={scheduleEdit[e.id] ?? (e.schedule || '')}
                          onChange={ev => setScheduleEdit(prev => ({ ...prev, [e.id]: ev.target.value }))}
                          className="flex-1 bg-muted border border-border rounded-xl px-4 py-2.5 font-golos text-sm text-foreground focus:outline-none focus:border-gold/50"
                        />
                        <button
                          onClick={() => saveSchedule(e.id, e.status)}
                          disabled={savingSchedule[e.id]}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 transition-all font-golos text-sm flex-shrink-0"
                        >
                          {savingSchedule[e.id] ? <Icon name="Loader" size={13} className="animate-spin" /> : <Icon name="Save" size={13} />}
                          Сохранить
                        </button>
                      </div>
                      {e.schedule && (
                        <p className="font-golos text-xs text-emerald-400/70 flex items-center gap-1.5">
                          <Icon name="CheckCircle" size={11} /> Текущее: {e.schedule}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : tab === 'reviews' ? (
          <div className="space-y-4">
            {reviews.length === 0 && (
              <div className="card-glass rounded-2xl p-10 text-center text-muted-foreground font-golos">Отзывов пока нет</div>
            )}
            {reviews.map(r => (
              <div key={r.id} className="card-glass rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-golos font-semibold text-foreground">{r.user_name}</span>
                      <span className={`px-2.5 py-0.5 rounded-full border text-xs font-golos ${r.approved ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border-amber-500/30'}`}>
                        {r.approved ? 'Опубликован' : 'На модерации'}
                      </span>
                    </div>
                    <p className="font-golos text-xs text-gold mb-2">{r.course_title}</p>
                    <div className="flex gap-0.5 mb-2">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Icon key={i} name="Star" size={12} className="text-gold" />
                      ))}
                    </div>
                    <p className="font-golos text-sm text-muted-foreground">{r.text}</p>
                  </div>
                </div>
                <div className="flex gap-3 pt-3 border-t border-border">
                  {!r.approved && (
                    <button onClick={() => approveReview(r.id)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all font-golos text-sm">
                      <Icon name="Check" size={13} /> Опубликовать
                    </button>
                  )}
                  {r.approved && (
                    <button onClick={() => rejectReview(r.id)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all font-golos text-sm">
                      <Icon name="EyeOff" size={13} /> Скрыть
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {users.length === 0 && (
              <div className="card-glass rounded-2xl p-10 text-center text-muted-foreground font-golos">Пользователей пока нет</div>
            )}
            {users.map(u => (
              <div key={u.id} className="card-glass rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-playfair font-bold">
                  {u.name[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-golos font-semibold text-foreground">{u.name}</span>
                    {u.is_admin && <span className="px-2 py-0.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-golos">Администратор</span>}
                  </div>
                  <p className="font-golos text-xs text-muted-foreground">{u.email}</p>
                </div>
                <span className="font-golos text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString('ru')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}