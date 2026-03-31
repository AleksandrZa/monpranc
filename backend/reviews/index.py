"""
Отзывы студентов академии Монпарнас.
GET / — получить одобренные отзывы
POST / — добавить отзыв (только авторизованный пользователь)
"""
import json
import os
import psycopg2
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def send_email_notification(subject: str, html_body: str):
    smtp_host = os.environ.get('SMTP_HOST', '')
    smtp_port = int(os.environ.get('SMTP_PORT', '587'))
    smtp_user = os.environ.get('SMTP_USER', '')
    smtp_pass = os.environ.get('SMTP_PASS', '')
    admin_email = os.environ.get('ADMIN_EMAIL', 'dmitriewa.sa2015@gmail.com')

    if not smtp_host or not smtp_user:
        return

    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = smtp_user
    msg['To'] = admin_email
    msg.attach(MIMEText(html_body, 'html', 'utf-8'))

    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.sendmail(smtp_user, admin_email, msg.as_string())


def handler(event: dict, context) -> dict:
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
        'Content-Type': 'application/json',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    method = event.get('httpMethod', 'GET')
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')

    if method == 'GET':
        conn = get_db()
        cur = conn.cursor()
        try:
            cur.execute(
                f"SELECT id, user_name, user_avatar, course_title, text, rating, created_at FROM {schema}.reviews WHERE approved = TRUE ORDER BY created_at DESC"
            )
            rows = cur.fetchall()
            result = [
                {'id': r[0], 'name': r[1], 'avatar': r[2] or r[1][0].upper(), 'course': r[3], 'text': r[4], 'rating': r[5], 'date': r[6].strftime('%B %Y') if r[6] else ''}
                for r in rows
            ]
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps(result, ensure_ascii=False)}
        finally:
            cur.close()
            conn.close()

    elif method == 'POST':
        body = json.loads(event.get('body') or '{}')
        user_id = body.get('user_id')
        user_name = body.get('user_name', '').strip()
        course_title = body.get('course_title', '').strip()
        text = body.get('text', '').strip()
        rating = int(body.get('rating', 5))

        if not user_id or not user_name or not course_title or not text:
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Заполните все поля'})}

        avatar = user_name[0].upper()

        conn = get_db()
        cur = conn.cursor()
        try:
            cur.execute(
                f'INSERT INTO {schema}.reviews (user_id, user_name, user_avatar, course_title, text, rating, approved) VALUES (%s, %s, %s, %s, %s, %s, FALSE) RETURNING id',
                (user_id, user_name, avatar, course_title, text, rating)
            )
            review_id = cur.fetchone()[0]
            conn.commit()

            try:
                html = f"""
                <h2>Новый отзыв — Монпарнас</h2>
                <table>
                <tr><td><b>Автор:</b></td><td>{user_name}</td></tr>
                <tr><td><b>Курс:</b></td><td>{course_title}</td></tr>
                <tr><td><b>Оценка:</b></td><td>{'★' * rating}</td></tr>
                <tr><td><b>Текст:</b></td><td>{text}</td></tr>
                </table>
                <p>Отзыв #{review_id} ожидает одобрения в панели администратора.</p>
                """
                send_email_notification(f'Новый отзыв от {user_name}', html)
            except Exception:
                pass

            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'id': review_id, 'pending': True})}
        finally:
            cur.close()
            conn.close()

    return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'Method not allowed'})}
