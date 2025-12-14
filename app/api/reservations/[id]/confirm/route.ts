import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import { getClientConfirmationEmail } from '@/lib/email-templates/client-confirmation'
import { generateGoogleCalendarURL, createPatientCalendarEvent } from '@/lib/calendar'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * GET /api/reservations/[id]/confirm
 * Confirms an appointment and sends confirmation email to client
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

    // Check if already confirmed
    if (appointment.status === 'CONFIRMED') {
      return new NextResponse(
        `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Déjà confirmé</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .container { background: white; padding: 3rem; border-radius: 1rem; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center; max-width: 500px; }
    h1 { color: #10b981; font-size: 2rem; margin: 0 0 1rem; }
    p { color: #6b7280; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <div style="font-size: 4rem; margin-bottom: 1rem;">✅</div>
    <h1>Déjà confirmé</h1>
    <p>Ce rendez-vous a déjà été confirmé. Le patient a reçu un email de confirmation.</p>
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

    // Check if already cancelled
    if (appointment.status === 'CANCELLED') {
      return new NextResponse(
        `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rendez-vous annulé</title>
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
    <h1>Rendez-vous annulé</h1>
    <p>Ce rendez-vous a déjà été refusé et ne peut plus être confirmé.</p>
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

    // Update appointment status to CONFIRMED
    await prisma.appointment.update({
      where: { id },
      data: {
        status: 'CONFIRMED',
        confirmedAt: new Date()
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

    // Generate Google Calendar URL
    const calendarEvent = createPatientCalendarEvent(
      new Date(appointment.date),
      appointment.timeSlot,
      appointment.patientName,
      appointment.email,
      appointment.locale
    )
    const calendarUrl = generateGoogleCalendarURL(calendarEvent)

    // Send confirmation email to client
    // DISABLED: Resend free tier with onboarding@resend.dev can only send to adpromo.media@gmail.com
    // TODO: Enable this when domain is verified at resend.com/domains
    /*
    const emailContent = getClientConfirmationEmail({
      id: appointment.id,
      patientName: appointment.patientName,
      date: formattedDate,
      time: appointment.timeSlot,
      locale: appointment.locale,
      calendarUrl
    })

    try {
      await resend.emails.send({
        from: 'Camille Labasse Ostéopathe <onboarding@resend.dev>',
        to: appointment.email,
        subject: emailContent.subject,
        html: emailContent.html
      })
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError)
      // Continue anyway - appointment is confirmed
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
  <title>Rendez-vous confirmé</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
    .container { background: white; padding: 3rem; border-radius: 1rem; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center; max-width: 500px; }
    h1 { color: #10b981; font-size: 2rem; margin: 0 0 1rem; }
    p { color: #6b7280; line-height: 1.6; margin-bottom: 1.5rem; }
    .details { background: #f0fdf4; padding: 1.5rem; border-radius: 0.5rem; margin: 1.5rem 0; text-align: left; }
    .details strong { color: #065f46; }
    .checkmark { font-size: 5rem; margin-bottom: 1rem; animation: scaleIn 0.5s ease-out; }
    @keyframes scaleIn { from { transform: scale(0); } to { transform: scale(1); } }
  </style>
</head>
<body>
  <div class="container">
    <div class="checkmark">✅</div>
    <h1>Rendez-vous confirmé !</h1>
    <p>Le rendez-vous a été confirmé avec succès.</p>
    <div class="details">
      <p style="margin: 0 0 0.5rem;"><strong>Patient :</strong> ${appointment.patientName}</p>
      <p style="margin: 0 0 0.5rem;"><strong>Date :</strong> ${formattedDate}</p>
      <p style="margin: 0;"><strong>Heure :</strong> ${appointment.timeSlot}</p>
    </div>
    <p style="color: #f59e0b; font-weight: 600;">⚠️ Le patient n'a pas reçu d'email automatique. Veuillez le contacter directement.</p>
    <p style="color: #6b7280; font-size: 0.9rem;">
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
    console.error('Error confirming appointment:', error)
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
    <p>Une erreur est survenue lors de la confirmation. Veuillez réessayer.</p>
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
