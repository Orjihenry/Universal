import { Link, usePage } from "@inertiajs/react";
import { edit as editProfile } from '@/routes/profile';

const navItems = [
    { href: '/', label: 'Home', isHome: true },
    { href: '/', label: 'Our Story', isHome: false },
    { href: '/', label: 'Bread & Specialties', isHome: false },
    { href: '/', label: 'Contact', isHome: false },
];

export default function FooterLayout() {
    const { auth } = usePage().props;

    return (
        <>
            <footer className="footer py-12">
                <div className="footer-inner">
                    <section className="footer-grid grid-cols-3 grid-rows-3 gap-4 mb-8">
                        <div className="footer-brand col-span-1 row-span-1">
                            <Link className="text-dancing-script footer-logo text-2xl font-bold" href="/">
                                Global Universal
                                <br />
                                Bakery Industries.
                            </Link>
                        </div>
                    </section>
                    <section className="footer-flex flex flex-col md:flex-row flex-wrap justify-between gap-4 mb-8">
                        <span className="addresses">
                            <span className="addresses-primary">
                                <p>123 Main St, Anytown, USA</p>
                                <p>info@globaluniversalbakery.com</p>
                                <p>(123) 456-7890</p>
                            </span>
                            <hr className="border-gray-200 my-4" />
                            <span className="addresses-secondary">
                                <p>123 Main St, Anytown, USA</p>
                                <p>info@globaluniversalbakery.com</p>
                                <p>(123) 456-7890</p>
                            </span>
                        </span>
                        <ul className="footer-nav flex flex-col gap-4">
                            {navItems.map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="footer-link">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        {auth.user ? (
                            <ul className="footer-auth flex flex-col gap-4">
                                <li>
                                    <Link href="/">Shop</Link>
                                </li>
                                <li>
                                    <Link href="/">Featured</Link>
                                </li>
                                <li>
                                    <Link href={editProfile()}>Account</Link>
                                </li>
                                <li>
                                    <Link href="/orders">My Orders</Link>
                                </li>
                            </ul>
                        ) : (
                            <ul className="footer-auth flex flex-col gap-4">
                                <li>
                                    <Link href="/">Shop</Link>
                                </li>
                                <li>
                                    <Link href="/">Featured</Link>
                                </li>
                            </ul>
                        )}
                        <ul className="hours flex flex-col gap-4">
                            <li>
                                <p>Office Hours</p>
                            </li>
                            <li>
                                <p>Monday - Friday</p>
                                <p>8:00 AM - 5:00 PM</p>
                            </li>
                            <li>
                                <p>Saturday</p>
                                <p>10:00 AM - 3:00 PM</p>
                            </li>
                            <li>
                                <p>Sunday - Closed</p>
                            </li>
                        </ul>
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