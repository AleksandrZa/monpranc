import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { api } from '@/api';
import type { User } from '@/App';

interface ProfilePageProps {
  user: User;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  onUpdateUser: (user: User) => void;
}

interface Enrollment {
  id: number;
  course_title: string;
  status: string;
  schedule: string | null;
  created_at: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Заявка отправлена', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  approved: { label: 'Заявка принята', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  rejected: { label: 'Заявка отклонена', color: 'text-red-400 bg-red-500/10 border-red-500/30' },
};

export default function ProfilePage({ user, onLogout, onNavigate, onUpdateUser }: ProfilePageProps) {
  const [avatar, setAvatar] = useState<string | undefined>(user.avatar);
  const [editName, setEditName] = useState(user.name);
  const [editMode, setEditMode] = useState(false);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user.id) {
      api.getEnrollments(user.id).then(data => {
        if (Array.isArray(data)) setEnrollments(data);
        setLoadingEnrollments(false);
      }).catch(() => setLoadingEnrollments(false));
    }
  }, [user.id]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      setAvatar(src);
      onUpdateUser({ ...user, avatar: src });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveName = () => {
    setEditMode(false);
    onUpdateUser({ ...user, name: editName, avatar });
  };

  const statusInfo = (status: string) => STATUS_LABELS[status] || STATUS_LABELS.pending;

  return (
    <div className="min-h-screen pt-28 pb-24 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Header card */}
        <div className="card-glass rounded-3xl p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div
                className="w-24 h-24 rounded-full overflow-hidden cursor-pointer border-2 border-gold/40 hover:border-gold/70 transition-all group relative"
                onClick={() => fileRef.current?.click()}
              >
                {avatar ? (
                  <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-background font-playfair font-bold text-3xl">
                    {editName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Icon name="Camera" size={20} className="text-white" />
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-background" />
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                {editMode ? (
                  <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    onBlur={handleSaveName}
                    onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                    autoFocus
                    className="font-playfair text-2xl font-light bg-transparent border-b border-gold/50 focus:outline-none text-foreground"
                  />
                ) : (
                  <h1 className="font-playfair text-2xl font-light text-foreground">{editName}</h1>
                )}
                <button
                  onClick={() => editMode ? handleSaveName() : setEditMode(true)}
                  className="text-muted-foreground hover:text-gold transition-colors flex-shrink-0"
                >
                  <Icon name={editMode ? 'Check' : 'Pencil'} size={14} />
                </button>
              </div>
              <p className="font-golos text-sm text-muted-foreground mb-3">{user.email}</p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-golos">Студент академии</span>
                {enrollments.filter(e => e.status === 'approved').length > 0 && (
                  <span className="px-3 py-1 rounded-full bg-violet/10 border border-violet/20 text-violet-300 text-xs font-golos">
                    {enrollments.filter(e => e.status === 'approved').length} активных курса
                  </span>
                )}
              </div>
              <p className="text-muted-foreground text-xs font-golos mt-3">Нажми на фото, чтобы загрузить своё</p>
            </div>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all font-golos text-sm self-start"
            >
              <Icon name="LogOut" size={14} />
              Выйти
            </button>
          </div>
        </div>

        {/* Courses */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-playfair text-2xl font-light text-foreground">Мои курсы</h2>
            <button
              onClick={() => onNavigate('enroll')}
              className="flex items-center gap-1.5 text-gold hover:text-gold-light transition-colors font-golos text-sm"
            >
              <Icon name="Plus" size={14} />
              Записаться
            </button>
          </div>

          {loadingEnrollments ? (
            <div className="flex justify-center py-12">
              <Icon name="Loader" size={28} className="text-gold animate-spin" />
            </div>
          ) : enrollments.length === 0 ? (
            <div className="card-glass rounded-2xl p-10 text-center">
              <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-4">
                <Icon name="BookOpen" size={24} className="text-gold/50" />
              </div>
              <h3 className="font-playfair text-xl font-light text-foreground mb-2">Вы пока не записаны</h3>
              <p className="text-muted-foreground font-golos text-sm mb-6">Выберите курс и отправьте заявку — мы свяжемся с вами</p>
              <button
                onClick={() => onNavigate('courses')}
                className="btn-gold px-8 py-3 rounded-full font-golos font-semibold text-sm"
              >
                Выбрать курс
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {enrollments.map(e => {
                const st = statusInfo(e.status);
                return (
                  <div key={e.id} className="card-glass rounded-2xl p-6 relative overflow-hidden">
                    <div className={`absolute top-0 left-0 right-0 h-0.5 ${e.status === 'approved' ? 'bg-gradient-to-r from-gold/50 to-transparent' : e.status === 'rejected' ? 'bg-gradient-to-r from-red-500/30 to-transparent' : 'bg-gradient-to-r from-amber-500/30 to-transparent'}`} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-golos font-semibold text-foreground mb-2">{e.course_title}</h3>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-golos ${st.color}`}>
                        <Icon name={e.status === 'approved' ? 'CheckCircle' : e.status === 'rejected' ? 'XCircle' : 'Clock'} size={11} fallback="Circle" />
                        {st.label}
                      </span>
                      {e.schedule ? (
                        <div className="flex items-start gap-2 mt-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                          <Icon name="Calendar" size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-golos text-xs text-emerald-400/70 mb-0.5">Расписание занятий</p>
                            <p className="font-golos text-sm text-emerald-300">{e.schedule}</p>
                          </div>
                        </div>
                      ) : e.status === 'approved' ? (
                        <div className="flex items-start gap-2 mt-3 p-3 rounded-xl bg-gold/5 border border-gold/15">
                          <Icon name="Clock" size={14} className="text-gold/60 mt-0.5 flex-shrink-0" />
                          <p className="font-golos text-xs text-muted-foreground">Расписание занятий скоро появится</p>
                        </div>
                      ) : e.status === 'pending' ? (
                        <p className="font-golos text-xs text-muted-foreground mt-3">
                          Мы рассматриваем вашу заявку и скоро свяжемся с вами
                        </p>
                      ) : null}
                    </div>
                  </div>
                );
              })}

              <button
                onClick={() => onNavigate('enroll')}
                className="w-full card-glass rounded-2xl p-5 border-2 border-dashed border-border hover:border-gold/30 transition-all flex items-center justify-center gap-2 text-muted-foreground hover:text-gold font-golos text-sm"
              >
                <Icon name="Plus" size={16} />
                Записаться ещё на один курс
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}