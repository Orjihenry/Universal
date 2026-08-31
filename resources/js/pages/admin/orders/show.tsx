import { Head } from '@inertiajs/react';
import OrderController from '@/actions/App/Http/Controllers/Admin/OrderController';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { formatMoney } from '@/lib/money';
import { adminOrders } from '@/routes';

type Order = {
    id: number;
    customerName: string;
    customerEmail: string;
    total: string;
    status: string;
    statusLabel: string;
    placedAt: string;
};

type Props = {
    order: Order;
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

export default function AdminOrdersShow({ order }: Props) {
    return (
        <>
            <Head title={`Order #${order.id}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <Heading title={`Order #${order.id}`} />

                <dl className="grid gap-4 rounded-xl border border-sidebar-border/70 p-4 sm:grid-cols-2 dark:border-sidebar-border">
                    <div className="grid gap-1">
                        <dt className="text-sm text-muted-foreground">
                            Customer
                        </dt>
                        <dd className="text-sm">
                            {order.customerName}
                            <span className="mt-0.5 block text-muted-foreground">
                                {order.customerEmail}
                            </span>
                        </dd>
                    </div>
                    <div className="grid gap-1">
                        <dt className="text-sm text-muted-foreground">Total</dt>
                        <dd className="text-sm tabular-nums">
                            {formatMoney(order.total)}
                        </dd>
                    </div>
                    <div className="grid gap-1">
                        <dt className="text-sm text-muted-foreground">
                            Status
                        </dt>
                        <dd>
                            <Badge variant={statusVariant(order.status)}>
                                {order.statusLabel}
                            </Badge>
                        </dd>
                    </div>
                    <div className="grid gap-1">
                        <dt className="text-sm text-muted-foreground">
                            Placed
                        </dt>
                        <dd className="text-sm">{order.placedAt}</dd>
                    </div>
                </dl>
            </div>
        </>
    );
}

AdminOrdersShow.layout = (props: Props) => ({
    breadcrumbs: [
        {
            title: 'Orders',
            href: adminOrders(),
        },
        {
            title: `Order #${props.order.id}`,
            href: OrderController.show.url(props.order.id),
        },
    ],
});
