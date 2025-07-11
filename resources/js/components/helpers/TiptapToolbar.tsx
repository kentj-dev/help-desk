import { Button } from '@/components/ui/button';
import { Editor } from '@tiptap/react';
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Italic, List, ListOrdered, Underline } from 'lucide-react';

interface TiptapToolbarProps {
    editor: Editor | null;
}

export function TiptapToolbar({ editor }: TiptapToolbarProps) {
    if (!editor) return null;

    const isActive = (type: string, attrs?: any) => (editor.isActive(type, attrs) ? 'bg-gray-200' : '');

    return (
        <div className="mb-2 flex flex-wrap gap-1 rounded border bg-white p-2 shadow-sm">
            <Button type="button" size="sm" variant="ghost" className={isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
                <Bold size={16} />
            </Button>
            <Button
                type="button"
                size="sm"
                variant="ghost"
                className={isActive('italic')}
                onClick={() => editor.chain().focus().toggleItalic().run()}
            >
                <Italic size={16} />
            </Button>
            <Button
                type="button"
                size="sm"
                variant="ghost"
                className={isActive('underline')}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
                <Underline size={16} />
            </Button>
            <Button
                type="button"
                size="sm"
                variant="ghost"
                className={isActive('bulletList')}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
                <List size={16} />
            </Button>
            <Button
                type="button"
                size="sm"
                variant="ghost"
                className={isActive('orderedList')}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
                <ListOrdered size={16} />
            </Button>
            <Button
                type="button"
                size="sm"
                variant="ghost"
                className={isActive('textAlign', { textAlign: 'left' })}
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
            >
                <AlignLeft size={16} />
            </Button>
            <Button
                type="button"
                size="sm"
                variant="ghost"
                className={isActive('textAlign', { textAlign: 'center' })}
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
            >
                <AlignCenter size={16} />
            </Button>
            <Button
                type="button"
                size="sm"
                variant="ghost"
                className={isActive('textAlign', { textAlign: 'right' })}
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
            >
                <AlignRight size={16} />
            </Button>
            <Button
                type="button"
                size="sm"
                variant="ghost"
                className={isActive('textAlign', { textAlign: 'justify' })}
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            >
                <AlignJustify size={16} />
            </Button>
        </div>
    );
}
