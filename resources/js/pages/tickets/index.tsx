import TicketsAction from '@/components/tickets/tickets-actions';
import TicketsPreview from '@/components/tickets/tickets-details';
import TicketsList from '@/components/tickets/tickets-list';
import AppLayoutTemplate from '@/layouts/app/app-header-layout';
import { SharedData, User } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { CirclePlus } from 'lucide-react';

export type ModeOfAddresing = {
    id: string;
    sort_order: number;
    mode: string;
};

type ModeOfAddresingTicket = {
    id: string;
    ticket_id: string;
    mode_of_addressing_id: string;
};

type AssignedToTicket = {
    id: string;
    assigned_to_id: string;
    assigned_by_id: string;
};

export type Reply = {
    id: string;
    details: string;
    owner: User;

    replies: Reply[];
    reply_id: string | null;

    created_at: string;
    updated_at: string;
};

export type Ticket = {
    id: string;
    ticket_number: string;
    status: 'open' | 'on-going' | 'resolved' | 'rejected';
    client_type: string;
    title: string;
    details: string;

    ticket_owner_id: string | null;
    owner: User | null;

    ticket_in_charge_id: string | null;
    in_charge: User | null;

    mode_of_addressings: ModeOfAddresingTicket[];
    assigned_tos: AssignedToTicket[];
    replies: Reply[];

    date_received_by_incharge: string;
    created_at: string;
    updated_at: string;
};
  
interface TicketsProps {
    tickets: Ticket[];
    selectedTicket: Ticket;
    modeOfAddressings: ModeOfAddresing[];
    statusCounts: Record<string, number>;
    users: User[];
}

export default function Tickets({ tickets, selectedTicket, modeOfAddressings, statusCounts, users }: TicketsProps) {
    const { isClientRoute, auth } = usePage<SharedData>().props;

    const isAdmin = auth.is_admin;

    return (
        <>
            <AppLayoutTemplate isClientRoute={isClientRoute}>
                <Head title="Tickets" />
                <div className="px-4 py-6">
                    {tickets.length > 0 ? (
                        <div className={`grid grid-cols-1 ${isAdmin ? 'md:grid-cols-[1fr_750px_0.5fr]' : 'md:grid-cols-[1fr_900px]'} gap-4`}>
                            {/* first column */}
                            <TicketsList tickets={tickets} statusCounts={statusCounts} selectedTicket={selectedTicket} />
                            {/* end of firt column */}

                            {selectedTicket ? (
                                <>
                                    {/* second column */}
                                    <TicketsPreview selectedTicket={selectedTicket} />
                                    {/* end of second column */}

                                    {/* third column */}
                                    {isAdmin && <TicketsAction selectedTicket={selectedTicket} modeOfAddressings={modeOfAddressings} users={users} />}
                                    {/* end of third column */}
                                </>
                            ) : (
                                <div className="mx-auto flex w-[50%] py-50 text-center text-sm font-medium text-gray-500">
                                    📩 Select a ticket on the left to view its details here. We're excited to help you out! 💬
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
                            <div className="mb-2 text-4xl">📭</div>
                            <div className="text-sm font-medium md:text-base">No tickets yet in the system.</div>
                            <div className="mt-1 text-xs text-gray-400">All caught up for now — new tickets will appear here.</div>

                            <button
                                onClick={() =>
                                    router.visit(route('create.ticket'), {
                                        preserveScroll: true,
                                    })
                                }
                                className="mt-4 flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-blue-700"
                            >
                                <CirclePlus size={16} /> Create Ticket
                            </button>
                        </div>
                    )}
                </div>
            </AppLayoutTemplate>
        </>
    );
}
