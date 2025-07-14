import { TiptapToolbar } from '@/components/helpers/TiptapToolbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayoutTemplate from '@/layouts/app/app-header-layout';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import TextAlign from '@tiptap/extension-text-align';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tickets',
        href: '/tickets',
    },
    {
        title: 'Create Ticket',
        href: '/create-ticket',
    },
];

type AddTicketForm = {
    title: string;
    details: string;
};

export default function CreateTicket() {
    const { isClientRoute } = usePage<SharedData>().props;

    const { data, setData, post, processing, errors, reset } = useForm<Required<AddTicketForm>>({
        title: '',
        details: '',
    });

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: { keepMarks: true, keepAttributes: false },
                orderedList: { keepMarks: true, keepAttributes: false },
            }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        content: '',
        onUpdate({ editor }) {
            setData('details', editor.getHTML());
        },
    });

    const handleCreateTicket = () => {
        const promise = new Promise<void>((resolve, reject) => {
            post(route('submit.create.ticket'), {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    editor?.commands.clearContent();
                    resolve();
                },
                onError: () => {
                    reject();
                },
            });
        });

        toast.promise(promise, {
            loading: 'Creating ticket...',
            success: 'Ticket created successfully!',
            error: 'Failed to create ticket!',
            duration: 5000,
        });
    };

    return (
        <AppLayoutTemplate isClientRoute={isClientRoute} breadcrumbs={breadcrumbs}>
            <Head title="Create Ticket" />
            <div className="px-4 py-6">
                <div className="flex flex-col gap-4">
                    <Input
                        type="text"
                        placeholder="Enter ticket title..."
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        id="title-input"
                    />

                    <div className="cursor-text rounded-md border p-2" onClick={() => editor?.commands.focus()}>
                        <TiptapToolbar editor={editor} />
                        <EditorContent editor={editor} className="prose min-h-[200px] max-w-none border-t p-2" />
                    </div>

                    <Button
                        className="ms-auto w-max"
                        variant={'success'}
                        onClick={handleCreateTicket}
                        disabled={processing || !data.title || !data.details}
                    >
                        <Send />
                        Submit Ticket
                    </Button>
                </div>
            </div>
        </AppLayoutTemplate>
    );
}
