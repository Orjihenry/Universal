import { Link, usePage } from '@inertiajs/react';
import {
    LogIn,
    LogOut,
    Menu,
    Package,
    X,
    Power,
    PowerOff,
    Search,
    Settings,
    ShoppingCart,
    User,
    UserPlus,
} from 'lucide-react';
import { useState } from 'react';
import AppearanceToggle from '@/components/appearance-toggle';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { breadAndSpecialties, contact, home, login, logout, ourStory, register } from '@/routes';
import { edit as editProfile } from '@/routes/profile';

const navItems = [
    { href: home(), label: 'Home' },
    { href: ourStory(), label: 'Our Story' },
    { href: breadAndSpecialties(), label: 'Bread & Specialties' },
    { href: contact(), label: 'Contact' },
];

const appearanceToggleClassName =
    'site-header-icon rounded-full bg-transparent hover:bg-transparent';

export default function SiteHeader() {
    const { auth } = usePage().props;
    const { isCurrentUrl } = useCurrentUrl();
    const [menuOpen, setMenuOpen] = useState(false);

    const navLinkClassName = (href: (typeof navItems)[number]['href']) =>
        isCurrentUrl(href) ? 'is-active' : undefined;

    return (
        <header className="site-header">
            <div className="site-header-inner">
                <Link href={home()} className="site-logo">
                    <span className="logo-mark">GUBI</span>
                </Link>

                <nav className="site-nav" aria-label="Primary">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={navLinkClassName(item.href)}
                            aria-current={
                                isCurrentUrl(item.href) ? 'page' : undefined
                            }
                        >
                            {item.label}
                        </Link>
                    ))}
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

                    <AppearanceToggle className={appearanceToggleClassName} />

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

                    <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                        <SheetTrigger
                            className="site-header-icon site-nav-toggle"
                            aria-label="Open menu"
                        >
                            <Menu />
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="site-drawer [&>button]:hidden"
                        >
                            <SheetHeader className="flex flex-row items-center justify-between space-y-0">
                                <div>
                                    <SheetTitle>Menu</SheetTitle>
                                    <SheetDescription className="sr-only">
                                        Site navigation
                                    </SheetDescription>
                                </div>
                                <div className="flex items-center gap-1">
                                    <AppearanceToggle className={appearanceToggleClassName} />
                                    <SheetClose
                                        className="site-header-icon"
                                        aria-label="Close menu"
                                    >
                                        <X />
                                    </SheetClose>
                                </div>
                            </SheetHeader>
                            <nav
                                className="site-drawer-nav"
                                aria-label="Primary"
                            >
                                {navItems.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className={navLinkClassName(item.href)}
                                        aria-current={
                                            isCurrentUrl(item.href)
                                                ? 'page'
                                                : undefined
                                        }
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
