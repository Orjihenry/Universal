import { Head } from '@inertiajs/react';
import {
    Clock,
    DollarSign,
    Package2,
    PackageCheck,
    ShoppingBag,
    Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Heading from '@/components/heading';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { adminDashboard } from '@/routes';

type DashboardStats = {
    todaysOrders: number;
    todaysRevenue: string;
    pendingOrders: number;
    ordersReadyForPickup: number;
    totalCustomers: number;
    productsAvailable: number;
};

type StatCard = {
    title: string;
    value: string | number;
    icon: LucideIcon;
};

type Props = {
    stats: DashboardStats;
};

export default function AdminDashboard({ stats }: Props) {
    const cards: StatCard[] = [
        {
            title: 'Today’s orders',
            value: stats.todaysOrders,
            icon: ShoppingBag,
        },
        {
            title: 'Today’s revenue',
            value: `$${stats.todaysRevenue}`,
            icon: DollarSign,
        },
        {
            title: 'Pending orders',
            value: stats.pendingOrders,
            icon: Clock,
        },
        {
            title: 'Orders ready for pickup',
            value: stats.ordersReadyForPickup,
            icon: PackageCheck,
        },
        {
            title: 'Total customers',
            value: stats.totalCustomers,
            icon: Users,
        },
        {
            title: 'Products available',
            value: stats.productsAvailable,
            icon: Package2,
        },
    ];

    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <Heading
                    title="Dashboard"
                    description="A snapshot of orders, customers, and the catalog."
                />

                <section
                    aria-label="Overview"
                    className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
                >
                    {cards.map((card) => (
                        <Card key={card.title}>
                            <CardHeader className="flex flex-row items-center justify-between gap-3">
                                <CardDescription>{card.title}</CardDescription>
                                <card.icon className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <CardTitle className="text-2xl font-semibold tabular-nums">
                                    {card.value}
                                </CardTitle>
                            </CardContent>
                        </Card>
                    ))}
                </section>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: adminDashboard(),
        },
    ],
};
