import { useState } from 'react'
import Icon from '@/components/ui/icon'
import Footer from '@/components/Footer'

const HERO_IMG =
  'https://cdn.poehali.dev/projects/f836a67a-a8be-4af0-8a66-d2f5ea2f50dd/files/7518d156-258b-4fc6-affa-7fb8a437df12.jpg'

const galleryItems = [
  {
    id: 1,
    type: 'photo',
    category: 'Академия',
    title: 'Занятия в академии',
    src: HERO_IMG,
    span: 'col-span-2 row-span-2',
  },
  {
    id: 2,
    type: 'photo',
    category: 'Студенты',
    title: 'Наши студенты',
    src: HERO_IMG,
    span: '',
  },
  {
    id: 3,
    type: 'photo',
    category: 'Мастер-курсы',
    title: 'Мастер-класс',
    src: HERO_IMG,
    span: '',
  },
  {
    id: 4,
    type: 'photo',
    category: 'Академия',
    title: 'Репетиция',
    src: HERO_IMG,
    span: '',
  },
  {
    id: 5,
    type: 'photo',
    category: 'Студенты',
    title: 'Творческая атмосфера',
    src: HERO_IMG,
    span: 'col-span-2',
  },
  {
    id: 6,
    type: 'video',
    category: 'Видео',
    title: 'О школе',
    src: HERO_IMG,
    span: '',
  },
  {
    id: 7,
    type: 'photo',
    category: 'Мастер-курсы',
    title: 'Работа с режиссёром',
    src: HERO_IMG,
    span: '',
  },
  {
    id: 8,
    type: 'photo',
    category: 'Академия',
    title: 'Сценическое движение',
    src: HERO_IMG,
    span: '',
  },
]

const galleryCategories = ['Все', 'Мастер-курсы', 'Студенты', 'Видео']

interface GalleryPageProps {
  onNavigate: (page: string) => void
}

export default function GalleryPage({ onNavigate }: GalleryPageProps) {
  const [activeCategory, setActiveCategory] = useState('Все')
  const [lightbox, setLightbox] = useState<string | null>(null)

  const filtered =
    activeCategory === 'Все'
      ? galleryItems
      : galleryItems.filter((g) => g.category === activeCategory)

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto py-24">
        <div className="text-center mb-4">
          <span className="text-gold text-xs font-golos tracking-widest uppercase">
            Атмосфера
          </span>
        </div>
        <h1 className="font-playfair text-5xl md:text-7xl font-light text-center mb-4">
          Фото <span className="text-gradient-gold italic">&amp;</span> видео
        </h1>
        <p className="font-golos text-muted-foreground text-center max-w-xl mx-auto mb-12">
          Жизнь академии в снимках — занятия, мастер-классы, репетиции и наши
          студенты
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {galleryCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full font-golos text-sm transition-all duration-300 ${
                activeCategory === cat ? 'btn-gold' : 'btn-outline-gold'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        {activeCategory === 'Видео' ? (
          <div className="flex flex-col items-center justify-center py-24 px-6">
            <div className="w-24 h-24 rounded-full border border-gold/20 bg-gold/5 flex items-center justify-center mb-8">
              <Icon name="Film" size={36} className="text-gold/40" />
            </div>
            <h2 className="font-playfair text-3xl md:text-4xl font-light text-foreground mb-4 text-center">
              Видео скоро появятся
            </h2>
            <p className="font-golos text-muted-foreground text-center max-w-sm leading-relaxed">
              Мы готовим съёмки занятий, мастер-классов и выступлений наших
              студентов — следите за обновлениями
            </p>
            <div className="mt-10 flex items-center gap-2 text-gold/40 font-golos text-xs tracking-widest uppercase">
              <div className="w-8 h-px bg-gold/20" />
              скоро
              <div className="w-8 h-px bg-gold/20" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px]">
            {filtered.map((item) => (
              <div
                key={item.id}
                className={`relative rounded-2xl overflow-hidden cursor-pointer group ${item.span}`}
                onClick={() => setLightbox(item.src)}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <span className="text-xs font-golos text-gold mb-1">
                    {item.category}
                  </span>
                  <span className="font-playfair text-lg text-foreground">
                    {item.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {lightbox && (
          <div
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center p-6 animate-scale-in"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:text-gold transition-colors"
              onClick={() => setLightbox(null)}
            >
              <Icon name="X" size={18} />
            </button>
            <img
              src={lightbox}
              alt="Просмотр"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
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
