import { Head } from '@inertiajs/react';
import BusinessController from '@/actions/App/Http/Controllers/Admin/BusinessController';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { adminBusinesses } from '@/routes';

type Business = {
    id: number;
    name: string;
    email: string;
    phone: string;
    typeLabel: string;
    status: string;
    statusLabel: string;
};

type Props = {
    business: Business;
};

export default function AdminBusinessesShow({ business }: Props) {
    return (
        <>
            <Head title={business.name} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <Heading title={business.name} />

                <dl className="grid gap-4 rounded-xl border border-sidebar-border/70 p-4 sm:grid-cols-2 dark:border-sidebar-border">
                    <div className="grid gap-1">
                        <dt className="text-sm text-muted-foreground">
                            Contact
                        </dt>
                        <dd className="text-sm">
                            {business.email}
                            <span className="mt-0.5 block text-muted-foreground">
                                {business.phone}
                            </span>
                        </dd>
                    </div>
                    <div className="grid gap-1">
                        <dt className="text-sm text-muted-foreground">Type</dt>
                        <dd className="text-sm">{business.typeLabel}</dd>
                    </div>
                    <div className="grid gap-1">
                        <dt className="text-sm text-muted-foreground">
                            Status
                        </dt>
                        <dd>
                            <Badge
                                variant={
                                    business.status === 'approved'
                                        ? 'default'
                                        : 'secondary'
                                }
                            >
                                {business.statusLabel}
                            </Badge>
                        </dd>
                    </div>
                </dl>
            </div>
        </>
    );
}

AdminBusinessesShow.layout = (props: Props) => ({
    breadcrumbs: [
        {
            title: 'Businesses',
            href: adminBusinesses(),
        },
        {
            title: props.business.name,
            href: BusinessController.show.url(props.business.id),
        },
    ],
});
