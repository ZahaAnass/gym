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
    MessageSquare,
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

/* ─── Animated counter hook ─────────────────────────────── */
function useCounter(target: number, duration = 2000) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                observer.disconnect();
                let start = 0;
                const step = target / (duration / 16);
                const tick = () => {
                    start = Math.min(start + step, target);
                    setCount(Math.round(start));
                    if (start < target) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
            },
            { threshold: 0.3 },
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target, duration]);
    return { count, ref };
}

/* ─── Stat Card ──────────────────────────────────────────── */
function StatCard({ value, suffix, label, icon }: { value: number; suffix: string; label: string; icon: React.ReactNode }) {
    const { count, ref } = useCounter(value);
    return (
        <div ref={ref} className="stat-card">
            <div className="stat-icon">{icon}</div>
            <span className="stat-value">
                {count.toLocaleString()}{suffix}
            </span>
            <span className="stat-label">{label}</span>
        </div>
    );
}

/* ─── Feature Card ───────────────────────────────────────── */
function FeatureCard({ icon, accent, title, description }: {
    icon: React.ReactNode; accent: string; title: string; description: string;
}) {
    return (
        <div className="feature-card">
            <div className={`feature-icon-wrap ${accent}`}>{icon}</div>
            <h3 className="feature-title">{title}</h3>
            <p className="feature-desc">{description}</p>
            <div className="feature-arrow">
                <ArrowRight size={16} />
            </div>
        </div>
    );
}

/* ─── Testimonial Card ───────────────────────────────────── */
function TestimonialCard({ quote, name, role, initials, accent }: {
    quote: string; name: string; role: string; initials: string; accent: string;
}) {
    return (
        <div className="testimonial-card">
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

/* ─── Pricing Card ───────────────────────────────────────── */
function PricingCard({ plan, price, period, description, features, cta, highlighted, canRegister }: {
    plan: string; price: string; period: string; description: string;
    features: string[]; cta: string; highlighted?: boolean; canRegister: boolean;
}) {
    return (
        <div className={`pricing-card ${highlighted ? 'pricing-card--featured' : ''}`}>
            {highlighted && <div className="pricing-badge">Most Popular</div>}
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

/* ─── FAQ Item ───────────────────────────────────────────── */
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

/* ─── Image Section Component ────────────────────────────── */
function HeroImageGrid() {
    return (
        <div className="hero-image-grid">
            <div className="hero-img hero-img--main">
                <img
                    src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&auto=format&fit=crop"
                    alt="Gym training"
                    loading="lazy"
                />
                <div className="img-overlay" />
                <div className="img-badge img-badge--pulse">
                    <span className="badge-dot" />
                    <span>Live Sessions</span>
                </div>
            </div>
            <div className="hero-img-stack">
                <div className="hero-img hero-img--sm">
                    <img
                        src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80&auto=format&fit=crop"
                        alt="Coach training client"
                        loading="lazy"
                    />
                    <div className="img-overlay" />
                </div>
                <div className="hero-img hero-img--sm hero-img--accent">
                    <img
                        src="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&q=80&auto=format&fit=crop"
                        alt="Athlete performance"
                        loading="lazy"
                    />
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

/* ─── Main Component ─────────────────────────────────────── */
export default function Welcome({ auth, canRegister, content }: any) {
    const [isDark, setIsDark] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeRole, setActiveRole] = useState<'admin' | 'coach' | 'client'>('coach');
    const [scrolled, setScrolled] = useState(false);

    const { data, setData, processing, reset } = useForm({ name: '', email: '', message: '' });

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Message sent! Our team will contact you shortly.');
        reset();
    };

    useEffect(() => {
        const dark = localStorage.theme !== 'light';
        setIsDark(dark);
        document.documentElement.classList.toggle('dark', dark);
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const toggleTheme = () => {
        const next = !isDark;
        setIsDark(next);
        document.documentElement.classList.toggle('dark', next);
        localStorage.theme = next ? 'dark' : 'light';
    };

    const roles = {
        admin: {
            label: 'Administrator',
            emoji: '⚙️',
            features: [
                { icon: <Shield size={18} />, text: 'Full user management & RBAC' },
                { icon: <BarChart3 size={18} />, text: 'Revenue analytics & reporting' },
                { icon: <Activity size={18} />, text: 'System audit logs' },
                { icon: <Zap size={18} />, text: 'Public CMS management' },
                { icon: <CreditCard size={18} />, text: 'Stripe payment oversight' },
            ],
        },
        coach: {
            label: 'Coach',
            emoji: '🏋️',
            features: [
                { icon: <Users size={18} />, text: 'Manage client rosters' },
                { icon: <Brain size={18} />, text: 'AI workout program generation' },
                { icon: <Activity size={18} />, text: 'Biometric assessment tools' },
                { icon: <Timer size={18} />, text: 'Session notes & scheduling' },
                { icon: <TrendingUp size={18} />, text: 'Client progress tracking' },
            ],
        },
        client: {
            label: 'Client',
            emoji: '🎯',
            features: [
                { icon: <Dumbbell size={18} />, text: 'View assigned programs' },
                { icon: <TrendingUp size={18} />, text: 'Log physical progress' },
                { icon: <Zap size={18} />, text: 'Manage personal goals' },
                { icon: <CreditCard size={18} />, text: 'Secure installment payments' },
                { icon: <Timer size={18} />, text: 'Track session attendance' },
            ],
        },
    };

    const navLinks = [
        { href: '#features', label: 'Features' },
        { href: '#how-it-works', label: 'Roles' },
        { href: '#pricing', label: 'Pricing' },
        { href: '#faq', label: 'FAQ' },
        { href: '#contact', label: 'Contact' },
    ];

    return (
        <>
            <Head title="AI Gym — Intelligent Fitness Management" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

                :root {
                    --brand: #C8F04E;
                    --brand-dim: #a8d238;
                    --brand-glow: rgba(200,240,78,0.15);
                    --surface: #0f0f0f;
                    --surface-2: #161616;
                    --surface-3: #1e1e1e;
                    --surface-4: #252525;
                    --border: rgba(255,255,255,0.08);
                    --border-hover: rgba(255,255,255,0.16);
                    --text-1: #f0f0f0;
                    --text-2: #8a8a8a;
                    --text-3: #555;
                    --radius: 16px;
                    --radius-sm: 10px;
                    --radius-lg: 24px;
                    --radius-xl: 32px;
                    --font-display: 'Syne', sans-serif;
                    --font-body: 'DM Sans', sans-serif;
                }

                .light-mode {
                    --surface: #fafafa;
                    --surface-2: #f4f4f4;
                    --surface-3: #ebebeb;
                    --surface-4: #e0e0e0;
                    --border: rgba(0,0,0,0.08);
                    --border-hover: rgba(0,0,0,0.16);
                    --text-1: #111;
                    --text-2: #555;
                    --text-3: #999;
                }

                * { box-sizing: border-box; margin: 0; padding: 0; }

                body {
                    background: var(--surface);
                    color: var(--text-1);
                    font-family: var(--font-body);
                    font-size: 16px;
                    line-height: 1.6;
                    overflow-x: hidden;
                }

                /* ── NAV ── */
                .nav {
                    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
                    transition: all 0.3s ease;
                    font-family: var(--font-body);
                }
                .nav--scrolled {
                    background: rgba(15,15,15,0.85);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid var(--border);
                }
                .light-mode .nav--scrolled { background: rgba(250,250,250,0.85); }
                .nav-inner {
                    max-width: 1280px; margin: 0 auto;
                    padding: 0 2rem;
                    display: flex; align-items: center; justify-content: space-between;
                    height: 72px;
                }
                .nav-logo {
                    display: flex; align-items: center; gap: 10px;
                    text-decoration: none;
                }
                .nav-logo-mark {
                    width: 36px; height: 36px;
                    background: var(--brand);
                    border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                }
                .nav-logo-mark svg { color: #000; }
                .nav-logo-text {
                    font-family: var(--font-display);
                    font-weight: 800;
                    font-size: 18px;
                    color: var(--text-1);
                    letter-spacing: -0.5px;
                }
                .nav-links {
                    display: flex; align-items: center; gap: 2rem;
                    list-style: none;
                }
                .nav-links a {
                    color: var(--text-2);
                    text-decoration: none;
                    font-size: 14px;
                    font-weight: 500;
                    transition: color 0.2s;
                }
                .nav-links a:hover { color: var(--text-1); }
                .nav-actions { display: flex; align-items: center; gap: 12px; }
                .nav-theme-btn {
                    width: 36px; height: 36px;
                    border-radius: 50%;
                    border: 1px solid var(--border);
                    background: var(--surface-3);
                    color: var(--text-2);
                    cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    transition: all 0.2s;
                }
                .nav-theme-btn:hover { border-color: var(--border-hover); color: var(--text-1); }
                .btn-ghost {
                    padding: 8px 18px;
                    border: 1px solid var(--border);
                    border-radius: 50px;
                    background: transparent;
                    color: var(--text-2);
                    font-size: 14px; font-weight: 500;
                    cursor: pointer; text-decoration: none;
                    transition: all 0.2s;
                    display: inline-flex; align-items: center;
                }
                .btn-ghost:hover { border-color: var(--border-hover); color: var(--text-1); }
                .btn-primary {
                    padding: 9px 20px;
                    border-radius: 50px;
                    background: var(--brand);
                    color: #000;
                    font-size: 14px; font-weight: 600;
                    cursor: pointer; text-decoration: none;
                    transition: all 0.2s;
                    display: inline-flex; align-items: center; gap: 6px;
                    border: none;
                }
                .btn-primary:hover { background: var(--brand-dim); transform: translateY(-1px); }

                /* ── MOBILE MENU ── */
                .mobile-menu-btn {
                    display: none;
                    width: 40px; height: 40px;
                    background: var(--surface-3); border: 1px solid var(--border);
                    border-radius: var(--radius-sm); cursor: pointer;
                    color: var(--text-1);
                    align-items: center; justify-content: center;
                }
                .mobile-menu {
                    display: none;
                    position: fixed; top: 72px; left: 0; right: 0;
                    background: var(--surface);
                    border-bottom: 1px solid var(--border);
                    padding: 1rem 2rem 1.5rem;
                    z-index: 99;
                    flex-direction: column; gap: 8px;
                }
                .mobile-menu.open { display: flex; }
                .mobile-menu a {
                    padding: 12px 16px;
                    color: var(--text-1);
                    text-decoration: none;
                    font-weight: 500;
                    border-radius: var(--radius-sm);
                    transition: background 0.2s;
                }
                .mobile-menu a:hover { background: var(--surface-3); }
                .mobile-menu-actions {
                    display: flex; flex-direction: column; gap: 8px;
                    padding-top: 12px; border-top: 1px solid var(--border);
                    margin-top: 4px;
                }

                @media (max-width: 768px) {
                    .nav-links, .nav-actions { display: none; }
                    .mobile-menu-btn { display: flex; }
                }

                /* ── HERO ── */
                .hero {
                    min-height: 100vh;
                    padding: 120px 2rem 80px;
                    display: flex; align-items: center;
                    position: relative; overflow: hidden;
                    max-width: 1280px; margin: 0 auto;
                    gap: 4rem;
                }
                .hero::before {
                    content: '';
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background:
                        radial-gradient(ellipse 600px 500px at 20% 50%, rgba(200,240,78,0.06) 0%, transparent 70%),
                        radial-gradient(ellipse 400px 400px at 80% 30%, rgba(200,240,78,0.04) 0%, transparent 70%);
                    pointer-events: none; z-index: 0;
                }
                .hero-content {
                    flex: 1; position: relative; z-index: 1;
                    max-width: 600px;
                }
                .hero-badge {
                    display: inline-flex; align-items: center; gap: 8px;
                    padding: 6px 14px;
                    border: 1px solid rgba(200,240,78,0.3);
                    border-radius: 50px;
                    background: rgba(200,240,78,0.08);
                    font-size: 12px; font-weight: 600;
                    color: var(--brand);
                    letter-spacing: 0.5px;
                    margin-bottom: 2rem;
                    text-transform: uppercase;
                }
                .badge-dot {
                    width: 6px; height: 6px;
                    border-radius: 50%;
                    background: var(--brand);
                    animation: pulse-dot 2s infinite;
                }
                @keyframes pulse-dot {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(0.8); }
                }
                .hero-title {
                    font-family: var(--font-display);
                    font-size: clamp(48px, 6vw, 80px);
                    font-weight: 800;
                    line-height: 1.0;
                    letter-spacing: -2px;
                    color: var(--text-1);
                    margin-bottom: 1.5rem;
                }
                .hero-title-accent {
                    color: var(--brand);
                    display: block;
                }
                .hero-subtitle {
                    font-size: 17px;
                    color: var(--text-2);
                    line-height: 1.7;
                    max-width: 480px;
                    margin-bottom: 2.5rem;
                }
                .hero-actions {
                    display: flex; align-items: center; gap: 16px;
                    flex-wrap: wrap;
                    margin-bottom: 3rem;
                }
                .btn-hero {
                    padding: 14px 28px;
                    border-radius: 50px;
                    background: var(--brand);
                    color: #000;
                    font-size: 15px; font-weight: 700;
                    text-decoration: none;
                    display: inline-flex; align-items: center; gap: 8px;
                    transition: all 0.25s;
                    font-family: var(--font-display);
                }
                .btn-hero:hover { background: var(--brand-dim); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(200,240,78,0.2); }
                .btn-hero-outline {
                    padding: 14px 28px;
                    border-radius: 50px;
                    border: 1px solid var(--border-hover);
                    color: var(--text-1);
                    font-size: 15px; font-weight: 600;
                    text-decoration: none;
                    display: inline-flex; align-items: center; gap: 8px;
                    transition: all 0.25s;
                    background: transparent;
                }
                .btn-hero-outline:hover { border-color: rgba(255,255,255,0.4); background: var(--surface-3); }
                .hero-trust {
                    display: flex; align-items: center; gap: 12px;
                    color: var(--text-3); font-size: 13px;
                }
                .hero-trust-avatars {
                    display: flex;
                }
                .hero-trust-avatar {
                    width: 28px; height: 28px;
                    border-radius: 50%;
                    border: 2px solid var(--surface);
                    overflow: hidden;
                    margin-left: -8px;
                }
                .hero-trust-avatar:first-child { margin-left: 0; }
                .hero-trust-avatar img { width: 100%; height: 100%; object-fit: cover; }
                .hero-trust-text { color: var(--text-2); }
                .hero-trust-text strong { color: var(--brand); }

                /* ── HERO IMAGES ── */
                .hero-visual {
                    flex: 1; max-width: 520px;
                    position: relative; z-index: 1;
                }
                .hero-image-grid {
                    display: grid;
                    grid-template-columns: 1.4fr 1fr;
                    gap: 12px;
                    height: 520px;
                }
                .hero-img {
                    border-radius: var(--radius-lg);
                    overflow: hidden;
                    position: relative;
                }
                .hero-img img {
                    width: 100%; height: 100%;
                    object-fit: cover;
                    transition: transform 0.6s ease;
                }
                .hero-img:hover img { transform: scale(1.04); }
                .hero-img--main { grid-row: span 2; }
                .hero-img-stack {
                    display: flex; flex-direction: column; gap: 12px;
                }
                .hero-img--sm { flex: 1; }
                .img-overlay {
                    position: absolute; inset: 0;
                    background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%);
                }
                .img-badge {
                    position: absolute; bottom: 16px; left: 16px;
                    display: flex; align-items: center; gap: 6px;
                    background: rgba(0,0,0,0.7);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.12);
                    border-radius: 50px;
                    padding: 6px 12px;
                    font-size: 12px; font-weight: 600; color: #fff;
                }
                .img-badge .badge-dot { background: #22c55e; }
                .img-stat-card {
                    position: absolute; bottom: 16px; left: 16px; right: 16px;
                    background: rgba(0,0,0,0.75);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(200,240,78,0.2);
                    border-radius: var(--radius-sm);
                    padding: 10px 14px;
                    display: flex; align-items: center; gap: 10px;
                }
                .img-stat-icon { color: var(--brand); }
                .img-stat-val { font-size: 16px; font-weight: 700; color: var(--brand); font-family: var(--font-display); line-height: 1; }
                .img-stat-lbl { font-size: 11px; color: rgba(255,255,255,0.6); margin-top: 2px; }

                /* ── MARQUEE ── */
                .marquee-wrap {
                    border-top: 1px solid var(--border);
                    border-bottom: 1px solid var(--border);
                    padding: 18px 0;
                    overflow: hidden;
                    background: var(--surface-2);
                }
                .marquee-track {
                    display: flex; gap: 3rem;
                    animation: marquee 30s linear infinite;
                    white-space: nowrap;
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .marquee-item {
                    display: inline-flex; align-items: center; gap: 10px;
                    color: var(--text-3); font-size: 13px; font-weight: 500;
                    letter-spacing: 0.5px;
                }
                .marquee-dot {
                    width: 4px; height: 4px;
                    border-radius: 50%; background: var(--brand);
                }

                /* ── STATS ── */
                .stats-section {
                    padding: 80px 2rem;
                    max-width: 1280px; margin: 0 auto;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1px;
                    background: var(--border);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg);
                    overflow: hidden;
                }
                @media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
                .stat-card {
                    background: var(--surface-2);
                    padding: 2.5rem 2rem;
                    display: flex; flex-direction: column; align-items: center; gap: 8px;
                    text-align: center;
                    transition: background 0.2s;
                }
                .stat-card:hover { background: var(--surface-3); }
                .stat-icon { color: var(--brand); margin-bottom: 4px; }
                .stat-value {
                    font-family: var(--font-display);
                    font-size: 42px; font-weight: 800;
                    color: var(--text-1);
                    letter-spacing: -1px;
                    line-height: 1;
                }
                .stat-label { font-size: 14px; color: var(--text-2); }

                /* ── FEATURES ── */
                .section {
                    padding: 100px 2rem;
                    max-width: 1280px; margin: 0 auto;
                }
                .section-tag {
                    display: inline-flex; align-items: center; gap: 6px;
                    font-size: 12px; font-weight: 600;
                    text-transform: uppercase; letter-spacing: 1px;
                    color: var(--brand);
                    margin-bottom: 16px;
                }
                .section-title {
                    font-family: var(--font-display);
                    font-size: clamp(32px, 4vw, 52px);
                    font-weight: 800;
                    letter-spacing: -1.5px;
                    line-height: 1.1;
                    color: var(--text-1);
                    margin-bottom: 1rem;
                }
                .section-subtitle {
                    font-size: 17px; color: var(--text-2);
                    max-width: 520px; line-height: 1.7;
                }
                .section-header { margin-bottom: 4rem; }
                .section-header--center { text-align: center; }
                .section-header--center .section-subtitle { margin: 0 auto; }

                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1px;
                    background: var(--border);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg);
                    overflow: hidden;
                }
                @media (max-width: 1024px) { .features-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (max-width: 640px) { .features-grid { grid-template-columns: 1fr; } }
                .feature-card {
                    background: var(--surface-2);
                    padding: 2rem;
                    position: relative;
                    transition: background 0.25s;
                    cursor: default;
                    overflow: hidden;
                }
                .feature-card::before {
                    content: '';
                    position: absolute; top: 0; left: 0; right: 0;
                    height: 2px;
                    background: var(--brand);
                    transform: scaleX(0);
                    transition: transform 0.3s ease;
                    transform-origin: left;
                }
                .feature-card:hover { background: var(--surface-3); }
                .feature-card:hover::before { transform: scaleX(1); }
                .feature-icon-wrap {
                    width: 44px; height: 44px;
                    border-radius: var(--radius-sm);
                    display: flex; align-items: center; justify-content: center;
                    margin-bottom: 1.25rem;
                }
                .accent-purple { background: rgba(139,92,246,0.15); color: #a78bfa; }
                .accent-green { background: rgba(34,197,94,0.15); color: #4ade80; }
                .accent-blue { background: rgba(59,130,246,0.15); color: #60a5fa; }
                .accent-amber { background: rgba(245,158,11,0.15); color: #fbbf24; }
                .accent-rose { background: rgba(244,63,94,0.15); color: #fb7185; }
                .accent-lime { background: rgba(200,240,78,0.15); color: var(--brand); }
                .feature-title {
                    font-family: var(--font-display);
                    font-size: 17px; font-weight: 700;
                    color: var(--text-1);
                    margin-bottom: 8px;
                }
                .feature-desc {
                    font-size: 14px; color: var(--text-2);
                    line-height: 1.6;
                }
                .feature-arrow {
                    position: absolute; bottom: 1.5rem; right: 1.5rem;
                    color: var(--text-3);
                    opacity: 0;
                    transform: translateX(-4px);
                    transition: all 0.25s;
                }
                .feature-card:hover .feature-arrow {
                    opacity: 1; transform: translateX(0);
                    color: var(--brand);
                }

                /* ── ROLES ── */
                .roles-section {
                    padding: 100px 2rem;
                    background: var(--surface-2);
                    border-top: 1px solid var(--border);
                    border-bottom: 1px solid var(--border);
                }
                .roles-inner { max-width: 1280px; margin: 0 auto; }
                .roles-tabs {
                    display: flex; gap: 8px;
                    margin-bottom: 3rem;
                    flex-wrap: wrap;
                }
                .role-tab {
                    padding: 10px 22px;
                    border-radius: 50px;
                    border: 1px solid var(--border);
                    background: transparent;
                    color: var(--text-2);
                    font-size: 14px; font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-family: var(--font-body);
                }
                .role-tab:hover { border-color: var(--border-hover); color: var(--text-1); }
                .role-tab--active {
                    background: var(--brand);
                    border-color: var(--brand);
                    color: #000;
                }
                .roles-content {
                    display: grid; grid-template-columns: 1fr 1fr;
                    gap: 4rem; align-items: center;
                }
                @media (max-width: 900px) { .roles-content { grid-template-columns: 1fr; } }
                .role-features { display: flex; flex-direction: column; gap: 12px; }
                .role-feature-item {
                    display: flex; align-items: center; gap: 16px;
                    padding: 16px 20px;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    transition: all 0.2s;
                }
                .role-feature-item:hover {
                    border-color: rgba(200,240,78,0.2);
                    background: rgba(200,240,78,0.03);
                }
                .role-feature-num {
                    width: 30px; height: 30px; min-width: 30px;
                    border-radius: 50%;
                    background: rgba(200,240,78,0.1);
                    color: var(--brand);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 12px; font-weight: 700;
                    font-family: var(--font-display);
                }
                .role-feature-icon { color: var(--text-2); }
                .role-feature-text { font-size: 15px; font-weight: 500; color: var(--text-1); }

                /* ── ROLE MOCKUP ── */
                .role-mockup {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-xl);
                    overflow: hidden;
                    padding: 2px;
                }
                .role-mockup-inner {
                    background: #0a0a0a;
                    border-radius: calc(var(--radius-xl) - 2px);
                    overflow: hidden;
                }
                .mockup-topbar {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 14px 20px;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                }
                .mockup-dots { display: flex; gap: 6px; }
                .mockup-dot {
                    width: 10px; height: 10px; border-radius: 50%;
                }
                .mockup-dot--r { background: #ff5f56; }
                .mockup-dot--y { background: #ffbd2e; }
                .mockup-dot--g { background: #27c93f; }
                .mockup-body { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
                .mockup-header { display: flex; align-items: center; justify-content: space-between; }
                .mockup-title-wrap { display: flex; flex-direction: column; gap: 4px; }
                .mockup-bar { height: 12px; border-radius: 4px; background: rgba(255,255,255,0.08); }
                .mockup-bar--wide { width: 140px; }
                .mockup-bar--sm { width: 80px; height: 10px; }
                .mockup-avatar { width: 36px; height: 36px; border-radius: 50%; background: rgba(200,240,78,0.2); display: flex; align-items: center; justify-content: center; font-size: 14px; }
                .mockup-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
                .mockup-stat {
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 12px; padding: 14px;
                }
                .mockup-stat-val { font-size: 20px; font-weight: 700; color: var(--brand); font-family: var(--font-display); }
                .mockup-stat-label { font-size: 11px; color: rgba(255,255,255,0.3); margin-top: 2px; }
                .mockup-chart {
                    height: 80px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 12px;
                    padding: 12px 16px;
                    display: flex; align-items: flex-end; gap: 6px;
                }
                .mockup-bar-chart { flex: 1; border-radius: 3px 3px 0 0; background: rgba(200,240,78,0.2); transition: background 0.3s; }
                .mockup-bar-chart--active { background: var(--brand); }
                .mockup-ai-block {
                    background: rgba(200,240,78,0.06);
                    border: 1px solid rgba(200,240,78,0.15);
                    border-radius: 14px; padding: 16px;
                    display: flex; align-items: center; gap: 12px;
                }
                .mockup-ai-icon { color: var(--brand); }
                .mockup-ai-lines { flex: 1; display: flex; flex-direction: column; gap: 6px; }
                .mockup-ai-line { height: 8px; border-radius: 4px; background: rgba(200,240,78,0.15); }
                .mockup-role-pill {
                    display: inline-flex; padding: 4px 12px;
                    border-radius: 50px;
                    font-size: 11px; font-weight: 600;
                    text-transform: uppercase; letter-spacing: 0.5px;
                }

                /* ── SHOWCASE IMAGE ── */
                .showcase-section {
                    padding: 0 2rem 100px;
                    max-width: 1280px; margin: 0 auto;
                }
                .showcase-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 16px;
                    border-radius: var(--radius-xl);
                    overflow: hidden;
                }
                @media (max-width: 768px) { .showcase-grid { grid-template-columns: 1fr; } }
                .showcase-img {
                    position: relative; overflow: hidden;
                    border-radius: var(--radius-lg);
                }
                .showcase-img img {
                    width: 100%; height: 380px;
                    object-fit: cover;
                    transition: transform 0.6s ease;
                }
                .showcase-img:hover img { transform: scale(1.04); }
                .showcase-overlay {
                    position: absolute; inset: 0;
                    background: linear-gradient(135deg, rgba(0,0,0,0.6) 0%, transparent 60%);
                    display: flex; align-items: flex-end;
                    padding: 2rem;
                }
                .showcase-label {
                    background: rgba(0,0,0,0.6);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 50px;
                    padding: 8px 16px;
                    font-size: 13px; font-weight: 600; color: #fff;
                    display: flex; align-items: center; gap: 6px;
                }
                .showcase-label svg { color: var(--brand); }
                .showcase-side { display: flex; flex-direction: column; gap: 16px; }
                .showcase-side .showcase-img img { height: 182px; }

                /* ── PRICING ── */
                .pricing-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 16px;
                    align-items: stretch;
                }
                @media (max-width: 900px) { .pricing-grid { grid-template-columns: 1fr; } }
                .pricing-card {
                    background: var(--surface-2);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg);
                    padding: 2rem;
                    display: flex; flex-direction: column;
                    position: relative;
                    transition: border-color 0.2s;
                }
                .pricing-card:hover { border-color: var(--border-hover); }
                .pricing-card--featured {
                    background: var(--brand);
                    border-color: var(--brand);
                }
                .pricing-card--featured * { color: #000 !important; }
                .pricing-badge {
                    position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
                    background: #000;
                    color: var(--brand) !important;
                    font-size: 11px; font-weight: 700;
                    padding: 4px 14px;
                    border-radius: 50px;
                    white-space: nowrap;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                }
                .pricing-plan {
                    font-size: 12px; font-weight: 700;
                    text-transform: uppercase; letter-spacing: 1px;
                    color: var(--brand);
                    margin-bottom: 12px;
                }
                .pricing-card--featured .pricing-plan { color: rgba(0,0,0,0.6) !important; }
                .pricing-price-row {
                    display: flex; align-items: baseline; gap: 6px;
                    margin-bottom: 8px;
                }
                .pricing-price {
                    font-family: var(--font-display);
                    font-size: 44px; font-weight: 800;
                    color: var(--text-1); letter-spacing: -2px;
                }
                .pricing-period { font-size: 14px; color: var(--text-2); }
                .pricing-desc { font-size: 14px; color: var(--text-2); margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border); }
                .pricing-card--featured .pricing-desc { border-color: rgba(0,0,0,0.15); }
                .pricing-features {
                    list-style: none;
                    display: flex; flex-direction: column; gap: 10px;
                    flex: 1; margin-bottom: 1.5rem;
                }
                .pricing-features li {
                    display: flex; align-items: center; gap: 10px;
                    font-size: 14px; color: var(--text-2);
                }
                .pricing-check { color: var(--brand); flex-shrink: 0; }
                .pricing-card--featured .pricing-check { color: rgba(0,0,0,0.6) !important; }
                .pricing-cta {
                    display: flex; align-items: center; justify-content: center; gap: 6px;
                    padding: 12px 20px;
                    border-radius: 50px;
                    border: 1px solid var(--border-hover);
                    background: transparent;
                    color: var(--text-1);
                    font-size: 14px; font-weight: 600;
                    text-decoration: none;
                    transition: all 0.2s;
                }
                .pricing-cta:hover { background: var(--surface-4); border-color: rgba(255,255,255,0.3); }
                .pricing-cta--featured {
                    background: #000 !important;
                    color: var(--brand) !important;
                    border-color: #000 !important;
                }
                .pricing-cta--featured:hover { opacity: 0.9; }

                /* ── TESTIMONIALS ── */
                .testimonials-section {
                    padding: 100px 2rem;
                    background: var(--surface-2);
                    border-top: 1px solid var(--border);
                    border-bottom: 1px solid var(--border);
                }
                .testimonials-inner { max-width: 1280px; margin: 0 auto; }
                .testimonials-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 16px;
                }
                @media (max-width: 900px) { .testimonials-grid { grid-template-columns: 1fr; } }
                .testimonial-card {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg);
                    padding: 2rem;
                    display: flex; flex-direction: column; gap: 1rem;
                    transition: border-color 0.2s, transform 0.2s;
                }
                .testimonial-card:hover { border-color: var(--border-hover); transform: translateY(-2px); }
                .stars { display: flex; gap: 4px; }
                .star { width: 14px; height: 14px; fill: #fbbf24; }
                .testimonial-quote { font-size: 15px; color: var(--text-2); line-height: 1.7; flex: 1; }
                .testimonial-author { display: flex; align-items: center; gap: 12px; margin-top: auto; }
                .author-avatar {
                    width: 42px; height: 42px; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 13px; font-weight: 700;
                    flex-shrink: 0;
                }
                .av-purple { background: rgba(139,92,246,0.2); color: #a78bfa; }
                .av-blue { background: rgba(59,130,246,0.2); color: #60a5fa; }
                .av-green { background: rgba(34,197,94,0.2); color: #4ade80; }
                .author-name { font-size: 14px; font-weight: 600; color: var(--text-1); }
                .author-role { font-size: 12px; color: var(--text-3); margin-top: 2px; }

                /* ── FAQ ── */
                .faq-item {
                    border-bottom: 1px solid var(--border);
                }
                .faq-question {
                    width: 100%; background: none; border: none; cursor: pointer;
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 1.5rem 0;
                    text-align: left; gap: 1rem;
                    color: var(--text-1);
                    font-size: 16px; font-weight: 600;
                    font-family: var(--font-body);
                    transition: color 0.2s;
                }
                .faq-question:hover { color: var(--brand); }
                .faq-chevron { color: var(--text-3); transition: transform 0.3s; flex-shrink: 0; }
                .faq-chevron.rotate { transform: rotate(180deg); }
                .faq-answer {
                    max-height: 0; overflow: hidden;
                    transition: max-height 0.35s ease, padding 0.35s ease;
                }
                .faq-answer--open { max-height: 300px; padding-bottom: 1.5rem; }
                .faq-answer p { font-size: 15px; color: var(--text-2); line-height: 1.7; padding-right: 3rem; }

                /* ── CONTACT ── */
                .contact-section {
                    padding: 100px 2rem;
                    max-width: 1280px; margin: 0 auto;
                }
                .contact-grid {
                    display: grid; grid-template-columns: 1fr 1.5fr;
                    gap: 6rem; align-items: start;
                }
                @media (max-width: 900px) { .contact-grid { grid-template-columns: 1fr; gap: 3rem; } }
                .contact-info { display: flex; flex-direction: column; gap: 1.5rem; }
                .contact-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--brand); }
                .contact-title { font-family: var(--font-display); font-size: 42px; font-weight: 800; letter-spacing: -1.5px; color: var(--text-1); line-height: 1.1; }
                .contact-body { font-size: 16px; color: var(--text-2); line-height: 1.7; }
                .contact-email { color: var(--brand); text-decoration: none; font-weight: 600; }
                .contact-email:hover { text-decoration: underline; }
                .contact-perks { display: flex; flex-direction: column; gap: 12px; margin-top: 8px; }
                .contact-perk { display: flex; align-items: center; gap: 10px; font-size: 14px; color: var(--text-2); }
                .contact-perk-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--brand); flex-shrink: 0; }
                .contact-form { display: flex; flex-direction: column; gap: 16px; }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }
                .form-group { display: flex; flex-direction: column; gap: 6px; }
                .form-label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-3); }
                .form-input, .form-textarea {
                    background: var(--surface-2);
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    padding: 14px 18px;
                    font-size: 15px;
                    color: var(--text-1);
                    font-family: var(--font-body);
                    outline: none;
                    transition: border-color 0.2s;
                    width: 100%;
                }
                .form-input:focus, .form-textarea:focus { border-color: rgba(200,240,78,0.4); }
                .form-input::placeholder, .form-textarea::placeholder { color: var(--text-3); }
                .form-textarea { resize: none; }
                .form-submit {
                    padding: 15px 28px;
                    background: var(--brand);
                    color: #000;
                    border: none; border-radius: 50px;
                    font-size: 15px; font-weight: 700;
                    cursor: pointer;
                    display: flex; align-items: center; justify-content: center; gap: 8px;
                    transition: all 0.2s;
                    font-family: var(--font-display);
                }
                .form-submit:hover { background: var(--brand-dim); transform: translateY(-1px); }
                .form-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

                /* ── FOOTER ── */
                .footer {
                    border-top: 1px solid var(--border);
                    background: var(--surface-2);
                    padding: 2.5rem 2rem;
                }
                .footer-inner {
                    max-width: 1280px; margin: 0 auto;
                    display: flex; align-items: center; justify-content: space-between;
                    gap: 2rem; flex-wrap: wrap;
                }
                .footer-links { display: flex; gap: 2rem; flex-wrap: wrap; }
                .footer-links a {
                    font-size: 14px; color: var(--text-3);
                    text-decoration: none; transition: color 0.2s;
                }
                .footer-links a:hover { color: var(--text-1); }
                .footer-copy { font-size: 13px; color: var(--text-3); }

                /* ── LIGHT MODE OVERRIDES ── */
                .light-mode {
                    --surface: #fafafa;
                    --surface-2: #f4f4f4;
                    --surface-3: #ebebeb;
                    --surface-4: #e0e0e0;
                    --border: rgba(0,0,0,0.09);
                    --border-hover: rgba(0,0,0,0.2);
                    --text-1: #111;
                    --text-2: #555;
                    --text-3: #999;
                }
                .light-mode .role-mockup-inner { background: #f0f0f0; }
                .light-mode .mockup-body .mockup-bar { background: rgba(0,0,0,0.08); }
                .light-mode .mockup-stat { background: rgba(0,0,0,0.04); border-color: rgba(0,0,0,0.08); }
                .light-mode .mockup-stat-label { color: rgba(0,0,0,0.3); }
                .light-mode .mockup-chart { background: rgba(0,0,0,0.03); border-color: rgba(0,0,0,0.08); }
                .light-mode .mockup-topbar { border-color: rgba(0,0,0,0.08); }

                /* ── ANIMATIONS ── */
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .hero-content > * {
                    animation: fadeInUp 0.6s ease both;
                }
                .hero-content > *:nth-child(1) { animation-delay: 0.1s; }
                .hero-content > *:nth-child(2) { animation-delay: 0.2s; }
                .hero-content > *:nth-child(3) { animation-delay: 0.3s; }
                .hero-content > *:nth-child(4) { animation-delay: 0.4s; }
                .hero-content > *:nth-child(5) { animation-delay: 0.5s; }
                .hero-visual { animation: fadeInUp 0.7s 0.3s ease both; }

                @media (max-width: 1024px) {
                    .hero { flex-direction: column; padding: 100px 1.5rem 60px; min-height: auto; }
                    .hero-visual { width: 100%; max-width: 100%; }
                    .hero-image-grid { height: 360px; }
                }
            `}</style>

            <div className={isDark ? '' : 'light-mode'}>
                {/* ── NAV ── */}
                <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
                    <div className="nav-inner">
                        <a href="/" className="nav-logo">
                            <div className="nav-logo-mark">
                                <Dumbbell size={18} />
                            </div>
                            <span className="nav-logo-text">AI GYM</span>
                        </a>

                        <ul className="nav-links">
                            {navLinks.map(l => (
                                <li key={l.href}><a href={l.href}>{l.label}</a></li>
                            ))}
                        </ul>

                        <div className="nav-actions">
                            <button onClick={toggleTheme} className="nav-theme-btn">
                                {isDark ? <Sun size={16} /> : <Moon size={16} />}
                            </button>
                            {auth.user ? (
                                <Link href="/dashboard" className="btn-primary">
                                    Dashboard <ArrowRight size={14} />
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login" className="btn-ghost">Log in</Link>
                                    {canRegister && (
                                        <Link href="/register" className="btn-primary">
                                            Get started <ArrowRight size={14} />
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>

                        <button
                            className="mobile-menu-btn"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
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
                        {auth.user ? (
                            <Link href="/dashboard" className="btn-primary" style={{ justifyContent: 'center' }}>Dashboard</Link>
                        ) : (
                            <>
                                <Link href="/login" className="btn-ghost" style={{ justifyContent: 'center' }}>Log in</Link>
                                {canRegister && (
                                    <Link href="/register" className="btn-primary" style={{ justifyContent: 'center' }}>Get started</Link>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* ── HERO ── */}
                <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '120px 2rem 80px', display: 'flex', alignItems: 'center', gap: '4rem', minHeight: '100vh', position: 'relative' }}>
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(ellipse 600px 500px at 20% 50%, rgba(200,240,78,0.06) 0%, transparent 70%), radial-gradient(ellipse 400px 400px at 80% 30%, rgba(200,240,78,0.04) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

                    <div className="hero-content">
                        {content?.announcement ? (
                            <div className="hero-badge">
                                <span className="badge-dot" />
                                <BellRing size={12} />
                                {content.announcement}
                            </div>
                        ) : (
                            <div className="hero-badge">
                                <span className="badge-dot" />
                                <Sparkles size={12} />
                                Powered by Gemini 2.5 Flash
                            </div>
                        )}

                        <h1 className="hero-title">
                            The Future<br />of Fitness is
                            <span className="hero-title-accent">Intelligent.</span>
                        </h1>

                        <p className="hero-subtitle">
                            Generate custom workouts, analyze biometrics instantly, and track every client's progress — all powered by AI, all in one enterprise platform.
                        </p>

                        <div className="hero-actions">
                            {auth.user ? (
                                <Link href="/dashboard" className="btn-hero">
                                    Access Portal <ArrowRight size={16} />
                                </Link>
                            ) : (
                                <>
                                    {canRegister && (
                                        <Link href="/register" className="btn-hero">
                                            Start free trial <ArrowRight size={16} />
                                        </Link>
                                    )}
                                    <a href="#features" className="btn-hero-outline">
                                        <Play size={14} /> Watch demo
                                    </a>
                                </>
                            )}
                        </div>

                        <div className="hero-trust">
                            <div className="hero-trust-avatars">
                                {['photo-1534528741775-53994a69daeb', 'photo-1494790108377-be9c29b29330', 'photo-1472099645785-5658abf4ff4e', 'photo-1506794778202-cad84cf45f1d'].map(id => (
                                    <div key={id} className="hero-trust-avatar">
                                        <img src={`https://images.unsplash.com/${id}?w=56&h=56&q=80&auto=format&fit=crop&crop=face`} alt="" />
                                    </div>
                                ))}
                            </div>
                            <span className="hero-trust-text">
                                Trusted by <strong>1,200+</strong> athletes & coaches
                            </span>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <HeroImageGrid />
                    </div>
                </section>

                {/* ── MARQUEE ── */}
                <div className="marquee-wrap">
                    <div className="marquee-track">
                        {['AI Workout Generation', 'Smart Biometrics', 'Stripe Payments', 'Role-Based Access', 'Progress Tracking', 'Redis Caching', 'Session Scheduling', 'Client Analytics', 'AI Workout Generation', 'Smart Biometrics', 'Stripe Payments', 'Role-Based Access', 'Progress Tracking', 'Redis Caching', 'Session Scheduling', 'Client Analytics'].map((item, i) => (
                            <span key={i} className="marquee-item">
                                <span className="marquee-dot" />
                                {item}
                            </span>
                        ))}
                    </div>
                </div>

                {/* ── STATS ── */}
                <div className="stats-section">
                    <div className="stats-grid">
                        <StatCard value={1200} suffix="+" label="Active members" icon={<Users size={20} />} />
                        <StatCard value={48} suffix="k" label="Programs generated" icon={<Brain size={20} />} />
                        <StatCard value={98} suffix="%" label="Client satisfaction" icon={<Activity size={20} />} />
                        <StatCard value={10} suffix="x" label="Faster workflow" icon={<Zap size={20} />} />
                    </div>
                </div>

                {/* ── SHOWCASE IMAGES ── */}
                <div className="showcase-section">
                    <div className="showcase-grid">
                        <div className="showcase-img">
                            <img
                                src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=900&q=80&auto=format&fit=crop"
                                alt="Gym floor"
                            />
                            <div className="showcase-overlay">
                                <div className="showcase-label">
                                    <Brain size={14} /> AI-Powered Training
                                </div>
                            </div>
                        </div>
                        <div className="showcase-side">
                            <div className="showcase-img">
                                <img
                                    src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80&auto=format&fit=crop"
                                    alt="Barbell training"
                                />
                                <div className="showcase-overlay">
                                    <div className="showcase-label">
                                        <TrendingUp size={14} /> Performance Tracking
                                    </div>
                                </div>
                            </div>
                            <div className="showcase-img">
                                <img
                                    src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80&auto=format&fit=crop"
                                    alt="Coach and client"
                                />
                                <div className="showcase-overlay">
                                    <div className="showcase-label">
                                        <Users size={14} /> Coach & Client Portals
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── FEATURES ── */}
                <section id="features" className="section">
                    <div className="section-header">
                        <div className="section-tag"><Sparkles size={12} /> Enterprise Features</div>
                        <h2 className="section-title">Built for coaches.<br />Designed for athletes.</h2>
                        <p className="section-subtitle">
                            Everything you need to manage gym operations, improve client outcomes, and process payments with confidence.
                        </p>
                    </div>
                    <div className="features-grid">
                        <FeatureCard
                            icon={<Brain size={22} />}
                            accent="accent-purple"
                            title="AI Workout Generation"
                            description="Instantly generate tailored 4-week programs based on client goals, fitness level, and medical constraints — powered by Gemini."
                        />
                        <FeatureCard
                            icon={<Activity size={22} />}
                            accent="accent-green"
                            title="Smart Biometrics"
                            description="Enter physical stats and get ideal weight targets, BMI insights, and personalised medical strategies from Gemini AI."
                        />
                        <FeatureCard
                            icon={<CreditCard size={22} />}
                            accent="accent-blue"
                            title="Automated Billing"
                            description="Stripe integration. Clients pay in full or split memberships over 3 months. Delinquent accounts are automatically flagged."
                        />
                        <FeatureCard
                            icon={<TrendingUp size={22} />}
                            accent="accent-amber"
                            title="Visual Progression"
                            description="Interactive dashboards for coaches and clients. Track weight, attendance, and goals over time with React Recharts."
                        />
                        <FeatureCard
                            icon={<Users size={22} />}
                            accent="accent-rose"
                            title="Role-Based Security"
                            description="Granular RBAC ensures admins, coaches, and clients only see what they need. Secure by design, backed by Spatie."
                        />
                        <FeatureCard
                            icon={<Zap size={22} />}
                            accent="accent-lime"
                            title="Redis Cached CMS"
                            description="Lightning-fast performance. Analytics, dashboard stats, and this landing page load in 0ms using Predis caching."
                        />
                    </div>
                </section>

                {/* ── ROLES ── */}
                <div id="how-it-works" className="roles-section">
                    <div className="roles-inner">
                        <div className="section-header">
                            <div className="section-tag"><Users size={12} /> Unified Ecosystem</div>
                            <h2 className="section-title">A dedicated portal<br />for every role</h2>
                            <p className="section-subtitle">
                                Switch between roles to see exactly what each user experiences on the platform.
                            </p>
                        </div>

                        <div className="roles-tabs">
                            {(Object.keys(roles) as Array<keyof typeof roles>).map(role => (
                                <button
                                    key={role}
                                    onClick={() => setActiveRole(role)}
                                    className={`role-tab ${activeRole === role ? 'role-tab--active' : ''}`}
                                >
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
                                                background: activeRole === 'admin' ? 'rgba(239,68,68,0.15)' : activeRole === 'coach' ? 'rgba(139,92,246,0.15)' : 'rgba(59,130,246,0.15)',
                                                color: activeRole === 'admin' ? '#f87171' : activeRole === 'coach' ? '#a78bfa' : '#60a5fa',
                                            }}>
                                                {roles[activeRole].label} Portal
                                            </span>
                                        </div>
                                        <div className="mockup-stats">
                                            {['48k', '98%', '10x'].map((v, i) => (
                                                <div key={i} className="mockup-stat">
                                                    <div className="mockup-stat-val">{v}</div>
                                                    <div className="mockup-stat-label">{['Programs', 'Satisfaction', 'Faster'][i]}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mockup-chart">
                                            {[40, 60, 45, 80, 65, 90, 75].map((h, i) => (
                                                <div
                                                    key={i}
                                                    className={`mockup-bar-chart ${i === 5 ? 'mockup-bar-chart--active' : ''}`}
                                                    style={{ height: `${h}%` }}
                                                />
                                            ))}
                                        </div>
                                        <div className="mockup-ai-block">
                                            <Brain size={18} className="mockup-ai-icon" />
                                            <div className="mockup-ai-lines">
                                                <div className="mockup-ai-line" style={{ width: '80%' }} />
                                                <div className="mockup-ai-line" style={{ width: '60%' }} />
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
                        <div className="section-tag"><CreditCard size={12} /> Pricing</div>
                        <h2 className="section-title">Simple, transparent plans</h2>
                        <p className="section-subtitle">Start free. Upgrade when your facility scales.</p>
                    </div>
                    <div className="pricing-grid">
                        <PricingCard
                            plan="Starter"
                            price="Free"
                            period="forever"
                            description="For solo coaches just getting started."
                            features={['Up to 5 clients', 'AI program generator (10/mo)', 'Basic biometrics', 'Community support']}
                            cta="Get started free"
                            canRegister={canRegister}
                        />
                        <PricingCard
                            plan="Pro"
                            price="$49"
                            period="/ month"
                            description="For growing gyms and serious coaches."
                            features={['Unlimited clients', 'Unlimited AI generation', 'Stripe split payments', 'FullCalendar integration', 'Priority support']}
                            cta="Start Pro trial"
                            highlighted
                            canRegister={canRegister}
                        />
                        <PricingCard
                            plan="Enterprise"
                            price="$199"
                            period="/ month"
                            description="For multi-location gym chains."
                            features={['Multi-location support', 'Custom branding', 'Redis CMS Access', 'Dedicated account manager', 'SLA guarantee']}
                            cta="Contact sales"
                            canRegister={canRegister}
                        />
                    </div>
                </section>

                {/* ── TESTIMONIALS ── */}
                <div className="testimonials-section">
                    <div className="testimonials-inner">
                        <div className="section-header section-header--center">
                            <div className="section-tag"><Users size={12} /> Testimonials</div>
                            <h2 className="section-title">Loved by industry leaders</h2>
                        </div>
                        <div className="testimonials-grid">
                            <TestimonialCard
                                quote="The AI program generator saved me hours every week. My clients are getting better results than ever and the programs feel genuinely personalised."
                                name="Sarah M."
                                role="Head Coach, Casablanca Fitness"
                                initials="SM"
                                accent="av-purple"
                            />
                            <TestimonialCard
                                quote="The Stripe split payment feature and automated delinquent tracking was a game-changer. Revenue recovery increased by 40% in the first month."
                                name="Karim B."
                                role="Gym Owner, Marrakech Central"
                                initials="KB"
                                accent="av-blue"
                            />
                            <TestimonialCard
                                quote="I can finally see my workout history, goals, and progress all in one place. The biometric advice helped me adapt my training to my health conditions."
                                name="Ines T."
                                role="Pro Athlete"
                                initials="IT"
                                accent="av-green"
                            />
                        </div>
                    </div>
                </div>

                {/* ── FAQ ── */}
                <section id="faq" className="section" style={{ maxWidth: '800px' }}>
                    <div className="section-header section-header--center">
                        <div className="section-tag">FAQ</div>
                        <h2 className="section-title">Common questions</h2>
                    </div>
                    <div>
                        <FAQItem q="How does the AI workout generator work?" a="Coaches fill in a client profile — goal, fitness level, available equipment, and any injuries. We send this to Google Gemini 2.5 Flash via our backend Service. It returns a structured JSON program instantly." />
                        <FAQItem q="Is my data secure?" a="Yes. All data is protected by strict Spatie Role-Based Access Control (RBAC). Payment data never touches our servers — it's handled entirely by Stripe. We also maintain strict System Audit Logs." />
                        <FAQItem q="How does split payment work for clients?" a="Clients can choose to pay their membership fee in monthly instalments via Stripe. If a payment fails, the backend automatically flags their account as 'Overdue', and the Admin can trigger automated email reminders." />
                        <FAQItem q="How is the platform so fast?" a="We aggressively use Redis (Predis) caching. Our Analytics Dashboard, User Directories, and this CMS Landing page are all cached in RAM, eliminating heavy MySQL queries." />
                        <FAQItem q="Can I try it before committing?" a="Absolutely. The Starter plan is completely free and lets you onboard up to 5 clients with 10 AI program generations per month. No credit card required." />
                    </div>
                </section>

                {/* ── CONTACT ── */}
                <section id="contact" className="contact-section">
                    <div className="contact-grid">
                        <div className="contact-info">
                            <div className="contact-label">Get in touch</div>
                            <h2 className="contact-title">Let's talk about your gym</h2>
                            <p className="contact-body">
                                Have questions? Send us a message or email us directly at{' '}
                                <a href={`mailto:${content?.contact_email || 'hello@aigym.io'}`} className="contact-email">
                                    {content?.contact_email || 'hello@aigym.io'}
                                </a>.
                            </p>
                            <div className="contact-perks">
                                {['Response within 24 hours', 'Free onboarding consultation', 'No commitment required'].map(p => (
                                    <div key={p} className="contact-perk">
                                        <div className="contact-perk-dot" />
                                        {p}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <form onSubmit={handleContactSubmit} className="contact-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Full name</label>
                                    <input
                                        type="text" required
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="John Doe"
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email" required
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="john@example.com"
                                        className="form-input"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Message</label>
                                <textarea
                                    required rows={5}
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    placeholder="Tell us about your gym and what you're looking for…"
                                    className="form-textarea form-input"
                                />
                            </div>
                            <button type="submit" disabled={processing} className="form-submit">
                                <Mail size={16} /> Send Message
                            </button>
                        </form>
                    </div>
                </section>

                {/* ── FOOTER ── */}
                <footer className="footer">
                    <div className="footer-inner">
                        <a href="/" className="nav-logo" style={{ textDecoration: 'none' }}>
                            <div className="nav-logo-mark">
                                <Dumbbell size={16} />
                            </div>
                            <span className="nav-logo-text">AI GYM</span>
                        </a>
                        <div className="footer-links">
                            {navLinks.map(l => (
                                <a key={l.href} href={l.href}>{l.label}</a>
                            ))}
                        </div>
                        <p className="footer-copy">© {new Date().getFullYear()} AI Gym. PFE Project.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
