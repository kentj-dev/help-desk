import { useInitials } from '@/hooks/use-initials';
import { Ticket } from '@/pages/tickets';
import { formatDateFull } from '@/utils/dateHelper';
import { getTicketStatusMeta } from '@/utils/statusHelper';
import { router } from '@inertiajs/react';
import DOMPurify from 'dompurify';
import { Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';

interface TicketsPreviewProps {
    selectedTicket: Ticket;
}

export default function TicketsPreview({ selectedTicket }: TicketsPreviewProps) {
    const getInitials = useInitials();

    const statusMeta = selectedTicket ? getTicketStatusMeta(selectedTicket.status) : null;

    const [replyDetails, setReplyDetails] = useState('');
    const [isAddingReply, setIsAddingReply] = useState(false);

    const handleAddReply = () => {
        setIsAddingReply(true);
        const payload = {
            ticketId: selectedTicket?.id ?? '',
            details: replyDetails,
        };

        const promise = new Promise<void>((resolve, reject) => {
            router.post(route('add.reply'), payload, {
                preserveScroll: true,
                onSuccess: () => resolve(),
                onError: () => reject(),
            });
        });

        toast.promise(promise, {
            loading: 'Adding reply...',
            success: 'Reply added!',
            error: 'Failed to add reply!',
            duration: 5000,
        });

        promise.finally(() => {
            setIsAddingReply(false);
            setReplyDetails('');
        });
    };

    return (
        <div className="flex flex-1 flex-col gap-2">
            <div className="text-sm text-gray-500">Details</div>
            <div className="flex min-h-100 flex-col justify-between rounded-md border border-gray-200 p-3 shadow-sm">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-0">
                            {statusMeta && (
                                <div className="flex items-center gap-2">
                                    <span className="font-bold">{selectedTicket.title}</span>
                                    <span className={`rounded px-2 py-1 text-xs font-semibold ${statusMeta.className}`}>{statusMeta.label}</span>
                                </div>
                            )}

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
                        </div>
                        <span className="text-xs font-semibold text-gray-500">{formatDateFull(selectedTicket.created_at)}</span>
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
                            <div className="cursor-pointer hover:underline">Edit</div>
                            <div>&bull;</div>
                            <div className="cursor-pointer hover:underline">Delete</div>
                            {(selectedTicket.status === 'open' || selectedTicket.status === 'on-going') && (
                                <>
                                    <div>&bull;</div>
                                    <div className="cursor-pointer hover:underline">Reply</div>
                                </>
                            )}
                        </div>
                        <div className="px-1 text-xs font-medium text-gray-500">{selectedTicket.ticket_number}</div>
                    </div>
                </div>
            </div>

            {selectedTicket.replies.length > 0 && (
                <>
                    <div className="text-sm text-gray-500">Replies</div>

                    {selectedTicket.replies.map((reply, idx) => (
                        <div key={idx} className="rounded-md border border-gray-200 p-3 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-1 flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col gap-0">
                                            <div className="mt-1 flex items-center gap-2">
                                                <Avatar className="h-8 w-8 overflow-hidden rounded-md border">
                                                    {reply.owner?.avatar && (
                                                        <AvatarImage src={`/storage/${reply.owner?.avatar}`} alt={reply.owner?.name} />
                                                    )}
                                                    <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                        {getInitials(reply.owner?.name ?? '')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-semibold text-gray-700">{reply.owner?.name}</span>
                                                    <span className="text-xs font-semibold text-gray-500">{reply.owner?.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs font-semibold text-gray-500">{formatDateFull(reply.created_at)}</span>
                                    </div>
                                    <Separator className="bg-gray-300" />
                                    <span>{reply.details}</span>
                                </div>
                            </div>
                            <div className="mt-2 flex flex-col gap-2">
                                <Separator className="bg-gray-300" />
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 px-1 text-xs font-medium text-gray-500">
                                        <div className="cursor-pointer hover:underline">Edit</div>
                                        <div>&bull;</div>
                                        <div className="cursor-pointer hover:underline">Delete</div>
                                        {(selectedTicket.status === 'open' || selectedTicket.status === 'on-going') && (
                                            <>
                                                <div>&bull;</div>
                                                <div className="cursor-pointer hover:underline">Reply</div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </>
            )}

            {(selectedTicket.status === 'open' || selectedTicket.status === 'on-going') && (
                <>
                    <div className="text-sm text-gray-500">New Reply</div>
                    <div className="flex flex-col gap-2 rounded-md border border-gray-200 p-3 shadow-sm">
                        <Textarea value={replyDetails} onChange={(e) => setReplyDetails(e.target.value)}></Textarea>
                        <div className="flex justify-end">
                            <Button variant={'success'} size={'sm'} onClick={handleAddReply} disabled={isAddingReply}>
                                <Send />
                                Submit Reply
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
