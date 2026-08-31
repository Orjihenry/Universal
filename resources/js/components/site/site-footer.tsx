import { Link, usePage } from "@inertiajs/react";
import { edit as editProfile } from '@/routes/profile';
import { breadAndSpecialties, contact, cookiePolicy, featured, home, orders, ourStory, privacyPolicy, shop, termsOfService } from "@/routes";

const navItems = [
    { href: home(), label: 'Home', isHome: true },
    { href: ourStory(), label: 'Our Story', isHome: false },
    { href: breadAndSpecialties(), label: 'Bread & Specialties', isHome: false },
    { href: contact(), label: 'Contact', isHome: false },
];

export default function SiteFooter() {
    const { auth } = usePage().props;

    return (
        <>
            <footer className="footer">
                <div className="footer-inner">
                    <section className="footer-brand">
                        <Link className="text-dancing-script footer-logo" href={home()}>
                            Global Universal
                            <br />
                            Bakery Industries.
                        </Link>
                    </section>
                    <section className="footer-flex">
                        <span className="addresses">
                            <span className="addresses-primary">
                                <p>123 Main St, Anytown, USA</p>
                                <p>info@globaluniversalbakery.com</p>
                                <p>(123) 456-7890</p>
                            </span>
                            <hr className="footer-rule" />
                            <span className="addresses-secondary">
                                <p>123 Main St, Anytown, USA</p>
                                <p>info@globaluniversalbakery.com</p>
                                <p>(123) 456-7890</p>
                            </span>
                        </span>
                        <ul className="footer-nav">
                            {navItems.map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="footer-link">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        {auth.user ? (
                            <ul className="footer-auth">
                                <li>
                                    <Link href={shop()}>Shop</Link>
                                </li>
                                <li>
                                    <Link href={featured()}>Featured</Link>
                                </li>
                                <li>
                                    <Link href={editProfile()}>Account</Link>
                                </li>
                                <li>
                                    <Link href={orders()}>My Orders</Link>
                                </li>
                            </ul>
                        ) : (
                            <ul className="footer-auth">
                                <li>
                                    <Link href={shop()}>Shop</Link>
                                </li>
                                <li>
                                    <Link href={featured()}>Featured</Link>
                                </li>
                            </ul>
                        )}
                        <ul className="hours">
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
                        <span className="footer-legal-links">
                            <Link href={privacyPolicy()}>Privacy Policy</Link>
                            <Link href={termsOfService()}>Terms of Service</Link>
                            <Link href={cookiePolicy()}>Cookie Policy</Link>
                        </span>
                    </section>
                </div>
            </footer>
        </>
    );
}