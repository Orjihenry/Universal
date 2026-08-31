import { Head, Link } from '@inertiajs/react';
import {
    CheckCircle,
    Clock,
    MoreHorizontal,
    PackageCheck,
    ShoppingBag,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import OrderController from '@/actions/App/Http/Controllers/OrderController';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatMoney } from '@/lib/money';
import { orders, shop } from '@/routes';

type OrderSummary = {
    total: number;
    pending: number;
    readyForPickup: number;
    completed: number;
};

type OrderRow = {
    id: number;
    total: string;
    status: string;
    statusLabel: string;
    placedAt: string;
};

type SummaryCard = {
    title: string;
    value: number;
    icon: LucideIcon;
};

type Props = {
    summary: OrderSummary;
    orders: OrderRow[];
};

function statusVariant(
    status: string,
): 'default' | 'secondary' | 'destructive' | 'outline' {
    if (status === 'ready_for_pickup') {
        return 'default';
    }

    if (status === 'completed') {
        return 'outline';
    }

    if (status === 'cancelled') {
        return 'destructive';
    }

    return 'secondary';
}

export default function OrdersIndex({ summary, orders: orderRows }: Props) {
    const cards: SummaryCard[] = [
        {
            title: 'Total',
            value: summary.total,
            icon: ShoppingBag,
        },
        {
            title: 'Pending',
            value: summary.pending,
            icon: Clock,
        },
        {
            title: 'Ready for pickup',
            value: summary.readyForPickup,
            icon: PackageCheck,
        },
        {
            title: 'Completed',
            value: summary.completed,
            icon: CheckCircle,
        },
    ];

    return (
        <>
            <Head title="My Orders" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <Heading
                    title="My Orders"
                    description="Track pickup status for orders you have placed."
                />

                <section
                    aria-label="Order summary"
                    className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
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

                <section aria-label="Your orders" className="grid gap-4">
                    <h2 className="text-lg font-semibold tracking-tight">
                        Your orders
                    </h2>

                    {orderRows.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-sidebar-border/70 px-6 py-16 text-center dark:border-sidebar-border">
                            <p className="text-sm font-medium">
                                You have not placed any orders yet
                            </p>
                            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                                When you check out from the shop, your orders
                                will show up here.
                            </p>
                            <Button asChild className="mt-4">
                                <Link href={shop()} prefetch>
                                    Browse the shop
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Placed</TableHead>
                                        <TableHead className="w-12 text-right">
                                            <span className="sr-only">
                                                Actions
                                            </span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orderRows.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">
                                                #{order.id}
                                            </TableCell>
                                            <TableCell className="tabular-nums">
                                                {formatMoney(order.total)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={statusVariant(
                                                        order.status,
                                                    )}
                                                >
                                                    {order.statusLabel}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {order.placedAt}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            aria-label={`Actions for order ${order.id}`}
                                                        >
                                                            <MoreHorizontal />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            asChild
                                                        >
                                                            <Link
                                                                href={OrderController.show.url(
                                                                    order.id,
                                                                )}
                                                                prefetch
                                                            >
                                                                View
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}

OrdersIndex.layout = {
    breadcrumbs: [
        {
            title: 'My Orders',
            href: orders(),
        },
    ],
};
