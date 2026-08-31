import { Head, Link } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { faqs as faqsRoute, help, shop } from '@/routes';
import { edit as editProfile } from '@/routes/profile';

type FaqItem = {
    question: string;
    answer: ReactNode;
};

const faqItems: FaqItem[] = [
    {
        question: 'How do I place an order?',
        answer: (
            <>
                Sign in, browse the{' '}
                <Link
                    href={shop()}
                    className="font-medium text-foreground underline underline-offset-4"
                >
                    shop
                </Link>
                , add the breads and specialties you want, and check out. We
                prepare each order for pickup at the bakery.
            </>
        ),
    },
    {
        question: 'How does pickup work?',
        answer: (
            <>
                After you place an order it stays pending while we bake and pack
                it. When it is ready for pickup, collect it at 123 Main St
                during office hours and bring your order confirmation. Staff
                will mark the order completed when you collect it.
            </>
        ),
    },
    {
        question: 'What currency are prices in?',
        answer: (
            <>
                All prices are in Nigerian Naira (₦). The amount you see at
                checkout is what you pay.
            </>
        ),
    },
    {
        question: 'How can I check the status of my order?',
        answer: (
            <>
                Open My Orders from the dashboard sidebar. Orders are pending
                while we prepare them, ready for pickup when you can collect
                them, completed after pickup, or cancelled if we cannot fulfil
                them.
            </>
        ),
    },
    {
        question: 'Can I order for my business?',
        answer: (
            <>
                Yes. Customer accounts can register a business. New
                registrations are reviewed by the bakery team. Once a business
                is approved, you can place orders against it. Pending businesses
                cannot be used until they are approved.
            </>
        ),
    },
    {
        question: 'How do I update my profile or password?',
        answer: (
            <>
                Open your account menu and go to{' '}
                <Link
                    href={editProfile()}
                    className="font-medium text-foreground underline underline-offset-4"
                >
                    Settings
                </Link>
                . You can update your name and email, change your password, and
                manage two-factor authentication or passkeys.
            </>
        ),
    },
    {
        question: 'What are your office hours?',
        answer: (
            <>
                Monday to Friday 8:00 AM – 5:00 PM, Saturday 10:00 AM – 3:00 PM.
                We are closed on Sunday. Pickup is during these hours only.
            </>
        ),
    },
    {
        question: 'Do you deliver?',
        answer: (
            <>
                Orders are for bakery pickup. We do not offer delivery at this
                time. If you cannot collect an order, contact us as soon as
                possible so we can help.
            </>
        ),
    },
    {
        question: 'What if my order is cancelled?',
        answer: (
            <>
                A cancelled order will not be prepared or held for pickup. If
                you think this was a mistake, or you need to place the order
                again, contact Help and Support with your order number.
            </>
        ),
    },
    {
        question: 'Who do I contact if I still need help?',
        answer: (
            <>
                Use the{' '}
                <Link
                    href={help()}
                    className="font-medium text-foreground underline underline-offset-4"
                >
                    Help and Support
                </Link>{' '}
                page for email, phone, and bakery hours. Include your name,
                account email, and order number when you write.
            </>
        ),
    },
];

export default function Faqs() {
    return (
        <>
            <Head title="FAQs" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <Heading
                    title="Frequently asked questions"
                    description="Quick answers about ordering, pickup, businesses, and your account."
                />

                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    {faqItems.map((item) => (
                        <details
                            key={item.question}
                            className="group border-b border-sidebar-border/70 px-4 py-4 last:border-b-0 dark:border-sidebar-border"
                        >
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium marker:content-none [&::-webkit-details-marker]:hidden">
                                {item.question}
                                <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                            </summary>
                            <div className="mt-2 pr-8 text-sm leading-relaxed text-muted-foreground">
                                {item.answer}
                            </div>
                        </details>
                    ))}
                </div>

                <div>
                    <Button asChild variant="outline">
                        <Link href={help()} prefetch>
                            Still need help? Contact support
                        </Link>
                    </Button>
                </div>
            </div>
        </>
    );
}

Faqs.layout = {
    breadcrumbs: [
        {
            title: 'FAQs',
            href: faqsRoute(),
        },
    ],
};
