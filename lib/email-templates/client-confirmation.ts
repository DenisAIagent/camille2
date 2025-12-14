/**
 * Email template for client - Appointment confirmation
 * Includes Google Calendar link and pre-session recommendations
 * Multi-language support (FR, PT, EN)
 */

interface ConfirmationDetails {
  id: string
  patientName: string
  date: string // Formatted date string
  time: string
  locale: string
  calendarUrl: string // Google Calendar add URL
}

interface LocalizedContent {
  subject: string
  greeting: string
  confirmed: string
  appointmentDetails: string
  dateLabel: string
  timeLabel: string
  locationLabel: string
  location: string
  addToCalendar: string
  recommendationsTitle: string
  recommendations: Array<{
    icon: string
    title: string
    description: string
  }>
  importantNote: string
  importantNoteText: string
  contactTitle: string
  contactText: string
  closing: string
  signature: string
  footerText: string
}

const translations: Record<string, LocalizedContent> = {
  fr: {
    subject: 'Votre rendez-vous est confirmé ✅',
    greeting: 'Bonjour',
    confirmed: 'Votre rendez-vous d\'ostéopathie est confirmé ! 🎉',
    appointmentDetails: 'Détails du rendez-vous',
    dateLabel: 'Date',
    timeLabel: 'Heure',
    locationLabel: 'Lieu',
    location: 'Avenida de Roma, 1000-260 Lisboa, Portugal',
    addToCalendar: '📅 Ajouter à mon agenda',
    recommendationsTitle: 'Recommandations pour une séance optimale',
    recommendations: [
      {
        icon: '👕',
        title: 'Vêtements confortables',
        description: 'Portez des vêtements souples et confortables. Évitez les jeans serrés ou les ceintures rigides.'
      },
      {
        icon: '💧',
        title: 'Hydratation',
        description: 'Hydratez-vous bien avant et après la séance pour faciliter l\'élimination des toxines.'
      },
      {
        icon: '🍽️',
        title: 'Repas légers',
        description: 'Évitez les repas copieux dans l\'heure précédant votre consultation.'
      },
      {
        icon: '⏰',
        title: 'Ponctualité',
        description: 'Arrivez 5 minutes en avance pour vous installer tranquillement.'
      },
      {
        icon: '📋',
        title: 'Examens médicaux',
        description: 'Si vous avez des examens médicaux récents (radiographies, IRM, etc.), pensez à les apporter.'
      }
    ],
    importantNote: 'Important',
    importantNoteText: 'Si vous devez annuler ou reporter votre rendez-vous, merci de nous prévenir au moins 24h à l\'avance.',
    contactTitle: 'Questions ?',
    contactText: 'N\'hésitez pas à nous contacter si vous avez des questions avant votre rendez-vous.',
    closing: 'Au plaisir de vous recevoir,',
    signature: 'Camille Labasse D.O.<br>Ostéopathe',
    footerText: 'Cabinet d\'Ostéopathie - Avenida de Roma, 1000-260 Lisboa, Portugal'
  },
  pt: {
    subject: 'A sua consulta está confirmada ✅',
    greeting: 'Olá',
    confirmed: 'A sua consulta de osteopatia está confirmada! 🎉',
    appointmentDetails: 'Detalhes da consulta',
    dateLabel: 'Data',
    timeLabel: 'Hora',
    locationLabel: 'Local',
    location: 'Avenida de Roma, 1000-260 Lisboa, Portugal',
    addToCalendar: '📅 Adicionar à minha agenda',
    recommendationsTitle: 'Recomendações para uma sessão ideal',
    recommendations: [
      {
        icon: '👕',
        title: 'Roupa confortável',
        description: 'Use roupas soltas e confortáveis. Evite calças justas ou cintos rígidos.'
      },
      {
        icon: '💧',
        title: 'Hidratação',
        description: 'Hidrate-se bem antes e depois da sessão para facilitar a eliminação de toxinas.'
      },
      {
        icon: '🍽️',
        title: 'Refeições leves',
        description: 'Evite refeições pesadas na hora anterior à sua consulta.'
      },
      {
        icon: '⏰',
        title: 'Pontualidade',
        description: 'Chegue 5 minutos mais cedo para se instalar tranquilamente.'
      },
      {
        icon: '📋',
        title: 'Exames médicos',
        description: 'Se tiver exames médicos recentes (radiografias, ressonâncias, etc.), lembre-se de os trazer.'
      }
    ],
    importantNote: 'Importante',
    importantNoteText: 'Se precisar cancelar ou remarcar a sua consulta, agradeço que me avise com pelo menos 24h de antecedência.',
    contactTitle: 'Dúvidas?',
    contactText: 'Não hesite em contactar-me se tiver alguma dúvida antes da sua consulta.',
    closing: 'Até breve,',
    signature: 'Camille Labasse D.O.<br>Osteopata',
    footerText: 'Consultório de Osteopatia - Avenida de Roma, 1000-260 Lisboa, Portugal'
  },
  en: {
    subject: 'Your appointment is confirmed ✅',
    greeting: 'Hello',
    confirmed: 'Your osteopathy appointment is confirmed! 🎉',
    appointmentDetails: 'Appointment details',
    dateLabel: 'Date',
    timeLabel: 'Time',
    locationLabel: 'Location',
    location: 'Avenida de Roma, 1000-260 Lisbon, Portugal',
    addToCalendar: '📅 Add to my calendar',
    recommendationsTitle: 'Recommendations for an optimal session',
    recommendations: [
      {
        icon: '👕',
        title: 'Comfortable clothing',
        description: 'Wear loose, comfortable clothing. Avoid tight jeans or rigid belts.'
      },
      {
        icon: '💧',
        title: 'Hydration',
        description: 'Hydrate well before and after the session to facilitate toxin elimination.'
      },
      {
        icon: '🍽️',
        title: 'Light meals',
        description: 'Avoid heavy meals in the hour before your consultation.'
      },
      {
        icon: '⏰',
        title: 'Punctuality',
        description: 'Arrive 5 minutes early to settle in comfortably.'
      },
      {
        icon: '📋',
        title: 'Medical exams',
        description: 'If you have recent medical exams (X-rays, MRI, etc.), remember to bring them.'
      }
    ],
    importantNote: 'Important',
    importantNoteText: 'If you need to cancel or reschedule your appointment, please notify us at least 24 hours in advance.',
    contactTitle: 'Questions?',
    contactText: 'Feel free to contact us if you have any questions before your appointment.',
    closing: 'Looking forward to seeing you,',
    signature: 'Camille Labasse D.O.<br>Osteopath',
    footerText: 'Osteopathy Practice - Avenida de Roma, 1000-260 Lisbon, Portugal'
  }
}

export function getClientConfirmationEmail(details: ConfirmationDetails): { subject: string, html: string } {
  const content = translations[details.locale] || translations.pt

  const html = `
<!DOCTYPE html>
<html lang="${details.locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header with gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
              <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                ${content.confirmed}
              </h1>
            </td>
          </tr>

          <!-- Main content -->
          <tr>
            <td style="padding: 40px 30px;">

              <!-- Greeting -->
              <p style="margin: 0 0 25px; color: #374151; font-size: 16px; line-height: 1.5;">
                ${content.greeting} ${details.patientName},
              </p>

              <!-- Appointment details card -->
              <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 25px; border-radius: 8px; margin-bottom: 30px;">
                <h2 style="margin: 0 0 20px; color: #065f46; font-size: 18px; font-weight: 600;">
                  ${content.appointmentDetails}
                </h2>

                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-bottom: 12px;">
                      <p style="margin: 0; color: #065f46; font-size: 14px; font-weight: 600;">
                        📆 ${content.dateLabel}
                      </p>
                      <p style="margin: 5px 0 0; color: #111827; font-size: 16px;">
                        ${details.date}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 12px;">
                      <p style="margin: 0; color: #065f46; font-size: 14px; font-weight: 600;">
                        🕐 ${content.timeLabel}
                      </p>
                      <p style="margin: 5px 0 0; color: #111827; font-size: 16px;">
                        ${details.time}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p style="margin: 0; color: #065f46; font-size: 14px; font-weight: 600;">
                        📍 ${content.locationLabel}
                      </p>
                      <p style="margin: 5px 0 0; color: #111827; font-size: 16px;">
                        ${content.location}
                      </p>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Google Calendar button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 40px;">
                <tr>
                  <td align="center">
                    <a href="${details.calendarUrl}" target="_blank" style="display: inline-block; padding: 16px 32px; background-color: #667eea; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);">
                      ${content.addToCalendar}
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Recommendations -->
              <h2 style="margin: 0 0 25px; color: #111827; font-size: 20px; font-weight: 600; text-align: center;">
                ${content.recommendationsTitle}
              </h2>

              ${content.recommendations.map(rec => `
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 15px; border: 1px solid #e5e7eb;">
                <div style="display: flex; align-items: flex-start;">
                  <div style="font-size: 28px; margin-right: 15px; line-height: 1;">
                    ${rec.icon}
                  </div>
                  <div>
                    <h3 style="margin: 0 0 8px; color: #111827; font-size: 15px; font-weight: 600;">
                      ${rec.title}
                    </h3>
                    <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                      ${rec.description}
                    </p>
                  </div>
                </div>
              </div>
              `).join('')}

              <!-- Important note -->
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px; margin: 30px 0;">
                <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 1.6;">
                  ⚠️ <strong>${content.importantNote}:</strong> ${content.importantNoteText}
                </p>
              </div>

              <!-- Contact section -->
              <div style="background-color: #eff6ff; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <h3 style="margin: 0 0 10px; color: #1e40af; font-size: 16px; font-weight: 600;">
                  💬 ${content.contactTitle}
                </h3>
                <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
                  ${content.contactText}
                </p>
              </div>

              <!-- Closing -->
              <p style="margin: 30px 0 0; color: #374151; font-size: 15px; line-height: 1.6;">
                ${content.closing}<br>
                <span style="color: #111827; font-weight: 600;">${content.signature}</span>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px 30px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center; line-height: 1.5;">
                ${content.footerText}
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

  return {
    subject: content.subject,
    html
  }
}
