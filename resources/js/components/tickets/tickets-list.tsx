import { Ticket } from '@/pages/tickets';
import { SharedData } from '@/types';
import { getTicketStatusMeta } from '@/utils/statusHelper';
import { truncateText } from '@/utils/textHelper';
import { Link, router, usePage } from '@inertiajs/react';
import { CirclePlus, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

interface TicketsListProps {
    tickets: Ticket[];
    statusCounts: Record<string, number>;
    selectedTicket: Ticket;
}

export default function TicketsList({ tickets, statusCounts, selectedTicket }: TicketsListProps) {
    const { isClientRoute } = usePage<SharedData>().props;

    console.log(isClientRoute);

    const filterBy = new URLSearchParams(window.location.search).get('filterBy');

    const [search, setSearch] = useState('');

    const filteredTickets = tickets.filter((ticket) => {
        const keyword = search.toLowerCase();
        return ticket.ticket_number.toString().includes(keyword) || ticket.title.toLowerCase().includes(keyword);
    });

    return (
        <div className="sticky-0 top-12 flex h-auto flex-col gap-2 overflow-hidden md:sticky md:h-[calc(100vh-6rem)]">
            <div>
                <Button
                    variant={'success'}
                    onClick={() =>
                        router.visit(route('create.ticket'), {
                            preserveScroll: true,
                        })
                    }
                >
                    <CirclePlus />
                    Create Ticket
                </Button>
            </div>

            <div className="text-sm text-gray-500">Filter</div>
            <div className="flex items-center gap-2">
                {statusCounts['open'] > 0 ? (
                    <div className="flex items-center justify-between gap-2 rounded border bg-yellow-400 px-2 py-0.5">
                        <Link
                            href={isClientRoute ? `/tickets?filterBy=open` : `/a/tickets?filterBy=open`}
                            className="text-xs font-semibold text-black"
                            preserveScroll
                        >
                            Open ({statusCounts['open'] ?? 0})
                        </Link>
                        {filterBy === 'open' && (
                            <Link className="cursor-pointer" href={isClientRoute ? `/tickets` : `/a/tickets`}>
                                <X size={16} />
                            </Link>
                        )}
                    </div>
                ) : (
                    <span className="rounded border bg-yellow-400 px-2 py-0.5 text-xs font-semibold text-black">
                        Open ({statusCounts['open'] ?? 0})
                    </span>
                )}

                {statusCounts['on-going'] > 0 ? (
                    <div className="flex items-center justify-between gap-2 rounded border bg-blue-500 px-2 py-0.5">
                        <Link
                            href={isClientRoute ? `/tickets?filterBy=on-going` : `/a/tickets?filterBy=on-going`}
                            className="text-xs font-semibold text-white"
                            preserveScroll
                        >
                            On-Going ({statusCounts['on-going'] ?? 0})
                        </Link>
                        {filterBy === 'on-going' && (
                            <Link className="cursor-pointer" href={isClientRoute ? `/tickets` : `/a/tickets`}>
                                <X size={16} color="white" />
                            </Link>
                        )}
                    </div>
                ) : (
                    <span className="rounded bg-blue-500 px-2 py-0.5 text-xs font-semibold text-white">
                        On-Going ({statusCounts['on-going'] ?? 0})
                    </span>
                )}
            </div>
            <div className="flex items-center gap-2">
                {statusCounts['resolved'] > 0 ? (
                    <div className="flex items-center justify-between gap-2 rounded border bg-green-700 px-2 py-0.5">
                        <Link
                            href={isClientRoute ? `/tickets?filterBy=resolved` : `/a/tickets?filterBy=resolved`}
                            className="text-xs font-semibold text-white"
                            preserveScroll
                        >
                            Resolved ({statusCounts['resolved'] ?? 0})
                        </Link>
                        {filterBy === 'resolved' && (
                            <Link className="cursor-pointer" href={isClientRoute ? `/tickets` : `/a/tickets`}>
                                <X size={16} color="white" />
                            </Link>
                        )}
                    </div>
                ) : (
                    <span className="rounded bg-green-700 px-2 py-0.5 text-xs font-semibold text-white">
                        Resolved ({statusCounts['resolved'] ?? 0})
                    </span>
                )}

                {statusCounts['rejected'] > 0 ? (
                    <div className="flex items-center justify-between gap-2 rounded border bg-red-600 px-2 py-0.5">
                        <Link
                            href={isClientRoute ? `/tickets?filterBy=rejected` : `/a/tickets?filterBy=rejected`}
                            className="text-xs font-semibold text-white"
                            preserveScroll
                        >
                            Rejected ({statusCounts['rejected'] ?? 0})
                        </Link>
                        {filterBy === 'rejected' && (
                            <Link className="cursor-pointer" href={isClientRoute ? `/tickets` : `/a/tickets`}>
                                <X size={16} color="white" />
                            </Link>
                        )}
                    </div>
                ) : (
                    <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
                        Rejected ({statusCounts['rejected'] ?? 0})
                    </span>
                )}
            </div>

            <div className="text-sm text-gray-500">Tickets</div>
            <div className="flex max-h-500 flex-col gap-2 overflow-y-auto rounded-md border border-gray-200 p-2 shadow-sm">
                <div>
                    <input
                        id="search-ticket-input"
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search ticket number or title..."
                        className="w-full border-b p-1 text-xs text-gray-700 focus:border-blue-500 focus:outline-none"
                    />
                </div>

                {filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket, idx) => {
                        const isSelected = selectedTicket?.id === ticket.id;

                        return (
                            <Link
                                key={idx}
                                href={isSelected ? '#' : `?ticket=${ticket.id}`}
                                preserveScroll
                                className={`block cursor-pointer rounded-md transition-all ${
                                    isSelected ? 'bg-[#2A5298] text-white hover:bg-[#3a5d96]' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center justify-between gap-2 px-2 pt-2">
                                        <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                                            TICKET #{ticket.ticket_number}
                                        </span>
                                        <span className={`${getTicketStatusMeta(ticket.status).className} rounded px-1 py-0 text-xs font-semibold`}>
                                            {getTicketStatusMeta(ticket.status).label}
                                        </span>
                                    </div>
                                    <span className={`px-2 text-sm font-bold ${isSelected ? 'text-white' : 'text-[#242424]'}`}>{ticket.title}</span>
                                    <span className={`px-2 text-sm ${isSelected ? 'font-bold text-white' : 'text-[#242424]'}`}>
                                        {truncateText(ticket.details, 50)}
                                    </span>
                                    <span className={`px-2 text-xs ${isSelected ? 'text-white' : 'text-[#242424]'}`}>
                                        {ticket.replies.length} Replies
                                    </span>
                                    <Separator className="bg-gray-400" />
                                    <div className="flex items-center justify-between px-2 pt-1 pb-2">
                                        <span
                                            className={`text-xs font-semibold break-all whitespace-pre-line ${isSelected ? 'text-white' : 'text-gray-600'}`}
                                        >
                                            {ticket.owner?.name} &bull; {ticket.owner?.email}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <div className="py-3 text-center text-xs text-gray-500">😔 No tickets found.</div>
                )}
            </div>
        </div>
    );
}
