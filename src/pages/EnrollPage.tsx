import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { api } from '@/api';
import type { User } from '@/App';

const courses = [
  'Базовый курс актёрского мастерства',
  'Продвинутый курс актёрского мастерства',
  'Школа Юного Актёра',
  'Мастер-курс Родиона Овчинникова',
  '«Актёрский интенсив» по методу Ли Страсберга',
  'Авторский тренинг Александра Рапопорта',
  'Подготовка в театральные ВУЗы',
  'Мастер-курс Данилы Дунаева',
  'Звёздный мастер-класс',
];

interface EnrollPageProps {
  user?: User | null;
  onNavigate?: (page: string) => void;
}

export default function EnrollPage({ user, onNavigate }: EnrollPageProps) {
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: '',
    email: user?.email || '',
    course: '',
    message: ''
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.submitEnroll({
        user_id: user?.id,
        user_name: form.name,
        user_email: form.email,
        user_phone: form.phone,
        course_title: form.course || 'Не указан',
        message: form.message,
      });
      if (res.error) {
        setError(res.error);
      } else {
        setSent(true);
      }
    } catch {
      setError('Ошибка отправки. Попробуйте ещё раз.');
    }
    setLoading(false);
  };

  return (
    <div className="pt-24 pb-20">
      {/* HEADER */}
      <section className="py-16 px-6 text-center">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-8 bg-gold/40" />
          <span className="text-gold/60 text-[10px] tracking-[0.4em] uppercase font-golos">Запись</span>
          <div className="h-px w-8 bg-gold/40" />
        </div>
        <h1 className="font-playfair text-5xl md:text-6xl font-bold text-foreground mb-4">
          Записаться<br />
          <span className="italic text-gradient-gold">на курс</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto font-golos">
          Оставьте заявку — мы свяжемся с вами в течение рабочего дня и ответим на все вопросы.
        </p>
      </section>

      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12">
        {/* ФОРМА */}
        <div>
          {sent ? (
            <div className="border border-gold/30 p-10 text-center h-full flex flex-col items-center justify-center gap-6">
              <div className="w-16 h-16 border border-gold/40 flex items-center justify-center text-gold">
                <Icon name="CheckCircle" size={28} />
              </div>
              <div>
                <h3 className="font-playfair text-2xl font-bold text-foreground mb-3">Заявка отправлена</h3>
                <p className="text-muted-foreground font-golos text-sm leading-relaxed">
                  Мы получили вашу заявку и свяжемся с вами в ближайшее время.
                  Ждите звонка или письма на указанный email.
                </p>
              </div>
              <button
                onClick={() => setSent(false)}
                className="btn-outline-gold px-6 py-2.5 rounded-full font-golos text-sm"
              >
                Отправить ещё
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-golos block mb-2">
                  Ваше имя *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Иван Иванов"
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground font-golos text-sm focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-colors placeholder:text-muted-foreground/50"
                />
              </div>
              <div>
                <label className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-golos block mb-2">
                  Телефон *
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="+7 (___) ___-__-__"
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground font-golos text-sm focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-colors placeholder:text-muted-foreground/50"
                />
              </div>
              <div>
                <label className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-golos block mb-2">
                  Эл. почта
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="example@mail.ru"
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground font-golos text-sm focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-colors placeholder:text-muted-foreground/50"
                />
              </div>
              <div>
                <label className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-golos block mb-2">
                  Интересующий курс
                </label>
                <select
                  value={form.course}
                  onChange={e => setForm({ ...form, course: e.target.value })}
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground font-golos text-sm focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-colors"
                >
                  <option value="" className="bg-background text-muted-foreground">Выберите курс...</option>
                  {courses.map(c => (
                    <option key={c} value={c} className="bg-background">{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-golos block mb-2">
                  Комментарий
                </label>
                <textarea
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  rows={3}
                  placeholder="Расскажите о своём опыте и целях..."
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground font-golos text-sm focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-colors placeholder:text-muted-foreground/50 resize-none"
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                  <Icon name="AlertCircle" size={14} className="text-destructive shrink-0" />
                  <span className="font-golos text-xs text-destructive">{error}</span>
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="btn-gold w-full py-4 rounded-full font-golos font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? <><Icon name="Loader" size={15} className="animate-spin" /> Отправляем...</> : 'Отправить заявку'}
              </button>
              <p className="text-muted-foreground/40 text-[10px] font-golos text-center leading-relaxed">
                Нажимая кнопку, вы соглашаетесь на обработку персональных данных
              </p>
            </form>
          )}
        </div>

        {/* КОНТАКТЫ */}
        <div className="space-y-6">
          <div className="card-glass rounded-2xl p-7">
            <h3 className="font-playfair text-2xl font-bold text-foreground mb-6">Контакты</h3>
            <div className="space-y-5">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold flex-shrink-0">
                  <Icon name="MapPin" size={15} />
                </div>
                <div>
                  <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-golos mb-1">Адрес</div>
                  <div className="text-foreground text-sm font-golos">г. Москва, ул. Малая Лубянка, дом 16</div>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold flex-shrink-0">
                  <Icon name="Phone" size={15} />
                </div>
                <div>
                  <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-golos mb-1">Телефон</div>
                  <a href="tel:+79153279755" className="text-foreground text-sm font-golos hover:text-gold transition-colors">
                    +7 (915) 327-97-55
                  </a>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold flex-shrink-0">
                  <Icon name="Mail" size={15} />
                </div>
                <div>
                  <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-golos mb-1">Эл. почта</div>
                  <a href="mailto:info@montparnas.ru" className="text-foreground text-sm font-golos hover:text-gold transition-colors">
                    info@montparnas.ru
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="card-glass rounded-2xl p-7">
            <h3 className="font-playfair text-xl font-semibold text-foreground mb-5">Почему Монпарнас?</h3>
            <div className="space-y-4">
              {[
                { icon: 'GraduationCap', text: 'Педагоги МХАТ, Щукинского, ВГИК, ГИТИС' },
                { icon: 'Users', text: '300+ выпускников за 10+ лет работы' },
                { icon: 'Film', text: 'Реальные навыки для кино и телевидения' },
                { icon: 'Heart', text: 'Творческая атмосфера единомышленников' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <Icon name={item.icon} size={16} className="text-gold flex-shrink-0" />
                  <span className="text-muted-foreground text-sm font-golos">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gold/5 border border-gold/20 rounded-2xl p-6">
            <p className="text-muted-foreground text-sm font-golos italic leading-relaxed">
              «Мы верим, что каждый человек обладает актёрским даром.
              Наша задача — помочь его раскрыть»
            </p>
            <div className="text-gold/50 text-xs font-golos mt-3">— Команда Montparnas</div>
          </div>
        </div>
      </div>
    </div>
  );
}