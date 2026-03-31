import json
from http.server import BaseHTTPRequestHandler
from api._lib.common import get_db, ensure_schema, hash_password, json_headers


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        for k, v in json_headers().items():
            self.send_header(k, v)
        self.end_headers()

    def do_POST(self):
        headers = json_headers()
        length = int(self.headers.get('content-length', 0) or 0)
        body = json.loads(self.rfile.read(length) or b'{}')
        action = body.get('action', '')

        conn = get_db()
        ensure_schema(conn)
        cur = conn.cursor()
        try:
            if action == 'register':
                name = body.get('name', '').strip()
                email = body.get('email', '').strip().lower()
                password = body.get('password', '')
                if not name or not email or not password:
                    self._send(400, {'error': 'Заполните все поля'}, headers)
                    return
                cur.execute('SELECT id FROM users WHERE email = %s', (email,))
                if cur.fetchone():
                    self._send(409, {'error': 'Email уже зарегистрирован'}, headers)
                    return
                pwd_hash = hash_password(password)
                cur.execute(
                    'INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s) RETURNING id, name, email, is_admin',
                    (name, email, pwd_hash)
                )
                row = cur.fetchone()
                conn.commit()
                self._send(200, {'id': row[0], 'name': row[1], 'email': row[2], 'is_admin': row[3]}, headers)
                return

            if action == 'login':
                email = body.get('email', '').strip().lower()
                password = body.get('password', '')
                pwd_hash = hash_password(password)
                cur.execute(
                    'SELECT id, name, email, is_admin, avatar_url FROM users WHERE email = %s AND password_hash = %s',
                    (email, pwd_hash)
                )
                row = cur.fetchone()
                if not row:
                    self._send(401, {'error': 'Неверный email или пароль'}, headers)
                    return
                self._send(200, {'id': row[0], 'name': row[1], 'email': row[2], 'is_admin': row[3], 'avatar_url': row[4]}, headers)
                return

            self._send(404, {'error': 'Not found'}, headers)
        finally:
            cur.close()
            conn.close()

    def _send(self, status, payload, headers):
        self.send_response(status)
        for k, v in headers.items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(json.dumps(payload, ensure_ascii=False).encode('utf-8'))
