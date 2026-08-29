import { dashboard } from "@/routes";
import { Link, usePage } from "@inertiajs/react";

export default function AdminHeader() {
    const { auth } = usePage().props;

    return (
        <header className="admin-header">
            <Link href={dashboard(auth.user.id)}>
                <span className="logo-mark">GUBI</span>
            </Link>

            <nav className="admin-nav">
                <Link href={dashboard(auth.user.id)}>Dashboard</Link>
            </nav>
        </header>
    );
}