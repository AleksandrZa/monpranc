import json
from http.server import BaseHTTPRequestHandler
from api._lib.common import get_db, ensure_schema, json_headers, parse_query


TEACHER_COLUMNS = '''
    id,
    name,
    role,
    short_role,
    detail,
    photo_url,
    photo_data,
    bio,
    theaters,
    films,
    awards,
    is_featured,
    sort_order,
    created_at,
    updated_at
'''


def row_to_teacher(row):
    return {
        'id': row[0],
        'name': row[1],
        'role': row[2],
        'short_role': row[3],
        'detail': row[4],
        'photo_url': row[5],
        'photo_data': row[6],
        'bio': row[7] or [],
        'theaters': row[8] or [],
        'films': row[9] or [],
        'awards': row[10] or [],
        'is_featured': row[11],
        'sort_order': row[12],
        'created_at': str(row[13]) if row[13] else None,
        'updated_at': str(row[14]) if row[14] else None,
    }


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        for k, v in json_headers().items():
            self.send_header(k, v)
        self.end_headers()

    def do_GET(self):
        headers = json_headers()
        query = parse_query(self.path)
        teacher_id = query.get('id')

        conn = get_db()
        ensure_schema(conn)
        cur = conn.cursor()
        try:
            if teacher_id:
                cur.execute(f'SELECT {TEACHER_COLUMNS} FROM teachers WHERE id = %s', (teacher_id,))
                row = cur.fetchone()
                if not row:
                    self._send(404, {'error': 'Teacher not found'}, headers)
                    return
                self._send(200, row_to_teacher(row), headers)
                return

            cur.execute(f'SELECT {TEACHER_COLUMNS} FROM teachers ORDER BY sort_order ASC, name ASC')
            rows = cur.fetchall()
            self._send(200, [row_to_teacher(row) for row in rows], headers)
        finally:
            cur.close()
            conn.close()

    def _send(self, status, payload, headers):
        self.send_response(status)
        for k, v in headers.items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(json.dumps(payload, ensure_ascii=False).encode('utf-8'))
