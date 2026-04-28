import { useState } from 'react'
import Icon from '@/components/ui/icon'
import Footer from '@/components/Footer'

interface CoursesPageProps {
  onNavigate: (page: string) => void
}

const courses = [
  {
    id: 1,
    category: 'base',
    title: 'Базовый курс актёрского мастерства',
    level: 'Начинающий',
    desc: 'Фундамент актёрской профессии: речь, пластика, работа с образом. Подходит для тех, кто впервые приходит в мир театра и кино.',
    includes: [
      'Сценическая речь',
      'Пластика и движение',
      'Работа с партнёром',
      'Основы образа',
    ],
    icon: 'BookOpen',
  },
  {
    id: 2,
    category: 'advanced',
    title: 'Продвинутый курс актёрского мастерства',
    level: 'Продвинутый',
    desc: 'Углублённое изучение техники актёрской игры. Работа над ролью, анализ текста, создание сложных образов.',
    includes: [
      'Анализ роли',
      'Работа с текстом',
      'Кинопробы',
      'Психофизика актёра',
    ],
    icon: 'TrendingUp',
  },
  {
    id: 3,
    category: 'kids',
    title: 'Школа Юного Актёра',
    level: 'Дети и подростки',
    desc: 'Специальная программа для детей от 6 лет. Развитие творческого потенциала, уверенности, коммуникации через игру и театр.',
    includes: [
      'Театральные игры',
      'Сценическая речь',
      'Танец и пластика',
      'Выступления на публике',
    ],
    icon: 'Star',
  },
  {
    id: 4,
    category: 'master',
    title: 'Мастер-курс Родиона Овчинникова',
    level: 'Профессионал',
    desc: 'Авторский курс от ведущего педагога МХАТ. Глубокая работа над природой актёрского действия и психофизическим аппаратом.',
    includes: [
      'Метод физических действий',
      'Работа с подсознанием',
      'Этюды',
      'Разбор спектаклей',
    ],
    icon: 'Award',
  },
  {
    id: 5,
    category: 'master',
    title: '«Актёрский интенсив» по методу Ли Страсберга',
    level: 'Профессионал',
    desc: 'Голливудский метод — техника аффективной памяти и эмоциональной памяти в действии. Метод использовали Аль Пачино, Де Ниро, Мерил Стрип.',
    includes: [
      'Аффективная память',
      'Чувственная память',
      'Работа с воображением',
      'Этюды по методу',
    ],
    icon: 'Film',
  },
  {
    id: 6,
    category: 'master',
    title: 'Авторский тренинг Александра Рапопорта',
    level: 'Профессионал',
    desc: 'Уникальный синтез психологии, пластики и актёрской техники. Педагог ВТУ им. Щукина раскрывает скрытые ресурсы актёра.',
    includes: [
      'Психология образа',
      'Телесно-ориентированный подход',
      'Импровизация',
      'Режиссёрский взгляд',
    ],
    icon: 'Lightbulb',
  },
  {
    id: 7,
    category: 'base',
    title: 'Подготовка в театральные ВУЗы',
    level: 'Абитуриенты',
    desc: 'Целевая подготовка к поступлению в МХАТ, Щукинское, ВГИК, ГИТИС. Отбор репертуара, работа с комиссией, психологическая подготовка.',
    includes: [
      'Программа для ВУЗа',
      'Отбор репертуара',
      'Репетиции туров',
      'Психологическая подготовка',
    ],
    icon: 'GraduationCap',
  },
  {
    id: 8,
    category: 'master',
    title: 'Мастер-курс Данилы Дунаева',
    level: 'Профессионал',
    desc: 'Работа с известным режиссёром и педагогом ВГИК. Погружение в кинопрофессию изнутри — от пробы до съёмочной площадки.',
    includes: [
      'Работа в кадре',
      'Крупный план',
      'Работа с режиссёром',
      'Кинопробы',
    ],
    icon: 'Video',
  },
  {
    id: 9,
    category: 'master',
    title: 'Звёздный мастер-класс',
    level: 'Все уровни',
    desc: 'Разовые встречи с ведущими актёрами, режиссёрами и деятелями киноиндустрии. Уникальная возможность пообщаться с профессионалами.',
    includes: [
      'Лекция от мастера',
      'Открытый разбор',
      'Q&A сессия',
      'Нетворкинг',
    ],
    icon: 'Sparkles',
  },
]

const categories = [
  { id: 'all', label: 'Все курсы' },
  { id: 'base', label: 'Базовые' },
  { id: 'advanced', label: 'Продвинутые' },
  { id: 'master', label: 'Мастер-курсы' },
  { id: 'kids', label: 'Детская школа' },
]

const levelColors: Record<string, string> = {
  Начинающий: 'text-emerald-400 border-emerald-400/30',
  Продвинутый: 'text-blue-400 border-blue-400/30',
  Профессионал: 'text-gold border-gold/30',
  'Дети и подростки': 'text-pink-400 border-pink-400/30',
  Абитуриенты: 'text-purple-400 border-purple-400/30',
  'Все уровни': 'text-white/60 border-white/20',
}

export default function CoursesPage({ onNavigate }: CoursesPageProps) {
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered =
    activeCategory === 'all'
      ? courses
      : courses.filter((c) => c.category === activeCategory)

  return (
    <div className="pt-24">
      {/* HEADER */}
      <section className="py-16 px-6 text-center">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-8 bg-gold/40" />
          <span className="text-gold/60 text-[10px] tracking-[0.4em] uppercase font-golos">
            Обучение
          </span>
          <div className="h-px w-8 bg-gold/40" />
        </div>
        <h1 className="font-playfair text-5xl md:text-6xl font-bold text-foreground mb-4">
          Наши <span className="italic text-gradient-gold">курсы</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto font-golos">
          9 программ для любого уровня подготовки — от первых шагов на сцене до
          работы в кино.
        </p>
      </section>

      {/* ФИЛЬТРЫ */}
      <div className="flex flex-wrap justify-center gap-3 px-6 mb-14">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-2 rounded-full font-golos text-sm transition-all duration-300 ${
              activeCategory === cat.id ? 'btn-gold' : 'btn-outline-gold'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* КУРСЫ */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((course) => (
          <div
            key={course.id}
            className="card-glass card-glow rounded-2xl border border-gold/10 p-7 flex flex-col transition-all duration-500 group hover:border-gold/25"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-background transition-all duration-300">
                <Icon name={course.icon} size={18} />
              </div>
              <span
                className={`text-xs rounded-full border px-3 py-1 font-golos ${levelColors[course.level]}`}
              >
                {course.level}
              </span>
            </div>

            <h3 className="font-playfair text-xl font-semibold text-foreground mb-3 leading-snug flex-grow-0">
              {course.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-golos flex-grow">
              {course.desc}
            </p>

            <div className="mb-6">
              <div className="text-[9px] tracking-[0.25em] uppercase text-gold/50 font-golos mb-3">
                В программе
              </div>
              <ul className="space-y-1.5">
                {course.includes.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-muted-foreground font-golos"
                  >
                    <div className="w-1 h-1 bg-gold/50 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => onNavigate('enroll')}
              className="btn-outline-gold w-full py-3 rounded-full font-golos text-sm font-medium"
            >
              Записаться
            </button>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-20 px-6 pb-20">
        <p className="text-muted-foreground/60 text-sm font-golos mb-6 italic">
          Не знаете, какой курс выбрать? Свяжитесь с нами — поможем разобраться.
        </p>
        <a
          href="tel:+79153279755"
          className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors font-golos text-sm tracking-wider"
        >
          <Icon name="Phone" size={15} />
          +7 (915) 327-97-55
        </a>
      </div>
      <footer className="border-t border-border/50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-md shadow-gold/20">
                  <span className="text-background font-playfair font-bold text-lg leading-none">
                    М
                  </span>
                </div>
                <span className="font-playfair font-semibold text-xl tracking-widest text-foreground">
                  МОНПАРНАС
                </span>
              </div>
              <p className="text-muted-foreground text-sm font-golos leading-relaxed max-w-xs mb-5">
                Академия кино — авторские методики, педагоги ведущих театральных
                ВУЗов Москвы, 10+ лет опыта.
              </p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/40 transition-all"
                >
                  <Icon name="Instagram" size={16} />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/40 transition-all"
                >
                  <Icon name="Youtube" size={16} />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/40 transition-all"
                >
                  <Icon name="MessageCircle" size={16} />
                </a>
              </div>
            </div>

            {/* Курсы */}
            <div>
              <h4 className="font-golos font-semibold text-foreground text-sm mb-4 tracking-wider">
                Курсы
              </h4>
              <ul className="space-y-2.5 font-golos text-sm text-muted-foreground">
                {[
                  'Базовый курс',
                  'Продвинутый курс',
                  'Школа Юного Актёра',
                  'Мастер-курсы',
                  'Подготовка в ВУЗы',
                ].map((c) => (
                  <li key={c}>
                    <button
                      onClick={() => onNavigate('courses')}
                      className="hover:text-gold transition-colors text-left"
                    >
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Контакты */}
            <div>
              <h4 className="font-golos font-semibold text-foreground text-sm mb-4 tracking-wider">
                Контакты
              </h4>
              <ul className="space-y-3 font-golos text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Icon
                    name="MapPin"
                    size={14}
                    className="text-gold mt-0.5 shrink-0"
                  />
                  г. Москва, ул. Малая Лубянка, д. 16
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Phone" size={14} className="text-gold shrink-0" />
                  <a
                    href="tel:+79153279755"
                    className="hover:text-gold transition-colors"
                  >
                    +7 (915) 327-97-55
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Mail" size={14} className="text-gold shrink-0" />
                  <a
                    href="mailto:info@montparnas.ru"
                    className="hover:text-gold transition-colors"
                  >
                    info@montparnas.ru
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="section-divider mb-6" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-muted-foreground text-xs font-golos">
              © 2025 Академия кино Монпарнас. Все права защищены.
            </p>
            <div className="flex items-center gap-4">
              <p className="text-muted-foreground/50 text-xs font-golos">
                г. Москва · Малая Лубянка, 16
              </p>
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
  )
}
