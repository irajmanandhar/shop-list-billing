import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BarChart3,
    CheckCircle2,
    LayoutGrid,
    Layers,
    ShoppingBag,
    Zap,
} from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { dashboard, login, register } from '@/routes';

const features = [
    {
        icon: Zap,
        title: 'Instant checkout',
        text: 'Ring up sales in two taps with a cart that just works.',
    },
    {
        icon: Layers,
        title: 'Smart categories',
        text: 'Organise your catalog and filter products in seconds.',
    },
    {
        icon: BarChart3,
        title: 'Live insights',
        text: 'Revenue, best sellers and stock alerts — updated in real time.',
    },
];

const mockStats = [
    { label: "Today's revenue", value: '$1,284', tone: 'text-emerald-600' },
    { label: 'Orders', value: '42', tone: 'text-teal-600' },
    { label: 'Low stock', value: '5', tone: 'text-amber-600' },
];

const mockBars = [35, 55, 40, 75, 60, 90, 45];

const mockProducts = [
    {
        name: 'Espresso Roast',
        price: '$12.00',
        swatch: 'from-amber-400 to-orange-500',
    },
    {
        name: 'Matcha Latte',
        price: '$6.50',
        swatch: 'from-emerald-400 to-teal-500',
    },
    {
        name: 'Chocolate Bar',
        price: '$3.25',
        swatch: 'from-stone-400 to-stone-600',
    },
];

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="PulsePOS — Point of Sale, simplified" />
            <div className="flex min-h-svh flex-col bg-background">
                <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur-md">
                    <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm shadow-emerald-500/30">
                                <AppLogoIcon className="size-4.5 fill-white" />
                            </div>
                            <div className="text-sm leading-tight">
                                <span className="block font-bold">
                                    PulsePOS
                                </span>
                                <span className="text-[11px] font-medium text-muted-foreground">
                                    Point of Sale
                                </span>
                            </div>
                        </Link>
                        <nav className="flex items-center gap-2">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm shadow-emerald-600/30 transition-colors hover:bg-emerald-700"
                                >
                                    <LayoutGrid className="size-4" />
                                    Go to dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="inline-flex h-9 items-center rounded-lg px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm shadow-emerald-600/30 transition-colors hover:bg-emerald-700"
                                    >
                                        Get started
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <main className="flex-1">
                    {/* Hero */}
                    <section className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-dots opacity-40 dark:opacity-15" />
                        <div className="absolute -top-40 right-0 size-96 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-500/10" />
                        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 pt-16 pb-20 md:pt-24 lg:grid-cols-2">
                            <div>
                                <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm dark:text-emerald-400">
                                    <CheckCircle2 className="size-3.5" />
                                    Trusted by local shops everywhere
                                </span>
                                <h1 className="mt-4 text-4xl leading-tight font-extrabold tracking-tight md:text-5xl">
                                    The point of sale your
                                    <span className="text-gradient">
                                        {' '}
                                        store deserves.
                                    </span>
                                </h1>
                                <p className="mt-4 max-w-lg text-base text-muted-foreground md:text-lg">
                                    Ring up sales, manage your catalog and
                                    understand your business — all from one
                                    fast, beautiful dashboard.
                                </p>
                                <div className="mt-8 flex flex-wrap gap-3">
                                    {auth.user ? (
                                        <Link
                                            href={dashboard()}
                                            className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-bold text-white shadow-md shadow-emerald-600/30 transition-all hover:bg-emerald-700"
                                        >
                                            Open the register
                                            <ArrowRight className="size-4" />
                                        </Link>
                                    ) : (
                                        <Link
                                            href={register()}
                                            className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-bold text-white shadow-md shadow-emerald-600/30 transition-all hover:bg-emerald-700"
                                        >
                                            Start selling free
                                            <ArrowRight className="size-4" />
                                        </Link>
                                    )}
                                    {!auth.user && (
                                        <Link
                                            href={login()}
                                            className="inline-flex h-11 items-center rounded-xl border bg-card px-6 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                                        >
                                            Log in
                                        </Link>
                                    )}
                                </div>
                                <div className="mt-10 flex items-center gap-8 border-t pt-6">
                                    {chartStats().map((stat) => (
                                        <div key={stat.label}>
                                            <p className="text-2xl font-extrabold">
                                                {stat.value}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {stat.label}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Product preview */}
                            <div className="relative">
                                <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-transparent blur-2xl" />
                                <div className="relative rounded-2xl border bg-card shadow-xl shadow-emerald-900/5">
                                    <div className="flex items-center gap-2 border-b px-4 py-3">
                                        <span className="size-2.5 rounded-full bg-red-400" />
                                        <span className="size-2.5 rounded-full bg-amber-400" />
                                        <span className="size-2.5 rounded-full bg-emerald-400" />
                                        <span className="ml-3 flex-1 rounded-md bg-muted px-3 py-1 text-[11px] text-muted-foreground">
                                            pulsepos.test/dashboard
                                        </span>
                                    </div>
                                    <div className="p-5">
                                        <p className="text-sm font-bold">
                                            Good morning, Owner
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Here's your store at a glance.
                                        </p>
                                        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                            {mockStats.map((stat) => (
                                                <div
                                                    key={stat.label}
                                                    className="rounded-xl border p-3"
                                                >
                                                    <p className="text-xs text-muted-foreground">
                                                        {stat.label}
                                                    </p>
                                                    <p
                                                        className={`mt-1 text-lg font-extrabold ${stat.tone}`}
                                                    >
                                                        {stat.value}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 flex h-28 items-end gap-2">
                                            {mockBars.map((height, index) => (
                                                <div
                                                    key={index}
                                                    className="flex-1 rounded-t-md bg-gradient-to-t from-emerald-600 to-teal-400 opacity-90"
                                                    style={{
                                                        height: `${height}%`,
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <div className="mt-4 space-y-2">
                                            {mockProducts.map(
                                                (product, index) => (
                                                    <div
                                                        key={product.name}
                                                        className={`flex items-center gap-3 rounded-xl border p-2.5 ${
                                                            index === 0
                                                                ? 'ring-2 ring-emerald-500/30'
                                                                : ''
                                                        }`}
                                                    >
                                                        <div
                                                            className={`size-9 shrink-0 rounded-lg bg-gradient-to-br ${product.swatch}`}
                                                        />
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-xs font-semibold">
                                                                {product.name}
                                                            </p>
                                                            <p className="text-[11px] text-muted-foreground">
                                                                Stock: 24
                                                            </p>
                                                        </div>
                                                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                                            {product.price}
                                                        </p>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Features */}
                    <section className="border-t bg-muted/40">
                        <div className="mx-auto w-full max-w-6xl px-4 py-16">
                            <div className="text-center">
                                <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">
                                    Everything a modern store needs
                                </h2>
                                <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground md:text-base">
                                    Built for speed, polished for everyday use.
                                </p>
                            </div>
                            <div className="mt-10 grid gap-4 md:grid-cols-3">
                                {features.map((feature) => (
                                    <div
                                        key={feature.title}
                                        className="rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                                    >
                                        <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                                            <feature.icon className="size-5" />
                                        </div>
                                        <h3 className="mt-4 font-bold">
                                            {feature.title}
                                        </h3>
                                        <p className="mt-1.5 text-sm text-muted-foreground">
                                            {feature.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="mx-auto w-full max-w-6xl px-4 py-16">
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 p-10 text-center text-white shadow-lg shadow-emerald-600/25 md:p-14">
                            <div className="absolute inset-0 bg-dots" />
                            <div className="relative">
                                <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">
                                    Ready to open the register?
                                </h2>
                                <p className="mx-auto mt-2 max-w-md text-sm text-emerald-50/90">
                                    Set up your store in minutes — no card, no
                                    complicated onboarding.
                                </p>
                                <div className="mt-6 flex justify-center gap-3">
                                    {auth.user ? (
                                        <Link
                                            href={dashboard()}
                                            className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-emerald-700 shadow-md transition-colors hover:bg-emerald-50"
                                        >
                                            Go to dashboard
                                            <ArrowRight className="size-4" />
                                        </Link>
                                    ) : (
                                        <Link
                                            href={register()}
                                            className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-emerald-700 shadow-md transition-colors hover:bg-emerald-50"
                                        >
                                            <ShoppingBag className="size-4" />
                                            Create your account
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="border-t">
                    <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-muted-foreground sm:flex-row">
                        <div className="flex items-center gap-2">
                            <div className="flex aspect-square size-6 items-center justify-center rounded-md bg-gradient-to-br from-emerald-500 to-teal-600">
                                <AppLogoIcon className="size-3 fill-white" />
                            </div>
                            <span className="font-semibold text-foreground">
                                PulsePOS
                            </span>
                            <span className="hidden sm:inline">
                                · Point of Sale
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/products"
                                className="transition-colors hover:text-foreground"
                            >
                                Products
                            </Link>
                            <Link
                                href="/categories"
                                className="transition-colors hover:text-foreground"
                            >
                                Categories
                            </Link>
                            <Link
                                href={auth.user ? dashboard() : login()}
                                className="transition-colors hover:text-foreground"
                            >
                                {auth.user ? 'Dashboard' : 'Log in'}
                            </Link>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

function chartStats() {
    return [
        { value: '2.5×', label: 'faster checkout' },
        { value: '5k+', label: 'sales processed' },
        { value: '99.9%', label: 'uptime' },
    ];
}
