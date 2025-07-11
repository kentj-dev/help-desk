import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppHeaderAdmin } from '@/components/app-header-admin';
import { AppShell } from '@/components/app-shell';
import { type BreadcrumbItem } from '@/types';
import type { PropsWithChildren } from 'react';
import { Toaster } from 'sonner';

export default function AppHeaderLayout({
    children,
    breadcrumbs,
    isClientRoute,
}: PropsWithChildren<{
    breadcrumbs?: BreadcrumbItem[];
    isClientRoute: boolean;
}>) {
    return (
        <AppShell>
            {isClientRoute ? <AppHeader breadcrumbs={breadcrumbs} /> : <AppHeaderAdmin breadcrumbs={breadcrumbs} />}
            <AppContent>{children}</AppContent>
            <footer className="flex flex-col items-center justify-center gap-2 px-5 py-10 text-center text-xs text-gray-500 md:text-sm">
                <div>
                    <span className="font-semibold">Help Desk</span>
                    <span className="mx-1">&bull;</span>
                    Supporting HEIs, students, and clients with efficient inquiry and service management
                </div>
                <div className="mt-1 text-xs text-gray-400">&copy; {new Date().getFullYear()} CHEDRO XII. All rights reserved.</div>
            </footer>
            <Toaster />
        </AppShell>
    );
}
