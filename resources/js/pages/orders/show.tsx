import { Head } from '@inertiajs/react';
import OrderController from '@/actions/App/Http/Controllers/OrderController';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { formatMoney } from '@/lib/money';
import { orders } from '@/routes';

type Order = {
    id: number;
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

export default function OrdersShow({ order }: Props) {
    return (
        <>
            <Head title={`Order #${order.id}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <Heading
                    title={`Order #${order.id}`}
                    description="Details for an order you placed with the bakery."
                />

                <dl className="grid gap-4 rounded-xl border border-sidebar-border/70 p-4 sm:grid-cols-2 dark:border-sidebar-border">
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

                {order.status === 'ready_for_pickup' && (
                    <p className="text-sm text-muted-foreground">
                        This order is ready. Collect it at the bakery during
                        office hours and bring your order number.
                    </p>
                )}

                {order.status === 'pending' && (
                    <p className="text-sm text-muted-foreground">
                        We are preparing this order. You will see it marked
                        ready for pickup when you can collect it.
                    </p>
                )}

                {order.status === 'cancelled' && (
                    <p className="text-sm text-muted-foreground">
                        This order will not be prepared. Contact Help and
                        Support if you think this was a mistake.
                    </p>
                )}
            </div>
        </>
    );
}

OrdersShow.layout = (props: Props) => ({
    breadcrumbs: [
        {
            title: 'My Orders',
            href: orders(),
        },
        {
            title: `Order #${props.order.id}`,
            href: OrderController.show.url(props.order.id),
        },
    ],
});
