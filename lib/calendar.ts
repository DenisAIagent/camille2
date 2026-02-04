/**
 * Google Calendar .ics file generator
 * Generates iCalendar format files for appointment booking
 */

interface CalendarEvent {
  title: string
  description: string
  location: string
  startDate: Date
  endDate: Date
  organizerEmail: string
  attendeeEmail: string
  attendeeName: string
}

/**
 * Format date to iCalendar DTSTART/DTEND format
 * Format: YYYYMMDDTHHMMSSZ (UTC)
 */
function formatICalDate(date: Date): string {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const seconds = String(date.getUTCSeconds()).padStart(2, '0')

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`
}

/**
 * Generate a unique UID for the calendar event
 */
function generateUID(appointmentId: string): string {
  return `appointment-${appointmentId}@camille-osteopathe.com`
}

/**
 * Escape special characters for iCalendar format
 */
function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

/**
 * Generate .ics file content for Google Calendar
 *
 * @param event - Calendar event details
 * @param appointmentId - Unique appointment ID
 * @returns iCalendar format string
 */
export function generateICS(event: CalendarEvent, appointmentId: string): string {
  const now = new Date()
  const dtstamp = formatICalDate(now)
  const dtstart = formatICalDate(event.startDate)
  const dtend = formatICalDate(event.endDate)
  const uid = generateUID(appointmentId)

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Camille Labasse Ostéopathe//Booking System//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    `SUMMARY:${escapeICalText(event.title)}`,
    `DESCRIPTION:${escapeICalText(event.description)}`,
    `LOCATION:${escapeICalText(event.location)}`,
    `ORGANIZER;CN=Camille Labasse:mailto:${event.organizerEmail}`,
    `ATTENDEE;CN=${escapeICalText(event.attendeeName)};RSVP=TRUE:mailto:${event.attendeeEmail}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Rendez-vous ostéopathie demain',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n')

  return icsContent
}

/**
 * Generate Google Calendar URL for adding event
 * Alternative to .ics file download
 */
export function generateGoogleCalendarURL(event: CalendarEvent): string {
  const baseUrl = 'https://calendar.google.com/calendar/render'

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatICalDate(event.startDate)}/${formatICalDate(event.endDate)}`,
    details: event.description,
    location: event.location,
    sf: 'true',
    output: 'xml'
  })

  return `${baseUrl}?${params.toString()}`
}

/**
 * Create appointment event for Camille's calendar
 */
export function createCamilleCalendarEvent(
  appointmentDate: Date,
  timeSlot: string,
  patientName: string,
  patientEmail: string,
  notes?: string
): CalendarEvent {
  // Parse time slot (e.g., "09:00")
  const [hours, minutes] = timeSlot.split(':').map(Number)

  // Create start date/time
  const startDate = new Date(appointmentDate)
  startDate.setHours(hours, minutes, 0, 0)

  // End time: 1 hour later
  const endDate = new Date(startDate)
  endDate.setHours(hours + 1, minutes, 0, 0)

  const description = [
    `Patient: ${patientName}`,
    `Email: ${patientEmail}`,
    notes ? `Notes: ${notes}` : '',
    '',
    'Consultation ostéopathique - Rua Rodrigues Sampaio n76, Lisboa'
  ].filter(Boolean).join('\n')

  return {
    title: `Consultation - ${patientName}`,
    description,
    location: 'Rua Rodrigues Sampaio n76, 1150-279 Lisboa, Portugal',
    startDate,
    endDate,
    organizerEmail: process.env.CONTACT_EMAIL || 'camilleosteopatia@gmail.com',
    attendeeEmail: patientEmail,
    attendeeName: patientName
  }
}

/**
 * Create appointment event for patient's calendar
 */
export function createPatientCalendarEvent(
  appointmentDate: Date,
  timeSlot: string,
  patientName: string,
  patientEmail: string,
  locale: string = 'pt'
): CalendarEvent {
  // Parse time slot
  const [hours, minutes] = timeSlot.split(':').map(Number)

  // Create start date/time
  const startDate = new Date(appointmentDate)
  startDate.setHours(hours, minutes, 0, 0)

  // End time: 1 hour later
  const endDate = new Date(startDate)
  endDate.setHours(hours + 1, minutes, 0, 0)

  const titles = {
    fr: 'Consultation Ostéopathie - Camille Labasse D.O.',
    pt: 'Consulta Osteopatia - Camille Labasse D.O.',
    en: 'Osteopathy Consultation - Camille Labasse D.O.'
  }

  const descriptions = {
    fr: `Consultation d'ostéopathie avec Camille Labasse D.O.\n\nRecommandations:\n- Portez des vêtements confortables\n- Hydratez-vous bien avant et après la séance\n- Évitez les repas copieux 1h avant\n- Arrivez 5 minutes en avance\n- Apportez vos examens médicaux si pertinent\n\nTél: +351 930 505 939\nAdresse: Rua Rodrigues Sampaio n76, 1º andar, 1150-279 Lisboa`,
    pt: `Consulta de osteopatia com Camille Labasse D.O.\n\nRecomendações:\n- Use roupas confortáveis\n- Hidrate-se bem antes e depois da sessão\n- Evite refeições pesadas 1h antes\n- Chegue 5 minutos mais cedo\n- Traga seus exames médicos se relevante\n\nTel: +351 930 505 939\nEndereço: Rua Rodrigues Sampaio n76, 1º andar, 1150-279 Lisboa`,
    en: `Osteopathy consultation with Camille Labasse D.O.\n\nRecommendations:\n- Wear comfortable clothing\n- Hydrate well before and after the session\n- Avoid heavy meals 1h before\n- Arrive 5 minutes early\n- Bring your medical exams if relevant\n\nPhone: +351 930 505 939\nAddress: Rua Rodrigues Sampaio n76, 1st floor, 1150-279 Lisboa`
  }

  return {
    title: titles[locale as keyof typeof titles] || titles.pt,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.pt,
    location: 'Rua Rodrigues Sampaio n76, 1150-279 Lisboa, Portugal',
    startDate,
    endDate,
    organizerEmail: process.env.CONTACT_EMAIL || 'camilleosteopatia@gmail.com',
    attendeeEmail: patientEmail,
    attendeeName: patientName
  }
}
