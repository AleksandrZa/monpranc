'use client'

import { useState } from 'react'
import { getTeacherImage, TeacherRecord } from '@/data/teachers'

interface TeacherAvatarProps {
  teacher: Partial<TeacherRecord>
  className?: string
  square?: boolean
}

export default function TeacherAvatar({
  teacher,
  className = '',
  square = false,
}: TeacherAvatarProps) {
  const src = getTeacherImage(teacher)
  const shape = square ? 'rounded-2xl' : 'rounded-full'
  const [isLoading, setIsLoading] = useState(Boolean(src))

  if (src) {
    return (
      <div
        className={`${shape} relative overflow-hidden bg-gradient-to-br from-gold/20 to-gold-dark/20 border border-gold/30 ${className}`}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gold/10 to-gold-dark/10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
          </div>
        )}

        <img
          src={src}
          alt={teacher.name || 'Фото преподавателя'}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />
      </div>
    )
  }

  return (
    <div
      className={`${shape} bg-gradient-to-br from-gold/20 to-gold-dark/20 border border-gold/30 flex items-center justify-center ${className}`}
    >
      <span className="font-playfair font-bold text-gold">
        {teacher.name?.[0] ?? '?'}
      </span>
    </div>
  )
}
