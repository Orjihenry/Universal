import { Link } from '@inertiajs/react';
import { BookOpen, Building, Building2, FolderGit2, LayoutGrid, Package2, Shield, Users, Users2Icon, UsersIcon } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { adminDashboard } from '@/routes';
import type { NavItem } from '@/types';

export function AdminSidebar() {
    const dashboardUrl = adminDashboard();

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboardUrl,
            icon: LayoutGrid,
        },
        {
            title: 'Users',
            href: 'usersUrl',
            icon: Users,
        },
        {
            title: 'Products',
            href: 'rolesUrl',
            icon: Shield,
        },
        {
            title: 'Businesses',
            href: 'businessesUrl',
            icon: Building2,
        },
        {
            title: 'Staff',
            href: 'staffUrl',
            icon: Users2Icon,
        },
        {
            title: 'Customers',
            href: 'customersUrl',
            icon: UsersIcon,
        },
        {
            title: 'Pending Orders',
            href: 'ordersUrl',
            icon: Package2,
        },
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
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
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
