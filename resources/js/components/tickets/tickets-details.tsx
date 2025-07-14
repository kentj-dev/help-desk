import { useInitials } from '@/hooks/use-initials';
import { Ticket } from '@/pages/tickets';
import { SharedData } from '@/types';
import { formatDateFull } from '@/utils/dateHelper';
import { getTicketStatusMeta } from '@/utils/statusHelper';
import { usePage } from '@inertiajs/react';
import DOMPurify from 'dompurify';
import { LockKeyhole } from 'lucide-react';
import { useRef } from 'react';
import NewReply from '../replies/new-reply';
import ReplyDetails from '../replies/reply-details';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';

interface TicketsPreviewProps {
    selectedTicket: Ticket;
}

export default function TicketsPreview({ selectedTicket }: TicketsPreviewProps) {
    const { auth } = usePage<SharedData>().props;

    const getInitials = useInitials();

    const statusMeta = selectedTicket ? getTicketStatusMeta(selectedTicket.status) : null;

    const replyRef = useRef<HTMLDivElement | null>(null);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">Ticket #{selectedTicket.ticket_number}</div>
                {statusMeta && (
                    <span className={`rounded-md px-2 py-1 text-xs font-semibold uppercase ${statusMeta.className}`}>{statusMeta.label}</span>
                )}
            </div>
            <div className="flex min-h-100 flex-col justify-between rounded-md border border-gray-200 p-3 shadow-sm">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-3">
                            <div className="mt-1 flex items-center gap-2">
                                <Avatar className="h-8 w-8 overflow-hidden rounded-md border">
                                    {selectedTicket.owner?.avatar && (
                                        <AvatarImage src={`/storage/${selectedTicket.owner?.avatar}`} alt={selectedTicket.owner?.name} />
                                    )}
                                    <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                        {getInitials(selectedTicket.owner?.name ?? '')}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-xs font-semibold text-gray-700">{selectedTicket.owner?.name}</span>
                                    <span className="text-xs font-semibold text-gray-500">{selectedTicket.owner?.email}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="font-bold">{selectedTicket.title}</span>
                            </div>
                        </div>
                    </div>
                    <Separator className="bg-gray-300" />
                    <div className="rendered-content">
                        <span
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(selectedTicket.details),
                            }}
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    {/* <div className="flex items-center gap-2">
                        <span className="text-blue-500 text-xs font-medium cursor-pointer hover:underline">
                        Attachment 1,
                        </span>
                        <span className="text-blue-500 text-xs font-medium cursor-pointer hover:underline">
                        Attachment 2
                        </span>
                    </div> */}
                    <Separator className="bg-gray-300" />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 px-1 text-xs font-medium text-gray-500">
                            {selectedTicket.status === 'open' || selectedTicket.status === 'on-going' ? (
                                <>
                                    {auth.user.id === selectedTicket.owner?.id && (
                                        <>
                                            <div className="cursor-pointer hover:underline">Edit</div>
                                            <div>&bull;</div>
                                        </>
                                    )}

                                    <div
                                        className="cursor-pointer hover:underline"
                                        onClick={() => {
                                            replyRef.current?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                    >
                                        Reply
                                    </div>
                                </>
                            ) : (
                                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <LockKeyhole size={16} /> Locked
                                </span>
                            )}
                        </div>
                        <span className="text-xs font-medium text-gray-500">{formatDateFull(selectedTicket.updated_at)}</span>
                    </div>
                </div>
            </div>

            {selectedTicket.replies.length > 0 && (
                <>
                    <div className="flex items-center gap-2">
                        <div className="text-sm text-gray-500">Replies</div>
                        <div className="text-xs font-medium text-gray-500">({selectedTicket.replies.length})</div>
                    </div>
                    {selectedTicket.replies
                        .filter((reply) => reply.reply_id === null)
                        .map((reply, idx) => (
                            <ReplyDetails key={idx} selectedTicket={selectedTicket} reply={reply} />
                        ))}
                </>
            )}

            {(selectedTicket.status === 'open' || selectedTicket.status === 'on-going') && (
                <>
                    <div className="text-sm text-gray-500">New Reply</div>
                    <NewReply replyRef={replyRef} selectedTicket={selectedTicket} />
                </>
            )}
        </div>
    );
}
