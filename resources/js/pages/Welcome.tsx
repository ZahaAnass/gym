import { Head, Link, useForm } from '@inertiajs/react';
import {
    Activity,
    ArrowRight,
    Brain,
    CheckCircle2,
    ChevronDown,
    CreditCard,
    Dumbbell,
    Mail,
    Menu,
    Moon,
    Sparkles,
    Sun,
    TrendingUp,
    Users,
    X,
    Zap,
    BellRing,
    Play,
    Shield,
    Timer,
    BarChart3,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

type Language = 'en' | 'fr' | 'ar';

const translations = {
    en: {
        metaTitle: 'AI Gym — Intelligent Fitness Management',
        nav: { features: 'Features', roles: 'Roles', pricing: 'Pricing', faq: 'FAQ', contact: 'Contact', login: 'Log in', getStarted: 'Get started', dashboard: 'Dashboard', lightMode: 'Light mode', darkMode: 'Dark mode' },
        hero: {
            fallbackBadge: 'Powered by Gemini 2.5 Flash',
            title1: 'The Future',
            title2: 'of Fitness is',
            accent: 'Intelligent.',
            subtitle: "Generate custom workouts, analyze biometrics instantly, and track every client's progress - all powered by AI, all in one enterprise platform.",
            accessPortal: 'Access Portal',
            startTrial: 'Start free trial',
            seeFeatures: 'See features',
            trustedBy: 'Trusted by',
            trustCount: '1,200+',
            trustSuffix: 'athletes & coaches',
        },
        common: { enterpriseFeatures: 'Enterprise Features', unifiedEcosystem: 'Unified Ecosystem', testimonials: 'Testimonials', pricing: 'Pricing', faq: 'FAQ', mostPopular: 'Most Popular' },
        sections: {
            featuresTitle: 'Built for coaches.\nDesigned for athletes.',
            featuresSubtitle: 'Everything you need to manage gym operations, improve client outcomes, and process payments with confidence.',
            rolesTitle: 'A dedicated portal\nfor every role',
            rolesSubtitle: 'Switch between roles to see exactly what each user experiences on the platform.',
            pricingTitle: 'Simple, transparent plans',
            pricingSubtitle: 'Start free. Upgrade when your facility scales.',
            testimonialsTitle: 'Loved by industry leaders',
            faqTitle: 'Common questions',
        },
        cta: { title: "Ready to transform your gym's potential?", accent: "gym's potential?", subtitle: 'Join 1,200+ coaches already using AI Gym to deliver better results, faster.', talkToUs: 'Talk to us' },
        contact: {
            label: 'Get in touch',
            title: "Let's talk about your gym",
            bodyPrefix: 'Have questions? Send us a message or email us directly at',
            bodySuffix: '.',
            perks: ['Response within 24 hours', 'Free onboarding consultation', 'No commitment required'],
            fullName: 'Full name',
            email: 'Email',
            message: 'Message',
            sendMessage: 'Send Message',
            placeholderName: 'John Doe',
            placeholderEmail: 'john@example.com',
            placeholderMessage: "Tell us about your gym and what you're looking for...",
            toastSent: 'Message sent! Our team will contact you shortly.',
        },
        footer: { copy: 'PFE Project.' },
    },
    fr: {
        metaTitle: 'AI Gym — Gestion Fitness Intelligente',
        nav: { features: 'Fonctionnalites', roles: 'Roles', pricing: 'Tarifs', faq: 'FAQ', contact: 'Contact', login: 'Connexion', getStarted: 'Commencer', dashboard: 'Tableau de bord', lightMode: 'Mode clair', darkMode: 'Mode sombre' },
        hero: {
            fallbackBadge: 'Propulse par Gemini 2.5 Flash',
            title1: "L'avenir",
            title2: 'du fitness est',
            accent: 'intelligent.',
            subtitle: "Generez des programmes personnalises, analysez les donnees biometrie en instantane et suivez la progression de chaque client dans une seule plateforme.",
            accessPortal: 'Acceder au portail',
            startTrial: "Demarrer l'essai gratuit",
            seeFeatures: 'Voir les fonctionnalites',
            trustedBy: 'Adopte par',
            trustCount: '1 200+',
            trustSuffix: 'athletes et coachs',
        },
        common: { enterpriseFeatures: "Fonctionnalites Entreprise", unifiedEcosystem: 'Ecosysteme unifie', testimonials: 'Temoignages', pricing: 'Tarifs', faq: 'FAQ', mostPopular: 'Le plus populaire' },
        sections: {
            featuresTitle: 'Concu pour les coachs.\nPense pour les athletes.',
            featuresSubtitle: "Tout ce qu'il faut pour gerer votre salle, ameliorer les resultats clients et securiser les paiements.",
            rolesTitle: 'Un portail dedie\npour chaque role',
            rolesSubtitle: "Basculez entre les roles pour voir l'experience exacte de chaque utilisateur.",
            pricingTitle: 'Des offres simples et claires',
            pricingSubtitle: 'Commencez gratuitement et evoluez quand votre salle grandit.',
            testimonialsTitle: 'Apprecie par les leaders du secteur',
            faqTitle: 'Questions frequentes',
        },
        cta: { title: 'Pret a transformer le potentiel de votre salle ?', accent: 'potentiel de votre salle ?', subtitle: 'Rejoignez 1 200+ coachs qui utilisent deja AI Gym pour obtenir de meilleurs resultats plus vite.', talkToUs: 'Parler avec nous' },
        contact: {
            label: 'Nous contacter',
            title: 'Parlons de votre salle',
            bodyPrefix: 'Des questions ? Envoyez-nous un message ou ecrivez-nous a',
            bodySuffix: '.',
            perks: ['Reponse sous 24 heures', 'Consultation de demarrage offerte', 'Aucun engagement requis'],
            fullName: 'Nom complet',
            email: 'Email',
            message: 'Message',
            sendMessage: 'Envoyer le message',
            placeholderName: 'Jean Dupont',
            placeholderEmail: 'jean@example.com',
            placeholderMessage: 'Parlez-nous de votre salle et de vos objectifs...',
            toastSent: 'Message envoye ! Notre equipe vous contactera rapidement.',
        },
        footer: { copy: 'Projet PFE.' },
    },
    ar: {
        metaTitle: 'AI Gym - ادارة اللياقة الذكية',
        nav: { features: 'المميزات', roles: 'الادوار', pricing: 'الاسعار', faq: 'الاسئلة', contact: 'تواصل', login: 'تسجيل الدخول', getStarted: 'ابدأ الان', dashboard: 'لوحة التحكم', lightMode: 'الوضع الفاتح', darkMode: 'الوضع الداكن' },
        hero: {
            fallbackBadge: 'مدعوم بواسطة Gemini 2.5 Flash',
            title1: 'مستقبل',
            title2: 'اللياقة البدنية',
            accent: 'ذكي.',
            subtitle: 'انشئ برامج تدريب مخصصة، حلل البيانات الحيوية فورا، وتابع تقدم كل عميل في منصة واحدة.',
            accessPortal: 'الدخول للمنصة',
            startTrial: 'ابدأ تجربة مجانية',
            seeFeatures: 'عرض المميزات',
            trustedBy: 'موثوق من قبل',
            trustCount: '+1200',
            trustSuffix: 'رياضي ومدرب',
        },
        common: { enterpriseFeatures: 'مميزات المؤسسات', unifiedEcosystem: 'منظومة موحدة', testimonials: 'آراء العملاء', pricing: 'الاسعار', faq: 'الاسئلة الشائعة', mostPopular: 'الاكثر طلبا' },
        sections: {
            featuresTitle: 'مصمم للمدربين.\nومبني للرياضيين.',
            featuresSubtitle: 'كل ما تحتاجه لادارة النادي وتحسين نتائج العملاء وتنظيم المدفوعات بثقة.',
            rolesTitle: 'بوابة مخصصة\nلكل دور',
            rolesSubtitle: 'بدل بين الادوار لتشاهد تجربة كل مستخدم داخل المنصة.',
            pricingTitle: 'خطط واضحة ومرنة',
            pricingSubtitle: 'ابدأ مجانا ثم طور خطتك مع نمو النادي.',
            testimonialsTitle: 'محبوب من قادة المجال',
            faqTitle: 'اسئلة متكررة',
        },
        cta: { title: 'جاهز لتطوير امكانيات ناديك؟', accent: 'امكانيات ناديك؟', subtitle: 'انضم لاكثر من 1200 مدرب يستخدمون AI Gym لتحقيق نتائج افضل بشكل اسرع.', talkToUs: 'تواصل معنا' },
        contact: {
            label: 'تواصل معنا',
            title: 'دعنا نتحدث عن ناديك',
            bodyPrefix: 'عندك اسئلة؟ ارسل لنا رسالة او راسلنا مباشرة على',
            bodySuffix: '.',
            perks: ['رد خلال 24 ساعة', 'استشارة انطلاق مجانية', 'بدون اي التزام'],
            fullName: 'الاسم الكامل',
            email: 'البريد الالكتروني',
            message: 'الرسالة',
            sendMessage: 'ارسال الرسالة',
            placeholderName: 'محمد علي',
            placeholderEmail: 'mohamed@example.com',
            placeholderMessage: 'اخبرنا عن ناديك وما الذي تبحث عنه...',
            toastSent: 'تم ارسال الرسالة! فريقنا سيتواصل معك قريبا.',
        },
        footer: { copy: 'مشروع التخرج PFE.' },
    },
} as const;

/* ─────────────────────────────────────────────────────────
   ANIMATED COUNTER HOOK
───────────────────────────────────────────────────────── */
function useCounter(target: number, duration = 2000) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) {
return;
}

                observer.disconnect();
                let start = 0;
                const step = target / (duration / 16);
                const tick = () => {
                    start = Math.min(start + step, target);
                    setCount(Math.round(start));

                    if (start < target) {
requestAnimationFrame(tick);
}
                };
                requestAnimationFrame(tick);
            },
            { threshold: 0.3 },
        );

        if (ref.current) {
observer.observe(ref.current);
}

        return () => observer.disconnect();
    }, [target, duration]);

    return { count, ref };
}

/* ─────────────────────────────────────────────────────────
   SCROLL-IN ANIMATION HOOK
───────────────────────────────────────────────────────── */
function useScrollReveal() {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
 if (entry.isIntersecting) {
 setVisible(true); observer.disconnect(); 
} 
},
            { threshold: 0.1 },
        );

        if (ref.current) {
observer.observe(ref.current);
}

        return () => observer.disconnect();
    }, []);

    return { ref, visible };
}

/* ─────────────────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────────────────── */
function StatCard({ value, suffix, label, icon }: { value: number; suffix: string; label: string; icon: React.ReactNode }) {
    const { count, ref } = useCounter(value);

    return (
        <div ref={ref as React.RefObject<HTMLDivElement>} className="stat-card">
            <div className="stat-icon">{icon}</div>
            <span className="stat-value">{count.toLocaleString()}{suffix}</span>
            <span className="stat-label">{label}</span>
        </div>
    );
}

function FeatureCard({ icon, accent, title, description }: {
    icon: React.ReactNode; accent: string; title: string; description: string;
}) {
    const { ref, visible } = useScrollReveal();

    return (
        <div ref={ref} className={`feature-card ${visible ? 'reveal-in' : 'reveal-pre'}`}>
            <div className={`feature-icon-wrap ${accent}`}>{icon}</div>
            <h3 className="feature-title">{title}</h3>
            <p className="feature-desc">{description}</p>
            <div className="feature-arrow"><ArrowRight size={16} /></div>
        </div>
    );
}

function TestimonialCard({ quote, name, role, initials, accent }: {
    quote: string; name: string; role: string; initials: string; accent: string;
}) {
    const { ref, visible } = useScrollReveal();

    return (
        <div ref={ref} className={`testimonial-card ${visible ? 'reveal-in' : 'reveal-pre'}`}>
            <div className="stars">
                {[...Array(5)].map((_, i) => (
                    <svg key={i} className="star" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
            <p className="testimonial-quote">"{quote}"</p>
            <div className="testimonial-author">
                <div className={`author-avatar ${accent}`}>{initials}</div>
                <div>
                    <p className="author-name">{name}</p>
                    <p className="author-role">{role}</p>
                </div>
            </div>
        </div>
    );
}

function PricingCard({ plan, price, period, description, features, cta, highlighted, canRegister, badgeLabel }: {
    plan: string; price: string; period: string; description: string;
    features: string[]; cta: string; highlighted?: boolean; canRegister: boolean; badgeLabel: string;
}) {
    const { ref, visible } = useScrollReveal();

    return (
        <div ref={ref} className={`pricing-card ${highlighted ? 'pricing-card--featured' : ''} ${visible ? 'reveal-in' : 'reveal-pre'}`}>
            {highlighted && <div className="pricing-badge">{badgeLabel}</div>}
            <p className="pricing-plan">{plan}</p>
            <div className="pricing-price-row">
                <span className="pricing-price">{price}</span>
                <span className="pricing-period">{period}</span>
            </div>
            <p className="pricing-desc">{description}</p>
            <ul className="pricing-features">
                {features.map((f) => (
                    <li key={f}>
                        <CheckCircle2 size={16} className="pricing-check" />
                        <span>{f}</span>
                    </li>
                ))}
            </ul>
            {canRegister && (
                <Link href="/register" className={`pricing-cta ${highlighted ? 'pricing-cta--featured' : ''}`}>
                    {cta} <ArrowRight size={14} />
                </Link>
            )}
        </div>
    );
}

function FAQItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);

    return (
        <div className={`faq-item ${open ? 'faq-item--open' : ''}`}>
            <button onClick={() => setOpen(!open)} className="faq-question">
                <span>{q}</span>
                <ChevronDown size={20} className={`faq-chevron ${open ? 'rotate' : ''}`} />
            </button>
            <div className={`faq-answer ${open ? 'faq-answer--open' : ''}`}>
                <p>{a}</p>
            </div>
        </div>
    );
}

function HeroImageGrid() {
    return (
        <div className="hero-image-grid">
            <div className="hero-img hero-img--main">
                <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&auto=format&fit=crop" alt="Gym training" loading="lazy" />
                <div className="img-overlay" />
                <div className="img-badge img-badge--pulse">
                    <span className="badge-dot" />
                    <span>Live Sessions</span>
                </div>
            </div>
            <div className="hero-img-stack">
                <div className="hero-img hero-img--sm">
                    <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80&auto=format&fit=crop" alt="Coach training client" loading="lazy" />
                    <div className="img-overlay" />
                </div>
                <div className="hero-img hero-img--sm hero-img--accent">
                    <img src="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&q=80&auto=format&fit=crop" alt="Athlete performance" loading="lazy" />
                    <div className="img-overlay" />
                    <div className="img-stat-card">
                        <TrendingUp size={14} className="img-stat-icon" />
                        <div>
                            <p className="img-stat-val">+40%</p>
                            <p className="img-stat-lbl">Performance</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────── */
export default function Welcome({ auth, canRegister, content }: any) {
    const [isDark, setIsDark] = useState(() => {
        if (typeof window === 'undefined') {
            return true;
        }

        return localStorage.theme !== 'light';
    });
    const [language, setLanguage] = useState<Language>(() => {
        if (typeof window === 'undefined') {
            return 'en';
        }

        const savedLang = localStorage.getItem('landing-language');

        return savedLang === 'en' || savedLang === 'fr' || savedLang === 'ar' ? savedLang : 'en';
    });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeRole, setActiveRole] = useState<'admin' | 'coach' | 'client'>('coach');
    const [scrolled, setScrolled] = useState(false);
    const isRTL = language === 'ar';
    const copy = translations[language];
    const cmsHeroTitle = content?.hero_title?.trim?.() || '';

    const { data, setData, processing, reset } = useForm({ name: '', email: '', message: '' });

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success(copy.contact.toastSent);
        reset();
    };

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);
    }, [isDark]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const toggleTheme = () => {
        const next = !isDark;
        setIsDark(next);
        localStorage.theme = next ? 'dark' : 'light';
    };

    const switchLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('landing-language', lang);
    };

    const roles = {
        admin: {
            label: language === 'fr' ? 'Administrateur' : language === 'ar' ? 'مدير النظام' : 'Administrator', emoji: '⚙️',
            features: [
                { icon: <Shield size={18} />, text: language === 'fr' ? 'Gestion complete des utilisateurs et RBAC' : language === 'ar' ? 'ادارة كاملة للمستخدمين وصلاحيات RBAC' : 'Full user management & RBAC' },
                { icon: <BarChart3 size={18} />, text: language === 'fr' ? 'Analyse des revenus et reporting' : language === 'ar' ? 'تحليلات الايرادات والتقارير' : 'Revenue analytics & reporting' },
                { icon: <Activity size={18} />, text: language === 'fr' ? 'Journaux d audit systeme' : language === 'ar' ? 'سجلات تدقيق النظام' : 'System audit logs' },
                { icon: <Zap size={18} />, text: language === 'fr' ? 'Gestion du CMS public' : language === 'ar' ? 'ادارة محتوى الموقع العام' : 'Public CMS management' },
                { icon: <CreditCard size={18} />, text: language === 'fr' ? 'Supervision des paiements Stripe' : language === 'ar' ? 'متابعة مدفوعات Stripe' : 'Stripe payment oversight' },
            ],
        },
        coach: {
            label: language === 'fr' ? 'Coach' : language === 'ar' ? 'مدرب' : 'Coach', emoji: '🏋️',
            features: [
                { icon: <Users size={18} />, text: language === 'fr' ? 'Gestion des listes clients' : language === 'ar' ? 'ادارة قوائم العملاء' : 'Manage client rosters' },
                { icon: <Brain size={18} />, text: language === 'fr' ? 'Generation IA des programmes' : language === 'ar' ? 'توليد برامج تدريب بالذكاء الاصطناعي' : 'AI workout program generation' },
                { icon: <Activity size={18} />, text: language === 'fr' ? 'Outils d evaluation biometrie' : language === 'ar' ? 'ادوات تقييم القياسات الحيوية' : 'Biometric assessment tools' },
                { icon: <Timer size={18} />, text: language === 'fr' ? 'Notes de sessions et planning' : language === 'ar' ? 'ملاحظات الجلسات والجدولة' : 'Session notes & scheduling' },
                { icon: <TrendingUp size={18} />, text: language === 'fr' ? 'Suivi de progression client' : language === 'ar' ? 'تتبع تقدم العملاء' : 'Client progress tracking' },
            ],
        },
        client: {
            label: language === 'fr' ? 'Client' : language === 'ar' ? 'عميل' : 'Client', emoji: '🎯',
            features: [
                { icon: <Dumbbell size={18} />, text: language === 'fr' ? 'Consulter les programmes assignes' : language === 'ar' ? 'عرض البرامج المخصصة لك' : 'View assigned programs' },
                { icon: <TrendingUp size={18} />, text: language === 'fr' ? 'Suivre la progression physique' : language === 'ar' ? 'تسجيل التقدم البدني' : 'Log physical progress' },
                { icon: <Zap size={18} />, text: language === 'fr' ? 'Gerer les objectifs personnels' : language === 'ar' ? 'ادارة الاهداف الشخصية' : 'Manage personal goals' },
                { icon: <CreditCard size={18} />, text: language === 'fr' ? 'Paiements securises en plusieurs fois' : language === 'ar' ? 'مدفوعات آمنة بالتقسيط' : 'Secure installment payments' },
                { icon: <Timer size={18} />, text: language === 'fr' ? 'Suivre la presence en session' : language === 'ar' ? 'تتبع حضور الجلسات' : 'Track session attendance' },
            ],
        },
    };

    const navLinks = [
        { href: '#features', label: copy.nav.features },
        { href: '#how-it-works', label: copy.nav.roles },
        { href: '#pricing', label: copy.nav.pricing },
        { href: '#faq', label: copy.nav.faq },
        { href: '#contact', label: copy.nav.contact },
    ];

    return (
        <>
            <Head title={copy.metaTitle} />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

                /* ═══════════════════════════════════════════
                   DESIGN TOKENS — DARK (default)
                ═══════════════════════════════════════════ */
                :root {
                    --brand:        #C8F04E;
                    --brand-dim:    #b0d83a;
                    --brand-muted:  #8aaa25;
                    --on-brand:     #0d0e0b;
                    --brand-glow:   rgba(200,240,78,0.20);
                    --brand-tint:   rgba(200,240,78,0.07);
                    --brand-tint2:  rgba(200,240,78,0.13);

                    --bg-base:      #0d0e0b;
                    --bg-raised:    #131510;
                    --bg-elevated:  #1a1c16;
                    --bg-high:      #20231c;
                    --bg-card:      #161810;

                    --border-subtle:  rgba(200,240,78,0.06);
                    --border-muted:   rgba(200,240,78,0.11);
                    --border-soft:    rgba(255,255,255,0.07);
                    --border-default: rgba(255,255,255,0.11);
                    --border-hover:   rgba(255,255,255,0.22);

                    --text-primary:   #eef0e6;
                    --text-secondary: #8c9080;
                    --text-tertiary:  #515548;
                    --text-brand:     var(--brand);

                    --accent-purple-bg:   rgba(162,110,255,0.13);
                    --accent-purple-fg:   #c4a0ff;
                    --accent-emerald-bg:  rgba(52,211,153,0.13);
                    --accent-emerald-fg:  #6ee7b7;
                    --accent-sky-bg:      rgba(56,189,248,0.13);
                    --accent-sky-fg:      #7dd3fc;
                    --accent-amber-bg:    rgba(251,191,36,0.13);
                    --accent-amber-fg:    #fcd34d;
                    --accent-rose-bg:     rgba(251,113,133,0.13);
                    --accent-rose-fg:     #fda4af;
                    --accent-lime-bg:     rgba(200,240,78,0.13);
                    --accent-lime-fg:     var(--brand);

                    --av-purple-bg: rgba(162,110,255,0.18);
                    --av-purple-fg: #c4a0ff;
                    --av-sky-bg:    rgba(56,189,248,0.18);
                    --av-sky-fg:    #7dd3fc;
                    --av-mint-bg:   rgba(52,211,153,0.18);
                    --av-mint-fg:   #6ee7b7;

                    --radius:    16px;
                    --radius-sm: 10px;
                    --radius-lg: 22px;
                    --radius-xl: 30px;

                    --font-display: 'Syne', sans-serif;
                    --font-body:    'DM Sans', sans-serif;

                    --nav-bg-scroll: rgba(13,14,11,0.85);
                }

                /* ═══════════════════════════════════════════
                   LIGHT MODE OVERRIDES
                ═══════════════════════════════════════════ */
                .light-mode {
                    --brand:        #3f7a0f;
                    --brand-dim:    #34670b;
                    --brand-muted:  #2b5809;
                    --on-brand:     #f6ffec;
                    --brand-glow:   rgba(63,122,15,0.16);
                    --brand-tint:   rgba(63,122,15,0.06);
                    --brand-tint2:  rgba(63,122,15,0.12);

                    --bg-base:      #f7f8f4;
                    --bg-raised:    #eef1e9;
                    --bg-elevated:  #e6eadf;
                    --bg-high:      #dde4d3;
                    --bg-card:      #ffffff;

                    --border-subtle:  rgba(90,122,0,0.09);
                    --border-muted:   rgba(90,122,0,0.14);
                    --border-soft:    rgba(0,0,0,0.07);
                    --border-default: rgba(0,0,0,0.11);
                    --border-hover:   rgba(0,0,0,0.24);

                    --text-primary:   #1a2114;
                    --text-secondary: #4b5a3d;
                    --text-tertiary:  #849375;
                    --text-brand:     var(--brand);

                    --accent-purple-bg:   rgba(109,40,217,0.09);
                    --accent-purple-fg:   #6d28d9;
                    --accent-emerald-bg:  rgba(4,120,87,0.09);
                    --accent-emerald-fg:  #047857;
                    --accent-sky-bg:      rgba(2,132,199,0.09);
                    --accent-sky-fg:      #0284c7;
                    --accent-amber-bg:    rgba(180,83,9,0.09);
                    --accent-amber-fg:    #b45309;
                    --accent-rose-bg:     rgba(190,18,60,0.09);
                    --accent-rose-fg:     #be123c;
                    --accent-lime-bg:     rgba(90,122,0,0.11);
                    --accent-lime-fg:     var(--brand);

                    --av-purple-bg: rgba(109,40,217,0.11);
                    --av-purple-fg: #6d28d9;
                    --av-sky-bg:    rgba(2,132,199,0.11);
                    --av-sky-fg:    #0284c7;
                    --av-mint-bg:   rgba(4,120,87,0.11);
                    --av-mint-fg:   #047857;

                    --nav-bg-scroll: rgba(248,246,240,0.90);
                }

                /* ═══════════════════════════════════════════
                   RESET & BASE
                ═══════════════════════════════════════════ */
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                html { scroll-behavior: smooth; }

                body {
                    background: var(--bg-base);
                    color: var(--text-primary);
                    font-family: var(--font-body);
                    font-size: 16px;
                    line-height: 1.65;
                    overflow-x: hidden;
                    -webkit-font-smoothing: antialiased;
                }

                /* Grain texture */
                body::after {
                    content: '';
                    position: fixed; inset: 0; z-index: 999;
                    pointer-events: none;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
                    opacity: 0.5;
                }
                .light-mode body::after { opacity: 0.25; }

                /* ═══════════════════════════════════════════
                   SCROLL REVEAL
                ═══════════════════════════════════════════ */
                .reveal-pre {
                    opacity: 0;
                    transform: translateY(28px);
                }
                .reveal-in {
                    opacity: 1;
                    transform: translateY(0);
                    transition: opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1);
                }

                /* ═══════════════════════════════════════════
                   AMBIENT ORBS
                ═══════════════════════════════════════════ */
                .ambient {
                    position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden;
                }
                .ambient-orb {
                    position: absolute; border-radius: 50%;
                    filter: blur(90px);
                    animation: float 14s ease-in-out infinite;
                    will-change: transform;
                }
                .ambient-orb-1 {
                    width: 700px; height: 600px; left: -180px; top: 5%;
                    background: radial-gradient(circle, rgba(200,240,78,0.08) 0%, transparent 70%);
                }
                .ambient-orb-2 {
                    width: 560px; height: 460px; right: -120px; top: 18%;
                    background: radial-gradient(circle, rgba(162,110,255,0.06) 0%, transparent 70%);
                    animation-delay: -5s;
                }
                .ambient-orb-3 {
                    width: 440px; height: 440px; left: 38%; top: 58%;
                    background: radial-gradient(circle, rgba(56,189,248,0.05) 0%, transparent 70%);
                    animation-delay: -9s;
                }
                .light-mode .ambient-orb-1 { background: radial-gradient(circle, rgba(90,122,0,0.07) 0%, transparent 70%); }
                .light-mode .ambient-orb-2 { background: radial-gradient(circle, rgba(109,40,217,0.05) 0%, transparent 70%); }
                .light-mode .ambient-orb-3 { background: radial-gradient(circle, rgba(2,132,199,0.04) 0%, transparent 70%); }

                @keyframes float {
                    0%,100% { transform: translate(0,0) scale(1); }
                    33%     { transform: translate(28px,-18px) scale(1.04); }
                    66%     { transform: translate(-18px,14px) scale(0.97); }
                }

                /* ═══════════════════════════════════════════
                   NAV
                ═══════════════════════════════════════════ */
                .nav {
                    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
                    transition: background 0.4s, backdrop-filter 0.4s, border-color 0.4s, box-shadow 0.4s;
                }
                .nav--scrolled {
                    background: var(--nav-bg-scroll);
                    backdrop-filter: blur(28px) saturate(180%);
                    -webkit-backdrop-filter: blur(28px) saturate(180%);
                    border-bottom: 1px solid var(--border-subtle);
                    box-shadow: 0 2px 48px rgba(0,0,0,0.28);
                }
                .nav-inner {
                    max-width: 1280px; margin: 0 auto;
                    padding: 0 clamp(1rem, 4vw, 2rem);
                    display: flex; align-items: center; justify-content: space-between;
                    height: 68px;
                }
                .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; flex-shrink: 0; }
                .nav-logo-mark {
                    width: 34px; height: 34px; border-radius: 9px;
                    background: var(--brand);
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 0 22px var(--brand-glow);
                    flex-shrink: 0;
                }
                .light-mode .nav-logo-mark { box-shadow: none; }
                .nav-logo-mark svg { color: #0d0e0b; }
                .light-mode .nav-logo-mark svg { color: var(--on-brand); }
                .nav-logo-text {
                    font-family: var(--font-display);
                    font-weight: 800; font-size: 17px;
                    color: var(--text-primary); letter-spacing: -0.3px;
                }
                .nav-links { display: flex; align-items: center; gap: 2rem; list-style: none; }
                .nav-links a {
                    color: var(--text-secondary); text-decoration: none;
                    font-size: 14px; font-weight: 500; letter-spacing: 0.1px;
                    transition: color 0.2s;
                }
                .nav-links a:hover { color: var(--text-primary); }
                .nav-actions { display: flex; align-items: center; gap: 10px; }
                .nav-theme-btn {
                    width: 34px; height: 34px; border-radius: 50%;
                    border: 1px solid var(--border-default);
                    background: var(--bg-elevated); color: var(--text-secondary);
                    cursor: pointer; display: flex; align-items: center; justify-content: center;
                    transition: border-color 0.2s, color 0.2s;
                }
                .nav-theme-btn:hover { border-color: var(--border-hover); color: var(--text-primary); }
                .btn-ghost {
                    padding: 8px 18px; border: 1px solid var(--border-default);
                    border-radius: 50px; background: transparent;
                    color: var(--text-secondary); font-size: 14px; font-weight: 500;
                    cursor: pointer; text-decoration: none;
                    transition: border-color 0.2s, color 0.2s, background 0.2s;
                    display: inline-flex; align-items: center;
                }
                .btn-ghost:hover { border-color: var(--border-hover); color: var(--text-primary); background: var(--bg-elevated); }
                .btn-primary {
                    padding: 9px 20px; border-radius: 50px;
                    background: var(--brand); color: var(--on-brand);
                    font-size: 14px; font-weight: 700;
                    cursor: pointer; text-decoration: none; border: none;
                    transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
                    display: inline-flex; align-items: center; gap: 6px;
                }
                .btn-primary:hover { background: var(--brand-dim); transform: translateY(-1px); box-shadow: 0 5px 22px var(--brand-glow); }

                /* Mobile menu btn */
                .mobile-menu-btn {
                    display: none; width: 40px; height: 40px;
                    background: var(--bg-elevated); border: 1px solid var(--border-default);
                    border-radius: var(--radius-sm); cursor: pointer;
                    color: var(--text-primary);
                    align-items: center; justify-content: center;
                }
                .mobile-menu {
                    display: none; position: fixed; top: 68px; left: 0; right: 0;
                    background: var(--bg-raised);
                    border-bottom: 1px solid var(--border-soft);
                    padding: 1rem clamp(1rem,4vw,2rem) 1.5rem; z-index: 99;
                    flex-direction: column; gap: 2px;
                    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
                }
                .mobile-menu.open { display: flex; }
                .mobile-menu a {
                    padding: 12px 14px; color: var(--text-primary);
                    text-decoration: none; font-weight: 500; font-size: 15px;
                    border-radius: var(--radius-sm); transition: background 0.2s;
                }
                .mobile-menu a:hover { background: var(--bg-elevated); }
                .mobile-menu-actions {
                    display: flex; flex-direction: column; gap: 8px;
                    padding-top: 14px; border-top: 1px solid var(--border-soft); margin-top: 8px;
                }

                @media (max-width: 768px) {
                    .nav-links, .nav-actions { display: none; }
                    .mobile-menu-btn { display: flex; }
                }

                /* ═══════════════════════════════════════════
                   HERO
                ═══════════════════════════════════════════ */
                .hero-wrap {
                    position: relative; z-index: 1;
                    max-width: 1280px; margin: 0 auto;
                    padding: clamp(110px,12vw,140px) clamp(1rem,4vw,2rem) clamp(60px,8vw,100px);
                    display: flex; align-items: center; gap: clamp(2rem,5vw,5rem);
                    min-height: 100vh;
                }
                @media (max-width: 1024px) {
                    .hero-wrap {
                        flex-direction: column; min-height: auto;
                        padding-top: 110px;
                    }
                }
                .hero-content { flex: 1; max-width: 600px; }
                .hero-badge {
                    display: inline-flex; align-items: center; gap: 8px;
                    padding: 6px 14px; border-radius: 50px;
                    border: 1px solid rgba(200,240,78,0.28);
                    background: rgba(200,240,78,0.07);
                    font-size: 11.5px; font-weight: 600;
                    color: var(--brand); letter-spacing: 0.6px; text-transform: uppercase;
                    margin-bottom: 1.75rem;
                }
                .light-mode .hero-badge {
                    border-color: rgba(90,122,0,0.22);
                    background: rgba(90,122,0,0.07);
                }
                .badge-dot {
                    width: 6px; height: 6px; border-radius: 50%; background: var(--brand);
                    animation: pulse-dot 2.2s infinite;
                }
                @keyframes pulse-dot {
                    0%,100% { opacity:1; transform:scale(1); }
                    50% { opacity:0.35; transform:scale(0.7); }
                }
                .hero-title {
                    font-family: var(--font-display);
                    font-size: clamp(44px, 5.8vw, 80px);
                    font-weight: 800; line-height: 1.0; letter-spacing: -2.5px;
                    color: var(--text-primary); margin-bottom: 1.4rem;
                }
                .hero-title-accent {
                    color: var(--brand); display: block;
                    text-shadow: 0 0 70px var(--brand-glow);
                }
                .light-mode .hero-title-accent { text-shadow: none; }
                .hero-subtitle {
                    font-size: clamp(15px, 2vw, 17px);
                    color: var(--text-secondary); line-height: 1.75;
                    max-width: 470px; margin-bottom: 2.4rem; font-weight: 300;
                }
                .hero-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 2.8rem; }
                .btn-hero {
                    padding: 13px 26px; border-radius: 50px;
                    background: var(--brand); color: var(--on-brand);
                    font-size: 15px; font-weight: 700; border: none;
                    text-decoration: none; cursor: pointer;
                    display: inline-flex; align-items: center; gap: 8px;
                    font-family: var(--font-display);
                    transition: background 0.25s, transform 0.25s, box-shadow 0.25s;
                }
                .btn-hero:hover { background: var(--brand-dim); transform: translateY(-2px); box-shadow: 0 10px 44px var(--brand-glow); }
                .btn-hero-outline {
                    padding: 13px 26px; border-radius: 50px;
                    border: 1px solid var(--border-default);
                    color: var(--text-primary); font-size: 15px; font-weight: 500;
                    text-decoration: none;
                    display: inline-flex; align-items: center; gap: 8px;
                    background: var(--bg-elevated);
                    transition: border-color 0.2s, background 0.2s;
                }
                .btn-hero-outline:hover { border-color: var(--border-hover); background: var(--bg-high); }
                .hero-trust { display: flex; align-items: center; gap: 12px; }
                .hero-trust-avatars { display: flex; }
                .hero-trust-avatar {
                    width: 28px; height: 28px; border-radius: 50%;
                    border: 2px solid var(--bg-base); overflow: hidden;
                    margin-left: -8px;
                }
                .hero-trust-avatar:first-child { margin-left: 0; }
                .hero-trust-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
                .hero-trust-text { font-size: 13px; color: var(--text-secondary); }
                .hero-trust-text strong { color: var(--brand); font-weight: 600; }

                /* Hero images */
                .hero-visual { flex: 1; max-width: 500px; width: 100%; }
                @media (max-width: 1024px) { .hero-visual { max-width: 100%; } }
                .hero-image-grid {
                    display: grid; grid-template-columns: 1.4fr 1fr; gap: 12px;
                    height: clamp(300px, 50vw, 520px);
                }
                .hero-img { border-radius: var(--radius-lg); overflow: hidden; position: relative; }
                .hero-img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.7s cubic-bezier(0.16,1,0.3,1); }
                .hero-img:hover img { transform: scale(1.05); }
                .hero-img--main { grid-row: span 2; }
                .hero-img-stack { display: flex; flex-direction: column; gap: 12px; }
                .hero-img--sm { flex: 1; }
                .img-overlay {
                    position: absolute; inset: 0;
                    background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%);
                }
                .img-badge {
                    position: absolute; bottom: 14px; left: 14px;
                    display: flex; align-items: center; gap: 6px;
                    background: rgba(13,14,11,0.76); backdrop-filter: blur(14px);
                    border: 1px solid rgba(255,255,255,0.11); border-radius: 50px;
                    padding: 6px 12px; font-size: 12px; font-weight: 600; color: #fff;
                }
                .img-badge .badge-dot { background: #22c55e; }
                .img-stat-card {
                    position: absolute; bottom: 14px; left: 14px; right: 14px;
                    background: rgba(13,14,11,0.80); backdrop-filter: blur(16px);
                    border: 1px solid rgba(200,240,78,0.20); border-radius: var(--radius-sm);
                    padding: 10px 14px; display: flex; align-items: center; gap: 10px;
                }
                .img-stat-icon { color: var(--brand); flex-shrink: 0; }
                .img-stat-val { font-size: 16px; font-weight: 700; color: var(--brand); font-family: var(--font-display); line-height: 1; }
                .img-stat-lbl { font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 2px; }

                /* Hero content animation */
                .hero-content > * { animation: fadeUp 0.65s ease both; }
                .hero-content > *:nth-child(1) { animation-delay: 0.05s; }
                .hero-content > *:nth-child(2) { animation-delay: 0.15s; }
                .hero-content > *:nth-child(3) { animation-delay: 0.25s; }
                .hero-content > *:nth-child(4) { animation-delay: 0.35s; }
                .hero-content > *:nth-child(5) { animation-delay: 0.45s; }
                .hero-visual { animation: fadeUp 0.8s 0.2s ease both; }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                /* ═══════════════════════════════════════════
                   MARQUEE
                ═══════════════════════════════════════════ */
                .marquee-wrap {
                    border-top: 1px solid var(--border-soft);
                    border-bottom: 1px solid var(--border-soft);
                    padding: 18px 0; overflow: hidden;
                    background: var(--bg-raised); position: relative; z-index: 1;
                }
                .marquee-track {
                    display: flex; gap: 3rem; width: max-content;
                    animation: marquee 34s linear infinite;
                }
                .marquee-track:hover { animation-play-state: paused; }
                @keyframes marquee {
                    from { transform: translateX(0); }
                    to   { transform: translateX(-50%); }
                }
                .marquee-item {
                    display: inline-flex; align-items: center; gap: 10px;
                    color: var(--text-tertiary); font-size: 12.5px; font-weight: 500;
                    letter-spacing: 0.5px; white-space: nowrap;
                }
                .marquee-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--brand); opacity: 0.7; flex-shrink: 0; }

                /* ═══════════════════════════════════════════
                   STATS
                ═══════════════════════════════════════════ */
                .stats-section {
                    padding: clamp(60px,8vw,90px) clamp(1rem,4vw,2rem);
                    max-width: 1280px; margin: 0 auto; position: relative; z-index: 1;
                }
                .stats-grid {
                    display: grid; grid-template-columns: repeat(4, 1fr);
                    gap: 1px; background: var(--border-soft);
                    border: 1px solid var(--border-soft);
                    border-radius: var(--radius-lg); overflow: hidden;
                }
                @media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (max-width: 400px)  { .stats-grid { grid-template-columns: 1fr; } }
                .stat-card {
                    background: var(--bg-raised); padding: clamp(1.5rem,3vw,2.5rem) 1.5rem;
                    display: flex; flex-direction: column; align-items: center;
                    gap: 8px; text-align: center; transition: background 0.25s;
                }
                .stat-card:hover { background: var(--bg-elevated); }
                .stat-icon { color: var(--brand); margin-bottom: 4px; opacity: 0.85; }
                .stat-value {
                    font-family: var(--font-display);
                    font-size: clamp(36px,4vw,46px); font-weight: 800;
                    color: var(--text-primary); letter-spacing: -1.5px; line-height: 1;
                }
                .stat-label { font-size: 13.5px; color: var(--text-secondary); }

                /* ═══════════════════════════════════════════
                   SECTIONS
                ═══════════════════════════════════════════ */
                .section {
                    padding: clamp(70px,9vw,110px) clamp(1rem,4vw,2rem);
                    max-width: 1280px; margin: 0 auto; position: relative; z-index: 1;
                }
                .section-tag {
                    display: inline-flex; align-items: center; gap: 6px;
                    font-size: 11.5px; font-weight: 600; text-transform: uppercase;
                    letter-spacing: 1.2px; color: var(--brand); margin-bottom: 14px;
                }
                .section-title {
                    font-family: var(--font-display);
                    font-size: clamp(28px,3.8vw,50px); font-weight: 800;
                    letter-spacing: -1.5px; line-height: 1.08;
                    color: var(--text-primary); margin-bottom: 1rem;
                }
                .section-subtitle {
                    font-size: 16px; color: var(--text-secondary);
                    max-width: 500px; line-height: 1.78; font-weight: 300;
                }
                .section-header { margin-bottom: clamp(2.5rem,5vw,4rem); }
                .section-header--center { text-align: center; }
                .section-header--center .section-subtitle { margin: 0 auto; }

                /* ═══════════════════════════════════════════
                   FEATURES GRID
                ═══════════════════════════════════════════ */
                .features-grid {
                    display: grid; grid-template-columns: repeat(3, 1fr);
                    gap: 1px; background: var(--border-subtle);
                    border: 1px solid var(--border-soft);
                    border-radius: var(--radius-lg); overflow: hidden;
                }
                @media (max-width: 1024px) { .features-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (max-width: 600px)  { .features-grid { grid-template-columns: 1fr; } }
                .feature-card {
                    background: var(--bg-raised); padding: clamp(1.4rem,2.5vw,2rem);
                    position: relative; overflow: hidden;
                    transition: background 0.25s;
                    cursor: default;
                }
                .feature-card::before {
                    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
                    background: linear-gradient(90deg, var(--brand) 0%, transparent 100%);
                    transform: scaleX(0); transform-origin: left; transition: transform 0.35s ease;
                }
                .feature-card:hover { background: var(--bg-elevated); }
                .feature-card:hover::before { transform: scaleX(1); }
                .feature-icon-wrap {
                    width: 44px; height: 44px; border-radius: var(--radius-sm);
                    display: flex; align-items: center; justify-content: center;
                    margin-bottom: 1.2rem;
                }
                .accent-purple  { background: var(--accent-purple-bg);  color: var(--accent-purple-fg); }
                .accent-emerald { background: var(--accent-emerald-bg); color: var(--accent-emerald-fg); }
                .accent-sky     { background: var(--accent-sky-bg);     color: var(--accent-sky-fg); }
                .accent-amber   { background: var(--accent-amber-bg);   color: var(--accent-amber-fg); }
                .accent-rose    { background: var(--accent-rose-bg);    color: var(--accent-rose-fg); }
                .accent-lime    { background: var(--accent-lime-bg);    color: var(--accent-lime-fg); }
                .feature-title {
                    font-family: var(--font-display); font-size: 16px; font-weight: 700;
                    color: var(--text-primary); margin-bottom: 8px;
                }
                .feature-desc { font-size: 14px; color: var(--text-secondary); line-height: 1.65; }
                .feature-arrow {
                    position: absolute; bottom: 1.4rem; right: 1.4rem;
                    color: var(--text-tertiary); opacity: 0;
                    transform: translateX(-4px); transition: opacity 0.22s, transform 0.22s, color 0.22s;
                }
                .feature-card:hover .feature-arrow { opacity: 1; transform: translateX(0); color: var(--brand); }

                /* ═══════════════════════════════════════════
                   SHOWCASE
                ═══════════════════════════════════════════ */
                .showcase-section {
                    padding: 0 clamp(1rem,4vw,2rem) clamp(60px,8vw,100px);
                    max-width: 1280px; margin: 0 auto; position: relative; z-index: 1;
                }
                .showcase-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 14px; }
                @media (max-width: 768px) { .showcase-grid { grid-template-columns: 1fr; } }
                .showcase-img { position: relative; overflow: hidden; border-radius: var(--radius-lg); }
                .showcase-img img {
                    width: 100%; height: clamp(220px,30vw,380px);
                    object-fit: cover; display: block;
                    transition: transform 0.7s cubic-bezier(0.16,1,0.3,1);
                }
                .showcase-img:hover img { transform: scale(1.04); }
                .showcase-overlay {
                    position: absolute; inset: 0;
                    background: linear-gradient(135deg, rgba(0,0,0,0.55) 0%, transparent 55%);
                    display: flex; align-items: flex-end; padding: 1.6rem;
                }
                .showcase-label {
                    background: rgba(13,14,11,0.68); backdrop-filter: blur(14px);
                    border: 1px solid rgba(255,255,255,0.11); border-radius: 50px;
                    padding: 7px 16px; font-size: 13px; font-weight: 600; color: #fff;
                    display: flex; align-items: center; gap: 7px;
                }
                .showcase-label svg { color: var(--brand); }
                .showcase-side { display: flex; flex-direction: column; gap: 14px; }
                .showcase-side .showcase-img img { height: clamp(100px,15vw,183px); }

                /* ═══════════════════════════════════════════
                   ROLES SECTION
                ═══════════════════════════════════════════ */
                .roles-section {
                    padding: clamp(70px,9vw,110px) clamp(1rem,4vw,2rem);
                    background: var(--bg-raised);
                    border-top: 1px solid var(--border-soft);
                    border-bottom: 1px solid var(--border-soft);
                    position: relative; z-index: 1;
                }
                .roles-inner { max-width: 1280px; margin: 0 auto; }
                .roles-tabs { display: flex; gap: 8px; margin-bottom: 2.5rem; flex-wrap: wrap; }
                .role-tab {
                    padding: 9px 20px; border-radius: 50px;
                    border: 1px solid var(--border-default);
                    background: transparent; color: var(--text-secondary);
                    font-size: 14px; font-weight: 600; cursor: pointer;
                    transition: border-color 0.2s, color 0.2s, background 0.2s, box-shadow 0.2s;
                    font-family: var(--font-body);
                }
                .role-tab:hover { border-color: var(--border-hover); color: var(--text-primary); background: var(--bg-elevated); }
                .role-tab--active {
                    background: var(--brand); border-color: var(--brand); color: var(--on-brand);
                    box-shadow: 0 0 24px var(--brand-glow);
                }
                .light-mode .role-tab--active { color: #fff; box-shadow: none; }
                .roles-content {
                    display: grid; grid-template-columns: 1fr 1fr;
                    gap: clamp(2rem,5vw,4rem); align-items: center;
                }
                @media (max-width: 900px) { .roles-content { grid-template-columns: 1fr; } }
                .role-features { display: flex; flex-direction: column; gap: 10px; }
                .role-feature-item {
                    display: flex; align-items: center; gap: 16px;
                    padding: 14px 18px;
                    background: var(--bg-base); border: 1px solid var(--border-soft);
                    border-radius: var(--radius);
                    transition: border-color 0.2s, background 0.2s;
                }
                .role-feature-item:hover { border-color: var(--border-muted); background: var(--brand-tint); }
                .role-feature-num {
                    width: 28px; height: 28px; min-width: 28px; border-radius: 50%;
                    background: var(--brand-tint2); color: var(--brand);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 12px; font-weight: 700; font-family: var(--font-display);
                }
                .role-feature-icon { color: var(--text-secondary); flex-shrink: 0; }
                .role-feature-text { font-size: 14.5px; font-weight: 500; color: var(--text-primary); }

                /* Role mockup */
                .role-mockup {
                    background: var(--bg-base); border: 1px solid var(--border-default);
                    border-radius: var(--radius-xl); overflow: hidden; padding: 2px;
                }
                .role-mockup-inner { background: #0a0b08; border-radius: calc(var(--radius-xl) - 2px); overflow: hidden; }
                .light-mode .role-mockup-inner { background: #e8e5de; }
                .mockup-topbar {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 14px 20px; border-bottom: 1px solid rgba(255,255,255,0.05);
                }
                .light-mode .mockup-topbar { border-bottom-color: rgba(0,0,0,0.07); }
                .mockup-dots { display: flex; gap: 6px; }
                .mockup-dot { width: 10px; height: 10px; border-radius: 50%; }
                .mockup-dot--r { background: #ff5f56; }
                .mockup-dot--y { background: #ffbd2e; }
                .mockup-dot--g { background: #27c93f; }
                .mockup-body { padding: 20px; display: flex; flex-direction: column; gap: 14px; }
                .mockup-header { display: flex; align-items: center; justify-content: space-between; }
                .mockup-title-wrap { display: flex; flex-direction: column; gap: 4px; }
                .mockup-bar { height: 11px; border-radius: 4px; background: rgba(255,255,255,0.07); }
                .light-mode .mockup-bar { background: rgba(0,0,0,0.09); }
                .mockup-bar--wide { width: 140px; }
                .mockup-bar--sm   { width: 80px; height: 9px; }
                .mockup-avatar {
                    width: 34px; height: 34px; border-radius: 50%;
                    background: rgba(200,240,78,0.18);
                    display: flex; align-items: center; justify-content: center; font-size: 14px;
                }
                .mockup-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
                .mockup-stat {
                    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 12px; padding: 14px;
                }
                .light-mode .mockup-stat { background: rgba(0,0,0,0.04); border-color: rgba(0,0,0,0.07); }
                .mockup-stat-val { font-size: 20px; font-weight: 700; color: var(--brand); font-family: var(--font-display); }
                .mockup-stat-label { font-size: 11px; color: rgba(255,255,255,0.28); margin-top: 2px; }
                .light-mode .mockup-stat-label { color: rgba(0,0,0,0.3); }
                .mockup-chart {
                    height: 80px; background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.05); border-radius: 12px;
                    padding: 12px 16px; display: flex; align-items: flex-end; gap: 6px;
                }
                .light-mode .mockup-chart { background: rgba(0,0,0,0.03); border-color: rgba(0,0,0,0.07); }
                .mockup-bar-chart { flex: 1; border-radius: 3px 3px 0 0; background: rgba(200,240,78,0.18); transition: background 0.3s; }
                .mockup-bar-chart--active { background: var(--brand); }
                .mockup-ai-block {
                    background: rgba(200,240,78,0.06); border: 1px solid rgba(200,240,78,0.13);
                    border-radius: 14px; padding: 16px;
                    display: flex; align-items: center; gap: 12px;
                }
                .mockup-ai-icon { color: var(--brand); flex-shrink: 0; }
                .mockup-ai-lines { flex: 1; display: flex; flex-direction: column; gap: 6px; }
                .mockup-ai-line { height: 7px; border-radius: 4px; background: rgba(200,240,78,0.13); }
                .mockup-role-pill {
                    display: inline-flex; padding: 4px 12px; border-radius: 50px;
                    font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;
                }

                /* ═══════════════════════════════════════════
                   PRICING
                ═══════════════════════════════════════════ */
                .pricing-grid {
                    display: grid; grid-template-columns: repeat(3,1fr);
                    gap: 16px; align-items: stretch;
                }
                @media (max-width: 900px) { .pricing-grid { grid-template-columns: 1fr; max-width: 480px; margin: 0 auto; } }
                .pricing-card {
                    background: var(--bg-raised); border: 1px solid var(--border-default);
                    border-radius: var(--radius-lg); padding: clamp(1.4rem,2.5vw,2rem);
                    display: flex; flex-direction: column; position: relative;
                    transition: border-color 0.25s, transform 0.25s;
                }
                .pricing-card:hover { border-color: var(--border-hover); transform: translateY(-3px); }
                .pricing-card--featured {
                    background: var(--brand); border-color: var(--brand);
                    box-shadow: 0 0 70px var(--brand-glow); transform: scale(1.025);
                }
                .pricing-card--featured:hover { transform: scale(1.025) translateY(-3px); }
                .pricing-card--featured * { color: #0d0e0b !important; }
                .light-mode .pricing-card--featured * { color: #fff !important; }
                .pricing-badge {
                    position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
                    background: #0d0e0b; color: var(--brand) !important;
                    font-size: 10.5px; font-weight: 700; padding: 4px 14px;
                    border-radius: 50px; white-space: nowrap;
                    letter-spacing: 0.8px; text-transform: uppercase;
                }
                .light-mode .pricing-badge { background: #1a1c14; }
                .pricing-plan {
                    font-size: 11.5px; font-weight: 700; text-transform: uppercase;
                    letter-spacing: 1.2px; color: var(--brand); margin-bottom: 12px;
                }
                .pricing-card--featured .pricing-plan { color: rgba(12,13,11,0.55) !important; }
                .pricing-price-row { display: flex; align-items: baseline; gap: 6px; margin-bottom: 8px; }
                .pricing-price {
                    font-family: var(--font-display); font-size: clamp(38px,4vw,48px);
                    font-weight: 800; color: var(--text-primary); letter-spacing: -2px;
                }
                .pricing-period { font-size: 14px; color: var(--text-secondary); }
                .pricing-desc {
                    font-size: 14px; color: var(--text-secondary);
                    margin-bottom: 1.4rem; padding-bottom: 1.4rem;
                    border-bottom: 1px solid var(--border-soft);
                }
                .pricing-card--featured .pricing-desc { border-color: rgba(12,13,11,0.16); }
                .pricing-features {
                    list-style: none; display: flex; flex-direction: column;
                    gap: 10px; flex: 1; margin-bottom: 1.4rem;
                }
                .pricing-features li { display: flex; align-items: center; gap: 10px; font-size: 14px; color: var(--text-secondary); }
                .pricing-check { color: var(--brand); flex-shrink: 0; }
                .pricing-card--featured .pricing-check { color: rgba(12,13,11,0.55) !important; }
                .pricing-cta {
                    display: flex; align-items: center; justify-content: center; gap: 6px;
                    padding: 12px 20px; border-radius: 50px;
                    border: 1px solid var(--border-hover); background: transparent;
                    color: var(--text-primary); font-size: 14px; font-weight: 600;
                    text-decoration: none; transition: background 0.2s;
                }
                .pricing-cta:hover { background: var(--bg-elevated); }
                .pricing-cta--featured { background: #0d0e0b !important; color: var(--brand) !important; border-color: #0d0e0b !important; }
                .pricing-cta--featured:hover { opacity: 0.88; }
                .light-mode .pricing-cta--featured { background: #1a1c14 !important; }

                /* ═══════════════════════════════════════════
                   TESTIMONIALS
                ═══════════════════════════════════════════ */
                .testimonials-section {
                    padding: clamp(70px,9vw,110px) clamp(1rem,4vw,2rem);
                    background: var(--bg-raised);
                    border-top: 1px solid var(--border-soft);
                    border-bottom: 1px solid var(--border-soft);
                    position: relative; z-index: 1;
                }
                .testimonials-inner { max-width: 1280px; margin: 0 auto; }
                .testimonials-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
                @media (max-width: 900px) { .testimonials-grid { grid-template-columns: 1fr; } }
                .testimonial-card {
                    background: var(--bg-base); border: 1px solid var(--border-default);
                    border-radius: var(--radius-lg); padding: 1.75rem;
                    display: flex; flex-direction: column; gap: 1rem;
                    transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
                }
                .testimonial-card:hover {
                    border-color: var(--brand-muted); transform: translateY(-4px);
                    box-shadow: 0 16px 48px rgba(0,0,0,0.24);
                }
                .light-mode .testimonial-card:hover { box-shadow: 0 10px 34px rgba(0,0,0,0.09); }
                .stars { display: flex; gap: 4px; }
                .star { width: 14px; height: 14px; fill: #22c55e; flex-shrink: 0; }
                .testimonial-quote { font-size: 14.5px; color: var(--text-secondary); line-height: 1.78; flex: 1; font-style: italic; }
                .testimonial-author { display: flex; align-items: center; gap: 12px; margin-top: auto; }
                .author-avatar {
                    width: 40px; height: 40px; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 13px; font-weight: 700; flex-shrink: 0;
                }
                .av-purple { background: var(--av-purple-bg); color: var(--av-purple-fg); }
                .av-blue   { background: var(--av-sky-bg);    color: var(--av-sky-fg); }
                .av-green  { background: var(--av-mint-bg);   color: var(--av-mint-fg); }
                .author-name { font-size: 14px; font-weight: 600; color: var(--text-primary); }
                .author-role { font-size: 12px; color: var(--text-tertiary); margin-top: 2px; }

                /* ═══════════════════════════════════════════
                   FAQ
                ═══════════════════════════════════════════ */
                .faq-item { border-bottom: 1px solid var(--border-soft); }
                .faq-question {
                    width: 100%; background: none; border: none; cursor: pointer;
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 1.4rem 0; text-align: left; gap: 1rem;
                    color: var(--text-primary); font-size: 15.5px; font-weight: 600;
                    font-family: var(--font-body); transition: color 0.2s;
                }
                .faq-question:hover { color: var(--brand); }
                .faq-chevron { color: var(--text-tertiary); transition: transform 0.3s, color 0.2s; flex-shrink: 0; }
                .faq-chevron.rotate { transform: rotate(180deg); color: var(--brand); }
                .faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.35s ease; }
                .faq-answer--open { max-height: 300px; padding-bottom: 1.4rem; }
                .faq-answer p { font-size: 15px; color: var(--text-secondary); line-height: 1.78; padding-right: 3rem; font-weight: 300; }

                /* ═══════════════════════════════════════════
                   CONTACT
                ═══════════════════════════════════════════ */
                .contact-section {
                    padding: clamp(70px,9vw,110px) clamp(1rem,4vw,2rem);
                    max-width: 1280px; margin: 0 auto; position: relative; z-index: 1;
                }
                .contact-grid { display: grid; grid-template-columns: 1fr 1.6fr; gap: clamp(2.5rem,6vw,6rem); align-items: start; }
                @media (max-width: 900px) { .contact-grid { grid-template-columns: 1fr; gap: 2.5rem; } }
                .contact-info { display: flex; flex-direction: column; gap: 1.25rem; }
                .contact-label { font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: var(--brand); }
                .contact-title { font-family: var(--font-display); font-size: clamp(30px,4vw,42px); font-weight: 800; letter-spacing: -1.5px; color: var(--text-primary); line-height: 1.1; }
                .contact-body { font-size: 16px; color: var(--text-secondary); line-height: 1.78; font-weight: 300; }
                .contact-email { color: var(--brand); text-decoration: none; font-weight: 600; }
                .contact-email:hover { text-decoration: underline; }
                .contact-perks { display: flex; flex-direction: column; gap: 10px; margin-top: 6px; }
                .contact-perk { display: flex; align-items: center; gap: 10px; font-size: 14px; color: var(--text-secondary); }
                .contact-perk-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--brand); flex-shrink: 0; }
                .contact-form { display: flex; flex-direction: column; gap: 14px; }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
                @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }
                .form-group { display: flex; flex-direction: column; gap: 6px; }
                .form-label { font-size: 11.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.6px; color: var(--text-tertiary); }
                .form-input, .form-textarea {
                    background: var(--bg-raised); border: 1px solid var(--border-default);
                    border-radius: var(--radius); padding: 13px 17px;
                    font-size: 15px; color: var(--text-primary);
                    font-family: var(--font-body); outline: none; width: 100%;
                    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
                }
                .form-input:focus, .form-textarea:focus {
                    border-color: var(--brand-muted); background: var(--bg-elevated);
                    box-shadow: 0 0 0 3px var(--brand-tint);
                }
                .form-input::placeholder, .form-textarea::placeholder { color: var(--text-tertiary); }
                .form-textarea { resize: none; }
                .form-submit {
                    padding: 14px 28px; background: var(--brand); color: var(--on-brand);
                    border: none; border-radius: 50px; font-size: 15px; font-weight: 700;
                    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
                    font-family: var(--font-display);
                    transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
                }
                .form-submit:hover { background: var(--brand-dim); transform: translateY(-1px); box-shadow: 0 8px 32px var(--brand-glow); }
                .form-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }
                .lang-switch {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 4px;
                    border: 1px solid var(--border-default);
                    border-radius: 999px;
                    background: var(--bg-elevated);
                }
                .lang-switch-btn {
                    border: none;
                    background: transparent;
                    color: var(--text-secondary);
                    padding: 6px 10px;
                    border-radius: 999px;
                    font-size: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: background 0.2s, color 0.2s;
                }
                .lang-switch-btn.active {
                    background: var(--brand);
                    color: var(--on-brand);
                }
                .rtl { direction: rtl; }
                .rtl .hero-trust-avatar { margin-left: 0; margin-right: -8px; }
                .rtl .hero-trust-avatar:first-child { margin-right: 0; }
                .rtl .feature-arrow { right: auto; left: 1.4rem; transform: translateX(4px); }
                .rtl .feature-card:hover .feature-arrow { transform: translateX(0); }
                .rtl .faq-question { text-align: right; }
                .rtl .faq-answer p { padding-right: 0; padding-left: 3rem; }

                /* ═══════════════════════════════════════════
                   FOOTER
                ═══════════════════════════════════════════ */
                .footer {
                    border-top: 1px solid var(--border-soft);
                    background: var(--bg-raised);
                    padding: 2.5rem clamp(1rem,4vw,2rem);
                    position: relative; z-index: 1;
                }
                .footer-inner {
                    max-width: 1280px; margin: 0 auto;
                    display: flex; align-items: center; justify-content: space-between;
                    gap: 1.5rem; flex-wrap: wrap;
                }
                .footer-links { display: flex; gap: 1.5rem; flex-wrap: wrap; }
                .footer-links a { font-size: 14px; color: var(--text-tertiary); text-decoration: none; transition: color 0.2s; }
                .footer-links a:hover { color: var(--text-primary); }
                .footer-copy { font-size: 13px; color: var(--text-tertiary); }

                /* ═══════════════════════════════════════════
                   DIVIDER
                ═══════════════════════════════════════════ */
                .divider-line {
                    width: 100%; height: 1px;
                    background: linear-gradient(90deg, transparent 0%, var(--border-default) 30%, var(--border-default) 70%, transparent 100%);
                    position: relative; z-index: 1;
                }

                /* ═══════════════════════════════════════════
                   CTA BANNER
                ═══════════════════════════════════════════ */
                .cta-banner {
                    margin: 0 clamp(1rem,4vw,2rem) clamp(60px,8vw,90px);
                    max-width: 1280px; margin-left: auto; margin-right: auto;
                    margin-bottom: clamp(60px,8vw,90px);
                    position: relative; z-index: 1;
                    background: linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-high) 100%);
                    border: 1px solid var(--border-muted);
                    border-radius: var(--radius-xl);
                    padding: clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4rem);
                    text-align: center; overflow: hidden;
                }
                .cta-banner::before {
                    content: ''; position: absolute; inset: 0;
                    background: radial-gradient(ellipse 60% 60% at 50% 0%, var(--brand-tint) 0%, transparent 70%);
                    pointer-events: none;
                }
                .cta-banner-title {
                    font-family: var(--font-display);
                    font-size: clamp(28px,4vw,50px); font-weight: 800;
                    letter-spacing: -1.5px; color: var(--text-primary);
                    margin-bottom: 1rem; position: relative;
                }
                .cta-banner-title span { color: var(--brand); }
                .cta-banner-sub {
                    font-size: 16px; color: var(--text-secondary);
                    margin-bottom: 2.2rem; font-weight: 300; position: relative;
                }
                .cta-banner-actions { display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; position: relative; }

                /* ═══════════════════════════════════════════
                   RESPONSIVE UTILITIES
                ═══════════════════════════════════════════ */
                @media (max-width: 480px) {
                    .hero-trust { flex-direction: column; align-items: flex-start; }
                    .cta-banner { margin-left: 1rem; margin-right: 1rem; }
                }
            `}</style>

            <div className={`${isDark ? '' : 'light-mode'} ${isRTL ? 'rtl' : ''}`} lang={language} dir={isRTL ? 'rtl' : 'ltr'}>
                {/* Ambient */}
                <div className="ambient">
                    <div className="ambient-orb ambient-orb-1" />
                    <div className="ambient-orb ambient-orb-2" />
                    <div className="ambient-orb ambient-orb-3" />
                </div>

                {/* ── NAV ── */}
                <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
                    <div className="nav-inner">
                        <a href="/" className="nav-logo">
                            <div className="nav-logo-mark"><Dumbbell size={18} /></div>
                            <span className="nav-logo-text">AI GYM</span>
                        </a>
                        <ul className="nav-links">
                            {navLinks.map(l => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}
                        </ul>
                        <div className="nav-actions">
                            <div className="lang-switch" aria-label="Language switcher">
                                {(['en', 'fr', 'ar'] as Language[]).map((lang) => (
                                    <button key={lang} onClick={() => switchLanguage(lang)} className={`lang-switch-btn ${language === lang ? 'active' : ''}`}>
                                        {lang.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                            <button onClick={toggleTheme} className="nav-theme-btn" aria-label="Toggle theme">
                                {isDark ? <Sun size={15} /> : <Moon size={15} />}
                            </button>
                            {auth.user ? (
                                <Link href="/dashboard" className="btn-primary">{copy.nav.dashboard} <ArrowRight size={14} /></Link>
                            ) : (
                                <>
                                    <Link href="/login" className="btn-ghost">{copy.nav.login}</Link>
                                    {canRegister && <Link href="/register" className="btn-primary">{copy.nav.getStarted} <ArrowRight size={14} /></Link>}
                                </>
                            )}
                        </div>
                        <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Menu">
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </nav>

                {/* Mobile Menu */}
                <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                    {navLinks.map(l => (
                        <a key={l.href} href={l.href} onClick={() => setIsMobileMenuOpen(false)}>{l.label}</a>
                    ))}
                    <div className="mobile-menu-actions">
                        <div className="lang-switch" aria-label="Language switcher mobile">
                            {(['en', 'fr', 'ar'] as Language[]).map((lang) => (
                                <button key={lang} onClick={() => switchLanguage(lang)} className={`lang-switch-btn ${language === lang ? 'active' : ''}`}>
                                    {lang.toUpperCase()}
                                </button>
                            ))}
                        </div>
                        <button onClick={toggleTheme} className="btn-ghost" style={{ justifyContent: 'center' }}>
                            {isDark ? <><Sun size={15} /> {copy.nav.lightMode}</> : <><Moon size={15} /> {copy.nav.darkMode}</>}
                        </button>
                        {auth.user ? (
                            <Link href="/dashboard" className="btn-primary" style={{ justifyContent: 'center' }}>{copy.nav.dashboard}</Link>
                        ) : (
                            <>
                                <Link href="/login" className="btn-ghost" style={{ justifyContent: 'center' }}>{copy.nav.login}</Link>
                                {canRegister && <Link href="/register" className="btn-primary" style={{ justifyContent: 'center' }}>{copy.nav.getStarted}</Link>}
                            </>
                        )}
                    </div>
                </div>

                {/* ── HERO ── */}
                <div className="hero-wrap">
                    <div className="hero-content">
                        {content?.announcement ? (
                            <div className="hero-badge"><span className="badge-dot" /><BellRing size={12} />{content.announcement}</div>
                        ) : (
                            <div className="hero-badge"><span className="badge-dot" /><Sparkles size={12} />{copy.hero.fallbackBadge}</div>
                        )}
                        <h1 className="hero-title">
                            {cmsHeroTitle ? (
                                <>
                                    {cmsHeroTitle}
                                    <span className="hero-title-accent">{copy.hero.accent}</span>
                                </>
                            ) : (
                                <>
                                    {copy.hero.title1}<br />{copy.hero.title2}
                                    <span className="hero-title-accent">{copy.hero.accent}</span>
                                </>
                            )}
                        </h1>
                        <p className="hero-subtitle">{copy.hero.subtitle}</p>
                        <div className="hero-actions">
                            {auth.user ? (
                                <Link href="/dashboard" className="btn-hero">{copy.hero.accessPortal} <ArrowRight size={16} /></Link>
                            ) : (
                                <>
                                    {canRegister && <Link href="/register" className="btn-hero">{copy.hero.startTrial} <ArrowRight size={16} /></Link>}
                                    <a href="#features" className="btn-hero-outline"><Play size={14} /> {copy.hero.seeFeatures}</a>
                                </>
                            )}
                        </div>
                        <div className="hero-trust">
                            <div className="hero-trust-avatars">
                                {['photo-1534528741775-53994a69daeb','photo-1494790108377-be9c29b29330','photo-1472099645785-5658abf4ff4e','photo-1506794778202-cad84cf45f1d'].map(id => (
                                    <div key={id} className="hero-trust-avatar">
                                        <img src={`https://images.unsplash.com/${id}?w=56&h=56&q=80&auto=format&fit=crop&crop=face`} alt="" />
                                    </div>
                                ))}
                            </div>
                            <span className="hero-trust-text">{copy.hero.trustedBy} <strong>{copy.hero.trustCount}</strong> {copy.hero.trustSuffix}</span>
                        </div>
                    </div>
                    <div className="hero-visual"><HeroImageGrid /></div>
                </div>

                {/* ── MARQUEE ── */}
                <div className="marquee-wrap">
                    <div className="marquee-track">
                        {[...Array(2)].flatMap(() =>
                            (language === 'ar'
                                ? ['توليد برامج AI','قياسات ذكية','مدفوعات Stripe','صلاحيات حسب الدور','تتبع التقدم','تخزين Redis','جدولة الجلسات','تحليلات العملاء']
                                : language === 'fr'
                                    ? ['Generation IA','Biometrie intelligente','Paiements Stripe','Acces par roles','Suivi progression','Cache Redis','Planning sessions','Analytique clients']
                                    : ['AI Workout Generation','Smart Biometrics','Stripe Payments','Role-Based Access','Progress Tracking','Redis Caching','Session Scheduling','Client Analytics']
                            ).map((item, i) => (
                                <span key={`${item}-${i}`} className="marquee-item">
                                    <span className="marquee-dot" />{item}
                                </span>
                            ))
                        )}
                    </div>
                </div>

                {/* ── STATS ── */}
                <div className="stats-section">
                    <div className="stats-grid">
                        <StatCard value={1200} suffix="+" label={language === 'ar' ? 'اعضاء نشطون' : language === 'fr' ? 'Membres actifs' : 'Active members'}       icon={<Users size={20} />} />
                        <StatCard value={48}   suffix="k"  label={language === 'ar' ? 'برامج مولدة' : language === 'fr' ? 'Programmes generes' : 'Programs generated'}  icon={<Brain size={20} />} />
                        <StatCard value={98}   suffix="%"  label={language === 'ar' ? 'رضا العملاء' : language === 'fr' ? 'Satisfaction client' : 'Client satisfaction'}  icon={<Activity size={20} />} />
                        <StatCard value={10}   suffix="x"  label={language === 'ar' ? 'سير عمل اسرع' : language === 'fr' ? 'Workflow accelere' : 'Faster workflow'}      icon={<Zap size={20} />} />
                    </div>
                </div>

                {/* ── SHOWCASE ── */}
                <div className="showcase-section">
                    <div className="showcase-grid">
                        <div className="showcase-img">
                            <img src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=900&q=80&auto=format&fit=crop" alt="Gym floor" />
                                <div className="showcase-overlay">
                                    <div className="showcase-label"><Brain size={14} /> {language === 'ar' ? 'تدريب مدعوم بالذكاء الاصطناعي' : language === 'fr' ? "Entrainement pilote par IA" : 'AI-Powered Training'}</div>
                                </div>
                            </div>
                        <div className="showcase-side">
                            <div className="showcase-img">
                                <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80&auto=format&fit=crop" alt="Barbell training" />
                                <div className="showcase-overlay">
                                    <div className="showcase-label"><TrendingUp size={14} /> {language === 'ar' ? 'تتبع الاداء' : language === 'fr' ? 'Suivi de performance' : 'Performance Tracking'}</div>
                                </div>
                            </div>
                            <div className="showcase-img">
                                <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80&auto=format&fit=crop" alt="Coach and client" />
                                <div className="showcase-overlay">
                                    <div className="showcase-label"><Users size={14} /> {language === 'ar' ? 'بوابات المدرب والعميل' : language === 'fr' ? 'Portails coach et client' : 'Coach & Client Portals'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── FEATURES ── */}
                <section id="features" className="section">
                    <div className="section-header">
                        <div className="section-tag"><Sparkles size={12} /> {copy.common.enterpriseFeatures}</div>
                        <h2 className="section-title">{copy.sections.featuresTitle.split('\n')[0]}<br />{copy.sections.featuresTitle.split('\n')[1]}</h2>
                        <p className="section-subtitle">{copy.sections.featuresSubtitle}</p>
                    </div>
                    <div className="features-grid">
                        <FeatureCard icon={<Brain size={22} />}      accent="accent-purple"  title={language === 'ar' ? 'توليد برامج AI' : language === 'fr' ? 'Generation IA de programmes' : 'AI Workout Generation'} description={language === 'ar' ? 'انشئ برامج تدريب مخصصة بسرعة حسب الهدف والمستوى والقيود الصحية.' : language === 'fr' ? 'Generez instantanement des programmes adaptes selon objectif, niveau et contraintes medicales.' : 'Instantly generate tailored 4-week programs based on client goals, fitness level, and medical constraints.'} />
                        <FeatureCard icon={<Activity size={22} />}   accent="accent-emerald" title={language === 'ar' ? 'قياسات حيوية ذكية' : language === 'fr' ? 'Biometrie intelligente' : 'Smart Biometrics'}       description={language === 'ar' ? 'ادخل القياسات لتحصل على مؤشرات وتوصيات عملية مدعومة بالذكاء الاصطناعي.' : language === 'fr' ? 'Saisissez les donnees physiques pour obtenir des recommandations intelligentes immediates.' : 'Enter physical stats and get ideal weight targets, BMI insights, and personalised strategies from AI.'} />
                        <FeatureCard icon={<CreditCard size={22} />} accent="accent-sky"     title={language === 'ar' ? 'فوترة تلقائية' : language === 'fr' ? 'Facturation automatisee' : 'Automated Billing'}      description={language === 'ar' ? 'تكامل Stripe مع الدفع الكامل او بالتقسيط والتنبيه للحسابات المتاخرة.' : language === 'fr' ? 'Integration Stripe avec paiement integral ou fractionne et detection des impayes.' : 'Stripe integration with full or split payments and automatic delinquent account flags.'} />
                        <FeatureCard icon={<TrendingUp size={22} />} accent="accent-amber"   title={language === 'ar' ? 'تقدم مرئي' : language === 'fr' ? 'Progression visuelle' : 'Visual Progression'}    description={language === 'ar' ? 'لوحات تفاعلية لتتبع الوزن والحضور والاهداف عبر الزمن.' : language === 'fr' ? 'Tableaux de bord interactifs pour suivre poids, presence et objectifs dans le temps.' : 'Interactive dashboards to track weight, attendance, and goals over time.'} />
                        <FeatureCard icon={<Users size={22} />}      accent="accent-rose"    title={language === 'ar' ? 'امان حسب الدور' : language === 'fr' ? 'Securite par role' : 'Role-Based Security'}   description={language === 'ar' ? 'صلاحيات دقيقة تضمن ان كل مستخدم يرى فقط ما يحتاجه.' : language === 'fr' ? 'RBAC granulaire pour que chaque utilisateur n accede qu a ce qui le concerne.' : 'Granular RBAC ensures each role sees only what it needs.'} />
                        <FeatureCard icon={<Zap size={22} />}        accent="accent-lime"    title={language === 'ar' ? 'CMS سريع عبر Redis' : language === 'fr' ? 'CMS accelere via Redis' : 'Redis Cached CMS'}      description={language === 'ar' ? 'اداء فائق السرعة للصفحات والتحليلات بفضل التخزين المؤقت.' : language === 'fr' ? 'Performance tres rapide des pages et analytics grace au cache Redis.' : 'Fast landing pages and analytics powered by Redis caching.'} />
                    </div>
                </section>

                <div className="divider-line" />

                {/* ── ROLES ── */}
                <div id="how-it-works" className="roles-section">
                    <div className="roles-inner">
                        <div className="section-header">
                            <div className="section-tag"><Users size={12} /> {copy.common.unifiedEcosystem}</div>
                            <h2 className="section-title">{copy.sections.rolesTitle.split('\n')[0]}<br />{copy.sections.rolesTitle.split('\n')[1]}</h2>
                            <p className="section-subtitle">{copy.sections.rolesSubtitle}</p>
                        </div>
                        <div className="roles-tabs">
                            {(Object.keys(roles) as Array<keyof typeof roles>).map(role => (
                                <button key={role} onClick={() => setActiveRole(role)} className={`role-tab ${activeRole === role ? 'role-tab--active' : ''}`}>
                                    {roles[role].emoji} {roles[role].label}
                                </button>
                            ))}
                        </div>
                        <div className="roles-content">
                            <div className="role-features">
                                {roles[activeRole].features.map((f, i) => (
                                    <div key={i} className="role-feature-item">
                                        <div className="role-feature-num">{i + 1}</div>
                                        <div className="role-feature-icon">{f.icon}</div>
                                        <span className="role-feature-text">{f.text}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="role-mockup">
                                <div className="role-mockup-inner">
                                    <div className="mockup-topbar">
                                        <div className="mockup-dots">
                                            <div className="mockup-dot mockup-dot--r" />
                                            <div className="mockup-dot mockup-dot--y" />
                                            <div className="mockup-dot mockup-dot--g" />
                                        </div>
                                        <div className="mockup-bar mockup-bar--sm" style={{ width: 100 }} />
                                        <div style={{ width: 60 }} />
                                    </div>
                                    <div className="mockup-body">
                                        <div className="mockup-header">
                                            <div className="mockup-title-wrap">
                                                <div className="mockup-bar mockup-bar--wide" />
                                                <div className="mockup-bar mockup-bar--sm" />
                                            </div>
                                            <div className="mockup-avatar">
                                                {activeRole === 'admin' ? '⚙️' : activeRole === 'coach' ? '🏋️' : '🎯'}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="mockup-role-pill" style={{
                                                background: activeRole === 'admin' ? 'rgba(239,68,68,0.13)' : activeRole === 'coach' ? 'rgba(162,110,255,0.13)' : 'rgba(56,189,248,0.13)',
                                                color: activeRole === 'admin' ? '#fca5a5' : activeRole === 'coach' ? '#c4a0ff' : '#7dd3fc',
                                            }}>
                                                {roles[activeRole].label} Portal
                                            </span>
                                        </div>
                                        <div className="mockup-stats">
                                            {['48k','98%','10x'].map((v, i) => (
                                                <div key={i} className="mockup-stat">
                                                    <div className="mockup-stat-val">{v}</div>
                                                    <div className="mockup-stat-label">{['Programs','Satisfaction','Faster'][i]}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mockup-chart">
                                            {[40,60,45,80,65,90,75].map((h, i) => (
                                                <div key={i} className={`mockup-bar-chart ${i === 5 ? 'mockup-bar-chart--active' : ''}`} style={{ height: `${h}%` }} />
                                            ))}
                                        </div>
                                        <div className="mockup-ai-block">
                                            <Brain size={18} className="mockup-ai-icon" />
                                            <div className="mockup-ai-lines">
                                                <div className="mockup-ai-line" style={{ width: '80%' }} />
                                                <div className="mockup-ai-line" style={{ width: '58%' }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── PRICING ── */}
                <section id="pricing" className="section">
                    <div className="section-header section-header--center">
                        <div className="section-tag"><CreditCard size={12} /> {copy.common.pricing}</div>
                        <h2 className="section-title">{copy.sections.pricingTitle}</h2>
                        <p className="section-subtitle">{copy.sections.pricingSubtitle}</p>
                    </div>
                    <div className="pricing-grid">
                        <PricingCard plan={language === 'ar' ? 'مبتدئ' : language === 'fr' ? 'Starter' : 'Starter'}    price={language === 'ar' ? 'مجاني' : 'Free'}  period={language === 'ar' ? 'مدى الحياة' : language === 'fr' ? 'a vie' : 'forever'}  description={language === 'ar' ? 'للمدربين المستقلين في البداية.' : language === 'fr' ? 'Pour les coachs independants qui demarrent.' : 'For solo coaches just getting started.'}      features={language === 'ar' ? ['حتى 5 عملاء','مولد برامج AI (10 شهريا)','قياسات حيوية اساسية','دعم المجتمع'] : language === 'fr' ? ['Jusqu a 5 clients','Generateur IA (10/mois)','Biometrie de base','Support communaute'] : ['Up to 5 clients','AI program generator (10/mo)','Basic biometrics','Community support']}                           cta={language === 'ar' ? 'ابدأ مجانا' : language === 'fr' ? 'Commencer gratuitement' : 'Get started free'}  canRegister={canRegister} badgeLabel={copy.common.mostPopular} />
                        <PricingCard plan="Pro"        price="$49"   period={language === 'ar' ? '/ شهر' : language === 'fr' ? '/ mois' : '/ month'}  description={language === 'ar' ? 'للنوادي المتنامية والمدربين المحترفين.' : language === 'fr' ? 'Pour les salles en croissance et les coachs exigeants.' : 'For growing gyms and serious coaches.'}        features={language === 'ar' ? ['عملاء غير محدودين','توليد AI غير محدود','مدفوعات Stripe بالتقسيط','تكامل FullCalendar','دعم اولوية'] : language === 'fr' ? ['Clients illimites','Generation IA illimitee','Paiements Stripe fractionnes','Integration FullCalendar','Support prioritaire'] : ['Unlimited clients','Unlimited AI generation','Stripe split payments','FullCalendar integration','Priority support']} cta={language === 'ar' ? 'ابدأ تجربة Pro' : language === 'fr' ? "Demarrer l'essai Pro" : 'Start Pro trial'}   highlighted canRegister={canRegister} badgeLabel={copy.common.mostPopular} />
                        <PricingCard plan={language === 'ar' ? 'مؤسسات' : 'Enterprise'} price="$199"  period={language === 'ar' ? '/ شهر' : language === 'fr' ? '/ mois' : '/ month'}  description={language === 'ar' ? 'لسلاسل النوادي متعددة الفروع.' : language === 'fr' ? 'Pour les chaines multi-sites.' : 'For multi-location gym chains.'}              features={language === 'ar' ? ['دعم عدة فروع','هوية بصرية مخصصة','وصول CMS Redis','مدير حساب مخصص','اتفاقية SLA'] : language === 'fr' ? ['Multi-sites','Branding personnalise','Acces CMS Redis','Account manager dedie','Garantie SLA'] : ['Multi-location support','Custom branding','Redis CMS Access','Dedicated account manager','SLA guarantee']}           cta={language === 'ar' ? 'تواصل مع المبيعات' : language === 'fr' ? 'Contacter les ventes' : 'Contact sales'}     canRegister={canRegister} badgeLabel={copy.common.mostPopular} />
                    </div>
                </section>

                {/* ── TESTIMONIALS ── */}
                <div className="testimonials-section">
                    <div className="testimonials-inner">
                        <div className="section-header section-header--center">
                            <div className="section-tag"><Users size={12} /> {copy.common.testimonials}</div>
                            <h2 className="section-title">{copy.sections.testimonialsTitle}</h2>
                        </div>
                        <div className="testimonials-grid">
                            <TestimonialCard quote="The AI program generator saved me hours every week. My clients are getting better results than ever and the programs feel genuinely personalised." name="Sarah M." role="Head Coach, Casablanca Fitness" initials="SM" accent="av-purple" />
                            <TestimonialCard quote="The Stripe split payment feature and automated delinquent tracking was a game-changer. Revenue recovery increased by 40% in the first month." name="Karim B." role="Gym Owner, Marrakech Central" initials="KB" accent="av-blue" />
                            <TestimonialCard quote="I can finally see my workout history, goals, and progress all in one place. The biometric advice helped me adapt my training to my health conditions." name="Ines T." role="Pro Athlete" initials="IT" accent="av-green" />
                        </div>
                    </div>
                </div>

                {/* ── FAQ ── */}
                <section id="faq" className="section" style={{ maxWidth: '820px' }}>
                    <div className="section-header section-header--center">
                        <div className="section-tag">{copy.common.faq}</div>
                        <h2 className="section-title">{copy.sections.faqTitle}</h2>
                    </div>
                    <div>
                        <FAQItem q={language === 'ar' ? 'كيف يعمل مولد برامج التدريب بالذكاء الاصطناعي؟' : language === 'fr' ? "Comment fonctionne le generateur d entrainement IA ?" : 'How does the AI workout generator work?'} a={language === 'ar' ? 'يقوم المدرب بادخال ملف العميل مثل الهدف والمستوى والادوات والاصابات، ثم نرسل البيانات الى Gemini عبر الخادم الخلفي ليعيد برنامجا منظما فورا.' : language === 'fr' ? 'Le coach renseigne le profil client (objectif, niveau, equipement, blessures). Le backend envoie ces donnees a Gemini qui retourne un programme structure instantanement.' : 'Coaches fill in a client profile - goal, fitness level, available equipment, and any injuries. We send this to Gemini via our backend service and it returns a structured program instantly.'} />
                        <FAQItem q={language === 'ar' ? 'هل بياناتي آمنة؟' : language === 'fr' ? 'Mes donnees sont-elles securisees ?' : 'Is my data secure?'} a={language === 'ar' ? 'نعم. يتم حماية البيانات بصلاحيات RBAC، وبيانات الدفع لا تمر عبر خوادمنا بل تتم بالكامل عبر Stripe مع سجلات تدقيق للنظام.' : language === 'fr' ? 'Oui. Les donnees sont protegees par RBAC, les paiements sont geres par Stripe, et le systeme conserve des journaux d audit stricts.' : "Yes. Data is protected by strict RBAC. Payment data never touches our servers and is handled by Stripe, with system audit logs in place."} />
                        <FAQItem q={language === 'ar' ? 'كيف يعمل الدفع بالتقسيط للعملاء؟' : language === 'fr' ? 'Comment fonctionne le paiement fractionne ?' : 'How does split payment work for clients?'} a={language === 'ar' ? 'يمكن للعميل اختيار الدفع على اقساط شهرية عبر Stripe، وعند فشل الدفع يتم تمييز الحساب تلقائيا كمتاخر.' : language === 'fr' ? 'Le client peut payer son abonnement en mensualites via Stripe. En cas d echec de paiement, le compte est automatiquement marque en retard.' : "Clients can pay memberships in monthly installments via Stripe. If a payment fails, the account is automatically marked overdue."} />
                        <FAQItem q={language === 'ar' ? 'لماذا المنصة سريعة جدا؟' : language === 'fr' ? 'Pourquoi la plateforme est-elle si rapide ?' : 'How is the platform so fast?'} a={language === 'ar' ? 'نستخدم تخزين Redis بشكل مكثف لتحميل التحليلات وصفحات المحتوى بسرعة عالية مع تقليل الاستعلامات الثقيلة.' : language === 'fr' ? 'Nous utilisons intensivement Redis pour mettre en cache les tableaux de bord et le contenu, ce qui reduit les requetes lourdes.' : 'We heavily use Redis caching for dashboards and content pages, reducing expensive database queries.'} />
                        <FAQItem q={language === 'ar' ? 'هل يمكنني التجربة قبل الاشتراك؟' : language === 'fr' ? "Puis-je essayer avant de m engager ?" : 'Can I try it before committing?'} a={language === 'ar' ? 'بالتأكيد. خطة البداية مجانية بالكامل وتسمح لك باضافة حتى 5 عملاء مع 10 توليدات AI شهريا.' : language === 'fr' ? 'Oui. Le plan Starter est gratuit et permet jusqu a 5 clients avec 10 generations IA par mois.' : 'Absolutely. The Starter plan is free and includes up to 5 clients with 10 AI generations per month.'} />
                    </div>
                </section>

                {/* ── CTA BANNER ── */}
                <div className="cta-banner">
                    <h2 className="cta-banner-title">{copy.cta.title.replace(copy.cta.accent, '')}<span>{copy.cta.accent}</span></h2>
                    <p className="cta-banner-sub">{copy.cta.subtitle}</p>
                    <div className="cta-banner-actions">
                        {canRegister && <Link href="/register" className="btn-hero">{copy.hero.startTrial} <ArrowRight size={16} /></Link>}
                        <a href="#contact" className="btn-hero-outline"><Mail size={14} /> {copy.cta.talkToUs}</a>
                    </div>
                </div>

                {/* ── CONTACT ── */}
                <section id="contact" className="contact-section">
                    <div className="contact-grid">
                        <div className="contact-info">
                            <div className="contact-label">{copy.contact.label}</div>
                            <h2 className="contact-title">{copy.contact.title}</h2>
                            <p className="contact-body">
                                {copy.contact.bodyPrefix}{' '}
                                <a href={`mailto:${content?.contact_email || 'hello@aigym.io'}`} className="contact-email">
                                    {content?.contact_email || 'hello@aigym.io'}
                                </a>{copy.contact.bodySuffix}
                            </p>
                            <div className="contact-perks">
                                {copy.contact.perks.map(p => (
                                    <div key={p} className="contact-perk">
                                        <div className="contact-perk-dot" />{p}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <form onSubmit={handleContactSubmit} className="contact-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">{copy.contact.fullName}</label>
                                    <input type="text" required value={data.name} onChange={e => setData('name', e.target.value)} placeholder={copy.contact.placeholderName} className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">{copy.contact.email}</label>
                                    <input type="email" required value={data.email} onChange={e => setData('email', e.target.value)} placeholder={copy.contact.placeholderEmail} className="form-input" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">{copy.contact.message}</label>
                                <textarea required rows={5} value={data.message} onChange={e => setData('message', e.target.value)} placeholder={copy.contact.placeholderMessage} className="form-textarea form-input" />
                            </div>
                            <button type="submit" disabled={processing} className="form-submit">
                                <Mail size={16} /> {copy.contact.sendMessage}
                            </button>
                        </form>
                    </div>
                </section>

                {/* ── FOOTER ── */}
                <footer className="footer">
                    <div className="footer-inner">
                        <a href="/" className="nav-logo">
                            <div className="nav-logo-mark"><Dumbbell size={16} /></div>
                            <span className="nav-logo-text">AI GYM</span>
                        </a>
                        <div className="footer-links">
                            {navLinks.map(l => <a key={l.href} href={l.href}>{l.label}</a>)}
                        </div>
                        <p className="footer-copy">© {new Date().getFullYear()} AI Gym. {copy.footer.copy}</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
