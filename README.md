# Монпарнас — Vercel + Postgres

Этот вариант подготовлен под деплой на Vercel.

## Что изменено
- фронтенд теперь обращается к локальным Vercel API routes: `/api/auth`, `/api/reviews`, `/api/enroll`, `/api/admin`
- backend перенесён в папку `api/` как Python serverless functions для Vercel
- БД: PostgreSQL через `DATABASE_URL`
- таблицы создаются автоматически при первом запросе

## Почему не SQLite
Vercel не подходит для SQLite, потому что локальная файловая система у serverless-функций эфемерная.

## Как задеплоить
1. Залей проект в GitHub
2. Импортируй репозиторий в Vercel
3. Создай Postgres в Vercel Marketplace (например Neon) или используй свой внешний Postgres
4. Добавь env:
   - `DATABASE_URL`
   - `ADMIN_KEY`
   - при необходимости SMTP-переменные
5. Нажми Deploy

## Локальный запуск
```bash
npm install
npm run dev
```

## Важно
Если у тебя уже были данные в старой БД, их надо перенести отдельно SQL-скриптом.
