import { Head, Link } from '@inertiajs/react';
import BusinessController from '@/actions/App/Http/Controllers/Admin/BusinessController';
import UserController from '@/actions/App/Http/Controllers/Admin/UserController';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { adminUsers } from '@/routes';

type UserAudience = 'customers' | 'staff' | 'admins';

type Business = {
    id: number;
    name: string;
    status: string;
    statusLabel: string;
};

type User = {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    roleLabel: string;
    businessesCount: number;
    ordersCount: number;
    joinedAt: string;
    businesses: Business[];
};

type Props = {
    audience: UserAudience;
    audienceLabel: string;
    user: User;
};

function roleVariant(
    role: string,
): 'default' | 'secondary' | 'outline' {
    if (role === 'super_admin') {
        return 'outline';
    }

    if (role === 'staff' || role === 'admin') {
        return 'default';
    }

    return 'secondary';
}

export default function AdminUsersShow({ audience, audienceLabel, user }: Props) {
    return (
        <>
            <Head title={user.name} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <Heading title={user.name} />

                <dl className="grid gap-4 rounded-xl border border-sidebar-border/70 p-4 sm:grid-cols-2 dark:border-sidebar-border">
                    <div className="grid gap-1">
                        <dt className="text-sm text-muted-foreground">
                            Contact
                        </dt>
                        <dd className="text-sm">
                            {user.email}
                            <span className="mt-0.5 block text-muted-foreground">
                                {user.phone}
                            </span>
                        </dd>
                    </div>
                    <div className="grid gap-1">
                        <dt className="text-sm text-muted-foreground">Role</dt>
                        <dd>
                            <Badge variant={roleVariant(user.role)}>
                                {user.roleLabel}
                            </Badge>
                        </dd>
                    </div>
                    <div className="grid gap-1">
                        <dt className="text-sm text-muted-foreground">
                            Joined
                        </dt>
                        <dd className="text-sm">{user.joinedAt}</dd>
                    </div>
                    {audience === 'customers' ? (
                        <div className="grid gap-1">
                            <dt className="text-sm text-muted-foreground">
                                Orders
                            </dt>
                            <dd className="text-sm tabular-nums">
                                {user.ordersCount}
                            </dd>
                        </div>
                    ) : null}
                </dl>

                {audience === 'customers' ? (
                    <section aria-label="Businesses" className="grid gap-4">
                        <h2 className="text-lg font-semibold tracking-tight">
                            Businesses
                        </h2>
                        {user.businesses.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                This customer has not registered a business.
                            </p>
                        ) : (
                            <ul className="divide-y divide-border rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                                {user.businesses.map((business) => (
                                    <li
                                        key={business.id}
                                        className="flex items-center justify-between gap-3 px-4 py-3"
                                    >
                                        <Link
                                            href={BusinessController.show.url(
                                                business.id,
                                            )}
                                            className="font-medium hover:underline"
                                        >
                                            {business.name}
                                        </Link>
                                        <Badge
                                            variant={
                                                business.status === 'approved'
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                        >
                                            {business.statusLabel}
                                        </Badge>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                ) : null}
            </div>
        </>
    );
}

AdminUsersShow.layout = (props: Props) => ({
    breadcrumbs: [
        {
            title: props.audienceLabel,
            href: adminUsers(props.audience),
        },
        {
            title: props.user.name,
            href: UserController.show.url({
                audience: props.audience,
                user: props.user.id,
            }),
        },
    ],
});
