'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TimeSlot {
  time: string
  available: boolean
}

interface TimeSlotPickerProps {
  selectedDate: Date | undefined
  selectedTime: string | undefined
  onTimeSelect: (time: string) => void
  locale?: string
}

// Créneaux horaires du cabinet (9h-18h, pause déjeuner 12h30-14h)
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = []

  // Matin: 9h00 - 12h30 (par créneaux de 30 min)
  const morningStart = 9
  const morningEnd = 12.5

  for (let hour = morningStart; hour < morningEnd; hour += 0.5) {
    const h = Math.floor(hour)
    const m = hour % 1 === 0 ? '00' : '30'
    slots.push({
      time: `${h.toString().padStart(2, '0')}:${m}`,
      available: true // Sera vérifiée avec l'API plus tard
    })
  }

  // Après-midi: 14h00 - 18h00
  const afternoonStart = 14
  const afternoonEnd = 18

  for (let hour = afternoonStart; hour < afternoonEnd; hour += 0.5) {
    const h = Math.floor(hour)
    const m = hour % 1 === 0 ? '00' : '30'
    slots.push({
      time: `${h.toString().padStart(2, '0')}:${m}`,
      available: true
    })
  }

  return slots
}

export function TimeSlotPicker({
  selectedDate,
  selectedTime,
  onTimeSelect,
  locale = 'pt'
}: TimeSlotPickerProps) {
  const timeSlots = generateTimeSlots()

  if (!selectedDate) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {locale === 'fr' && 'Veuillez d\'abord sélectionner une date'}
        {locale === 'pt' && 'Por favor, selecione primeiro uma data'}
        {locale === 'en' && 'Please select a date first'}
      </div>
    )
  }

  // Simuler l'indisponibilité de certains créneaux (pour le prototype)
  // Plus tard, on vérifierait via API
  const isSlotAvailable = (time: string) => {
    // Pour le prototype, rendre aléatoirement quelques créneaux indisponibles
    const randomUnavailable = ['10:00', '14:30', '16:00']
    return !randomUnavailable.includes(time)
  }

  const formatDateHeader = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }

    const localeMap = {
      fr: 'fr-FR',
      pt: 'pt-PT',
      en: 'en-GB'
    }

    return date.toLocaleDateString(localeMap[locale as keyof typeof localeMap] || 'pt-PT', options)
  }

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-center capitalize">
        {formatDateHeader(selectedDate)}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
        {timeSlots.map((slot) => {
          const available = isSlotAvailable(slot.time)
          const isSelected = selectedTime === slot.time

          return (
            <Button
              key={slot.time}
              variant={isSelected ? 'default' : 'outline'}
              size="sm"
              disabled={!available}
              onClick={() => onTimeSelect(slot.time)}
              className={cn(
                'font-mono text-sm',
                !available && 'opacity-50 cursor-not-allowed',
                isSelected && 'bg-primary text-primary-foreground'
              )}
            >
              {slot.time}
            </Button>
          )
        })}
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground justify-center pt-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-input rounded" />
          <span>
            {locale === 'fr' && 'Disponible'}
            {locale === 'pt' && 'Disponível'}
            {locale === 'en' && 'Available'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary rounded" />
          <span>
            {locale === 'fr' && 'Sélectionné'}
            {locale === 'pt' && 'Selecionado'}
            {locale === 'en' && 'Selected'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-muted rounded opacity-50" />
          <span>
            {locale === 'fr' && 'Indisponible'}
            {locale === 'pt' && 'Indisponível'}
            {locale === 'en' && 'Unavailable'}
          </span>
        </div>
      </div>
    </div>
  )
}
