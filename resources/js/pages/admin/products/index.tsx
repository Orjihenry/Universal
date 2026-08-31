import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import ProductController from '@/actions/App/Http/Controllers/Admin/ProductController';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatMoney } from '@/lib/money';
import { adminProducts } from '@/routes';

type ProductRow = {
    id: number;
    name: string;
    category: string;
    categoryLabel: string;
    price: string | null;
    featured: boolean;
    isAvailable: boolean;
};

type Props = {
    products: ProductRow[];
    category?: string | null;
    categoryLabel?: string | null;
};

export default function AdminProductsIndex({
    products,
    category = null,
    categoryLabel = null,
}: Props) {
    const title = categoryLabel ? categoryLabel : 'All products';

    return (
        <>
            <Head title={title} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <Heading
                        title={title}
                        description="Manage the bakery catalog. Filter by category from the sidebar."
                    />
                    <Button asChild>
                        <Link
                            href={ProductController.create.url({
                                query: category ? { category } : {},
                            })}
                        >
                            <Plus />
                            Add product
                        </Link>
                    </Button>
                </div>

                {products.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-sidebar-border/70 px-6 py-16 text-center dark:border-sidebar-border">
                        <p className="text-sm font-medium">No products yet</p>
                        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                            Add a Bread & Specialties or Pastry item to start
                            the catalog.
                        </p>
                        <Button className="mt-4" asChild>
                            <Link
                                href={ProductController.create.url({
                                    query: category ? { category } : {},
                                })}
                            >
                                <Plus />
                                Add product
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <ul className="divide-y divide-border rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        {products.map((product) => (
                            <li
                                key={product.id}
                                className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="grid gap-1">
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {product.categoryLabel}
                                        {product.price
                                            ? ` · ${formatMoney(product.price)}`
                                            : ''}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {product.featured ? (
                                        <Badge variant="secondary">
                                            Featured
                                        </Badge>
                                    ) : null}
                                    <Badge
                                        variant={
                                            product.isAvailable
                                                ? 'default'
                                                : 'outline'
                                        }
                                    >
                                        {product.isAvailable
                                            ? 'Available'
                                            : 'Hidden'}
                                    </Badge>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
}

AdminProductsIndex.layout = (props: Props) => ({
    breadcrumbs: [
        {
            title: props.categoryLabel ?? 'Products',
            href: adminProducts(
                props.category
                    ? { query: { category: props.category } }
                    : undefined,
            ),
        },
    ],
});
