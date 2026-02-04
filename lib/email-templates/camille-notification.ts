/**
 * Email template for Camille - New appointment notification
 * Includes Accept/Refuse buttons and Google Calendar integration
 */

interface AppointmentDetails {
  id: string
  patientName: string
  email: string
  phone: string
  date: string // Formatted date string
  time: string
  notes?: string
  calendarUrl: string // Google Calendar add URL
}

export function getCamilleNotificationEmail(details: AppointmentDetails): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const confirmUrl = `${baseUrl}/api/reservations/${details.id}/confirm`
  const refuseUrl = `${baseUrl}/api/reservations/${details.id}/refuse`

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouvelle demande de rendez-vous</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header with gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                📅 Nouvelle demande de rendez-vous
              </h1>
              <p style="margin: 10px 0 0; color: #e0e7ff; font-size: 14px;">
                Action requise - Veuillez confirmer ou refuser
              </p>
            </td>
          </tr>

          <!-- Main content -->
          <tr>
            <td style="padding: 40px 30px;">

              <!-- Greeting -->
              <p style="margin: 0 0 25px; color: #374151; font-size: 16px; line-height: 1.5;">
                Bonjour Camille,
              </p>

              <p style="margin: 0 0 30px; color: #374151; font-size: 16px; line-height: 1.5;">
                Vous avez reçu une nouvelle demande de rendez-vous. Voici les détails :
              </p>

              <!-- Appointment details card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 25px;">

                    <!-- Patient name -->
                    <div style="margin-bottom: 20px;">
                      <p style="margin: 0 0 5px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                        Patient
                      </p>
                      <p style="margin: 0; color: #111827; font-size: 18px; font-weight: 600;">
                        ${details.patientName}
                      </p>
                    </div>

                    <!-- Date and time -->
                    <div style="margin-bottom: 20px;">
                      <p style="margin: 0 0 5px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                        Date et heure
                      </p>
                      <p style="margin: 0; color: #111827; font-size: 16px; font-weight: 500;">
                        📆 ${details.date}
                      </p>
                      <p style="margin: 5px 0 0; color: #111827; font-size: 16px; font-weight: 500;">
                        🕐 ${details.time}
                      </p>
                    </div>

                    <!-- Contact info -->
                    <div style="margin-bottom: 20px;">
                      <p style="margin: 0 0 5px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                        Contact
                      </p>
                      <p style="margin: 0; color: #111827; font-size: 14px;">
                        📧 <a href="mailto:${details.email}" style="color: #667eea; text-decoration: none;">${details.email}</a>
                      </p>
                      <p style="margin: 5px 0 0; color: #111827; font-size: 14px;">
                        📱 <a href="tel:${details.phone}" style="color: #667eea; text-decoration: none;">${details.phone}</a>
                      </p>
                    </div>

                    ${details.notes ? `
                    <!-- Notes -->
                    <div style="margin-bottom: 0;">
                      <p style="margin: 0 0 5px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                        Notes du patient
                      </p>
                      <p style="margin: 0; color: #111827; font-size: 14px; line-height: 1.6; padding: 12px; background-color: #ffffff; border-left: 3px solid #667eea; border-radius: 4px;">
                        ${details.notes}
                      </p>
                    </div>
                    ` : ''}

                  </td>
                </tr>
              </table>

              <!-- Action buttons -->
              <p style="margin: 0 0 20px; color: #374151; font-size: 15px; font-weight: 600; text-align: center;">
                Que souhaitez-vous faire ?
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <!-- Accept button -->
                  <td width="48%" align="center">
                    <a href="${confirmUrl}" style="display: inline-block; width: 100%; padding: 16px 24px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; text-align: center; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);">
                      ✅ Accepter
                    </a>
                  </td>
                  <td width="4%"></td>
                  <!-- Refuse button -->
                  <td width="48%" align="center">
                    <a href="${refuseUrl}" style="display: inline-block; width: 100%; padding: 16px 24px; background-color: #ef4444; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; text-align: center; box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);">
                      ❌ Refuser
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Google Calendar button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <a href="${details.calendarUrl}" target="_blank" style="display: inline-block; padding: 14px 28px; background-color: #667eea; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);">
                      📅 Ajouter à Google Calendar
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Info note -->
              <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 4px; margin-bottom: 20px;">
                <p style="margin: 0; color: #1e40af; font-size: 13px; line-height: 1.6;">
                  💡 <strong>Note :</strong> En cliquant sur "Accepter", un email de confirmation sera automatiquement envoyé au patient avec les détails du rendez-vous et les recommandations de préparation.
                </p>
              </div>

              <!-- Closing -->
              <p style="margin: 30px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Bonne journée,<br>
                <span style="color: #374151; font-weight: 500;">Votre système de réservation</span>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px 30px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center; line-height: 1.5;">
                Cet email a été envoyé automatiquement depuis votre site de réservation.<br>
                Cabinet d'Ostéopathie - Rua Rodrigues Sampaio n76, 1º andar, 1150-279 Lisboa, Portugal
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}
