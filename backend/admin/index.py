"""
Панель администратора академии Монпарнас. v2
GET /enrollments — список заявок
POST /enrollments/approve — подтвердить заявку (+ расписание)
GET /reviews — список отзывов на модерации
POST /reviews/approve — одобрить отзыв
POST /reviews/reject — отклонить отзыв
GET /users — список пользователей
"""
import json
import os
import psycopg2
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def send_email(to_email: str, subject: str, html_body: str):
    smtp_host = os.environ.get('SMTP_HOST', '')
    smtp_port = int(os.environ.get('SMTP_PORT', '587'))
    smtp_user = os.environ.get('SMTP_USER', '')
    smtp_pass = os.environ.get('SMTP_PASS', '')

    if not smtp_host or not smtp_user:
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


def handler(event: dict, context) -> dict:
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
        'Content-Type': 'application/json',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    method = event.get('httpMethod', 'GET')
    body = json.loads(event.get('body') or '{}')

    admin_key = body.get('key', '') or event.get('headers', {}).get('x-admin-key', '')
    expected_key = os.environ.get('ADMIN_KEY', '')
    if not expected_key or admin_key != expected_key:
        return {'statusCode': 403, 'headers': headers, 'body': json.dumps({'error': 'Forbidden'})}

    action = body.get('action', '') or event.get('queryStringParameters', {}).get('action', '')
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')

    conn = get_db()
    cur = conn.cursor()

    try:
        if action == 'get_enrollments':
            cur.execute(
                f"SELECT id, user_id, user_name, user_email, user_phone, course_title, message, status, schedule, created_at FROM {schema}.enrollments ORDER BY created_at DESC"
            )
            rows = cur.fetchall()
            result = [
                {'id': r[0], 'user_id': r[1], 'user_name': r[2], 'user_email': r[3], 'user_phone': r[4],
                 'course_title': r[5], 'message': r[6], 'status': r[7], 'schedule': r[8], 'created_at': str(r[9])}
                for r in rows
            ]
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps(result, ensure_ascii=False)}

        elif action == 'update_enrollment':
            enrollment_id = body.get('id')
            schedule = body.get('schedule', '')
            status = body.get('status', 'approved')

            cur.execute(
                f"UPDATE {schema}.enrollments SET status = %s, schedule = %s WHERE id = %s RETURNING user_email, user_name, course_title",
                (status, schedule, enrollment_id)
            )
            row = cur.fetchone()
            conn.commit()

            if row and status == 'approved':
                try:
                    html = f"""
                    <h2>Ваша заявка подтверждена!</h2>
                    <p>Здравствуйте, <b>{row[1]}</b>!</p>
                    <p>Ваша заявка на курс <b>{row[2]}</b> подтверждена.</p>
                    <h3>Расписание:</h3>
                    <p>{schedule or 'Уточните расписание у администратора'}</p>
                    <br><p>С уважением, Академия кино Монпарнас</p>
                    """
                    send_email(row[0], f'Заявка подтверждена — {row[2]}', html)
                except Exception:
                    pass

            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}

        elif action == 'get_reviews':
            cur.execute(
                f"SELECT id, user_name, course_title, text, rating, approved, created_at FROM {schema}.reviews ORDER BY approved ASC, created_at DESC"
            )
            rows = cur.fetchall()
            result = [
                {'id': r[0], 'user_name': r[1], 'course_title': r[2], 'text': r[3], 'rating': r[4], 'approved': r[5], 'created_at': str(r[6])}
                for r in rows
            ]
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps(result, ensure_ascii=False)}

        elif action == 'approve_review':
            review_id = body.get('id')
            cur.execute(f"UPDATE {schema}.reviews SET approved = TRUE WHERE id = %s", (review_id,))
            conn.commit()
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}

        elif action == 'reject_review':
            review_id = body.get('id')
            cur.execute(f"UPDATE {schema}.reviews SET approved = FALSE WHERE id = %s", (review_id,))
            conn.commit()
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}

        elif action == 'get_users':
            cur.execute(
                f"SELECT id, name, email, is_admin, created_at FROM {schema}.users ORDER BY created_at DESC"
            )
            rows = cur.fetchall()
            result = [
                {'id': r[0], 'name': r[1], 'email': r[2], 'is_admin': r[3], 'created_at': str(r[4])}
                for r in rows
            ]
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps(result, ensure_ascii=False)}

        return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'error': 'Not found'})}

    finally:
        cur.close()
        conn.close()