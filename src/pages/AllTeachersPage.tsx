import { useEffect, useState } from 'react'
import Icon from '@/components/ui/icon'
import Footer from '@/components/Footer'
import { api } from '@/api'
import TeacherAvatar from '@/components/teachers/TeacherAvatar'
import { fallbackTeachers, TeacherRecord } from '@/data/teachers'

interface AllTeachersPageProps {
  onNavigate: (page: string) => void
}

export default function AllTeachersPage({ onNavigate }: AllTeachersPageProps) {
  const [teachers, setTeachers] = useState<TeacherRecord[]>(fallbackTeachers)

  useEffect(() => {
    let mounted = true
    api
      .getTeachers()
      .then((rows) => {
        if (mounted && Array.isArray(rows) && rows.length > 0) setTeachers(rows)
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="pt-24">
      <div className="py-24 px-6">
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
              <span className="text-gold/60 text-[10px] tracking-[0.4em] uppercase font-golos">
                МХАТ · Щукина · ВГИК · ГИТИС · Вахтангова
              </span>
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
                  <TeacherAvatar
                    teacher={t}
                    className="w-12 h-12 flex-shrink-0 group-hover:border-gold/60 transition-all duration-300"
                  />
                  <h3 className="font-playfair text-base font-semibold text-foreground leading-tight">
                    {t.name}
                  </h3>
                </div>
                <p className="font-golos text-xs text-gold/80 mb-3 leading-relaxed">
                  {t.short_role || t.role}
                </p>
                <div className="flex items-center gap-1 text-gold/40 group-hover:text-gold transition-colors text-xs font-golos">
                  Подробнее <Icon name="ArrowRight" size={12} />
                </div>
              </button>
            ))}
          </div>
        </div>
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
