import { Form, Head, Link } from '@inertiajs/react';
import BusinessController from '@/actions/App/Http/Controllers/Admin/BusinessController';
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
import { adminBusinesses } from '@/routes';

type TypeOption = {
    value: string;
    label: string;
};

type Props = {
    types: TypeOption[];
};

export default function AdminBusinessesCreate({ types }: Props) {
    return (
        <>
            <Head title="Add business" />
            <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <Heading
                    title="Add business"
                    description="Create an approved account so it appears in the active list."
                />

                <Form
                    {...BusinessController.store.form()}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <Card>
                            <CardHeader>
                                <CardTitle>Business details</CardTitle>
                                <CardDescription>
                                    Contact and location information for this
                                    account.
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
                                        placeholder="Harbor Cafe"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        required
                                        placeholder="12 Dock St"
                                    />
                                    <InputError message={errors.address} />
                                </div>

                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input
                                            id="city"
                                            name="city"
                                            required
                                            placeholder="Portland"
                                        />
                                        <InputError message={errors.city} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="state">State</Label>
                                        <Input
                                            id="state"
                                            name="state"
                                            required
                                            placeholder="ME"
                                        />
                                        <InputError message={errors.state} />
                                    </div>
                                </div>

                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            placeholder="hello@harbor.test"
                                        />
                                        <InputError message={errors.email} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            required
                                            placeholder="555-0100"
                                        />
                                        <InputError message={errors.phone} />
                                    </div>
                                </div>

                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="website">Website</Label>
                                        <Input
                                            id="website"
                                            name="website"
                                            type="url"
                                            placeholder="https://harbor.test"
                                        />
                                        <InputError message={errors.website} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="business_type">
                                            Type
                                        </Label>
                                        <select
                                            id="business_type"
                                            name="business_type"
                                            required
                                            defaultValue=""
                                            className="border-input focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                                        >
                                            <option value="" disabled>
                                                Select a type
                                            </option>
                                            {types.map((type) => (
                                                <option
                                                    key={type.value}
                                                    value={type.value}
                                                >
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError
                                            message={errors.business_type}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="justify-end gap-2">
                                <Button variant="outline" asChild>
                                    <Link href={adminBusinesses()}>
                                        Cancel
                                    </Link>
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    data-test="create-business-button"
                                >
                                    Save business
                                </Button>
                            </CardFooter>
                        </Card>
                    )}
                </Form>
            </div>
        </>
    );
}

AdminBusinessesCreate.layout = {
    breadcrumbs: [
        {
            title: 'Businesses',
            href: adminBusinesses(),
        },
        {
            title: 'Add business',
            href: BusinessController.create.url(),
        },
    ],
};
