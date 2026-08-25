import { Link, usePage } from '@inertiajs/react';
import {
    LogIn,
    LogOut,
    Package,
    Power,
    PowerOff,
    Search,
    Settings,
    ShoppingCart,
    User,
    UserPlus,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { home, login, logout, register } from '@/routes';
import { edit as editProfile } from '@/routes/profile';

export default function HeaderLayout() {
    const { auth } = usePage().props;
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <header className="site-header">
            <div className="site-header-inner">
                <Link href={home()} className="site-logo">
                    <span className="logo-mark">GUBI</span>
                </Link>

                <nav className="site-nav" aria-label="Primary">
                    <Link
                        href={home()}
                        className={
                            isCurrentUrl(home()) ? 'is-active' : undefined
                        }
                    >
                        Home
                    </Link>
                    <Link href="/">Our Story</Link>
                    <Link href="/">Bread & Specialties</Link>
                    <Link href="/">Contact</Link>
                </nav>

                <div className="site-header-actions">
                    <button
                        type="button"
                        className="site-header-icon"
                        aria-label="Search"
                    >
                        <Search />
                    </button>

                    <Link
                        href="/cart"
                        className="site-header-icon"
                        aria-label="Cart"
                    >
                        <ShoppingCart />
                    </Link>

                    {auth.user && (
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                className="site-header-icon"
                                aria-label="Account"
                            >
                                <User />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href={editProfile()}>
                                        <Settings />
                                        Account
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/orders">
                                        <Package />
                                        My orders
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger
                            className="site-header-icon"
                            aria-label={auth.user ? 'Log out' : 'Log in'}
                        >
                            {auth.user ? <Power /> : <PowerOff />}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {auth.user ? (
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={logout()}
                                        method="post"
                                        as="button"
                                    >
                                        <LogOut />
                                        Log out
                                    </Link>
                                </DropdownMenuItem>
                            ) : (
                                <>
                                    <DropdownMenuItem asChild>
                                        <Link href={login()}>
                                            <LogIn />
                                            Log in
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={register()}>
                                            <UserPlus />
                                            Register
                                        </Link>
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
