import json
import os
from http.server import BaseHTTPRequestHandler
from api._lib.common import get_db, ensure_schema, json_headers, send_email, parse_query


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
        admin_key = body.get('key', '') or self.headers.get('x-admin-key', '')
        expected_key = os.environ.get('ADMIN_KEY', '')
        if not expected_key or admin_key != expected_key:
            self._send(403, {'error': 'Forbidden'}, headers)
            return

        action = body.get('action', '')
        conn = get_db()
        ensure_schema(conn)
        cur = conn.cursor()
        try:
            if action == 'get_enrollments':
                cur.execute('SELECT id, user_id, user_name, user_email, user_phone, course_title, message, status, schedule, created_at FROM enrollments ORDER BY created_at DESC')
                rows = cur.fetchall()
                result = [
                    {'id': r[0], 'user_id': r[1], 'user_name': r[2], 'user_email': r[3], 'user_phone': r[4], 'course_title': r[5], 'message': r[6], 'status': r[7], 'schedule': r[8], 'created_at': str(r[9])}
                    for r in rows
                ]
                self._send(200, result, headers)
                return

            if action == 'update_enrollment':
                enrollment_id = body.get('id')
                schedule = body.get('schedule', '')
                status = body.get('status', 'approved')
                cur.execute('UPDATE enrollments SET status = %s, schedule = %s WHERE id = %s RETURNING user_email, user_name, course_title', (status, schedule, enrollment_id))
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
                self._send(200, {'ok': True}, headers)
                return

            if action == 'get_reviews':
                cur.execute('SELECT id, user_name, course_title, text, rating, approved, created_at FROM reviews ORDER BY approved ASC, created_at DESC')
                rows = cur.fetchall()
                result = [
                    {'id': r[0], 'user_name': r[1], 'course_title': r[2], 'text': r[3], 'rating': r[4], 'approved': r[5], 'created_at': str(r[6])}
                    for r in rows
                ]
                self._send(200, result, headers)
                return

            if action == 'approve_review':
                review_id = body.get('id')
                cur.execute('UPDATE reviews SET approved = TRUE WHERE id = %s', (review_id,))
                conn.commit()
                self._send(200, {'ok': True}, headers)
                return

            if action == 'reject_review':
                review_id = body.get('id')
                cur.execute('UPDATE reviews SET approved = FALSE WHERE id = %s', (review_id,))
                conn.commit()
                self._send(200, {'ok': True}, headers)
                return


            if action == 'get_teachers':
                cur.execute('SELECT id, name, role, short_role, detail, photo_url, photo_data, bio, theaters, films, awards, is_featured, sort_order, created_at, updated_at FROM teachers ORDER BY sort_order ASC, name ASC')
                rows = cur.fetchall()
                result = [
                    {'id': r[0], 'name': r[1], 'role': r[2], 'short_role': r[3], 'detail': r[4], 'photo_url': r[5], 'photo_data': r[6], 'bio': r[7] or [], 'theaters': r[8] or [], 'films': r[9] or [], 'awards': r[10] or [], 'is_featured': r[11], 'sort_order': r[12], 'created_at': str(r[13]), 'updated_at': str(r[14])}
                    for r in rows
                ]
                self._send(200, result, headers)
                return

            if action == 'upsert_teacher':
                teacher = body.get('teacher') or {}
                teacher_id = (teacher.get('id') or '').strip()
                name = (teacher.get('name') or '').strip()
                role = (teacher.get('role') or '').strip()
                if not teacher_id or not name or not role:
                    self._send(400, {'error': 'Teacher id, name and role are required'}, headers)
                    return
                cur.execute(
                    '''
                    INSERT INTO teachers (
                        id, name, role, short_role, detail, photo_url, photo_data, bio, theaters, films, awards, is_featured, sort_order, updated_at
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
                    ON CONFLICT (id) DO UPDATE SET
                        name = EXCLUDED.name,
                        role = EXCLUDED.role,
                        short_role = EXCLUDED.short_role,
                        detail = EXCLUDED.detail,
                        photo_url = EXCLUDED.photo_url,
                        photo_data = EXCLUDED.photo_data,
                        bio = EXCLUDED.bio,
                        theaters = EXCLUDED.theaters,
                        films = EXCLUDED.films,
                        awards = EXCLUDED.awards,
                        is_featured = EXCLUDED.is_featured,
                        sort_order = EXCLUDED.sort_order,
                        updated_at = NOW()
                    RETURNING id
                    ''',
                    (
                        teacher_id,
                        name,
                        role,
                        teacher.get('short_role'),
                        teacher.get('detail'),
                        teacher.get('photo_url'),
                        teacher.get('photo_data'),
                        teacher.get('bio') or [],
                        teacher.get('theaters') or [],
                        teacher.get('films') or [],
                        teacher.get('awards') or [],
                        bool(teacher.get('is_featured')),
                        int(teacher.get('sort_order') or 999),
                    )
                )
                row = cur.fetchone()
                conn.commit()
                self._send(200, {'ok': True, 'id': row[0]}, headers)
                return

            if action == 'get_users':
                cur.execute('SELECT id, name, email, is_admin, created_at FROM users ORDER BY created_at DESC')
                rows = cur.fetchall()
                result = [
                    {'id': r[0], 'name': r[1], 'email': r[2], 'is_admin': r[3], 'created_at': str(r[4])}
                    for r in rows
                ]
                self._send(200, result, headers)
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
