import os
import hashlib
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from urllib.parse import parse_qs
import psycopg2


def get_db():
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        raise RuntimeError('DATABASE_URL is not set')
    return psycopg2.connect(database_url)


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
