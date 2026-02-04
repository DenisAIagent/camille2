import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import LightboxGallery from '@/components/ui/LightboxGallery';
import WhoIsItFor from '@/components/home/WhoIsItFor';
import { Button } from '@/components/ui/button';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const _t = await getTranslations({ locale, namespace: 'OsteopathyPage' });

    const titles = {
        fr: 'Ostéopathe Lisbonne - Biodynamique & Fonctionnel | Camille Labasse',
        pt: 'Osteopata Lisboa - Biodinâmica & Funcional | Camille Labasse',
        en: 'Osteopath Lisbon - Biodynamic & Functional | Camille Labasse'
    };

    const descriptions = {
        fr: 'Cabinet d\'ostéopathie à Lisbonne (Rua Rodrigues Sampaio n76). Approche douce et biodynamique pour bébés, adultes et femmes enceintes. Traitement des douleurs, stress et troubles fonctionnels.',
        pt: 'Consultório de osteopatia em Lisboa (Rua Rodrigues Sampaio n76). Abordagem suave e biodinâmica para bebés, adultos e grávidas. Tratamento de dores, stress e distúrbios funcionais.',
        en: 'Osteopathy practice in Lisbon (Rua Rodrigues Sampaio n76). Gentle biodynamic approach for babies, adults and pregnant women. Treatment of pain, stress and functional disorders.'
    };

    return {
        title: titles[locale as keyof typeof titles] || titles.fr,
        description: descriptions[locale as keyof typeof descriptions] || descriptions.fr,
        keywords: locale === 'fr'
            ? 'ostéopathe Lisbonne, ostéopathie biodynamique, ostéopathie bébé Lisbonne, mal de dos, urgence ostéopathe, Camille Labasse, Rua Rodrigues Sampaio'
            : locale === 'pt'
                ? 'osteopata Lisboa, osteopatia biodinâmica, osteopatia bebé Lisboa, dor nas costas, urgência osteopata, Camille Labasse, Rua Rodrigues Sampaio'
                : 'osteopath Lisbon, biodynamic osteopathy, baby osteopath Lisbon, back pain, emergency osteopath, Camille Labasse, Rua Rodrigues Sampaio',
        openGraph: {
            title: titles[locale as keyof typeof titles] || titles.fr,
            description: descriptions[locale as keyof typeof descriptions] || descriptions.fr,
            url: `https://camille-osteopathe.com/${locale}/osteopathie`,
            siteName: 'Camille Labasse Ostéopathe',
            locale: locale,
            type: 'website',
            images: [
                {
                    url: '/images/photos/opengraph-image.jpg',
                    width: 1200,
                    height: 630,
                    alt: 'Camille Labasse - Ostéopathie Biodynamique',
                }
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: titles[locale as keyof typeof titles] || titles.fr,
            description: descriptions[locale as keyof typeof descriptions] || descriptions.fr,
            images: ['/images/photos/opengraph-image.jpg'],
        },
        robots: {
            index: true,
            follow: true,
        },
        alternates: {
            canonical: `https://camille-osteopathe.com/${locale}/osteopathie`,
            languages: {
                'fr': 'https://camille-osteopathe.com/fr/osteopathie',
                'pt': 'https://camille-osteopathe.com/pt/osteopathie',
                'en': 'https://camille-osteopathe.com/en/osteopathie',
            },
        },
    };
}

export default async function OsteopathyPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'OsteopathyPage' });
    const tHome = await getTranslations({ locale, namespace: 'HomePage' });

    return (
        <div className="flex flex-col">
            {/* Schema.org MedicalSpecialty */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "MedicalSpecialty",
                        "name": "Ostéopathie Biodynamique & Fonctionnelle",
                        "description": "Approche thérapeutique manuelle douce pour rétablir l&apos;équilibre du corps.",
                        "medicalSpecialty": "Osteopathic",
                        "availableService": {
                            "@type": "MedicalTherapy",
                            "name": "Consultation Ostéopathie"
                        }
                    })
                }}
            />

            {/* Hero Section avec image */}
            <section className="relative min-h-[30vh] flex items-center justify-center overflow-hidden parallax-container">
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: 'url(/images/photos/camille-45%20-%20Grande.jpeg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundAttachment: 'fixed'
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background"></div>
                </div>

                <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium mb-0 text-foreground drop-shadow-lg animate-fade-in-up">
                        {t('h1')}
                    </h1>
                </div>
            </section>

      {/* Who is it for? - Interactive with SEO content */}
      <WhoIsItFor />

      {/* Why Consult? - Redesign moderne */}
      <section className="py-24 relative">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-5xl font-serif text-center mb-4 text-gradient">{tHome('h2_why')}</h2>
          <p className="text-center text-muted-foreground mb-16 text-lg">{t('why_subtitle')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              'why_muscle',
              'why_tendinitis',
              'why_digestive',
              'why_stress',
              'why_tinnitus',
              'why_emotional',
              'why_women'
            ].map((key, index) => (
              <div
                key={key}
                className="group relative bg-card border-2 border-border/50 hover:border-primary/50 rounded-2xl p-8 shadow-sm hover:shadow-premium transition-smooth"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="text-lg text-foreground leading-relaxed block">{tHome(key)}</span>
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 shimmer pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galerie visuelle */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-serif text-center mb-4 text-gradient">{t('gallery_title')}</h2>
          <p className="text-center text-muted-foreground mb-16 text-lg">{t('gallery_subtitle')}</p>

          <LightboxGallery
            images={[
              'camille-04 - Grande.webp',
              'camille-06 - Grande.webp',
              'camille-07 - Grande.webp',
              'camille-09 - Grande.webp',
              'camille-22 - Grande.webp',
              'camille-27 - Grande.webp',
              'camille-28 - Grande.webp',
              'camille-38 - Grande.webp'
            ]}
          />
        </div>
      </section>

      {/* CTA Final - Premium */}
      <section className="py-32 relative overflow-hidden">
        {/* Background with image optimisée */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/photos/camille-50 - Grande.webp"
            alt="Cabinet Camille Labasse"
            fill
            quality={85}
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/75 dark:bg-black/85 z-[1]"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-serif mb-6 text-white">
            {t('cta_title')}
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            {t('cta_subtitle')}
          </p>
          <Button
            asChild
            size="lg"
            className="gradient-warm hover:shadow-glow text-white rounded-full px-16 py-8 text-xl h-auto transition-smooth hover-scale shadow-premium"
          >
            <Link href="/contact">{tHome('h2_book')}</Link>
          </Button>
        </div>
      </section>
        </div>
    );
}
