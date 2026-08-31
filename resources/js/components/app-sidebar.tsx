import { Link } from '@inertiajs/react';
import { BookOpen, House, LayoutGrid, LifeBuoy, Package2 } from 'lucide-react';
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
import { dashboard, faqs, help, home, orders } from '@/routes';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const dashboardUrl = dashboard();

    const mainNavItems: NavItem[] = [
        {
            title: 'Back to site',
            href: home(),
            icon: House,
        },
        {
            title: 'Dashboard',
            href: dashboardUrl,
            icon: LayoutGrid,
        },
        {
            title: 'My Orders',
            href: orders(),
            icon: Package2,
        },
    ];

    const footerNavItems: NavItem[] = [
        {
            title: 'FAQs',
            href: faqs(),
            icon: BookOpen,
        },
        {
            title: 'Help and Support',
            href: help(),
            icon: LifeBuoy,
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
                <NavMain items={mainNavItems} label="Menu" />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
