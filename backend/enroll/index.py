"""
Записи на курсы академии Монпарнас.
POST / — подать заявку
GET /?user_id=N — получить записи пользователя
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
        user_id = event.get('queryStringParameters', {}).get('user_id')
        if not user_id:
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'user_id required'})}

        conn = get_db()
        cur = conn.cursor()
        try:
            cur.execute(
                f'SELECT id, course_title, status, schedule, created_at FROM {schema}.enrollments WHERE user_id = %s ORDER BY created_at DESC',
                (user_id,)
            )
            rows = cur.fetchall()
            result = [{'id': r[0], 'course_title': r[1], 'status': r[2], 'schedule': r[3], 'created_at': str(r[4])} for r in rows]
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps(result)}
        finally:
            cur.close()
            conn.close()

    elif method == 'POST':
        body = json.loads(event.get('body') or '{}')
        user_id = body.get('user_id')
        user_name = body.get('user_name', '').strip()
        user_email = body.get('user_email', '').strip()
        user_phone = body.get('user_phone', '').strip()
        course_title = body.get('course_title', '').strip()
        message = body.get('message', '').strip()

        if not user_name or not user_email or not user_phone or not course_title:
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Заполните все обязательные поля'})}

        conn = get_db()
        cur = conn.cursor()
        try:
            cur.execute(
                f'INSERT INTO {schema}.enrollments (user_id, user_name, user_email, user_phone, course_title, message) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id',
                (user_id, user_name, user_email, user_phone, course_title, message)
            )
            enrollment_id = cur.fetchone()[0]
            conn.commit()

            try:
                html = f"""
                <h2>Новая заявка на курс — Монпарнас</h2>
                <table>
                <tr><td><b>Имя:</b></td><td>{user_name}</td></tr>
                <tr><td><b>Email:</b></td><td>{user_email}</td></tr>
                <tr><td><b>Телефон:</b></td><td>{user_phone}</td></tr>
                <tr><td><b>Курс:</b></td><td>{course_title}</td></tr>
                <tr><td><b>Сообщение:</b></td><td>{message or '—'}</td></tr>
                </table>
                <p>Заявка #{enrollment_id}. Для подтверждения войдите в панель администратора.</p>
                """
                send_email_notification(f'Новая заявка: {course_title}', html)
            except Exception:
                pass

            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'id': enrollment_id, 'status': 'pending'})}
        finally:
            cur.close()
            conn.close()

    return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'Method not allowed'})}
