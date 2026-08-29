import { dashboard } from '@/routes';
import { Link } from '@inertiajs/react';

export default function AdminHeader() {
    return (
        <header className="admin-header">
            <Link href={dashboard()}>
                <span className="logo-mark">GUBI</span>
            </Link>

            <nav className="admin-nav">
                <Link href={dashboard()}>Dashboard</Link>
            </nav>
        </header>
    );
}
