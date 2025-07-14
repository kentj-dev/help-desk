import Heading from '@/components/heading';
import AppLayoutTemplate from '@/layouts/app/app-header-layout';
import { SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
export default function Welcome() {
    const { isClientRoute } = usePage<SharedData>().props;

    return (
        <>
            <AppLayoutTemplate isClientRoute={isClientRoute}>
                <Head title="Home" />
                <div className="px-4 py-6">
                    <Heading title={`Welcome to CHEDRO XII's Help Desk`} description={'Visit Tickets tab to get started'} />
                </div>
            </AppLayoutTemplate>
        </>
    );
}
