import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Redo2,
  RemoveFormatting,
  Strikethrough,
  Undo2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

/**
 * Editor teks kaya berbasis TipTap (tanpa elemen eksternal,
 * kompatibel penuh dengan Vite + React 19).
 *
 * `value` berisi HTML. Perubahan dipropagasikan ke `onChange`.
 */
export default function RichTextEditor({ value = '', onChange, placeholder = 'Tulis konten di sini...' }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none min-h-[180px] px-3.5 py-3 text-sm leading-relaxed focus:outline-none',
      },
    },
    onUpdate: ({ editor: instance }) => onChange?.(instance.getHTML()),
  })

  // Sinkronisasi saat nilai dikontrol berubah dari luar (mis. reset form).
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      const { from, to } = editor.state.selection
      const shouldRestore = editor.isFocused && from === to
      editor.commands.setContent(value || '', { emitUpdate: false })
      if (shouldRestore) editor.commands.setTextSelection(Math.min(value.length, editor.state.doc.content.size - 2))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  useEffect(() => () => editor?.destroy(), [editor])

  if (!editor) {
    return <div className="min-h-[180px] animate-pulse rounded-md border bg-muted/40" />
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/40 p-1.5">
        <EditorAction editor={editor} onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')} label="Tebal">
          <Bold />
        </EditorAction>
        <EditorAction editor={editor} onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')} label="Miring">
          <Italic />
        </EditorAction>
        <EditorAction editor={editor} onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')} label="Coret">
          <Strikethrough />
        </EditorAction>
        <Divider />
        <EditorAction editor={editor} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })} label="Subjudul">
          <Heading2 />
        </EditorAction>
        <EditorAction editor={editor} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })} label="Sub-subjudul">
          <Pilcrow />
        </EditorAction>
        <Divider />
        <EditorAction editor={editor} onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')} label="Daftar berpoin">
          <List />
        </EditorAction>
        <EditorAction editor={editor} onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')} label="Daftar bernomor">
          <ListOrdered />
        </EditorAction>
        <EditorAction editor={editor} onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')} label="Kutipan">
          <Quote />
        </EditorAction>
        <Divider />
        <EditorAction editor={editor} onClick={() => editor.chain().focus().unsetAllMarks().run()}
          label="Hapus format">
          <RemoveFormatting />
        </EditorAction>
        <div className="ml-auto flex items-center gap-0.5">
          <EditorAction editor={editor} onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()} label="Undo">
            <Undo2 />
          </EditorAction>
          <EditorAction editor={editor} onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()} label="Redo">
            <Redo2 />
          </EditorAction>
        </div>
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}

function EditorAction({ editor: _editor, onClick, active, disabled, label, children }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className={cn('h-7 w-7 rounded-md', active && 'bg-primary/15 text-primary hover:bg-primary/20')}
      onClick={onClick}
      disabled={disabled}
      title={label}
    >
      {children}
    </Button>
  )
}

function Divider({ className }) {
  return <div className={cn('mx-1 h-5 w-px bg-border', className)} />
}