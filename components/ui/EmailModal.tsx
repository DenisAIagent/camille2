'use client';

import { X, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, FormEvent, useEffect } from 'react';
import ReCaptchaV3 from '@/components/ui/ReCaptcha';

interface EmailModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function EmailModal({ isOpen, onClose }: EmailModalProps) {
    const t = useTranslations('ContactModals.email');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

    const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    const isRecaptchaConfigured = Boolean(recaptchaSiteKey);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        setIsSubmitting(true);
        setSubmitStatus('idle');
        setErrorMessage('');

        try {
            // Execute reCAPTCHA v3 before submitting
            let token: string;
            try {
                token = await (window as any).executeRecaptcha('email_modal');
            } catch (error) {
                console.error('reCAPTCHA execution failed:', error);
                setSubmitStatus('error');
                setErrorMessage('Erreur de vérification captcha. Veuillez réessayer.');
                setIsSubmitting(false);
                return;
            }

            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    captchaToken: token
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle specific error messages from server
                if (response.status === 429) {
                    throw new Error(data.error || 'Trop de tentatives. Veuillez patienter.');
                } else if (response.status === 400 && data.error?.includes('captcha')) {
                    throw new Error('Captcha invalide. Veuillez réessayer.');
                } else {
                    throw new Error(data.error || 'Erreur lors de l\'envoi du message');
                }
            }

            setSubmitStatus('success');
            setFormData({ name: '', email: '', message: '' });
            setCaptchaToken(null);
            setErrorMessage('');

            // Close modal after 2 seconds on success
            setTimeout(() => {
                onClose();
                setSubmitStatus('idle');
            }, 2000);
        } catch (err) {
            const error = err as Error;
            if (process.env.NODE_ENV === 'development') {
                console.error('[DEV] Error sending message:', error.message);
            }
            setSubmitStatus('error');
            setErrorMessage(error.message || t('error') || 'Une erreur est survenue');
            setCaptchaToken(null);
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] animate-fade-in"
                onClick={onClose}
            />

            {/* Modal Container with Scroll */}
            <div className="fixed inset-0 z-[70] overflow-y-auto">
                <div className="min-h-screen flex items-center justify-center p-4">
                    {/* Modal Content */}
                    <div className="relative w-full max-w-md bg-background rounded-2xl shadow-2xl border-2 border-border/50 overflow-hidden my-8 animate-modal-appear">
                        {/* Header */}
                        <div className="bg-gradient-warm p-6 relative">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 dark:bg-white/10 dark:hover:bg-white/20 text-[#3A3516] dark:text-white transition-colors z-10"
                                aria-label={t('close')}
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <div className="flex items-center gap-3 pr-10">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0">
                                    <Send className="w-7 h-7 text-primary" />
                                </div>
                                <div className="text-[#3A3516] dark:text-white">
                                    <h3 className="text-2xl font-semibold leading-tight">{t('title')}</h3>
                                    <p className="text-[#4A4526] dark:text-white/90 text-sm mt-1">{t('subtitle')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Name Field */}
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium text-muted-foreground">
                                        {t('nameLabel')}
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder={t('namePlaceholder')}
                                        required
                                        className="w-full bg-muted/50 border-2 border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors text-base"
                                    />
                                </div>

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                                        {t('emailLabel')}
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder={t('emailPlaceholder')}
                                        required
                                        className="w-full bg-muted/50 border-2 border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors text-base"
                                    />
                                </div>

                                {/* Message Field */}
                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium text-muted-foreground">
                                        {t('messageLabel')}
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder={t('messagePlaceholder')}
                                        required
                                        rows={5}
                                        className="w-full bg-muted/50 border-2 border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none text-base"
                                    />
                                </div>

                                {/* reCAPTCHA v3 - Invisible */}
                                <ReCaptchaV3
                                    onVerify={(token) => setCaptchaToken(token)}
                                    onError={() => {
                                        console.error('reCAPTCHA loading error');
                                    }}
                                    action="email_modal"
                                />

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex items-center justify-center gap-3 px-6 py-4 gradient-warm text-white rounded-xl font-medium transition-all hover:shadow-glow hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                                >
                                    <Send className="w-5 h-5" />
                                    <span>{isSubmitting ? t('sending') : t('send')}</span>
                                </button>

                                {/* Status Messages */}
                                {submitStatus === 'success' && (
                                    <p className="text-sm text-green-600 text-center animate-fade-in font-medium">
                                        ✓ {t('success')}
                                    </p>
                                )}
                                {submitStatus === 'error' && (
                                    <p className="text-sm text-red-600 text-center animate-fade-in font-medium">
                                        ✗ {errorMessage || t('error')}
                                    </p>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
