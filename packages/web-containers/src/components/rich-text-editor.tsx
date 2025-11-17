'use client';

import React from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import { Heading } from '@tiptap/extension-heading';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Heading1, Heading2, Heading3, Code2, FileCode, Quote } from 'lucide-react';

import { Toggle } from './ui/toggle';
import { Separator } from './ui/separator';
import { htmlToMarkdown, markdownToHtml, isHtml } from '../lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  exportFormat?: 'html' | 'markdown';
  disabled?: boolean;
  placeholder?: string;
  minHeight?: string;
  className?: string;
  id?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  ariaRequired?: boolean;
  ariaInvalid?: boolean;
}

const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-t-md border border-b-0 p-2">
      {/* Heading buttons */}
      <Toggle
        size="sm"
        pressed={editor.isActive('heading', { level: 1 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        aria-label="Toggle heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('heading', { level: 2 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        aria-label="Toggle heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('heading', { level: 3 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        aria-label="Toggle heading 3"
      >
        <Heading3 className="h-4 w-4" />
      </Toggle>
      <Separator orientation="vertical" className="h-6" />

      {/* Text formatting buttons */}
      <Toggle
        size="sm"
        pressed={editor.isActive('bold')}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        aria-label="Toggle bold"
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('italic')}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        aria-label="Toggle italic"
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('code')}
        onPressedChange={() => editor.chain().focus().toggleCode().run()}
        aria-label="Toggle inline code"
      >
        <Code2 className="h-4 w-4" />
      </Toggle>
      <Separator orientation="vertical" className="h-6" />

      {/* Block formatting buttons */}
      <Toggle
        size="sm"
        pressed={editor.isActive('codeBlock')}
        onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
        aria-label="Toggle code block"
      >
        <FileCode className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('blockquote')}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
        aria-label="Toggle blockquote"
      >
        <Quote className="h-4 w-4" />
      </Toggle>
    </div>
  );
};

export function RichTextEditor({
  value,
  onChange,
  exportFormat = 'markdown',
  disabled,
  id,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  ariaRequired,
  ariaInvalid,
}: RichTextEditorProps) {
  // Normalize content for editor initialization
  const getInitialContent = () => {
    if (exportFormat === 'html') {
      return value;
    }

    // If exportFormat is markdown but value is HTML, convert HTML -> markdown -> HTML
    if (isHtml(value)) {
      const markdown = htmlToMarkdown(value);
      return markdownToHtml(markdown);
    }

    // Value is markdown, convert markdown -> HTML
    return markdownToHtml(value);
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable heading from StarterKit to avoid duplication
        heading: false,
        // Enable code block
        codeBlock: {
          HTMLAttributes: {
            class: 'bg-muted rounded-md p-4 font-mono text-sm',
          },
        },
        // Enable blockquote
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-primary pl-4 italic',
          },
        },
      }),
      Heading.configure({
        levels: [1, 2, 3],
        HTMLAttributes: {
          class: 'font-bold',
        },
      }),
    ],
    content: getInitialContent(),
    onUpdate: ({ editor }) => {
      onChange(exportFormat === 'html' ? editor.getHTML() : htmlToMarkdown(editor.getHTML()));
    },
    editable: !disabled,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none min-h-[150px] max-h-[300px] overflow-y-auto rounded-b-md border p-4 focus:outline-none [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-bold [&_code]:bg-muted [&_code]:rounded [&_code]:px-1 [&_code]:py-0.5 [&_pre]:bg-muted [&_pre]:rounded-md [&_pre]:p-4 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_a]:text-primary [&_a]:underline',
      },
    },
  });

  React.useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [editor, disabled]);

  React.useEffect(() => {
    if (!editor) {
      return;
    }

    const nextContent = getInitialContent();
    if (nextContent !== editor.getHTML()) {
      editor.commands.setContent(nextContent, false);
    }
  }, [editor, value, exportFormat]);

  return (
    <div>
      <EditorToolbar editor={editor} />
      <EditorContent
        editor={editor}
        id={id}
        role="textbox"
        aria-multiline="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabel ? undefined : ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-required={ariaRequired}
        aria-invalid={ariaInvalid}
        aria-disabled={disabled ? 'true' : undefined}
      />
    </div>
  );
}
