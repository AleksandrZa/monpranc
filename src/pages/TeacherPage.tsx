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
      <Footer onNavigate={onNavigate} />
    </div>
  )
}
