import type { Metadata } from 'next';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import FeatureBlock from '@/components/ui/FeatureBlock';
import { Button } from '@/components/ui/button';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const _t = await getTranslations({ locale, namespace: 'HomePage' });

  const titles = {
    fr: 'Ostéopathe Lisbonne | Camille Labasse D.O.',
    pt: 'Osteopata Lisboa | Camille Labasse D.O.',
    en: 'Osteopath Lisbon | Camille Labasse D.O.'
  };

  const descriptions = {
    fr: 'Camille Labasse, Ostéopathe D.O. à Lisbonne (Avenida de Roma). Ostéopathie biodynamique, pédiatrique et traitement des traumatismes. Prenez rendez-vous en ligne.',
    pt: 'Camille Labasse, Osteopata D.O. em Lisboa (Avenida de Roma). Osteopatia biodinâmica, pediátrica e tratamento de traumas. Marque a sua consulta online.',
    en: 'Camille Labasse, Osteopath D.O. in Lisbon (Avenida de Roma). Biodynamic osteopathy, pediatric care and trauma treatment. Book your appointment online.'
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.fr,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.fr,
    keywords: locale === 'fr'
      ? 'ostéopathe Lisbonne, ostéopathe français Lisbonne, ostéopathie biodynamique, urgence ostéopathe, Camille Labasse, Avenida de Roma'
      : locale === 'pt'
        ? 'osteopata Lisboa, osteopata francês Lisboa, osteopatia biodinâmica, urgência osteopata, Camille Labasse, Avenida de Roma'
        : 'osteopath Lisbon, french osteopath Lisbon, biodynamic osteopathy, emergency osteopath, Camille Labasse, Avenida de Roma',
    authors: [{ name: 'Camille Labasse' }],
    openGraph: {
      title: titles[locale as keyof typeof titles] || titles.fr,
      description: descriptions[locale as keyof typeof descriptions] || descriptions.fr,
      type: 'website',
      locale: locale,
      alternateLocale: ['fr', 'pt', 'en'].filter(l => l !== locale),
      images: [
        {
          url: '/images/photos/opengraph-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Camille Labasse - Ostéopathe Lisbonne',
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
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'HomePage' });
  const tOsteo = await getTranslations({ locale, namespace: 'OsteopathyPage' });

  return (
    <div className="flex flex-col">
      {/* Schema.org LocalBusiness / Physician */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Physician",
            "name": "Camille Labasse Ostéopathe",
            "image": "https://camille-osteopathe.com/images/photos/camille-24%20-%20Grande.webp",
            "@id": "https://camille-osteopathe.com",
            "url": "https://camille-osteopathe.com",
            "telephone": "+351930505939",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Avenida de Roma",
              "addressLocality": "Lisboa",
              "postalCode": "1000-000", // À ajuster
              "addressCountry": "PT"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 38.7436, // Coordonnées approx Av de Roma
              "longitude": -9.1436
            },
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday"
              ],
              "opens": "09:00",
              "closes": "19:00"
            },
            "sameAs": [
              "https://www.instagram.com/camille_osteopathe", // Exemple
              "https://www.linkedin.com/in/camille-labasse" // Exemple
            ],
            "priceRange": "$$"
          })
        }}
      />

      {/* Hero Section - Parallax avec image de fond */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden parallax-container pb-16">
        {/* Background Image optimisée avec Next.js Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/photos/camille-01 - Grande.webp"
            alt="Camille Labasse Ostéopathe - Cabinet Lisbonne"
            fill
            priority
            fetchPriority="high"
            quality={85}
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background z-[1]"></div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 text-center max-w-5xl relative z-10">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-medium tracking-tight mb-8 text-foreground drop-shadow-lg">
              {t('h1')}
            </h1>
            <p className="text-xl md:text-2xl text-foreground/90 leading-relaxed max-w-3xl mx-auto mb-12 drop-shadow">
              {t('intro')}
            </p>
            <div className="flex justify-center">
              <Button
                asChild
                size="lg"
                className="gradient-warm hover:shadow-glow text-white rounded-full px-8 sm:px-12 py-6 sm:py-7 text-base sm:text-lg h-auto transition-smooth hover-scale shadow-premium w-full sm:w-auto whitespace-normal text-center leading-tight"
              >
                <Link href="/contact">{t('h2_book')}</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-0 md:bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-primary rounded-full animate-float"></div>
          </div>
        </div>
      </section>

      {/* Section À propos avec photo */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Photo professionnelle */}
            <div className="relative group">
              <div className="relative overflow-hidden rounded-3xl shadow-premium hover-scale transition-smooth">
                <Image
                  src="/images/photos/camille-24 - Grande.webp"
                  alt="Camille Labasse - Ostéopathe"
                  width={665}
                  height={443}
                  quality={75}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-smooth"></div>
              </div>
              {/* Floating decoration */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-float"></div>
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Texte de bienvenue */}
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-serif mb-6 text-gradient">
                {t('h2_welcome')}
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {t('welcome')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content from Osteopathie page */}
      <div className="container mx-auto px-4 max-w-6xl pt-8 pb-12">
        <div className="space-y-16 md:space-y-20">
          {/* Comprendre l'Ostéopathie */}
          <FeatureBlock
            imageSrc="/images/photos/camille-22 - Grande.webp"
            imageAlt="Comprendre l&apos;ostéopathie"
            title={tOsteo('h2_understand')}
            description={tOsteo('text_understand')}
            layout="image-right"
            decorationPosition="top-right"
          />

          {/* Ostéopathie Fonctionnelle */}
          <FeatureBlock
            imageSrc="/images/photos/camille-27 - Grande.webp"
            imageAlt="Ostéopathie fonctionnelle"
            title={tOsteo('h2_functional')}
            description={tOsteo('text_functional')}
            layout="image-left"
            decorationPosition="bottom-left"
            decorationDelay="1s"
          />

          {/* Pathologies Traitées */}
          <FeatureBlock
            imageSrc="/images/photos/camille-28 - Grande.webp"
            imageAlt="Pathologies traitées"
            title={tOsteo('h2_pathologies')}
            description={tOsteo('text_pathologies')}
            layout="image-right"
            decorationPosition="top-left"
            decorationDelay="2s"
          />

          {/* Ostéopathie Biodynamique - Highlighted */}
          <section className="relative overflow-hidden">
            <div
              className="absolute inset-0 z-0 opacity-10"
              style={{
                backgroundImage: 'url(/images/photos/camille-38%20-%20Grande.jpeg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            ></div>
            <div className="relative z-10 gradient-subtle p-12 rounded-3xl shadow-glow">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-serif mb-8 text-primary">{tOsteo('h2_bio')}</h2>
                <p className="text-lg text-foreground/80 leading-relaxed whitespace-pre-line">
                  {tOsteo('text_bio')}
                </p>
              </div>
            </div>
          </section>

          {/* CTA Final */}
          <section className="text-center pt-0 pb-0">
            <h3 className="text-2xl font-serif mb-6 text-foreground">{tOsteo('cta_question')}</h3>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-10 py-4 rounded-full gradient-warm text-white font-bold text-lg shadow-lg hover:shadow-glow transition-smooth hover-scale tracking-wide"
              >
                {tOsteo('cta_button')}
              </Link>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full px-8 py-4 h-auto border-2 border-primary/30 hover:border-primary transition-smooth animated-underline"
              >
                <Link href="/osteopathie">{t('learn_more_osteopathy')}</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
