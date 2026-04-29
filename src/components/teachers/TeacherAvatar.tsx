import { getTeacherImage, TeacherRecord } from '@/data/teachers';

interface TeacherAvatarProps {
  teacher: Partial<TeacherRecord>;
  className?: string;
  square?: boolean;
}

export default function TeacherAvatar({ teacher, className = '', square = false }: TeacherAvatarProps) {
  const src = getTeacherImage(teacher);
  const shape = square ? 'rounded-2xl' : 'rounded-full';

  if (src) {
    return (
      <div className={`${shape} overflow-hidden bg-gradient-to-br from-gold/20 to-gold-dark/20 border border-gold/30 ${className}`}>
        <img
          src={src}
          alt={teacher.name || 'Фото преподавателя'}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className={`${shape} bg-gradient-to-br from-gold/20 to-gold-dark/20 border border-gold/30 flex items-center justify-center ${className}`}>
      <span className="font-playfair font-bold text-gold">
        {teacher.name?.[0] ?? '?'}
      </span>
    </div>
  );
}
