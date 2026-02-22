/**
 * Rich Text Editor Component
 * Simple WYSIWYG editor for blog content
 * Uses contenteditable with basic formatting toolbar
 */

import React, { useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Code,
  Quote,
  Heading2,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start writing...',
  label,
  error,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const toolbarButtons = [
    { icon: <Bold size={16} />, command: 'bold', title: 'Bold (Ctrl+B)' },
    { icon: <Italic size={16} />, command: 'italic', title: 'Italic (Ctrl+I)' },
    { icon: <Underline size={16} />, command: 'underline', title: 'Underline (Ctrl+U)' },
    { icon: <Heading2 size={16} />, command: 'formatBlock', value: 'h2', title: 'Heading' },
    { icon: <List size={16} />, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: <ListOrdered size={16} />, command: 'insertOrderedList', title: 'Numbered List' },
    { icon: <Quote size={16} />, command: 'formatBlock', value: 'blockquote', title: 'Quote' },
    { icon: <Code size={16} />, command: 'formatBlock', value: 'pre', title: 'Code Block' },
    { icon: <Link size={16} />, onClick: insertLink, title: 'Insert Link' },
  ];

  return (
    <div className="space-y-2">
      {label && (
        <label className="block font-mono text-sm font-bold uppercase tracking-wide">{label}</label>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-2 border-ink bg-surface">
        {toolbarButtons.map((btn, index) => (
          <button
            key={index}
            type="button"
            onClick={() => (btn.onClick ? btn.onClick() : execCommand(btn.command, btn.value))}
            className="p-2 hover:bg-newsprint border border-transparent hover:border-ink transition-colors"
            title={btn.title}
          >
            {btn.icon}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        data-placeholder={placeholder}
        className={`
          min-h-[300px] p-4 border-2 border-ink bg-newsprint focus:outline-none focus:ring-2 focus:ring-ink/20
          prose prose-sm max-w-none
          [&:empty:before]:content-[attr(data-placeholder)] [&:empty:before]:text-ink/40
          ${error ? 'border-red-500' : ''}
        `}
        style={{
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
        }}
      />

      {error && <p className="text-red-600 font-mono text-xs">{error}</p>}

      {/* Character Count */}
      <p className="font-mono text-xs text-ink/40 text-right">
        {editorRef.current?.textContent?.length || 0} characters
      </p>

      {/* Styling for editor content */}
      <style>{`
        [contenteditable] h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 1rem 0 0.5rem 0;
        }
        [contenteditable] ul,
        [contenteditable] ol {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }
        [contenteditable] blockquote {
          border-left: 4px solid var(--color-ink);
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
        }
        [contenteditable] pre {
          background: #f5f5f5;
          padding: 1rem;
          border-left: 4px solid var(--color-ink);
          font-family: monospace;
          overflow-x: auto;
        }
        [contenteditable] a {
          color: #2563eb;
          text-decoration: underline;
        }
        [contenteditable] p {
          margin: 0.5rem 0;
        }
      `}</style>
    </div>
  );
};
