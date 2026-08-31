import { Head, Link } from '@inertiajs/react';
import {
    MoreHorizontal,
    UserCog,
    UserIcon,
    Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import UserController from '@/actions/App/Http/Controllers/Admin/UserController';
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
import { adminUsers } from '@/routes';

type UserAudience = 'customers' | 'staff' | 'admins';

type UserSummary = {
    customers: number;
    staff: number;
    admins: number;
};

type UserRow = {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    roleLabel: string;
    businessesCount: number;
    ordersCount: number;
    joinedAt: string;
};

type SummaryCard = {
    title: string;
    value: number;
    icon: LucideIcon;
};

type Props = {
    audience: UserAudience;
    audienceLabel: string;
    description: string;
    emptyTitle: string;
    emptyDescription: string;
    summary: UserSummary;
    users: UserRow[];
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

export default function AdminUsersIndex({
    audience,
    audienceLabel,
    description,
    emptyTitle,
    emptyDescription,
    summary,
    users,
}: Props) {
    const cards: SummaryCard[] = [
        {
            title: 'Customers',
            value: summary.customers,
            icon: Users,
        },
        {
            title: 'Staff',
            value: summary.staff,
            icon: UserIcon,
        },
        {
            title: 'Admins',
            value: summary.admins,
            icon: UserCog,
        },
    ];

    return (
        <>
            <Head title={audienceLabel} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <Heading title={audienceLabel} description={description} />

                <section
                    aria-label="User summary"
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

                <section aria-label={audienceLabel} className="grid gap-4">
                    <h2 className="text-lg font-semibold tracking-tight">
                        {audienceLabel}
                    </h2>

                    {users.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-sidebar-border/70 px-6 py-16 text-center dark:border-sidebar-border">
                            <p className="text-sm font-medium">{emptyTitle}</p>
                            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                                {emptyDescription}
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Role</TableHead>
                                        {audience === 'customers' ? (
                                            <>
                                                <TableHead>Businesses</TableHead>
                                                <TableHead>Orders</TableHead>
                                            </>
                                        ) : null}
                                        <TableHead>Joined</TableHead>
                                        <TableHead className="w-12 text-right">
                                            <span className="sr-only">
                                                Actions
                                            </span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">
                                                {user.name}
                                            </TableCell>
                                            <TableCell>
                                                <div className="grid gap-0.5">
                                                    <span>{user.email}</span>
                                                    <span className="text-muted-foreground">
                                                        {user.phone}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={roleVariant(
                                                        user.role,
                                                    )}
                                                >
                                                    {user.roleLabel}
                                                </Badge>
                                            </TableCell>
                                            {audience === 'customers' ? (
                                                <>
                                                    <TableCell className="tabular-nums">
                                                        {user.businessesCount}
                                                    </TableCell>
                                                    <TableCell className="tabular-nums">
                                                        {user.ordersCount}
                                                    </TableCell>
                                                </>
                                            ) : null}
                                            <TableCell className="text-muted-foreground">
                                                {user.joinedAt}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            aria-label={`Actions for ${user.name}`}
                                                        >
                                                            <MoreHorizontal />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            asChild
                                                        >
                                                            <Link
                                                                href={UserController.show.url(
                                                                    {
                                                                        audience,
                                                                        user: user.id,
                                                                    },
                                                                )}
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

AdminUsersIndex.layout = (props: Props) => ({
    breadcrumbs: [
        {
            title: props.audienceLabel,
            href: adminUsers(props.audience),
        },
    ],
});
