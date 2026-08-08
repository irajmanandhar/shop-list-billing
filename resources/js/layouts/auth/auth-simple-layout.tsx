import { Link, usePage } from '@inertiajs/react';
import { BarChart3, ScanLine, Zap } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

const features = [
    {
        icon: Zap,
        title: 'Instant checkout',
        text: 'Ring up a sale in two taps, no training needed.',
    },
    {
        icon: ScanLine,
        title: 'Smart catalog',
        text: 'Search and filter products by name or category.',
    },
    {
        icon: BarChart3,
        title: 'Live insights',
        text: 'Revenue, best sellers and stock alerts in real time.',
    },
];

const stats = [
    { value: '2.5×', label: 'faster checkout' },
    { value: '99.9%', label: 'uptime' },
    { value: '∞', label: 'products & categories' },
];

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            {/* Brand panel */}
            <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 p-10 text-white lg:flex">
                <div className="absolute inset-0 bg-dots" />
                <div className="absolute -top-24 -right-24 size-80 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-32 -left-16 size-96 rounded-full bg-teal-400/20 blur-3xl" />

                <Link
                    href={home()}
                    className="relative z-10 flex w-fit items-center gap-3"
                >
                    <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-white/15 shadow-sm backdrop-blur-sm">
                        <AppLogoIcon className="size-4.5 fill-white" />
                    </div>
                    <div className="grid text-sm">
                        <span className="leading-tight font-bold">{name}</span>
                        <span className="text-[11px] leading-tight font-medium text-emerald-100/80">
                            Point of Sale
                        </span>
                    </div>
                </Link>

                <div className="relative max-w-md">
                    <h2 className="text-3xl leading-tight font-extrabold tracking-tight">
                        Run your store like it's
                        <span className="text-emerald-200"> on autopilot.</span>
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-emerald-50/90">
                        Everything you need to sell, track inventory and
                        understand your business — in one place.
                    </p>
                    <ul className="mt-8 space-y-5">
                        {features.map((feature) => (
                            <li key={feature.title} className="flex gap-3">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                                    <feature.icon className="size-4.5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">
                                        {feature.title}
                                    </p>
                                    <p className="text-sm text-emerald-50/85">
                                        {feature.text}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="relative flex gap-6">
                    {stats.map((stat) => (
                        <div key={stat.label}>
                            <p className="text-2xl font-extrabold">
                                {stat.value}
                            </p>
                            <p className="text-xs text-emerald-100/80">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Form panel */}
            <div className="flex items-center justify-center bg-background p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <div className="flex flex-col gap-7">
                        <Link
                            href={home()}
                            className="flex w-fit items-center gap-2.5 self-center"
                        >
                            <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm shadow-emerald-500/30">
                                <AppLogoIcon className="size-4.5 fill-white" />
                            </div>
                            <div className="text-sm leading-tight">
                                <span className="block font-bold">{name}</span>
                                <span className="text-[11px] leading-tight font-medium text-muted-foreground">
                                    Point of Sale
                                </span>
                            </div>
                        </Link>

                        <div className="space-y-1.5 text-center">
                            <h1 className="text-2xl font-extrabold tracking-tight">
                                {title}
                            </h1>
                            <p className="text-sm text-balance text-muted-foreground">
                                {description}
                            </p>
                        </div>

                        <div className="rounded-2xl border bg-card p-6 shadow-sm md:p-7">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
