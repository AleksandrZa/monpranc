import json
from http.server import BaseHTTPRequestHandler
from api._lib.common import get_db, ensure_schema, json_headers, parse_query, send_admin_email


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        for k, v in json_headers().items():
            self.send_header(k, v)
        self.end_headers()

    def do_GET(self):
        headers = json_headers()
        query = parse_query(self.path)
        user_id = query.get('user_id')
        if not user_id:
            self._send(400, {'error': 'user_id required'}, headers)
            return

        conn = get_db()
        ensure_schema(conn)
        cur = conn.cursor()
        try:
            cur.execute(
                'SELECT id, course_title, status, schedule, created_at FROM enrollments WHERE user_id = %s ORDER BY created_at DESC',
                (user_id,)
            )
            rows = cur.fetchall()
            result = [{'id': r[0], 'course_title': r[1], 'status': r[2], 'schedule': r[3], 'created_at': str(r[4])} for r in rows]
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
        user_email = body.get('user_email', '').strip()
        user_phone = body.get('user_phone', '').strip()
        course_title = body.get('course_title', '').strip()
        message = body.get('message', '').strip()

        if not user_name or not user_email or not user_phone or not course_title:
            self._send(400, {'error': 'Заполните все обязательные поля'}, headers)
            return

        conn = get_db()
        ensure_schema(conn)
        cur = conn.cursor()
        try:
            cur.execute(
                'INSERT INTO enrollments (user_id, user_name, user_email, user_phone, course_title, message) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id',
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
                send_admin_email(f'Новая заявка: {course_title}', html)
            except Exception:
                pass
            self._send(200, {'id': enrollment_id, 'status': 'pending'}, headers)
        finally:
            cur.close()
            conn.close()

    def _send(self, status, payload, headers):
        self.send_response(status)
        for k, v in headers.items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(json.dumps(payload, ensure_ascii=False).encode('utf-8'))
