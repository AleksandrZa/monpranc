import Icon from '@/components/ui/icon';
import Footer from '@/components/Footer';

interface TeacherPageProps {
  teacherId: string;
  onNavigate: (page: string) => void;
}

const teachers: Record<string, {
  name: string;
  role: string;
  photo: string;
  bio: string[];
  theaters?: string[];
  films?: string[];
  awards?: string[];
}> = {
  ovchinnikov: {
    name: 'Родион Овчинников',
    role: 'Ведущий педагог по актёрскому мастерству',
    photo: '',
    bio: [
      'Актёр, режиссёр, драматург, заслуженный артист России, профессор кафедры мастерства актёра ВТУ им. Б.В. Щукина.',
      'Во время учёбы в средней школе окончил музыкальное училище. В 1983 г. окончил актёрский факультет театрального института им. Б.В. Щукина, мастерская Катина-Ярцева. В 1989 г. окончил Высшие режиссёрские курсы при Госкино СССР, мастерская Ролана Быкова. В 1992 г. окончил философско-богословский факультет духовной академии в Мюнхене.',
      'С 1983 по 1993 г. работал актёром в театре «Ленком». С 1993 по 1996 г. — актёром в театре на «Таганке». Одновременно с актёрской работой занимался сольной музыкальной деятельностью — провёл сольные концерты «Русская поэзия в музыке» в десятках городов России и за рубежом (Париж, Нью-Йорк, Мадрид, Токио, Амстердам и др.).',
      'С 1996 года преподаёт в театральном институте им. Б.В. Щукина. Профессор кафедры мастерства актёра. Преподавал в театральных институтах России, Южной Кореи, Великобритании, Чехии, Швейцарии.',
      'Р.Ю. Овчинников ведёт мастер-классы по актёрскому тренингу в летней театральной школе СТД под руководством А. Калягина, а также в Англии, Франции, Польше, США, Голландии, Испании, Болгарии, Греции, Италии, Эстонии, Чехии.',
      'С 2014 года — ведущий педагог по актёрскому мастерству Академии кино Montparnas.',
    ],
    theaters: [
      'Театр «Ленком»: «Юнона и Авось», «Жестокие игры», «Иванов», «Оптимистическая трагедия», «Диктатура совести»',
      'Театр на Таганке: «Борис Годунов», «Мастер и Маргарита», «Тартюф», «Преступление и наказание», «Живаго»',
      '«Преступление и наказание» — Раскольников (театр им. М. Чехова)',
      '«Смерть Павла I» — Павел I (театр Рубена Симонова)',
      '«Борис Годунов» — Самозванец (театр Наций)',
    ],
    awards: ['Заслуженный артист России', 'Профессор ВТУ им. Б.В. Щукина'],
  },
  isaeva: {
    name: 'Вероника Исаева',
    role: 'Педагог по сценической речи и актёрскому мастерству (ШЮА)',
    photo: '',
    bio: [
      'Актриса театра и кино, режиссёр, педагог.',
      'Окончила Школу-студию МХАТ (актриса театра и кино) и ВТУ им. Щукина (педагог по сценической речи).',
      'Поставила спектакль «Письмовник» в Международном Славянском Институте (МСИ им. Державина). Сыграла в фильме «Знак бесконечности».',
      'Опыт преподавания с 2006 года: Институт Современного Искусства, Музыкальная Академия им. Маймонида, МИТРО и МСИ им. Державина.',
    ],
  },
  kuzina: {
    name: 'Виктория Кузина',
    role: 'Педагог по актёрскому мастерству',
    photo: '',
    bio: [
      'Кастинг-директор, педагог по системе Ли Страсберга.',
      'С 2007 года — директор кастинг-агентства «Все актёры.ру».',
      'Организатор и участник профессионального семинара по обмену опытом между российскими актёрами и американскими педагогами, работающими по методу Ли Страсберга, в Лос-Анжелесе, США.',
      'С 2013 года успешно проводит курсы и семинары по системе Ли Страсберга.',
    ],
    films: [
      'Кастинг-директор к/ф «О чём говорят мужчины» (фильм 1)',
      'Кастинг-директор к/ф «Натурщица», «Америка» (Россия–Португалия)',
      'Кастинг-директор к/ф «Икона сезона», «Случайная связь»',
    ],
  },
  rapoport: {
    name: 'Александр Рапопорт',
    role: 'Педагог по актёрскому мастерству',
    photo: '',
    bio: [
      'Актёр театра и кино, режиссёр, педагог по актёрскому мастерству.',
      'Ведущий преподаватель мастер-курсов Академии кино Montparnas. Специализируется на работе с актёрами в кино и на телевидении.',
    ],
  },
  dunaev: {
    name: 'Данила Дунаев',
    role: 'Педагог по актёрскому мастерству',
    photo: '',
    bio: [
      'Актёр театра и кино, педагог по актёрскому мастерству.',
      'Ведущий мастер-курсов Академии кино Montparnas. Работает с актёрами всех уровней — от начинающих до профессионалов.',
    ],
  },
};

const allTeachers = [
  { id: 'ovchinnikov', name: 'Родион Овчинников', role: 'Ведущий педагог по актёрскому мастерству' },
  { id: 'isaeva', name: 'Вероника Исаева', role: 'Педагог по сценической речи и актёрскому мастерству' },
  { id: 'kuzina', name: 'Виктория Кузина', role: 'Педагог по актёрскому мастерству' },
  { id: 'rapoport', name: 'Александр Рапопорт', role: 'Педагог по актёрскому мастерству' },
  { id: 'dunaev', name: 'Данила Дунаев', role: 'Педагог по актёрскому мастерству' },
  { id: 'polyansky', name: 'Роман Полянский', role: 'Педагог по актёрскому мастерству' },
  { id: 'maslov', name: 'Игорь Маслов', role: 'Педагог по актёрскому мастерству' },
  { id: 'mukhamadaev', name: 'Дмитрий Мухамадаев', role: 'Педагог по актёрскому мастерству' },
  { id: 'milkis', name: 'Михаил Милькис', role: 'Педагог по актёрскому мастерству' },
  { id: 'gusarova', name: 'Анна Гусарова', role: 'Педагог по актёрскому мастерству' },
  { id: 'soshnnikov', name: 'Станислав Сошников', role: 'Педагог по актёрскому мастерству' },
  { id: 'tsomaeva', name: 'Аида Цомаева', role: 'Педагог по актёрскому мастерству' },
  { id: 'vishnevskaya', name: 'Александра Вишневская', role: 'Педагог по актёрскому мастерству' },
  { id: 'boytsov', name: 'Максим Бойцов', role: 'Педагог по актёрскому мастерству' },
  { id: 'sakhnov', name: 'Владислав Сахнов', role: 'Педагог по актёрскому мастерству' },
  { id: 'itimeneva', name: 'Валерия Итименева', role: 'Педагог по актёрскому мастерству' },
  { id: 'blinova', name: 'Александра Блинова', role: 'Педагог по актёрскому мастерству' },
  { id: 'andreeva', name: 'Татьяна Андреева', role: 'Педагог по актёрскому мастерству' },
  { id: 'stefanko', name: 'Елена Стефанко', role: 'Педагог по актёрскому мастерству' },
  { id: 'malinskaya', name: 'Елена Малинская', role: 'Педагог по актёрскому мастерству' },
];

export default function TeacherPage({ teacherId, onNavigate }: TeacherPageProps) {
  const teacher = teachers[teacherId];

  if (!teacher) {
    const t = allTeachers.find(t => t.id === teacherId);
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
            <span className="font-playfair font-bold text-4xl text-gold">{t?.name?.[0] ?? '?'}</span>
          </div>
          <h1 className="font-playfair text-4xl font-light text-foreground mb-3">{t?.name}</h1>
          <p className="text-gold font-golos text-sm mb-8">{t?.role}</p>
          <p className="text-muted-foreground font-golos">Подробная информация о педагоге скоро появится.</p>
        </div>
        <Footer onNavigate={onNavigate} />
      </div>
    );
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

          <div className="flex flex-col sm:flex-row gap-8 items-start mb-12">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-gold/20 to-gold-dark/20 border border-gold/30 flex items-center justify-center flex-shrink-0">
              <span className="font-playfair font-bold text-5xl text-gold">{teacher.name[0]}</span>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="font-playfair text-3xl md:text-4xl font-light text-foreground">{teacher.name}</h1>
              </div>
              <p className="text-gold font-golos text-sm mb-3">{teacher.role}</p>
              {teacher.awards && (
                <div className="flex flex-wrap gap-2">
                  {teacher.awards.map((a, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-gold/10 border border-gold/25 text-gold text-xs font-golos">{a}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-5 mb-10">
            {teacher.bio.map((paragraph, i) => (
              <p key={i} className="font-golos text-muted-foreground leading-relaxed">{paragraph}</p>
            ))}
          </div>

          {teacher.theaters && (
            <div className="card-glass rounded-2xl p-6 mb-6">
              <h2 className="font-playfair text-xl font-light text-foreground mb-4 flex items-center gap-2">
                <Icon name="Theater" fallback="Star" size={18} className="text-gold" /> Театральные работы
              </h2>
              <ul className="space-y-2">
                {teacher.theaters.map((item, i) => (
                  <li key={i} className="flex gap-3 font-golos text-sm text-muted-foreground">
                    <div className="w-1 h-1 bg-gold/50 rounded-full flex-shrink-0 mt-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {teacher.films && (
            <div className="card-glass rounded-2xl p-6 mb-6">
              <h2 className="font-playfair text-xl font-light text-foreground mb-4 flex items-center gap-2">
                <Icon name="Film" size={18} className="text-gold" /> Работы в кино
              </h2>
              <ul className="space-y-2">
                {teacher.films.map((item, i) => (
                  <li key={i} className="flex gap-3 font-golos text-sm text-muted-foreground">
                    <div className="w-1 h-1 bg-gold/50 rounded-full flex-shrink-0 mt-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-10 text-center">
            <button
              onClick={() => onNavigate('enroll')}
              className="btn-gold px-10 py-4 font-golos font-semibold text-sm"
            >
              Записаться на курс
            </button>
          </div>
        </div>
      </div>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}

export { allTeachers };
