import os
import hashlib
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from urllib.parse import parse_qs
import psycopg


DEFAULT_TEACHERS = [
    {
        'id': 'ovchinnikov',
        'name': 'Родион Овчинников',
        'role': 'Ведущий педагог по актёрскому мастерству',
        'short_role': 'Актёр, режиссёр, заслуженный артист России',
        'detail': 'Профессор ВТУ им. Щукина. Театр «Ленком», Таганка',
        'bio': [
            'Актёр, режиссёр, драматург, заслуженный артист России, профессор кафедры мастерства актёра ВТУ им. Б.В. Щукина.',
            'С 1996 года преподаёт в театральном институте им. Б.В. Щукина. Профессор кафедры мастерства актёра.',
            'С 2014 года — ведущий педагог по актёрскому мастерству Академии кино Montparnas.',
        ],
        'theaters': [
            'Театр «Ленком»: «Юнона и Авось», «Жестокие игры», «Иванов»',
            'Театр на Таганке: «Борис Годунов», «Мастер и Маргарита», «Тартюф»',
        ],
        'awards': ['Заслуженный артист России', 'Профессор ВТУ им. Б.В. Щукина'],
        'is_featured': True,
        'sort_order': 1,
    },
    {
        'id': 'isaeva',
        'name': 'Вероника Исаева',
        'role': 'Педагог по сценической речи и актёрскому мастерству (ШЮА)',
        'short_role': 'Педагог по сценической речи и актёрскому мастерству',
        'detail': 'Школа-студия МХАТ, ВТУ им. Щукина. Опыт с 2006 года',
        'bio': ['Актриса театра и кино, режиссёр, педагог.', 'Опыт преподавания с 2006 года.'],
        'is_featured': True,
        'sort_order': 2,
    },
    {
        'id': 'kuzina',
        'name': 'Виктория Кузина',
        'role': 'Педагог по актёрскому мастерству',
        'short_role': 'Педагог по системе Ли Страсберга',
        'detail': 'Кастинг-директор. «О чём говорят мужчины» и другие',
        'bio': ['Кастинг-директор, педагог по системе Ли Страсберга.'],
        'films': ['Кастинг-директор к/ф «О чём говорят мужчины»'],
        'is_featured': True,
        'sort_order': 3,
    },
    {
        'id': 'rapoport',
        'name': 'Александр Рапопорт',
        'role': 'Педагог по актёрскому мастерству',
        'short_role': 'Педагог по актёрскому мастерству',
        'detail': 'Актёр театра и кино, режиссёр',
        'bio': ['Актёр театра и кино, режиссёр, педагог по актёрскому мастерству.'],
        'is_featured': True,
        'sort_order': 4,
    },
    {
        'id': 'dunaev',
        'name': 'Данила Дунаев',
        'role': 'Педагог по актёрскому мастерству',
        'short_role': 'Педагог по актёрскому мастерству',
        'detail': 'Актёр театра и кино',
        'bio': ['Актёр театра и кино, педагог по актёрскому мастерству.'],
        'is_featured': True,
        'sort_order': 5,
    },
]

MORE_TEACHERS = [
    'polyansky:Роман Полянский', 'maslov:Игорь Маслов', 'mukhamadaev:Дмитрий Мухамадаев',
    'milkis:Михаил Милькис', 'gusarova:Анна Гусарова', 'soshnnikov:Станислав Сошников',
    'tsomaeva:Аида Цомаева', 'vishnevskaya:Александра Вишневская', 'boytsov:Максим Бойцов',
    'sakhnov:Владислав Сахнов', 'itimeneva:Валерия Итименева', 'blinova:Александра Блинова',
    'andreeva:Татьяна Андреева', 'stefanko:Елена Стефанко', 'malinskaya:Елена Малинская',
]

for i, item in enumerate(MORE_TEACHERS, start=6):
    teacher_id, name = item.split(':', 1)
    DEFAULT_TEACHERS.append({
        'id': teacher_id,
        'name': name,
        'role': 'Педагог по актёрскому мастерству',
        'short_role': 'Педагог по актёрскому мастерству',
        'is_featured': False,
        'sort_order': i,
    })


def get_db():
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        raise RuntimeError('DATABASE_URL is not set')
    return psycopg.connect(database_url)


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def json_headers(extra=None):
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
        'Content-Type': 'application/json; charset=utf-8',
    }
    if extra:
        headers.update(extra)
    return headers


def parse_query(path: str) -> dict:
    if '?' not in path:
        return {}
    raw = path.split('?', 1)[1]
    return {k: v[0] for k, v in parse_qs(raw).items()}


def seed_teachers(cur):
    cur.execute('SELECT COUNT(*) FROM teachers')
    if cur.fetchone()[0] > 0:
        return
    for teacher in DEFAULT_TEACHERS:
        cur.execute(
            '''
            INSERT INTO teachers (
                id, name, role, short_role, detail, photo_url, photo_data, bio, theaters, films, awards, is_featured, sort_order
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (id) DO NOTHING
            ''',
            (
                teacher.get('id'),
                teacher.get('name'),
                teacher.get('role'),
                teacher.get('short_role'),
                teacher.get('detail'),
                teacher.get('photo_url'),
                teacher.get('photo_data'),
                teacher.get('bio', []),
                teacher.get('theaters', []),
                teacher.get('films', []),
                teacher.get('awards', []),
                teacher.get('is_featured', False),
                teacher.get('sort_order', 999),
            )
        )


def ensure_schema(conn):
    cur = conn.cursor()
    try:
        cur.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            avatar_url TEXT,
            is_admin BOOLEAN NOT NULL DEFAULT FALSE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        ''')
        cur.execute('''
        CREATE TABLE IF NOT EXISTS enrollments (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
            user_name TEXT NOT NULL,
            user_email TEXT NOT NULL,
            user_phone TEXT NOT NULL,
            course_title TEXT NOT NULL,
            message TEXT,
            status TEXT NOT NULL DEFAULT 'pending',
            schedule TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        ''')
        cur.execute('''
        CREATE TABLE IF NOT EXISTS reviews (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
            user_name TEXT NOT NULL,
            user_avatar TEXT,
            course_title TEXT NOT NULL,
            text TEXT NOT NULL,
            rating INTEGER NOT NULL DEFAULT 5,
            approved BOOLEAN NOT NULL DEFAULT FALSE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        ''')
        cur.execute('''
        CREATE TABLE IF NOT EXISTS teachers (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            role TEXT NOT NULL,
            short_role TEXT,
            detail TEXT,
            photo_url TEXT,
            photo_data TEXT,
            bio TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
            theaters TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
            films TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
            awards TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
            is_featured BOOLEAN NOT NULL DEFAULT FALSE,
            sort_order INTEGER NOT NULL DEFAULT 999,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        ''')
        cur.execute('''
        ALTER TABLE teachers
        ADD COLUMN IF NOT EXISTS photo_url TEXT,
        ADD COLUMN IF NOT EXISTS photo_data TEXT,
        ADD COLUMN IF NOT EXISTS short_role TEXT,
        ADD COLUMN IF NOT EXISTS detail TEXT,
        ADD COLUMN IF NOT EXISTS bio TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
        ADD COLUMN IF NOT EXISTS theaters TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
        ADD COLUMN IF NOT EXISTS films TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
        ADD COLUMN IF NOT EXISTS awards TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
        ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 999,
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
        ''')
        seed_teachers(cur)
        conn.commit()
    finally:
        cur.close()


def send_email(to_email: str, subject: str, html_body: str):
    smtp_host = os.environ.get('SMTP_HOST', '')
    smtp_port = int(os.environ.get('SMTP_PORT', '587'))
    smtp_user = os.environ.get('SMTP_USER', '')
    smtp_pass = os.environ.get('SMTP_PASS', '')

    if not smtp_host or not smtp_user or not to_email:
        return

    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = smtp_user
    msg['To'] = to_email
    msg.attach(MIMEText(html_body, 'html', 'utf-8'))

    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.sendmail(smtp_user, to_email, msg.as_string())


def send_admin_email(subject: str, html_body: str):
    admin_email = os.environ.get('ADMIN_EMAIL', '')
    if admin_email:
        send_email(admin_email, subject, html_body)
