import json
from http.server import BaseHTTPRequestHandler
from api._lib.common import get_db, ensure_schema, json_headers, send_admin_email


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        for k, v in json_headers().items():
            self.send_header(k, v)
        self.end_headers()

    def do_GET(self):
        headers = json_headers()
        conn = get_db()
        ensure_schema(conn)
        cur = conn.cursor()
        try:
            cur.execute('SELECT id, user_name, user_avatar, course_title, text, rating, created_at FROM reviews WHERE approved = TRUE ORDER BY created_at DESC')
            rows = cur.fetchall()
            result = [
                {'id': r[0], 'name': r[1], 'avatar': r[2] or r[1][0].upper(), 'course': r[3], 'text': r[4], 'rating': r[5], 'date': r[6].strftime('%B %Y') if r[6] else ''}
                for r in rows
            ]
            self._send(200, result, headers)
        finally:
            cur.close()
            conn.close()

    def do_POST(self):
        headers = json_headers()
        length = int(self.headers.get('content-length', 0) or 0)
        body = json.loads(self.rfile.read(length) or b'{}')
        user_id = body.get('user_id')
        user_name = body.get('user_name', '').strip()
        course_title = body.get('course_title', '').strip()
        text = body.get('text', '').strip()
        rating = int(body.get('rating', 5))
        if not user_id or not user_name or not course_title or not text:
            self._send(400, {'error': 'Заполните все поля'}, headers)
            return

        avatar = user_name[0].upper()
        conn = get_db()
        ensure_schema(conn)
        cur = conn.cursor()
        try:
            cur.execute(
                'INSERT INTO reviews (user_id, user_name, user_avatar, course_title, text, rating, approved) VALUES (%s, %s, %s, %s, %s, %s, FALSE) RETURNING id',
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
                send_admin_email(f'Новый отзыв от {user_name}', html)
            except Exception:
                pass
            self._send(200, {'id': review_id, 'pending': True}, headers)
        finally:
            cur.close()
            conn.close()

    def _send(self, status, payload, headers):
        self.send_response(status)
        for k, v in headers.items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(json.dumps(payload, ensure_ascii=False).encode('utf-8'))
