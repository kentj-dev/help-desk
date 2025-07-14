import { Reply, Ticket } from '@/pages/tickets';
import { SharedData } from '@/types';
import { formatDateFull } from '@/utils/dateHelper';
import { useForm, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { CornerDownRight, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

interface AddReplyForm {
    ticketId: string;
    replyId: string;
    details: string;
}
interface ChildReplyDetailsProps {
    selectedTicket: Ticket;
    childReply: Reply;
    showReply?: boolean;
}

export default function ChildReplyDetails({ selectedTicket, childReply, showReply = true }: ChildReplyDetailsProps) {
    const { auth } = usePage<SharedData>().props;

    const [isAddingReply, setIsAddingReply] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<Required<AddReplyForm>>({
        ticketId: selectedTicket.id,
        replyId: childReply.id,
        details: '',
    });

    const handleAddReply = () => {
        const promise = new Promise<void>((resolve, reject) => {
            post(route('add.child-reply', [selectedTicket.id, childReply.id]), {
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
        <div className="flex cursor-default items-start gap-2 rounded-md py-0.5 ps-2 hover:bg-gray-100">
            <div className="flex flex-col">
                <CornerDownRight color="#6A7282" size={16} />
            </div>
            <div className="flex w-full flex-col gap-1">
                <div className="flex items-start gap-1 text-sm break-words whitespace-pre-line">
                    <span className="font-medium text-nowrap">{childReply.owner.name}</span>
                    <span className="text-nowrap text-gray-500">says</span>
                    <span className="font-medium">{childReply.details}</span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-400">{formatDateFull(childReply.updated_at)}</div>
                    <div className="flex items-center gap-1.5 pe-2">
                        {showReply && (selectedTicket.status === 'open' || selectedTicket.status === 'on-going') && (
                            <>
                                {auth.user.id === childReply.owner?.id && (
                                    <>
                                        <div className="cursor-pointer text-xs text-gray-500 hover:underline">Edit</div>
                                        <div className="text-xs text-gray-500">&bull;</div>
                                        <div className="cursor-pointer text-xs text-gray-500 hover:underline">Delete</div>
                                        <div className="text-xs text-gray-500">&bull;</div>
                                    </>
                                )}

                                <div
                                    className="cursor-pointer text-xs text-gray-500 hover:underline"
                                    onClick={() => setIsAddingReply(!isAddingReply)}
                                >
                                    {!isAddingReply ? 'Reply' : 'Close Reply'}
                                </div>
                            </>
                        )}
                    </div>
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
                {Array.isArray(childReply.replies) &&
                    childReply.replies.length > 0 &&
                    childReply.replies.map((reply, idx) => (
                        <ChildReplyDetails selectedTicket={selectedTicket} childReply={reply} showReply={false} key={idx} />
                    ))}
            </div>
        </div>
    );
}
