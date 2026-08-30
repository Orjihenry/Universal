import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Building2, Cake, CakeSlice, FileText, FolderGit2, LayoutGrid, Mail, Package2, UserCog, UserIcon, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarClose,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { adminBusinesses, adminDashboard, adminProducts } from '@/routes';
import type { NavItem } from '@/types';

const categoryIcons: Record<string, LucideIcon> = {
    'bread-and-specialties': CakeSlice,
    pastry: Cake,
};

export function AdminSidebar() {
    const dashboardUrl = adminDashboard();
    const { productCategories = [] } = usePage().props;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboardUrl,
            icon: LayoutGrid,
        },
        {
            title: 'Users',
            icon: Users,
            items: [
                {
                    title: 'Customers',
                    href: '#',
                    icon: Users,
                },
                {
                    title: 'Staff',
                    href: '#',
                    icon: UserIcon,
                },
                {
                    title: 'Admins',
                    href: '#',
                    icon: UserCog,
                },
            ],
        },
        {
            title: 'Products',
            icon: Package2,
            items: [
                {
                    title: 'All products',
                    href: adminProducts(),
                    icon: Package2,
                },
                ...productCategories.map((category) => ({
                    title: category.name,
                    href: adminProducts({
                        query: { category: category.slug },
                    }),
                    icon: categoryIcons[category.slug] ?? Package2,
                })),
            ],
        },
        {
            title: 'Businesses',
            href: adminBusinesses(),
            icon: Building2,
        },
        {
            title: 'Orders',
            href: '#',
            icon: Package2,
        },
        {
            title: 'Pages',
            href: '#',
            icon: FileText,
            items: [
                {
                    title: 'About',
                    href: '#',
                    icon: BookOpen,
                },
                {
                    title: 'Contact',
                    href: '#',
                    icon: Mail,
                },
            ],
        }
    ];

    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/laravel/react-starter-kit',
            icon: FolderGit2,
        },
        {
            title: 'Documentation',
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="flex-row items-center justify-between gap-2">
                <SidebarMenu className="flex-1">
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <SidebarClose />
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
