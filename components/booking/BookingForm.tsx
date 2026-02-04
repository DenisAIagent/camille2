'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { TimeSlotPicker } from './TimeSlotPicker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { addDays, isSunday, isMonday } from 'date-fns'
import { fr, pt, enUS } from 'date-fns/locale'
import { Calendar as CalendarIcon, Clock, User, Mail, Phone, MessageSquare, CheckCircle2 } from 'lucide-react'

interface BookingFormProps {
  locale?: string
}

export function BookingForm({ locale = 'pt' }: BookingFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState<string | undefined>()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Désactiver dimanches et lundis (jours de fermeture) + dates passées
  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today || isSunday(date) || isMonday(date)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDate || !selectedTime) {
      alert(locale === 'fr' ? 'Veuillez sélectionner une date et un horaire' :
            locale === 'pt' ? 'Por favor, selecione uma data e horário' :
            'Please select a date and time')
      return
    }

    setIsSubmitting(true)

    try {
      // Appel API pour envoyer l'email
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date: selectedDate.toISOString(),
          time: selectedTime,
          notes: formData.notes,
          locale
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi')
      }

      console.log('Réservation envoyée avec succès:', data)
      setIsSuccess(true)

    } catch (error) {
      console.error('Erreur lors de la réservation:', error)
      alert(
        locale === 'fr' ? 'Erreur lors de l\'envoi. Veuillez réessayer.' :
        locale === 'pt' ? 'Erro ao enviar. Por favor, tente novamente.' :
        'Error sending. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const getTexts = () => {
    switch (locale) {
      case 'fr':
        return {
          title: 'Réserver un rendez-vous',
          description: 'Sélectionnez une date et un horaire pour votre consultation',
          step1: 'Étape 1: Choisir une date',
          step2: 'Étape 2: Choisir un créneau',
          step3: 'Étape 3: Vos coordonnées',
          nameLabel: 'Nom complet',
          namePlaceholder: 'Jean Dupont',
          emailLabel: 'Email',
          emailPlaceholder: 'jean.dupont@exemple.com',
          phoneLabel: 'Téléphone',
          phonePlaceholder: '+351 912 345 678',
          notesLabel: 'Notes (optionnel)',
          notesPlaceholder: 'Précisez le motif de votre consultation...',
          submitButton: 'Confirmer le rendez-vous',
          submitting: 'Envoi en cours...',
          successTitle: 'Demande envoyée !',
          successMessage: 'Camille va confirmer votre rendez-vous par email sous 24h.',
          newBooking: 'Nouvelle réservation',
          closedDays: 'Cabinet fermé dimanche et lundi'
        }
      case 'pt':
        return {
          title: 'Marcar consulta',
          description: 'Selecione uma data e horário para a sua consulta',
          step1: 'Passo 1: Escolher data',
          step2: 'Passo 2: Escolher horário',
          step3: 'Passo 3: Suas informações',
          nameLabel: 'Nome completo',
          namePlaceholder: 'João Silva',
          emailLabel: 'Email',
          emailPlaceholder: 'joao.silva@exemplo.com',
          phoneLabel: 'Telefone',
          phonePlaceholder: '+351 912 345 678',
          notesLabel: 'Notas (opcional)',
          notesPlaceholder: 'Descreva o motivo da consulta...',
          submitButton: 'Confirmar consulta',
          submitting: 'Enviando...',
          successTitle: 'Pedido enviado!',
          successMessage: 'Camille vai confirmar a sua consulta por email em 24h.',
          newBooking: 'Nova marcação',
          closedDays: 'Consultório fechado domingo e segunda'
        }
      default: // en
        return {
          title: 'Book an appointment',
          description: 'Select a date and time for your consultation',
          step1: 'Step 1: Choose a date',
          step2: 'Step 2: Choose a time slot',
          step3: 'Step 3: Your information',
          nameLabel: 'Full name',
          namePlaceholder: 'John Doe',
          emailLabel: 'Email',
          emailPlaceholder: 'john.doe@example.com',
          phoneLabel: 'Phone',
          phonePlaceholder: '+351 912 345 678',
          notesLabel: 'Notes (optional)',
          notesPlaceholder: 'Describe the reason for your consultation...',
          submitButton: 'Confirm appointment',
          submitting: 'Sending...',
          successTitle: 'Request sent!',
          successMessage: 'Camille will confirm your appointment by email within 24h.',
          newBooking: 'New booking',
          closedDays: 'Office closed Sunday and Monday'
        }
    }
  }

  const texts = getTexts()

  if (isSuccess) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-12 pb-12 text-center space-y-4">
          <CheckCircle2 className="w-16 h-16 mx-auto text-green-600 dark:text-green-500" />
          <h2 className="text-2xl font-bold text-green-600 dark:text-green-500">
            {texts.successTitle}
          </h2>
          <p className="text-muted-foreground">
            {texts.successMessage}
          </p>
          <div className="bg-muted/50 dark:bg-muted/20 p-4 rounded-lg space-y-2 text-sm">
            <div className="flex items-center justify-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              <span>{selectedDate?.toLocaleDateString(locale === 'fr' ? 'fr-FR' : locale === 'pt' ? 'pt-PT' : 'en-GB')}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{selectedTime}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <User className="w-4 h-4" />
              <span>{formData.name}</span>
            </div>
          </div>
          <Button
            onClick={() => {
              setIsSuccess(false)
              setSelectedDate(undefined)
              setSelectedTime(undefined)
              setFormData({ name: '', email: '', phone: '', notes: '' })
            }}
            variant="outline"
          >
            {texts.newBooking}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl">{texts.title}</CardTitle>
        <CardDescription>{texts.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Étape 1: Calendrier */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">{texts.step1}</h3>
            </div>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={isDateDisabled}
                className="rounded-md border"
                locale={locale === 'fr' ? fr : locale === 'pt' ? pt : enUS}
              />
            </div>
            <p className="text-xs text-center text-muted-foreground">
              {texts.closedDays}
            </p>
          </div>

          <Separator />

          {/* Étape 2: Créneaux horaires */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">{texts.step2}</h3>
            </div>
            <TimeSlotPicker
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onTimeSelect={setSelectedTime}
              locale={locale}
            />
          </div>

          <Separator />

          {/* Étape 3: Formulaire de contact */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">{texts.step3}</h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">{texts.nameLabel} *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={texts.namePlaceholder}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{texts.emailLabel} *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={texts.emailPlaceholder}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="phone">{texts.phoneLabel} *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder={texts.phonePlaceholder}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">{texts.notesLabel}</Label>
                <Textarea
                  id="notes"
                  placeholder={texts.notesPlaceholder}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={!selectedDate || !selectedTime || isSubmitting}
          >
            {isSubmitting ? texts.submitting : texts.submitButton}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
