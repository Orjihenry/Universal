import { Head, Link } from '@inertiajs/react';
import {
    Ban,
    Building2,
    CheckCircle,
    Clock,
    MoreHorizontal,
    Plus,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import BusinessController from '@/actions/App/Http/Controllers/Admin/BusinessController';
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
import { adminBusinesses } from '@/routes';

type BusinessSummary = {
    total: number;
    pending: number;
    approved: number;
    suspended: number;
};

type BusinessRow = {
    id: number;
    name: string;
    email: string;
    phone: string;
    type: string;
    typeLabel: string;
    status: string;
    statusLabel: string;
};

type SummaryCard = {
    title: string;
    value: number;
    icon: LucideIcon;
};

type Props = {
    summary: BusinessSummary;
    businesses: BusinessRow[];
};

export default function AdminBusinessesIndex({
    summary,
    businesses,
}: Props) {
    const cards: SummaryCard[] = [
        {
            title: 'Total',
            value: summary.total,
            icon: Building2,
        },
        {
            title: 'Pending',
            value: summary.pending,
            icon: Clock,
        },
        {
            title: 'Approved',
            value: summary.approved,
            icon: CheckCircle,
        },
        {
            title: 'Suspended',
            value: summary.suspended,
            icon: Ban,
        },
    ];

    return (
        <>
            <Head title="Businesses" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <Heading title="Businesses" />

                <section
                    aria-label="Business summary"
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

                <section aria-label="Active businesses" className="grid gap-4">
                    <div className="flex items-center justify-between gap-4">
                        <h2 className="text-lg font-semibold tracking-tight">
                            Active businesses
                        </h2>
                        <Button asChild>
                            <Link href={BusinessController.create.url()}>
                                <Plus />
                                Add business
                            </Link>
                        </Button>
                    </div>

                    {businesses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-sidebar-border/70 px-6 py-16 text-center dark:border-sidebar-border">
                            <p className="text-sm font-medium">
                                No active businesses
                            </p>
                            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                                Approved accounts will appear here.
                            </p>
                            <Button className="mt-4" asChild>
                                <Link href={BusinessController.create.url()}>
                                    <Plus />
                                    Add business
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-12 text-right">
                                            <span className="sr-only">
                                                Actions
                                            </span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {businesses.map((business) => (
                                        <TableRow key={business.id}>
                                            <TableCell className="font-medium">
                                                {business.name}
                                            </TableCell>
                                            <TableCell>
                                                <div className="grid gap-0.5">
                                                    <span>{business.email}</span>
                                                    <span className="text-muted-foreground">
                                                        {business.phone}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {business.typeLabel}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        business.status ===
                                                        'approved'
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {business.statusLabel}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            aria-label={`Actions for ${business.name}`}
                                                        >
                                                            <MoreHorizontal />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            asChild
                                                        >
                                                            <Link
                                                                href={BusinessController.show.url(
                                                                    business.id,
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

AdminBusinessesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Businesses',
            href: adminBusinesses(),
        },
    ],
};
