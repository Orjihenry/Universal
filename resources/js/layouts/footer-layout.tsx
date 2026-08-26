import { Link, usePage } from "@inertiajs/react";

const navItems = [
    { href: '/', label: 'Home', isHome: true },
    { href: '/', label: 'Our Story', isHome: false },
    { href: '/', label: 'Bread & Specialties', isHome: false },
    { href: '/', label: 'Contact', isHome: false },
];

export default function FooterLayout() {
    return (
        <>
            <footer className="footer py-12">
                <div className="footer-inner">
                    <section className="footer-grid grid-cols-3 grid-rows-3 gap-4">
                        <div className="footer-brand col-span-1 row-span-1">
                            <Link className="text-dancing-script footer-logo text-2xl font-bold" href="/">
                                Global Universal Bakery Industries.
                            </Link>
                        </div>
                    </section>
                    <section className="footer-grid grid-cols-3 grid-rows-3 gap-4">
                        <div className="footer-nav col-span-1 row-span-1">
                            {navItems.map((item) => (
                                <Link key={item.label} href={item.href} className="footer-link">
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </section>
                    <section className="legal">
                        <span className="footer-legal">
                            <p>&copy; {new Date().getFullYear()} Global Universal Bakery Industries. All rights reserved.</p>
                        </span>
                        <span className="footer-legal-links flex flex-row gap-4">
                            <Link href="/privacy-policy">Privacy Policy</Link>
                            <Link href="/terms-of-service">Terms of Service</Link>
                            <Link href="/cookie-policy">Cookie Policy</Link>
                        </span>
                    </section>
                </div>
            </footer>
        </>
    );
}