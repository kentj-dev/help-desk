import { Ticket } from '@/pages/tickets';
import { getTicketStatusMeta } from '@/utils/statusHelper';
import { truncateText } from '@/utils/textHelper';
import { Link } from '@inertiajs/react';
import { X } from 'lucide-react';
import { Separator } from '../ui/separator';

interface TicketsListProps {
    tickets: Ticket[];
    statusCounts: Record<string, number>;
    selectedTicket: Ticket;
}

export default function TicketsList({ tickets, statusCounts, selectedTicket }: TicketsListProps) {
    const filterBy = new URLSearchParams(window.location.search).get('filterBy');

    return (
        <div className="flex w-80 flex-col gap-2">
            <div className="text-sm text-gray-500">Filter</div>
            <div className="flex items-center gap-2">
                {statusCounts['open'] > 0 ? (
                    <div className="flex items-center justify-between gap-2 rounded border bg-yellow-400 px-2 py-0.5">
                        <Link href={`/?filterBy=open`} className="text-xs font-semibold text-black" preserveScroll>
                            Open ({statusCounts['open'] ?? 0})
                        </Link>
                        {filterBy === 'open' && (
                            <Link className="cursor-pointer" href={`/`}>
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
                        <Link href={`/?filterBy=on-going`} className="text-xs font-semibold text-white" preserveScroll>
                            On-Going ({statusCounts['on-going'] ?? 0})
                        </Link>
                        {filterBy === 'on-going' && (
                            <Link className="cursor-pointer" href={`/`}>
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
                        <Link href={`/?filterBy=resolved`} className="text-xs font-semibold text-white" preserveScroll>
                            Resolved ({statusCounts['resolved'] ?? 0})
                        </Link>
                        {filterBy === 'resolved' && (
                            <Link className="cursor-pointer" href={`/`}>
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
                        <Link href={`/?filterBy=rejected`} className="text-xs font-semibold text-white" preserveScroll>
                            Rejected ({statusCounts['rejected'] ?? 0})
                        </Link>
                        {filterBy === 'rejected' && (
                            <Link className="cursor-pointer" href={`/`}>
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
            <div className="flex max-h-500 flex-col gap-2 overflow-auto rounded-md border border-gray-200 p-2 shadow-sm">
                {tickets.map((ticket, idx) => {
                    const isSelected = selectedTicket?.id === ticket.id;

                    return (
                        <Link
                            key={idx}
                            href={`?ticketId=${ticket.id}`}
                            preserveScroll
                            className={`block cursor-pointer rounded-md transition-all ${
                                isSelected ? 'bg-[#2A5298] text-white hover:bg-[#19335e]' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
                                <span className={`px-2 text-sm font-bold ${isSelected ? 'text-white' : 'text-[#242424]'}`}>
                                    {truncateText(ticket.title, 15)}
                                </span>
                                <span className={`px-2 text-sm ${isSelected ? 'font-bold text-white' : 'text-[#242424]'}`}>
                                    {truncateText(ticket.details, 100)}
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
                })}
            </div>
        </div>
    );
}
