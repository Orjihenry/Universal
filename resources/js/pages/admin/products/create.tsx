import { Form, Head, Link } from '@inertiajs/react';
import ProductController from '@/actions/App/Http/Controllers/Admin/ProductController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { adminProducts } from '@/routes';

type CategoryOption = {
    id: number;
    name: string;
    slug: string;
};

type Props = {
    categories: CategoryOption[];
    defaultCategoryId?: number | null;
};

export default function AdminProductsCreate({
    categories,
    defaultCategoryId = null,
}: Props) {
    return (
        <>
            <Head title="Add product" />
            <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <Heading
                    title="Add product"
                    description="Create a catalog item for Bread & Specialties or Pastry."
                />

                <Form
                    {...ProductController.store.form()}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <Card>
                            <CardHeader>
                                <CardTitle>Product details</CardTitle>
                                <CardDescription>
                                    These fields appear on the public shop once
                                    the catalog is live.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        required
                                        autoFocus
                                        placeholder="Sourdough boule"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="category_id">Category</Label>
                                    <select
                                        id="category_id"
                                        name="category_id"
                                        required
                                        defaultValue={defaultCategoryId ?? ''}
                                        className="border-input focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                                    >
                                        <option value="" disabled>
                                            Select a category
                                        </option>
                                        {categories.map((category) => (
                                            <option
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.category_id} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="A short tasting note or ingredients highlight."
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="price">Price (₦)</Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                    />
                                    <InputError message={errors.price} />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <label className="flex items-start gap-3 rounded-lg border border-border p-3">
                                        <input
                                            id="is_available"
                                            name="is_available"
                                            type="checkbox"
                                            value="1"
                                            defaultChecked
                                            className="border-input mt-0.5 size-4 rounded-[4px] border shadow-xs"
                                        />
                                        <span className="grid gap-0.5">
                                            <span className="text-sm font-medium">
                                                Available
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                Show this item as in stock.
                                            </span>
                                        </span>
                                    </label>
                                    <label className="flex items-start gap-3 rounded-lg border border-border p-3">
                                        <input
                                            id="featured"
                                            name="featured"
                                            type="checkbox"
                                            value="1"
                                            className="border-input mt-0.5 size-4 rounded-[4px] border shadow-xs"
                                        />
                                        <span className="grid gap-0.5">
                                            <span className="text-sm font-medium">
                                                Featured
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                Eligible for the featured list.
                                            </span>
                                        </span>
                                    </label>
                                </div>
                            </CardContent>
                            <CardFooter className="justify-end gap-2">
                                <Button variant="outline" asChild>
                                    <Link href={adminProducts()}>Cancel</Link>
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    data-test="create-product-button"
                                >
                                    Save product
                                </Button>
                            </CardFooter>
                        </Card>
                    )}
                </Form>
            </div>
        </>
    );
}

AdminProductsCreate.layout = {
    breadcrumbs: [
        {
            title: 'Products',
            href: adminProducts(),
        },
        {
            title: 'Add product',
            href: ProductController.create.url(),
        },
    ],
};
