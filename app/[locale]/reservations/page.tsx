import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { BookingForm } from '@/components/booking/BookingForm'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Reservations' })

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  }
}

export default async function ReservationsPage({ params }: Props) {
  const { locale } = await params

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 dark:from-background dark:to-muted/5">
      <div className="container py-12 md:py-20">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {locale === 'fr' && 'Réservation en ligne'}
            {locale === 'pt' && 'Marcação online'}
            {locale === 'en' && 'Online booking'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {locale === 'fr' && 'Choisissez votre créneau et recevez une confirmation par email sous 24h'}
            {locale === 'pt' && 'Escolha o seu horário e receba uma confirmação por email em 24h'}
            {locale === 'en' && 'Choose your time slot and receive confirmation by email within 24h'}
          </p>
        </div>

        <BookingForm locale={locale} />

        {/* Informations pratiques */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-6 rounded-lg bg-card border">
              <div className="text-3xl mb-2">⏰</div>
              <h3 className="font-semibold mb-2">
                {locale === 'fr' && 'Horaires'}
                {locale === 'pt' && 'Horários'}
                {locale === 'en' && 'Opening hours'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {locale === 'fr' && 'Mar-Sam: 9h-12h30, 14h-18h'}
                {locale === 'pt' && 'Ter-Sáb: 9h-12h30, 14h-18h'}
                {locale === 'en' && 'Tue-Sat: 9am-12:30pm, 2pm-6pm'}
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card border">
              <div className="text-3xl mb-2">💶</div>
              <h3 className="font-semibold mb-2">
                {locale === 'fr' && 'Tarifs'}
                {locale === 'pt' && 'Preços'}
                {locale === 'en' && 'Pricing'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {locale === 'fr' && 'Consultation: 60€'}
                {locale === 'pt' && 'Consulta: 60€'}
                {locale === 'en' && 'Consultation: 60€'}
                <br />
                <span className="text-xs">
                  {locale === 'fr' && 'Tarif réduit: 50€'}
                  {locale === 'pt' && 'Preço reduzido: 50€'}
                  {locale === 'en' && 'Reduced rate: 50€'}
                </span>
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card border">
              <div className="text-3xl mb-2">✅</div>
              <h3 className="font-semibold mb-2">
                {locale === 'fr' && 'Validation'}
                {locale === 'pt' && 'Validação'}
                {locale === 'en' && 'Validation'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {locale === 'fr' && 'Confirmation manuelle par Camille sous 24h'}
                {locale === 'pt' && 'Confirmação manual pela Camille em 24h'}
                {locale === 'en' && 'Manual confirmation by Camille within 24h'}
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 rounded-lg bg-muted/50 dark:bg-muted/20 text-center">
            <p className="text-sm text-muted-foreground">
              {locale === 'fr' && (
                <>
                  Une question ? Contactez-moi directement par{' '}
                  <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '351930505939'}?text=Bonjour, j'ai une question concernant les réservations`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    WhatsApp
                  </a>
                  {' '}ou{' '}
                  <a
                    href="/fr/contact"
                    className="text-primary hover:underline font-medium"
                  >
                    email
                  </a>
                </>
              )}
              {locale === 'pt' && (
                <>
                  Alguma questão? Contacte-me diretamente por{' '}
                  <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '351930505939'}?text=Olá, tenho uma pergunta sobre marcações`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    WhatsApp
                  </a>
                  {' '}ou{' '}
                  <a
                    href="/pt/contactos"
                    className="text-primary hover:underline font-medium"
                  >
                    email
                  </a>
                </>
              )}
              {locale === 'en' && (
                <>
                  Any questions? Contact me directly via{' '}
                  <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '351930505939'}?text=Hello, I have a question about bookings`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    WhatsApp
                  </a>
                  {' '}or{' '}
                  <a
                    href="/en/contact"
                    className="text-primary hover:underline font-medium"
                  >
                    email
                  </a>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
