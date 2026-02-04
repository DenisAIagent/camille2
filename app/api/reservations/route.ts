import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { prisma } from '@/lib/prisma'
import { getCamilleNotificationEmail } from '@/lib/email-templates/camille-notification'
import { generateGoogleCalendarURL, createCamilleCalendarEvent } from '@/lib/calendar'

const resend = new Resend(process.env.RESEND_API_KEY)

// Email de test (à changer en production)
const TEST_EMAIL = 'adpromo.media@gmail.com'
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || TEST_EMAIL

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, date, time, notes, locale } = body

    // Validation
    if (!name || !email || !phone || !date || !time) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      )
    }

    // Formater la date
    const appointmentDate = new Date(date)
    const dateFormatter = new Intl.DateTimeFormat(
      locale === 'fr' ? 'fr-FR' : locale === 'pt' ? 'pt-PT' : 'en-GB',
      {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }
    )
    const formattedDate = dateFormatter.format(appointmentDate)

    // Save appointment to database
    const appointment = await prisma.appointment.create({
      data: {
        patientName: name,
        email,
        phone,
        date: appointmentDate,
        timeSlot: time,
        notes: notes || null,
        locale: locale || 'pt',
        status: 'PENDING'
      }
    })

    // Generate Google Calendar URL for Camille
    const calendarEvent = createCamilleCalendarEvent(
      appointmentDate,
      time,
      name,
      email,
      notes
    )
    const calendarUrl = generateGoogleCalendarURL(calendarEvent)

    // Generate email notification for Camille with Accept/Refuse buttons
    const emailHtml = getCamilleNotificationEmail({
      id: appointment.id,
      patientName: name,
      email,
      phone,
      date: formattedDate,
      time,
      notes,
      calendarUrl
    })

    // Envoyer l'email via Resend
    const { data, error } = await resend.emails.send({
      from: 'Réservations Ostéopathe <onboarding@resend.dev>',
      to: CONTACT_EMAIL,
      // replyTo: email, // Disabled for Resend free tier with onboarding@resend.dev
      subject: `📅 Nouvelle demande de RDV - ${name} (${email})`,
      html: emailHtml,
    })

    if (error) {
      console.error('Erreur Resend:', error)
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email', details: error },
        { status: 500 }
      )
    }

    console.log('Email envoyé avec succès:', data)
    console.log('Rendez-vous créé:', appointment.id)

    return NextResponse.json({
      success: true,
      message: 'Demande de réservation envoyée avec succès',
      appointmentId: appointment.id,
      emailId: data?.id
    })

  } catch (error) {
    console.error('Erreur API reservations:', error)
    return NextResponse.json(
      { error: 'Erreur serveur', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
