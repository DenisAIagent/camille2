import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * GET /api/reservations/[id]/refuse
 * Refuses/cancels an appointment and optionally sends notification to client
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Find the appointment
    const appointment = await prisma.appointment.findUnique({
      where: { id }
    })

    if (!appointment) {
      return new NextResponse(
        `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rendez-vous introuvable</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .container { background: white; padding: 3rem; border-radius: 1rem; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center; max-width: 500px; }
    h1 { color: #dc2626; font-size: 2rem; margin: 0 0 1rem; }
    p { color: #6b7280; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <div style="font-size: 4rem; margin-bottom: 1rem;">❌</div>
    <h1>Rendez-vous introuvable</h1>
    <p>Le rendez-vous demandé n'existe pas ou a été supprimé.</p>
  </div>
</body>
</html>
        `,
        {
          status: 404,
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        }
      )
    }

    // Check if already cancelled
    if (appointment.status === 'CANCELLED') {
      return new NextResponse(
        `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Déjà refusé</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .container { background: white; padding: 3rem; border-radius: 1rem; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center; max-width: 500px; }
    h1 { color: #f59e0b; font-size: 2rem; margin: 0 0 1rem; }
    p { color: #6b7280; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
    <h1>Déjà refusé</h1>
    <p>Ce rendez-vous a déjà été refusé.</p>
  </div>
</body>
</html>
        `,
        {
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        }
      )
    }

    // Check if already confirmed
    if (appointment.status === 'CONFIRMED') {
      return new NextResponse(
        `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Impossible d'annuler</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .container { background: white; padding: 3rem; border-radius: 1rem; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center; max-width: 500px; }
    h1 { color: #f59e0b; font-size: 2rem; margin: 0 0 1rem; }
    p { color: #6b7280; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
    <h1>Rendez-vous déjà confirmé</h1>
    <p>Ce rendez-vous a déjà été confirmé et le patient a été notifié. Veuillez le contacter directement pour l'annuler.</p>
  </div>
</body>
</html>
        `,
        {
          status: 400,
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        }
      )
    }

    // Update appointment status to CANCELLED
    await prisma.appointment.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date()
      }
    })

    // Format date for email
    const dateFormatter = new Intl.DateTimeFormat(
      appointment.locale === 'fr' ? 'fr-FR' : appointment.locale === 'pt' ? 'pt-PT' : 'en-GB',
      {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }
    )
    const formattedDate = dateFormatter.format(new Date(appointment.date))

    // Optionally send cancellation email to client (commented out for now)
    // You may want to notify the patient that their request was declined
    /*
    const translations = {
      fr: {
        subject: 'Demande de rendez-vous - Indisponibilité',
        body: `Bonjour ${appointment.patientName},\n\nMalheureusement, je ne suis pas disponible pour le créneau demandé (${formattedDate} à ${appointment.timeSlot}).\n\nJe vous invite à proposer d'autres dates via le formulaire de réservation.\n\nCordialement,\nCamille Labasse D.O.`
      },
      pt: {
        subject: 'Pedido de consulta - Indisponibilidade',
        body: `Olá ${appointment.patientName},\n\nInfelizmente, não estou disponível para o horário solicitado (${formattedDate} às ${appointment.timeSlot}).\n\nConvido-o a propor outras datas através do formulário de reserva.\n\nCordialmente,\nCamille Labasse D.O.`
      },
      en: {
        subject: 'Appointment request - Unavailability',
        body: `Hello ${appointment.patientName},\n\nUnfortunately, I am not available for the requested time slot (${formattedDate} at ${appointment.timeSlot}).\n\nI invite you to propose other dates via the booking form.\n\nBest regards,\nCamille Labasse D.O.`
      }
    }

    const emailContent = translations[appointment.locale as keyof typeof translations] || translations.pt

    try {
      await resend.emails.send({
        from: 'Camille Labasse Ostéopathe <onboarding@resend.dev>',
        to: appointment.email,
        subject: emailContent.subject,
        text: emailContent.body
      })
    } catch (emailError) {
      console.error('Error sending cancellation email:', emailError)
      // Continue anyway
    }
    */

    // Return success page
    return new NextResponse(
      `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rendez-vous refusé</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); }
    .container { background: white; padding: 3rem; border-radius: 1rem; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center; max-width: 500px; }
    h1 { color: #dc2626; font-size: 2rem; margin: 0 0 1rem; }
    p { color: #6b7280; line-height: 1.6; margin-bottom: 1.5rem; }
    .details { background: #fef2f2; padding: 1.5rem; border-radius: 0.5rem; margin: 1.5rem 0; text-align: left; }
    .details strong { color: #991b1b; }
    .icon { font-size: 5rem; margin-bottom: 1rem; }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">❌</div>
    <h1>Rendez-vous refusé</h1>
    <p>Le rendez-vous a été refusé et marqué comme annulé.</p>
    <div class="details">
      <p style="margin: 0 0 0.5rem;"><strong>Patient :</strong> ${appointment.patientName}</p>
      <p style="margin: 0 0 0.5rem;"><strong>Date :</strong> ${formattedDate}</p>
      <p style="margin: 0;"><strong>Heure :</strong> ${appointment.timeSlot}</p>
    </div>
    <p style="color: #6b7280; font-size: 0.9rem;">Si vous souhaitez contacter le patient, voici ses coordonnées :</p>
    <p style="color: #667eea; font-size: 0.9rem;">
      📧 ${appointment.email}<br>
      📱 ${appointment.phone}
    </p>
  </div>
</body>
</html>
      `,
      {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      }
    )

  } catch (error) {
    console.error('Error refusing appointment:', error)
    return new NextResponse(
      `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Erreur</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .container { background: white; padding: 3rem; border-radius: 1rem; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center; max-width: 500px; }
    h1 { color: #dc2626; font-size: 2rem; margin: 0 0 1rem; }
    p { color: #6b7280; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
    <h1>Erreur serveur</h1>
    <p>Une erreur est survenue lors du refus. Veuillez réessayer.</p>
  </div>
</body>
</html>
      `,
      {
        status: 500,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      }
    )
  }
}
