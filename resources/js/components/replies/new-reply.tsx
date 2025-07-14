import { Ticket } from '@/pages/tickets';
import { router } from '@inertiajs/react';
import TextAlign from '@tiptap/extension-text-align';
import { CharacterCount } from '@tiptap/extensions';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { TiptapToolbar } from '../helpers/TiptapToolbar';
import { Button } from '../ui/button';

interface NewReplyProps {
    selectedTicket: Ticket;
    replyRef: React.RefObject<HTMLDivElement | null>;
}

export default function NewReply({ selectedTicket, replyRef }: NewReplyProps) {
    const [replyDetails, setReplyDetails] = useState('');
    const [isAddingReply, setIsAddingReply] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: { keepMarks: true, keepAttributes: false },
                orderedList: { keepMarks: true, keepAttributes: false },
            }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            CharacterCount,
        ],
        content: '',
        onUpdate({ editor }) {
            setReplyDetails(editor.getHTML());
        },
    });

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
            editor?.commands.clearContent();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };

    return (
        <div ref={replyRef} className="flex flex-col gap-2 rounded-md border border-gray-200 p-3 shadow-sm">
            <div className="cursor-text rounded-md border p-2" onClick={() => editor?.commands.focus()}>
                <TiptapToolbar editor={editor} />
                <EditorContent editor={editor} className="prose min-h-[150px] max-w-none border-t p-2" />
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {/* <RadialProgress percentage={percentage} bgColor="#f3f4f6" progressColor="#3b82f6" /> */}
                    <div className="flex flex-col gap-0">
                        <span className="text-xs text-gray-500">{editor.storage.characterCount.characters()} characters</span>
                        <span className="text-xs text-gray-500">{editor.storage.characterCount.words()} words</span>
                    </div>
                </div>
                <Button variant={'success'} size={'sm'} onClick={handleAddReply} disabled={isAddingReply || editor?.isEmpty}>
                    <Send />
                    Submit Reply
                </Button>
            </div>
        </div>
    );
}
