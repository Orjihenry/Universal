import { Head, Link } from '@inertiajs/react';
import { BookOpen, Clock, Mail, MapPin, Phone } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { contact, faqs, help } from '@/routes';

export default function Help() {
    return (
        <>
            <Head title="Help and Support" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <Heading
                    title="Help and Support"
                    description="Need a hand with an order, pickup, or your account? Reach the bakery team using the details below."
                />

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Mail className="size-4" />
                                Email
                            </CardTitle>
                            <CardDescription>
                                We reply during office hours, usually the same
                                day.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <a
                                href="mailto:info@globaluniversalbakery.com"
                                className="text-sm font-medium underline-offset-4 hover:underline"
                            >
                                info@globaluniversalbakery.com
                            </a>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Phone className="size-4" />
                                Phone
                            </CardTitle>
                            <CardDescription>
                                Call during office hours for urgent pickup
                                questions.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <a
                                href="tel:+1234567890"
                                className="text-sm font-medium underline-offset-4 hover:underline"
                            >
                                (123) 456-7890
                            </a>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <MapPin className="size-4" />
                                Visit us
                            </CardTitle>
                            <CardDescription>
                                Collect orders at the bakery during office
                                hours.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">123 Main St, Anytown, USA</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Clock className="size-4" />
                            Office hours
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2 text-sm sm:grid-cols-3">
                        <p>
                            <span className="font-medium">Monday – Friday</span>
                            <br />
                            8:00 AM – 5:00 PM
                        </p>
                        <p>
                            <span className="font-medium">Saturday</span>
                            <br />
                            10:00 AM – 3:00 PM
                        </p>
                        <p>
                            <span className="font-medium">Sunday</span>
                            <br />
                            Closed
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            When you contact us
                        </CardTitle>
                        <CardDescription>
                            Include your name, the email on your account, and
                            your order number if you have one. A short
                            description of what you need helps us reply faster.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        <Button asChild>
                            <Link href={faqs()} prefetch>
                                <BookOpen className="size-4" />
                                Browse FAQs
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href={contact()} prefetch>
                                Open contact page
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Help.layout = {
    breadcrumbs: [
        {
            title: 'Help and Support',
            href: help(),
        },
    ],
};
