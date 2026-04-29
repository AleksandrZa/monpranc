import argparse
import base64
import json
import mimetypes
import os
from pathlib import Path

import psycopg


DEFAULT_MAP = {
    'Родион Овчинников': 'ovchinnikov',
    'Вероника Исаева': 'isaeva',
    'Виктория Кузина': 'kuzina',
    'Александр Рапопорт': 'rapoport',
    'Данила Дунаев': 'dunaev',
    'Роман Полянский': 'polyansky',
    'Игорь Маслов': 'maslov',
    'Дмитрий Мухамадаев': 'mukhamadaev',
    'Михаил Милькис': 'milkis',
    'Анна Гусарова': 'gusarova',
    'Станислав Сошников': 'soshnnikov',
    'Аида Цомаева': 'tsomaeva',
    'Александра Вишневская': 'vishnevskaya',
    'Максим Бойцов': 'boytsov',
    'Владислав Сахнов': 'sakhnov',
    'Валерия Итименева': 'itimeneva',
    'Александра Блинова': 'blinova',
    'Татьяна Андреева': 'andreeva',
    'Елена Стефанко': 'stefanko',
    'Елена Малинская': 'malinskaya',
}


def file_to_data_url(path: Path) -> str:
    mime = mimetypes.guess_type(path.name)[0] or 'image/jpeg'
    encoded = base64.b64encode(path.read_bytes()).decode('ascii')
    return f'data:{mime};base64,{encoded}'


def resolve_teacher_id(filename: str, mapping: dict[str, str]) -> str | None:
    stem = Path(filename).stem.lower()
    for source_name, teacher_id in mapping.items():
        variants = [source_name.lower(), teacher_id.lower()]
        if any(v in stem for v in variants):
            return teacher_id
    return None


def main():
    parser = argparse.ArgumentParser(description='Импорт фото преподавателей в Neon/Postgres как data URL.')
    parser.add_argument('photos_dir', help='Папка с фотографиями после распаковки архива')
    parser.add_argument('--mapping', help='JSON-файл с маппингом "Имя преподавателя": "teacher_id"')
    args = parser.parse_args()

    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        raise SystemExit('DATABASE_URL не задан. Установи его перед запуском.')

    mapping = DEFAULT_MAP.copy()
    if args.mapping:
        mapping.update(json.loads(Path(args.mapping).read_text(encoding='utf-8')))

    photos_dir = Path(args.photos_dir)
    if not photos_dir.exists():
        raise SystemExit(f'Папка не найдена: {photos_dir}')

    files = [p for p in photos_dir.rglob('*') if p.is_file() and p.suffix.lower() in {'.jpg', '.jpeg', '.png', '.webp'}]
    if not files:
        raise SystemExit('В папке нет изображений .jpg/.jpeg/.png/.webp')

    conn = psycopg.connect(database_url)
    updated = 0
    skipped = []
    try:
        with conn.cursor() as cur:
            for path in files:
                teacher_id = resolve_teacher_id(path.name, mapping)
                if not teacher_id:
                    skipped.append(path.name)
                    continue
                cur.execute(
                    'UPDATE teachers SET photo_data = %s, updated_at = NOW() WHERE id = %s',
                    (file_to_data_url(path), teacher_id),
                )
                updated += cur.rowcount
        conn.commit()
    finally:
        conn.close()

    print(f'Обновлено записей: {updated}')
    if skipped:
        print('Не удалось сопоставить файлы:')
        for name in skipped:
            print(f' - {name}')


if __name__ == '__main__':
    main()
