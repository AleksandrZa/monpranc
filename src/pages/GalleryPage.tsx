import { useState } from 'react';
import Icon from '@/components/ui/icon';
import Footer from '@/components/Footer';

const HERO_IMG = 'https://cdn.poehali.dev/projects/f836a67a-a8be-4af0-8a66-d2f5ea2f50dd/files/7518d156-258b-4fc6-affa-7fb8a437df12.jpg';

const galleryItems = [
  { id: 1, type: 'photo', category: 'Академия', title: 'Занятия в академии', src: HERO_IMG, span: 'col-span-2 row-span-2' },
  { id: 2, type: 'photo', category: 'Студенты', title: 'Наши студенты', src: HERO_IMG, span: '' },
  { id: 3, type: 'photo', category: 'Мастер-курсы', title: 'Мастер-класс', src: HERO_IMG, span: '' },
  { id: 4, type: 'photo', category: 'Академия', title: 'Репетиция', src: HERO_IMG, span: '' },
  { id: 5, type: 'photo', category: 'Студенты', title: 'Творческая атмосфера', src: HERO_IMG, span: 'col-span-2' },
  { id: 6, type: 'video', category: 'Видео', title: 'О школе', src: HERO_IMG, span: '' },
  { id: 7, type: 'photo', category: 'Мастер-курсы', title: 'Работа с режиссёром', src: HERO_IMG, span: '' },
  { id: 8, type: 'photo', category: 'Академия', title: 'Сценическое движение', src: HERO_IMG, span: '' },
];

const galleryCategories = ['Все', 'Академия', 'Студенты', 'Мастер-курсы', 'Видео'];

interface GalleryPageProps {
  onNavigate: (page: string) => void;
}

export default function GalleryPage({ onNavigate }: GalleryPageProps) {
  const [activeCategory, setActiveCategory] = useState('Все');
  const [lightbox, setLightbox] = useState<string | null>(null);

  const filtered = activeCategory === 'Все' ? galleryItems : galleryItems.filter(g => g.category === activeCategory);

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-4">
          <span className="text-gold text-xs font-golos tracking-widest uppercase">Атмосфера</span>
        </div>
        <h1 className="font-playfair text-5xl md:text-7xl font-light text-center mb-4">
          Фото <span className="text-gradient-gold italic">&amp;</span> видео
        </h1>
        <p className="font-golos text-muted-foreground text-center max-w-xl mx-auto mb-12">
          Жизнь академии в снимках — занятия, мастер-классы, репетиции и наши студенты
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
                <span className="text-xs font-golos text-gold mb-1">{item.category}</span>
                <span className="font-playfair text-lg text-foreground">{item.title}</span>
              </div>
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-background/70 backdrop-blur flex items-center justify-center border border-gold/40">
                    <Icon name="Play" size={20} className="text-gold ml-1" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

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
      <Footer onNavigate={onNavigate} />
    </div>
  );
}