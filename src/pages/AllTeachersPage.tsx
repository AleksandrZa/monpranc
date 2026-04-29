import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import Footer from '@/components/Footer';
import { api } from '@/api';
import TeacherAvatar from '@/components/teachers/TeacherAvatar';
import { fallbackTeachers, TeacherRecord } from '@/data/teachers';

interface AllTeachersPageProps {
  onNavigate: (page: string) => void;
}

export default function AllTeachersPage({ onNavigate }: AllTeachersPageProps) {
  const [teachers, setTeachers] = useState<TeacherRecord[]>(fallbackTeachers);

  useEffect(() => {
    let mounted = true;
    api.getTeachers()
      .then((rows) => {
        if (mounted && Array.isArray(rows) && rows.length > 0) setTeachers(rows);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="pt-24">
      <div className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => onNavigate('about')}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors font-golos text-sm mb-10"
          >
            <Icon name="ArrowLeft" size={14} /> Об академии
          </button>

          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-4 mb-5">
              <div className="h-px w-8 bg-gold/40" />
              <span className="text-gold/60 text-[10px] tracking-[0.4em] uppercase font-golos">МХАТ · Щукина · ВГИК · ГИТИС · Вахтангова</span>
              <div className="h-px w-8 bg-gold/40" />
            </div>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground">
              Наши <span className="italic text-gradient-gold">педагоги</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {teachers.map((t) => (
              <button
                key={t.id}
                onClick={() => onNavigate(`teacher:${t.id}`)}
                className="card-glass card-glow rounded-2xl p-6 text-left group hover:border-gold/30 transition-all duration-500 border border-gold/10"
              >
                <div className="flex items-center gap-4 mb-4">
                  <TeacherAvatar teacher={t} className="w-12 h-12 flex-shrink-0 group-hover:border-gold/60 transition-all duration-300" />
                  <h3 className="font-playfair text-base font-semibold text-foreground leading-tight">{t.name}</h3>
                </div>
                <p className="font-golos text-xs text-gold/80 mb-3 leading-relaxed">{t.short_role || t.role}</p>
                <div className="flex items-center gap-1 text-gold/40 group-hover:text-gold transition-colors text-xs font-golos">
                  Подробнее <Icon name="ArrowRight" size={12} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
