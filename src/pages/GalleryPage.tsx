import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Icon from '@/components/ui/icon'

type GalleryItem = {
  id: string
  type: 'photo' | 'video'
  category: 'Студенты' | 'Мастер-курсы' | 'Видео'
  title: string
  src: string
}

const studentImageFiles = [
  '1.jpg',
  '2.jpg',
  '3.jpg',
  '4.jpg',
  '5.jpg',
  '6.jpg',
  '7.jpg',
  '8.jpg',
  '9.jpg',
  '10.jpg',
  '11.jpg',
  '12.jpg',
  '13.jpg',
  '14.jpg',
  '15.jpg',
  '16.jpg',
  '17.jpg',
  '18.jpg',
  '19.jpg',
  '20.jpg',
  '21.jpg',
  '22.jpg',
  '23.jpg',
  '24.jpg',
  '25.jpg',
  '26.jpg',
  '27.jpg',
  '28.jpg',
  '29.jpg',
  '30.jpg',
  '31.jpg',
  '32.jpg',
  '33.jpg',
  '34.jpg',
  '35.jpg',
  '36.jpg',
  '37.jpg',
  '38.jpg',
  '39.jpg',
  '40.jpg',
  '41.jpg',
  '42.jpg',
  '43.jpg',
  '44.jpg',
  '45.jpg',
  '46.jpg',
  '47.jpg',
  '48.jpg',
  '49.jpg',
  '50.jpg',
  '51.jpg',
  '52.jpg',
  '53.jpg',
  '54.jpg',
  '55.jpg',
  '56.jpg',
  '57.jpg',
  '58.jpg',
  '59.jpg',
  '60.jpg',
  '61.jpg',
  '62.jpg',
  '63.jpg',
  '64.jpg',
  '65.jpg',
  '66.jpg',
  '68.jpg',
  '69.jpg',
]

const masterCourseImageFiles = [
  '70.jpg',
  '71.jpg',
  '72.jpg',
  '73.jpg',
  '74.jpg',
  '75.jpg',
  '76.jpg',
  '77.jpg',
  '78.jpg',
  '79.jpg',
  '80.jpg',
  '81.jpg',
  '82.jpg',
  '83.jpg',
  '84.jpg',
  '85.jpg',
  '86.jpg',
  '87.png',
  '88.png',
  '89.jpg',
  '90.jpg',
  '91.jpg',
  '92.jpg',
  '93.jpg',
  '94.jpg',
  '95.jpg',
  '96.jpg',
  '97.jpg',
  '98.jpg',
  '99.jpg',
  '100.jpg',
  '101.jpg',
  '102.jpg',
  '103.jpg',
  '104.jpg',
  '105.png',
  '106.png',
  '107.png',
  '108.png',
  '109.jpg',
  '110.jpg',
  '111.jpg',
  '112.jpg',
  '113.jpg',
  '114.jpg',
  '115.jpg',
  '116.jpg',
  '117.jpg',
  '118.jpg',
  '119.jpg',
  '120.jpg',
  '121.jpg',
  '122.jpg',
  '123.jpg',
  '124.jpg',
  '125.jpg',
  '126.jpg',
  '127.jpg',
  '128.jpg',
  '129.jpg',
  '130.jpg',
  '131.jpg',
  '132.jpg',
  '133.jpg',
  '134.jpg',
  '135.jpg',
  '136.jpg',
  '137.jpeg',
  '138.jpeg',
]

const galleryItems: GalleryItem[] = [
  ...studentImageFiles.map((file, index): GalleryItem => {
    const number = index + 1

    return {
      id: `student-${file}`,
      type: 'photo',
      category: 'Студенты',
      title: `Студенты — фото ${number}`,
      src: `/gallery/students/${file}`,
    }
  }),
  ...masterCourseImageFiles.map((file, index): GalleryItem => {
    const number = index + 1

    return {
      id: `master-course-${file}`,
      type: 'photo',
      category: 'Мастер-курсы',
      title: `Мастер-курсы — фото ${number}`,
      src: `/gallery/master-courses/${file}`,
    }
  }),
]

const galleryCategories = ['Все', 'Мастер-курсы', 'Студенты', 'Видео']

interface GalleryPageProps {
  onNavigate: (page: string) => void
}

export default function GalleryPage({ onNavigate }: GalleryPageProps) {
  const [activeCategory, setActiveCategory] = useState('Все')
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null)

  useEffect(() => {
    if (!lightbox) return

    const originalBodyOverflow = document.body.style.overflow
    const originalHtmlOverflow = document.documentElement.style.overflow

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightbox(null)
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalBodyOverflow
      document.documentElement.style.overflow = originalHtmlOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [lightbox])

  const filtered =
    activeCategory === 'Все'
      ? galleryItems
      : galleryItems.filter((g) => g.category === activeCategory)

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-6xl mx-auto py-24">
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
          <div className="grid grid-cols-1 px-4 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group bg-muted"
                onClick={() => setLightbox(item)}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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
        {lightbox &&
          createPortal(
            <div
              className="fixed inset-0 z-[9999] w-screen h-[100dvh] overflow-hidden bg-background/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6"
              onClick={() => setLightbox(null)}
              role="button"
              tabIndex={-1}
              aria-label="Закрыть просмотр фотографии"
            >
              <button
                type="button"
                aria-label="Закрыть просмотр"
                className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-10 h-10 rounded-full bg-muted/90 flex items-center justify-center text-foreground hover:text-gold transition-colors"
                onClick={() => setLightbox(null)}
              >
                <Icon name="X" size={18} />
              </button>

              <img
                src={lightbox.src}
                alt={lightbox.title}
                className="block max-w-[calc(100vw-1.5rem)] sm:max-w-[calc(100vw-3rem)] max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-3rem)] w-auto h-auto object-contain rounded-2xl shadow-2xl cursor-pointer"
              />
            </div>,
            document.body,
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
                  Montparnas
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
