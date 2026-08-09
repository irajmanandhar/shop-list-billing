import { usePage } from '@inertiajs/react';

import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const { name } = usePage().props;

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm shadow-emerald-500/30">
                <AppLogoIcon className="size-4.5 fill-white" />
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-bold">
                    {name}
                </span>
                <span className="text-[11px] leading-tight font-medium text-muted-foreground">
                    Point of Sale
                </span>
            </div>
        </>
    );
}
