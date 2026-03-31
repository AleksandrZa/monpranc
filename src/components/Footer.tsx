import Icon from '@/components/ui/icon';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-black/40 border-t border-gold/10 pt-16 pb-8 px-6 mt-auto">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

          {/* Brand */}
          <div>
            <button onClick={() => onNavigate('home')} className="flex items-center gap-3 mb-5 group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-lg shadow-gold/30">
                <span className="text-background font-playfair font-bold text-lg leading-none">М</span>
              </div>
              <span className="font-playfair font-semibold text-xl tracking-widest text-foreground group-hover:text-gold transition-colors duration-300">
                МОНПАРНАС
              </span>
            </button>
            <p className="text-muted-foreground text-sm font-golos leading-relaxed max-w-xs">
              Академия кино — актёрское мастерство, режиссура, школа юного актёра и мастер-курсы с ведущими представителями киноиндустрии.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-foreground font-golos text-xs tracking-widest uppercase mb-5">Навигация</h3>
            <ul className="space-y-3">
              {[
                { id: 'about', label: 'Об академии' },
                { id: 'courses', label: 'Курсы' },
                { id: 'reviews', label: 'Отзывы' },
                { id: 'gallery', label: 'Фото и видео' },
                { id: 'enroll', label: 'Записаться' },
              ].map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className="text-muted-foreground hover:text-gold transition-colors font-golos text-sm"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="text-foreground font-golos text-xs tracking-widest uppercase mb-5">Контакты</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-muted-foreground text-sm font-golos">
                <Icon name="MapPin" size={15} className="text-gold mt-0.5 flex-shrink-0" />
                г. Москва, ул. Малая Лубянка, дом 16
              </li>
              <li>
                <a href="tel:+79153279755" className="flex items-center gap-3 text-muted-foreground hover:text-gold transition-colors text-sm font-golos">
                  <Icon name="Phone" size={15} className="text-gold flex-shrink-0" />
                  +7 (915) 327-97-55
                </a>
              </li>
              <li>
                <a href="mailto:info@montparnas.ru" className="flex items-center gap-3 text-muted-foreground hover:text-gold transition-colors text-sm font-golos">
                  <Icon name="Mail" size={15} className="text-gold flex-shrink-0" />
                  info@montparnas.ru
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="section-divider mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-muted-foreground/50 text-xs font-golos">
            © {new Date().getFullYear()} Академия кино Montparnas. Все права защищены.
          </p>
          <button
            onClick={() => onNavigate('enroll')}
            className="btn-gold px-6 py-2.5 rounded-full font-golos text-xs font-semibold tracking-wide"
          >
            Записаться на курс
          </button>
        </div>
      </div>
    </footer>
  );
}
