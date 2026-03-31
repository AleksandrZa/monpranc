import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const HERO_IMG = 'https://cdn.poehali.dev/projects/f836a67a-a8be-4af0-8a66-d2f5ea2f50dd/files/7518d156-258b-4fc6-affa-7fb8a437df12.jpg';

const stats = [
  { value: '10+', label: 'лет опыта' },
  { value: '300+', label: 'выпускников' },
  { value: '9', label: 'программ обучения' },
  { value: '5', label: 'ведущих педагогов' },
];

const reasons = [
  { icon: 'ShieldCheck', title: 'Избавиться от зажимов', desc: 'Научитесь владеть голосом, телом и пространством — без страха и скованности.' },
  { icon: 'Mic', title: 'Публичные выступления', desc: 'Аудитория будет жадно ловить каждое ваше слово. Вы станете оратором.' },
  { icon: 'Film', title: 'Работа в кино', desc: 'Начните сниматься в кино и на телевидении — мы даём реальные инструменты.' },
  { icon: 'Users', title: 'Творческая среда', desc: 'Атмосфера профессионалов и единомышленников, которая вдохновляет каждый день.' },
  { icon: 'Star', title: 'Отточить мастерство', desc: 'Для профессионалов — углублённые курсы и уникальные мастер-классы.' },
  { icon: 'TrendingUp', title: 'Самореализация', desc: 'Раскройте таланты и получите дополнительные возможности в профессии.' },
];

const reviews = [
  {
    name: 'Мария Соколова',
    role: 'Базовый курс актёрского мастерства',
    text: 'Пришла совершенно зажатой, боялась даже говорить на публике. После трёх месяцев в Монпарнасе выступаю перед аудиторией без страха. Педагоги — настоящие профессионалы!',
    rating: 5,
    avatar: 'М',
  },
  {
    name: 'Дмитрий Волков',
    role: 'Мастер-курс Данилы Дунаева',
    text: 'Уникальный опыт работы с настоящим мастером кино. После курса получил первую роль в сериале. Рекомендую всем, кто серьёзно хочет работать в кино.',
    rating: 5,
    avatar: 'Д',
  },
  {
    name: 'Анна Кириллова',
    role: 'Школа Юного Актёра',
    text: 'Отдала дочь в Школу Юного Актёра — не узнаю ребёнка. Стала уверенной, раскованной, с удовольствием выступает на сцене. Спасибо команде Монпарнаса!',
    rating: 5,
    avatar: 'А',
  },
];

const galleryPreviews = [
  { src: HERO_IMG, title: 'Занятия в академии' },
  { src: HERO_IMG, title: 'Мастер-классы' },
  { src: HERO_IMG, title: 'Наши студенты' },
];

export default function HomePage({ onNavigate }: HomePageProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* HERO */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${HERO_IMG})`,
            transform: `translateY(${scrollY * 0.3}px)`,
            willChange: 'transform',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 20% 20%, rgba(123,79,166,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(212,168,83,0.1) 0%, transparent 60%)',
        }} />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/60" />
            <span className="text-gold text-xs font-golos tracking-widest uppercase">Академия кино · Москва</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/60" />
          </div>

          <h1 className="font-playfair text-6xl md:text-8xl font-light text-foreground leading-tight mb-6 opacity-0 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Академия кино<br />
            <span className="text-gradient-gold italic font-semibold">Монпарнас</span>
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 opacity-0 animate-fade-in font-golos" style={{ animationDelay: '0.65s' }}>
            Авторские методики педагогов МХАТ, Щукинского, ВГИК.<br />
            Интенсивная подготовка актёров для кино и телевидения.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in" style={{ animationDelay: '0.85s' }}>
            <button
              onClick={() => onNavigate('courses')}
              className="btn-gold px-10 py-4 rounded-full font-golos font-semibold text-sm"
            >
              Выбрать курс
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="btn-outline-gold px-10 py-4 rounded-full font-golos text-sm"
            >
              Об академии
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: '1.3s' }}>
          <div className="w-6 h-10 rounded-full border border-gold/30 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-gold/60 animate-bounce" />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 border-y border-border/50">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-playfair text-4xl md:text-5xl font-light text-gradient-gold mb-1">{s.value}</div>
              <div className="text-muted-foreground text-xs font-golos tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ДЛЯ КОГО */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-gold text-xs font-golos tracking-widest uppercase">Для кого</span>
            <h2 className="font-playfair text-4xl md:text-5xl font-light text-foreground mt-3 mb-4">
              Академия открыта для всех,<br />
              <span className="text-gradient-gold italic">кто готов меняться</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto font-golos">
              Наша программа ориентирована не только на профессионалов —
              здесь каждый найдёт путь к себе.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reasons.map((r, i) => (
              <div key={i} className="card-glass card-glow rounded-2xl p-7 transition-all duration-500 group">
                <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mb-5 group-hover:bg-gold group-hover:text-background transition-all duration-300">
                  <Icon name={r.icon} size={20} />
                </div>
                <h3 className="font-playfair text-xl font-medium text-foreground mb-2">{r.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-golos">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ГАЛЕРЕЯ — превью */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-gold text-xs font-golos tracking-widest uppercase">Атмосфера</span>
              <h2 className="font-playfair text-3xl md:text-4xl font-light text-foreground mt-2">
                Жизнь <span className="text-gradient-gold italic">академии</span>
              </h2>
            </div>
            <button
              onClick={() => onNavigate('gallery')}
              className="btn-outline-gold px-6 py-2.5 rounded-full font-golos text-sm hidden md:flex items-center gap-2"
            >
              Все фото <Icon name="ArrowRight" size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {galleryPreviews.map((item, i) => (
              <div
                key={i}
                className={`relative rounded-2xl overflow-hidden cursor-pointer group ${i === 0 ? 'md:row-span-2 h-64 md:h-auto' : 'h-44'}`}
                onClick={() => onNavigate('gallery')}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-5">
                  <span className="font-playfair text-foreground text-lg">{item.title}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center md:hidden">
            <button
              onClick={() => onNavigate('gallery')}
              className="btn-outline-gold px-8 py-3 rounded-full font-golos text-sm"
            >
              Смотреть все фото
            </button>
          </div>
        </div>
      </section>

      {/* ОТЗЫВЫ */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-gold text-xs font-golos tracking-widest uppercase">Отзывы</span>
            <h2 className="font-playfair text-4xl md:text-5xl font-light text-foreground mt-3">
              Говорят наши <span className="text-gradient-gold italic">студенты</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <div key={i} className="card-glass card-glow rounded-2xl p-7 flex flex-col">
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Icon key={j} name="Star" size={14} className="text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed font-golos flex-grow mb-6 italic">
                  «{r.text}»
                </p>
                <div className="flex items-center gap-3 pt-5 border-t border-border/50">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-background font-playfair font-bold">
                    {r.avatar}
                  </div>
                  <div>
                    <p className="font-golos font-semibold text-sm text-foreground">{r.name}</p>
                    <p className="font-golos text-xs text-gold">{r.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => onNavigate('reviews')}
              className="btn-outline-gold px-8 py-3.5 rounded-full font-golos text-sm inline-flex items-center gap-2"
            >
              Все отзывы и оставить свой <Icon name="ArrowRight" size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="card-glass rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5" style={{
              background: 'radial-gradient(ellipse at center, rgba(212,168,83,0.4) 0%, transparent 70%)',
            }} />
            <div className="relative z-10">
              <span className="text-gold text-xs font-golos tracking-widest uppercase mb-4 block">Первое занятие бесплатно</span>
              <h2 className="font-playfair text-4xl md:text-5xl font-light text-foreground mb-4">
                Готов начать своё<br />
                <span className="text-gradient-gold italic font-semibold">путешествие?</span>
              </h2>
              <p className="text-muted-foreground font-golos mb-10 max-w-lg mx-auto leading-relaxed text-lg">
                Первое занятие — бесплатно. Приходи и почувствуй атмосферу Монпарнаса.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => onNavigate('enroll')}
                  className="btn-gold px-10 py-4 rounded-full font-golos font-semibold text-sm"
                >
                  Записаться бесплатно
                </button>
                <a
                  href="tel:+79153279755"
                  className="btn-outline-gold px-10 py-4 rounded-full font-golos text-sm flex items-center justify-center gap-2"
                >
                  <Icon name="Phone" size={15} />
                  Позвонить нам
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-md shadow-gold/20">
                  <span className="text-background font-playfair font-bold text-lg leading-none">М</span>
                </div>
                <span className="font-playfair font-semibold text-xl tracking-widest text-foreground">МОНПАРНАС</span>
              </div>
              <p className="text-muted-foreground text-sm font-golos leading-relaxed max-w-xs mb-5">
                Академия кино — авторские методики, педагоги ведущих театральных ВУЗов Москвы, 10+ лет опыта.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/40 transition-all">
                  <Icon name="Instagram" size={16} />
                </a>
                <a href="#" className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/40 transition-all">
                  <Icon name="Youtube" size={16} />
                </a>
                <a href="#" className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/40 transition-all">
                  <Icon name="MessageCircle" size={16} />
                </a>
              </div>
            </div>

            {/* Курсы */}
            <div>
              <h4 className="font-golos font-semibold text-foreground text-sm mb-4 tracking-wider">Курсы</h4>
              <ul className="space-y-2.5 font-golos text-sm text-muted-foreground">
                {['Базовый курс', 'Продвинутый курс', 'Школа Юного Актёра', 'Мастер-курсы', 'Подготовка в ВУЗы'].map(c => (
                  <li key={c}>
                    <button onClick={() => onNavigate('courses')} className="hover:text-gold transition-colors text-left">{c}</button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Контакты */}
            <div>
              <h4 className="font-golos font-semibold text-foreground text-sm mb-4 tracking-wider">Контакты</h4>
              <ul className="space-y-3 font-golos text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Icon name="MapPin" size={14} className="text-gold mt-0.5 shrink-0" />
                  г. Москва, ул. Малая Лубянка, д. 16
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Phone" size={14} className="text-gold shrink-0" />
                  <a href="tel:+79153279755" className="hover:text-gold transition-colors">+7 (915) 327-97-55</a>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Mail" size={14} className="text-gold shrink-0" />
                  <a href="mailto:info@montparnas.ru" className="hover:text-gold transition-colors">info@montparnas.ru</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="section-divider mb-6" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-muted-foreground text-xs font-golos">© 2025 Академия кино Монпарнас. Все права защищены.</p>
            <div className="flex items-center gap-4">
              <p className="text-muted-foreground/50 text-xs font-golos">г. Москва · Малая Лубянка, 16</p>
              <button
                onClick={() => onNavigate('admin')}
                className="text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors text-xs font-golos"
              >
                Панель управления
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}