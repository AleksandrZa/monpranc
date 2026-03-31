"""
Регистрация и вход пользователей академии Монпарнас.
POST /register — создать аккаунт
POST /login — войти
"""
import json
import os
import hashlib
import psycopg2


def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def handler(event: dict, context) -> dict:
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
        'Content-Type': 'application/json',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    action = body.get('action', '')

    conn = get_db()
    cur = conn.cursor()
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')

    try:
        if action == 'register':
            name = body.get('name', '').strip()
            email = body.get('email', '').strip().lower()
            password = body.get('password', '')

            if not name or not email or not password:
                return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Заполните все поля'})}

            cur.execute(f'SELECT id FROM {schema}.users WHERE email = %s', (email,))
            if cur.fetchone():
                return {'statusCode': 409, 'headers': headers, 'body': json.dumps({'error': 'Email уже зарегистрирован'})}

            pwd_hash = hash_password(password)
            cur.execute(
                f'INSERT INTO {schema}.users (name, email, password_hash) VALUES (%s, %s, %s) RETURNING id, name, email, is_admin',
                (name, email, pwd_hash)
            )
            row = cur.fetchone()
            conn.commit()
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'id': row[0], 'name': row[1], 'email': row[2], 'is_admin': row[3]})
            }

        elif action == 'login':
            email = body.get('email', '').strip().lower()
            password = body.get('password', '')
            pwd_hash = hash_password(password)

            cur.execute(
                f'SELECT id, name, email, is_admin, avatar_url FROM {schema}.users WHERE email = %s AND password_hash = %s',
                (email, pwd_hash)
            )
            row = cur.fetchone()
            if not row:
                return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'error': 'Неверный email или пароль'})}

            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'id': row[0], 'name': row[1], 'email': row[2], 'is_admin': row[3], 'avatar_url': row[4]})
            }

        return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'error': 'Not found'})}

    finally:
        cur.close()
        conn.close()