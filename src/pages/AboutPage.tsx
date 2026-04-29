import { useEffect, useState } from 'react'
import Icon from '@/components/ui/icon'
import Footer from '@/components/Footer'
import { api } from '@/api'
import TeacherAvatar from '@/components/teachers/TeacherAvatar'
import { featuredFallbackTeachers, TeacherRecord } from '@/data/teachers'

interface AboutPageProps {
  onNavigate: (page: string) => void
}

const values = [
  {
    icon: 'GraduationCap',
    title: 'Профессионализм',
    desc: 'Педагоги ведущих театральных ВУЗов Москвы: МХАТ, ВТУ им. Щукина, ВГИК и других.',
  },
  {
    icon: 'Zap',
    title: 'Интенсивность',
    desc: 'Авторские методики обеспечивают быстрый прогресс даже для начинающих.',
  },
  {
    icon: 'Heart',
    title: 'Атмосфера',
    desc: 'Творческая среда единомышленников, где каждый вдохновляет друг друга.',
  },
  {
    icon: 'Target',
    title: 'Практика',
    desc: 'Реальные навыки для работы в кино, на телевидении и публичных выступлений.',
  },
]

export default function AboutPage({ onNavigate }: AboutPageProps) {
  const [mainTeachers, setMainTeachers] = useState<TeacherRecord[]>(
    featuredFallbackTeachers,
  )

  useEffect(() => {
    let mounted = true
    api
      .getTeachers()
      .then((rows) => {
        if (!mounted || !Array.isArray(rows) || rows.length === 0) return
        const featured = rows.filter((teacher) => teacher.is_featured)
        if (featured.length) setMainTeachers(featured)
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="pt-24 overflow-x-hidden">
      <section className="py-20 px-6 text-center relative">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(212,168,83,0.3) 60px), repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(212,168,83,0.3) 60px)',
          }}
        />
        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-8 bg-gold/40" />
            <span className="text-gold/60 text-[10px] tracking-[0.4em] uppercase font-golos">
              Об академии
            </span>
            <div className="h-px w-8 bg-gold/40" />
          </div>
          <h1 className="font-playfair text-5xl md:text-7xl font-bold text-foreground leading-tight mb-8">
            Академия кино
            <br />
            <span className="italic text-gradient-gold">Montparnas</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto font-golos">
            Уникальный образовательный проект, объединяющий Академию актёрского
            мастерства, Школу юного актёра и мастер-курсы с ведущими
            представителями киноиндустрии.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 bg-black/30">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-6">
              Три направления
              <br />
              <span className="italic text-gradient-gold">одной академии</span>
            </h2>
            <div className="space-y-5">
              {[
                {
                  title: 'Академия актёрского мастерства',
                  desc: 'Базовый и продвинутый курсы для тех, кто хочет профессионально освоить актёрскую профессию.',
                },
                {
                  title: 'Школа юного актёра',
                  desc: 'Специальная программа для детей и подростков — раскрытие творческого потенциала с юных лет.',
                },
                {
                  title: 'Мастер-курсы',
                  desc: 'Уникальные курсы с ведущими представителями киноиндустрии. Голливудский метод, звёздные мастер-классы.',
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-6 h-6 border border-gold/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-gold/60" />
                  </div>
                  <div>
                    <div className="text-foreground font-semibold mb-1 font-golos">
                      {item.title}
                    </div>
                    <div className="text-muted-foreground text-sm font-golos leading-relaxed">
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-gold/15 p-10 rounded-2xl">
            <div className="text-center mb-8">
              <div className="font-playfair text-5xl font-bold text-gradient-gold mb-1">
                10+
              </div>
              <div className="text-white/40 text-xs tracking-widest uppercase font-golos">
                лет опыта
              </div>
            </div>
            <div className="section-divider mb-8" />
            <div className="text-center mb-8">
              <div className="font-playfair text-5xl font-bold text-gradient-gold mb-1">
                300+
              </div>
              <div className="text-white/40 text-xs tracking-widest uppercase font-golos">
                выпускников
              </div>
            </div>
            <div className="section-divider mb-8" />
            <div className="text-center">
              <p className="text-muted-foreground/70 text-sm font-golos italic leading-relaxed">
                «Наша цель — дать актуальные знания и практические навыки для
                развития в актёрской профессии и обычной жизни»
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-playfair text-4xl font-bold text-foreground">
              Наши <span className="italic text-gradient-gold">ценности</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <div
                key={i}
                className="card-glass rounded-2xl card-glow p-6 transition-all duration-500 group text-center"
              >
                <div className="w-10 h-10 rounded-xl border border-gold/30 flex items-center justify-center text-gold mx-auto mb-5 group-hover:bg-gold group-hover:text-black transition-all duration-300">
                  <Icon name={v.icon} size={18} />
                </div>
                <h3 className="font-playfair text-lg font-semibold text-foreground mb-2">
                  {v.title}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed font-golos">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-black/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-5">
              <div className="h-px w-8 bg-gold/40" />
              <span className="text-gold/60 text-[10px] tracking-[0.4em] uppercase font-golos">
                МХАТ · Щукина · ВГИК · ГИТИС · Вахтангова
              </span>
              <div className="h-px w-8 bg-gold/40" />
            </div>
            <h2 className="font-playfair text-4xl font-bold text-foreground">
              Наши <span className="italic text-gradient-gold">педагоги</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {mainTeachers.map((t) => (
              <button
                key={t.id}
                onClick={() => onNavigate(`teacher:${t.id}`)}
                className="card-glass card-glow rounded-2xl p-6 text-left group hover:border-gold/30 transition-all duration-500 border border-gold/10"
              >
                <div className="flex items-center gap-4 mb-4">
                  <TeacherAvatar
                    teacher={t}
                    className="w-14 h-14 flex-shrink-0 group-hover:border-gold/60 transition-all duration-300"
                  />
                  <h3 className="font-playfair text-base font-semibold text-foreground leading-tight">
                    {t.name}
                  </h3>
                </div>
                <p className="font-golos text-xs text-gold mb-1">
                  {t.short_role || t.role}
                </p>
                <p className="font-golos text-xs text-muted-foreground leading-relaxed">
                  {t.detail || ''}
                </p>
                <div className="flex items-center gap-1 mt-4 text-gold/50 group-hover:text-gold transition-colors text-xs font-golos">
                  Подробнее <Icon name="ArrowRight" size={12} />
                </div>
              </button>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => onNavigate('all-teachers')}
              className="btn-outline-gold px-8 py-3 rounded-full font-golos text-sm inline-flex items-center gap-2"
            >
              <Icon name="Users" size={15} />
              Все преподаватели
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-8">
            Найдите нас{' '}
            <span className="italic text-gradient-gold">в Москве</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="border border-gold/15 p-6 text-center rounded-2xl">
              <Icon
                name="MapPin"
                size={20}
                className="text-gold mx-auto mb-3"
              />
              <div className="text-xs tracking-widest uppercase text-muted-foreground font-golos mb-2">
                Адрес
              </div>
              <div className="font-golos text-sm text-foreground">
                Москва, ул. Малая Лубянка, д. 16
              </div>
            </div>
            <div className="border border-gold/15 p-6 text-center rounded-2xl">
              <Icon name="Phone" size={20} className="text-gold mx-auto mb-3" />
              <div className="text-xs tracking-widest uppercase text-muted-foreground font-golos mb-2">
                Телефон
              </div>
              <div className="font-golos text-sm text-foreground">
                +7 (915) 327-97-55
              </div>
            </div>
            <div className="border border-gold/15 p-6 text-center rounded-2xl">
              <Icon
                name="Clock3"
                size={20}
                className="text-gold mx-auto mb-3"
              />
              <div className="text-xs tracking-widest uppercase text-muted-foreground font-golos mb-2">
                График
              </div>
              <div className="font-golos text-sm text-foreground">
                Ежедневно, 10:00–20:00
              </div>
            </div>
          </div>
        </div>
      </section>
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
                  href=""
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
