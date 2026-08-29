import { Head, Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { dashboard, login } from '@/routes';

const craftSecrets: {
    id: string;
    name: string;
    detail: string;
    icon: ReactNode;
}[] = [
    {
        id: 'wheat-flour',
        name: 'Wheat flour',
        detail: 'Stone-milled wheat for a tender crumb and a full, honest flavour in every loaf.',
        icon: (
            <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
                <path
                    d="M32 54V18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
                <path
                    d="M32 22c-6-4-12-4-16-2 2 6 8 10 16 12 8-2 14-6 16-12-4-2-10-2-16 2Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                />
                <path
                    d="M32 32c-6-4-12-4-16-2 2 6 8 10 16 12 8-2 14-6 16-12-4-2-10-2-16 2Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                />
                <path
                    d="M32 42c-5-3-10-3-14-1 2 5 7 8 14 10 7-2 12-5 14-10-4-2-9-2-14 1Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                />
            </svg>
        ),
    },
    {
        id: 'salty',
        name: 'Salty',
        detail: 'A pinch of sea salt to season the crust and keep the sweetness of the grain in balance.',
        icon: (
            <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
                <path
                    d="M24 22h16l3 28H21l3-28Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                />
                <path
                    d="M26 22V18a6 6 0 0 1 12 0v4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                />
                <path
                    d="M32 32v8M29 36h6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
            </svg>
        ),
    },
    {
        id: 'water',
        name: 'Water',
        detail: 'Clean, cold water to wake the dough and keep every bake light and even.',
        icon: (
            <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
                <path
                    d="M32 14c0 0-14 18-14 28a14 14 0 1 0 28 0c0-10-14-28-14-28Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                />
            </svg>
        ),
    },
    {
        id: 'yeast',
        name: 'Yeast',
        detail: 'A slow, living ferment that gives the bread its lift, aroma, and character.',
        icon: (
            <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
                <path
                    d="M18 44c0-8 6-14 14-14s14 6 14 14H18Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                />
                <path
                    d="M26 30c0-6 4-10 10-10s10 4 10 10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                />
                <circle cx="28" cy="38" r="1.2" fill="currentColor" />
                <circle cx="36" cy="36" r="1.2" fill="currentColor" />
                <circle cx="40" cy="42" r="1.2" fill="currentColor" />
            </svg>
        ),
    },
];

export default function Welcome() {
    const { auth } = usePage().props;
    const dashboardUrl = dashboard();

    return (
        <>
            <Head title="Global Universal Bread Industry" />
            <div className="flex min-h-screen flex-col items-center">
                <section className="hero">
                    <div className="hero-content">
                        <p className="text-rouge">
                            Every bite makes the{' '}
                            <span className="hero-highlight">moment</span>{' '}
                            special
                        </p>
                        <h1 className="hero-heading">
                            Made fresh for every moment, shared with joy
                        </h1>
                        <p className="hero-text">
                            We believe great taste and responsible choices
                            should go hand in hand. We are committed to creating
                            quality baked goods while making thoughtful choices
                            that respect our communities and the world around
                            us.
                            <br />
                            Our goal is to make everyday choices more
                            responsible—baking products that people can enjoy
                            today while contributing to a better future for
                            generations to come.
                        </p>
                        <Link
                            href={auth.user ? dashboardUrl : login()}
                            className="hero-cta"
                        >
                            <span className="hero-cta-icon" aria-hidden="true">
                                <svg
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M3 8h10M9 4l4 4-4 4"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </span>
                            {auth.user ? 'Dashboard' : 'Log in'}
                        </Link>
                    </div>
                </section>
                <section className="craft">
                    <div className="craft-content">
                        <h2 className="text-rouge">Our Craft</h2>
                        <p className="craft-lede">
                            Specialists in the bakery industry since 1985
                        </p>
                        <ul className="craft-secrets">
                            {craftSecrets.map((secret) => (
                                <li key={secret.id} className="craft-item">
                                    <div
                                        className="craft-flip"
                                        tabIndex={0}
                                        aria-label={secret.name}
                                        aria-describedby={`${secret.id}-detail`}
                                    >
                                        <div className="craft-flip-inner">
                                            <div className="craft-face craft-face-front">
                                                <span className="craft-icon">
                                                    {secret.icon}
                                                </span>
                                                <span className="craft-label">
                                                    {secret.name}
                                                </span>
                                            </div>
                                            <div
                                                id={`${secret.id}-detail`}
                                                className="craft-face craft-face-back"
                                            >
                                                <span className="craft-label">
                                                    {secret.name}
                                                </span>
                                                <p>{secret.detail}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            </div>
        </>
    );
}
