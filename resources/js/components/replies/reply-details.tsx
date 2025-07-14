import { useInitials } from '@/hooks/use-initials';
import { Reply, Ticket } from '@/pages/tickets';
import { SharedData } from '@/types';
import { formatDateFull } from '@/utils/dateHelper';
import { useForm, usePage } from '@inertiajs/react';
import DOMPurify from 'dompurify';
import { AnimatePresence, motion } from 'framer-motion';
import { CornerDownRight, LockKeyhole, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';
import ChildReplyDetails from './child-reply-details';

interface AddReplyForm {
    ticketId: string;
    replyId: string;
    details: string;
}

interface ReplyDetailsProps {
    selectedTicket: Ticket;
    reply: Reply;
}

export default function ReplyDetails({ selectedTicket, reply }: ReplyDetailsProps) {
    const { auth } = usePage<SharedData>().props;

    const getInitials = useInitials();

    const [isAddingReply, setIsAddingReply] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<Required<AddReplyForm>>({
        ticketId: selectedTicket.id,
        replyId: reply.id,
        details: '',
    });

    const handleAddReply = () => {
        const promise = new Promise<void>((resolve, reject) => {
            post(route('add.child-reply', [selectedTicket.id, reply.id]), {
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
            setData('details', '');
        });
    };

    return (
        <div className="rounded-md border border-gray-200 p-3 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex min-w-0 flex-1 flex-col gap-2 break-words whitespace-pre-line">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-0">
                            <div className="mt-1 flex items-center gap-2">
                                <Avatar className="h-8 w-8 overflow-hidden rounded-md border">
                                    {reply.owner?.avatar && <AvatarImage src={`/storage/${reply.owner?.avatar}`} alt={reply.owner?.name} />}
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
                    </div>
                    <Separator className="bg-gray-300" />
                    <div className="rendered-content overflow-hidden break-words whitespace-pre-line">
                        <span
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(reply.details),
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="mt-2 flex flex-col gap-2">
                <Separator className="bg-gray-300" />
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 px-1 text-xs font-medium text-gray-500">
                        {selectedTicket.status === 'open' || selectedTicket.status === 'on-going' ? (
                            <>
                                {auth.user.id === reply.owner?.id && (
                                    <>
                                        <div className="cursor-pointer hover:underline">Edit</div>
                                        <div>&bull;</div>
                                        <div className="cursor-pointer hover:underline">Delete</div>
                                        <div>&bull;</div>
                                    </>
                                )}

                                <div className="cursor-pointer hover:underline" onClick={() => setIsAddingReply(!isAddingReply)}>
                                    {!isAddingReply ? 'Reply' : 'Close Reply'}
                                </div>
                            </>
                        ) : (
                            <span className="flex items-center gap-1.5 text-xs text-gray-500">
                                <LockKeyhole size={16} />
                            </span>
                        )}
                    </div>
                    <span className="text-xs font-medium text-gray-500">{formatDateFull(reply.updated_at)}</span>
                </div>
                <AnimatePresence>
                    {isAddingReply && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="flex items-start gap-2 overflow-hidden"
                        >
                            <div className="flex flex-col">
                                <CornerDownRight color="#6A7282" size={16} />
                            </div>
                            <div className="flex w-full flex-col gap-2">
                                <Textarea
                                    placeholder="Write something..."
                                    className="min-h-1 resize-none text-xs focus-visible:border-blue-500 focus-visible:ring-0"
                                    onChange={(e) => setData('details', e.target.value)}
                                />
                                <div className="flex items-start justify-between">
                                    <div>
                                        <span className="text-xs text-gray-500">{data.details.length} characters</span>
                                    </div>
                                    <Button
                                        variant={'success'}
                                        size={'sm'}
                                        onClick={handleAddReply}
                                        disabled={data.details.length === 0 || processing}
                                    >
                                        <Send />
                                        Submit Reply
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                {reply.replies.length > 0 && (
                    <>
                        <Separator className="bg-gray-300" />
                        {reply.replies.map((childReply, idx) => (
                            <div key={idx} className="flex flex-col gap-2">
                                <ChildReplyDetails selectedTicket={selectedTicket} childReply={childReply} key={idx} />
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}
