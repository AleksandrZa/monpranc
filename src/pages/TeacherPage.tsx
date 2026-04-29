import { useEffect, useMemo, useState } from 'react'
import Icon from '@/components/ui/icon'
import Footer from '@/components/Footer'
import { api } from '@/api'
import TeacherAvatar from '@/components/teachers/TeacherAvatar'
import { fallbackTeachers, TeacherRecord } from '@/data/teachers'

interface TeacherPageProps {
  teacherId: string
  onNavigate: (page: string) => void
}

export const allTeachers = fallbackTeachers.map(
  ({ id, name, role, short_role }) => ({
    id,
    name,
    role: short_role || role,
  }),
)

export default function TeacherPage({
  teacherId,
  onNavigate,
}: TeacherPageProps) {
  const fallbackTeacher = useMemo(
    () => fallbackTeachers.find((item) => item.id === teacherId),
    [teacherId],
  )
  const [teacher, setTeacher] = useState<TeacherRecord | null>(
    fallbackTeacher || null,
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTeacher(fallbackTeacher || null)
    let mounted = true
    setLoading(true)
    api
      .getTeacher(teacherId)
      .then((row) => {
        if (mounted && row && !row.error) setTeacher(row)
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [teacherId, fallbackTeacher])

  if (!teacher && !loading) {
    return (
      <div className="min-h-screen pt-28 pb-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <button
            onClick={() => onNavigate('about')}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors font-golos text-sm mb-10"
          >
            <Icon name="ArrowLeft" size={14} /> Наши педагоги
          </button>
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold/20 to-gold-dark/20 border border-gold/30 flex items-center justify-center mx-auto mb-6">
            <span className="font-playfair font-bold text-4xl text-gold">
              ?
            </span>
          </div>
          <h1 className="font-playfair text-4xl font-light text-foreground mb-3">
            Педагог не найден
          </h1>
          <p className="text-muted-foreground font-golos">
            Проверь id или вернись в раздел преподавателей.
          </p>
        </div>
        <Footer onNavigate={onNavigate} />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24">
      <div className="pt-10 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => onNavigate('about')}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors font-golos text-sm mb-10"
          >
            <Icon name="ArrowLeft" size={14} /> Наши педагоги
          </button>

          {teacher && (
            <>
              <div className="flex flex-col sm:flex-row gap-8 items-start mb-12">
                <TeacherAvatar
                  teacher={teacher}
                  square
                  className="w-32 h-32 flex-shrink-0"
                />
                <div>
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h1 className="font-playfair text-3xl md:text-4xl font-light text-foreground">
                      {teacher.name}
                    </h1>
                  </div>
                  <p className="text-gold font-golos text-sm mb-3">
                    {teacher.short_role || teacher.role}
                  </p>
                  {!!teacher.awards?.length && (
                    <div className="flex flex-wrap gap-2">
                      {teacher.awards.map((a, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-gold/10 border border-gold/25 text-gold text-xs font-golos"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-5 mb-10">
                {teacher.bio?.length ? (
                  teacher.bio.map((paragraph, i) => (
                    <p
                      key={i}
                      className="font-golos text-muted-foreground leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="font-golos text-muted-foreground leading-relaxed">
                    Подробная информация о педагоге скоро появится.
                  </p>
                )}
              </div>

              {!!teacher.theaters?.length && (
                <div className="card-glass rounded-2xl p-6 mb-6">
                  <h2 className="font-playfair text-xl font-light text-foreground mb-4 flex items-center gap-2">
                    <Icon
                      name="Theater"
                      fallback="Star"
                      size={18}
                      className="text-gold"
                    />{' '}
                    Театральные работы
                  </h2>
                  <ul className="space-y-2">
                    {teacher.theaters.map((item, i) => (
                      <li
                        key={i}
                        className="flex gap-3 font-golos text-sm text-muted-foreground"
                      >
                        <div className="w-1 h-1 bg-gold/50 rounded-full flex-shrink-0 mt-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {!!teacher.films?.length && (
                <div className="card-glass rounded-2xl p-6 mb-6">
                  <h2 className="font-playfair text-xl font-light text-foreground mb-4 flex items-center gap-2">
                    <Icon name="Film" size={18} className="text-gold" /> Работы
                    в кино
                  </h2>
                  <ul className="space-y-2">
                    {teacher.films.map((item, i) => (
                      <li
                        key={i}
                        className="flex gap-3 font-golos text-sm text-muted-foreground"
                      >
                        <div className="w-1 h-1 bg-gold/50 rounded-full flex-shrink-0 mt-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          <div className="mt-10 text-center">
            <button
              onClick={() => onNavigate('enroll')}
              className="btn-gold px-10 py-4 font-golos font-semibold text-sm rounded-full"
            >
              Записаться на курс
            </button>
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
