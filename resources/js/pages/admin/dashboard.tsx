import { Head, router } from '@inertiajs/react';
import {
    Banknote,
    Clock,
    Package2,
    PackageCheck,
    ShoppingBag,
    Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { formatMoney } from '@/lib/money';
import { adminDashboard } from '@/routes';

type SalesPeriod = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

type SalesPoint = {
    date: string;
    label: string;
    revenue: string;
};

type DashboardStats = {
    todaysOrders: number;
    todaysRevenue: string;
    pendingOrders: number;
    ordersReadyForPickup: number;
    totalCustomers: number;
    productsAvailable: number;
    salesPeriod: SalesPeriod;
    salesPeriodLabel: string;
    salesOverview: SalesPoint[];
};

type AttentionItem = {
    id: number;
    title: string;
    meta?: string;
};

type AttentionQueue = {
    count: number;
    items: AttentionItem[];
};

type DashboardAttention = {
    pendingBusinesses: AttentionQueue;
    unavailableProducts: AttentionQueue;
    pendingOrders: AttentionQueue;
};

type StatCard = {
    title: string;
    value: string | number;
    icon: LucideIcon;
};

type Props = {
    stats: DashboardStats;
    attention: DashboardAttention;
};

export default function AdminDashboard({ stats, attention }: Props) {
    const cards: StatCard[] = [
        {
            title: 'Today’s orders',
            value: stats.todaysOrders,
            icon: ShoppingBag,
        },
        {
            title: 'Today’s revenue',
            value: formatMoney(stats.todaysRevenue),
            icon: Banknote,
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

    const attentionGroups = [
        {
            title: 'Pending business approvals',
            queue: attention.pendingBusinesses,
            empty: 'None waiting',
        },
        {
            title: 'Unavailable products',
            queue: attention.unavailableProducts,
            empty: 'None',
        },
        {
            title: 'Pending orders',
            queue: attention.pendingOrders,
            empty: 'None',
        },
    ];

    const salesTotal = stats.salesOverview.reduce(
        (sum, point) => sum + Number(point.revenue),
        0,
    );
    const salesMax = Math.max(
        ...stats.salesOverview.map((point) => Number(point.revenue)),
        0,
    );

    const setSalesPeriod = (period: string) => {
        if (period === '' || period === stats.salesPeriod) {
            return;
        }

        router.get(
            adminDashboard.url({
                query: { sales: period },
            }),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                only: ['stats'],
            },
        );
    };

    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <Heading title="Dashboard" />

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

                <section
                    aria-label="Sales and attention"
                    className="grid gap-4 lg:grid-cols-3"
                >
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="grid gap-1">
                                <CardTitle>Sales overview</CardTitle>
                                <CardDescription>
                                    {stats.salesPeriodLabel}
                                </CardDescription>
                            </div>
                            <div className="flex flex-col items-start gap-3 sm:items-end">
                                <ToggleGroup
                                    type="single"
                                    variant="outline"
                                    size="sm"
                                    value={stats.salesPeriod}
                                    onValueChange={setSalesPeriod}
                                    aria-label="Sales period"
                                >
                                    <ToggleGroupItem
                                        value="weekly"
                                        className="px-2.5 text-xs"
                                    >
                                        Weekly
                                    </ToggleGroupItem>
                                    <ToggleGroupItem
                                        value="monthly"
                                        className="px-2.5 text-xs"
                                    >
                                        Monthly
                                    </ToggleGroupItem>
                                    <ToggleGroupItem
                                        value="quarterly"
                                        className="px-2.5 text-xs"
                                    >
                                        Quarterly
                                    </ToggleGroupItem>
                                    <ToggleGroupItem
                                        value="yearly"
                                        className="px-2.5 text-xs"
                                    >
                                        Yearly
                                    </ToggleGroupItem>
                                </ToggleGroup>
                                <p className="text-lg font-semibold tabular-nums">
                                    {formatMoney(salesTotal)}
                                </p>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex h-48 items-end gap-2">
                                {stats.salesOverview.map((point) => {
                                    const value = Number(point.revenue);
                                    const height =
                                        salesMax === 0
                                            ? 4
                                            : Math.max(
                                                  (value / salesMax) * 100,
                                                  4,
                                              );

                                    return (
                                        <div
                                            key={point.date}
                                            className="flex min-w-0 flex-1 flex-col items-center gap-2"
                                        >
                                            <div className="flex h-40 w-full items-end">
                                                <div
                                                    className="w-full rounded-t-md bg-primary"
                                                    style={{
                                                        height: `${height}%`,
                                                    }}
                                                    title={formatMoney(
                                                        point.revenue,
                                                    )}
                                                />
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {point.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Needs attention</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-5">
                            {attentionGroups.map((group) => (
                                <div key={group.title} className="grid gap-2">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-sm font-medium">
                                            {group.title}
                                        </p>
                                        <Badge
                                            variant={
                                                group.queue.count > 0
                                                    ? 'secondary'
                                                    : 'outline'
                                            }
                                        >
                                            {group.queue.count}
                                        </Badge>
                                    </div>
                                    {group.queue.items.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">
                                            {group.empty}
                                        </p>
                                    ) : (
                                        <ul className="grid gap-1.5">
                                            {group.queue.items.map((item) => (
                                                <li
                                                    key={`${group.title}-${item.id}`}
                                                    className="flex items-baseline justify-between gap-3 text-sm"
                                                >
                                                    <span className="truncate">
                                                        {item.title}
                                                    </span>
                                                    {item.meta ? (
                                                        <span className="shrink-0 text-muted-foreground tabular-nums">
                                                            {item.meta}
                                                        </span>
                                                    ) : null}
                                                </li>
                                            ))}
                                            {group.queue.count >
                                            group.queue.items.length ? (
                                                <li className="text-sm text-muted-foreground">
                                                    And{' '}
                                                    {group.queue.count -
                                                        group.queue.items
                                                            .length}{' '}
                                                    more
                                                </li>
                                            ) : null}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
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
