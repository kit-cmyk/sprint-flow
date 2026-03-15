"use client"

import { useRef, useEffect, useCallback } from "react"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  ImageIcon,
  Minus,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  minHeight?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start typing...",
  className = "",
  disabled = false,
  minHeight = "160px",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const sync = useCallback(() => {
    if (editorRef.current) onChange(editorRef.current.innerHTML)
  }, [onChange])

  const execCommand = useCallback(
    (command: string, val?: string) => {
      document.execCommand(command, false, val)
      editorRef.current?.focus()
      sync()
    },
    [sync]
  )

  /* ── Insert image as data URL at cursor ── */
  const insertImageDataUrl = useCallback(
    (dataUrl: string) => {
      editorRef.current?.focus()
      execCommand("insertImage", dataUrl)
      // Give the img element themed styles after insertion
      if (editorRef.current) {
        editorRef.current.querySelectorAll("img").forEach((img) => {
          if (!img.dataset.styled) {
            img.style.maxWidth = "100%"
            img.style.borderRadius = "6px"
            img.style.margin = "8px 0"
            img.style.display = "block"
            img.dataset.styled = "1"
          }
        })
      }
    },
    [execCommand]
  )

  const handleImageFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (result) insertImageDataUrl(result)
      }
      reader.readAsDataURL(file)
    },
    [insertImageDataUrl]
  )

  /* ── Paste: intercept images ── */
  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      const items = Array.from(e.clipboardData.items)
      const imageItem = items.find((i) => i.type.startsWith("image/"))
      if (imageItem) {
        e.preventDefault()
        const file = imageItem.getAsFile()
        if (file) handleImageFile(file)
        return
      }
      // Allow default paste for text; sync afterwards
      setTimeout(sync, 0)
    },
    [handleImageFile, sync]
  )

  /* ── Drag-and-drop images directly onto editor ── */
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith("image/")
      )
      if (files.length > 0) {
        e.preventDefault()
        files.forEach(handleImageFile)
      }
    },
    [handleImageFile]
  )

  return (
    <div className={`rounded-lg border border-border bg-background ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border p-2">
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => execCommand("bold")} disabled={disabled} title="Bold (Ctrl+B)">
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => execCommand("italic")} disabled={disabled} title="Italic (Ctrl+I)">
          <Italic className="h-4 w-4" />
        </Button>

        <div className="mx-1 h-6 w-px bg-border" />

        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => execCommand("formatBlock", "h1")} disabled={disabled} title="Heading 1">
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => execCommand("formatBlock", "h2")} disabled={disabled} title="Heading 2">
          <Heading2 className="h-4 w-4" />
        </Button>

        <div className="mx-1 h-6 w-px bg-border" />

        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => execCommand("insertUnorderedList")} disabled={disabled} title="Bullet List">
          <List className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => execCommand("insertOrderedList")} disabled={disabled} title="Numbered List">
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => execCommand("insertHorizontalRule")} disabled={disabled} title="Divider">
          <Minus className="h-4 w-4" />
        </Button>

        <div className="mx-1 h-6 w-px bg-border" />

        {/* Image button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => imageInputRef.current?.click()}
          disabled={disabled}
          title="Insert Image"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            Array.from(e.target.files ?? []).forEach(handleImageFile)
            e.target.value = ""
          }}
        />
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={sync}
        onPaste={handlePaste}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`w-full overflow-auto p-4 text-sm leading-relaxed text-foreground outline-none focus:ring-0 ${
          disabled ? "cursor-not-allowed opacity-50" : ""
        }`}
        style={{ minHeight }}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />

      <style jsx>{`
        [contentEditable]:empty:before {
          content: attr(data-placeholder);
          color: hsl(var(--muted-foreground) / 0.5);
        }
        [contentEditable] h1 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0.75rem 0 0.25rem;
          color: hsl(var(--foreground));
        }
        [contentEditable] h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0.75rem 0 0.25rem;
          color: hsl(var(--foreground));
        }
        [contentEditable] strong { font-weight: 600; }
        [contentEditable] em    { font-style: italic; }
        [contentEditable] ul,
        [contentEditable] ol {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }
        [contentEditable] li { margin: 0.25rem 0; }
        [contentEditable] p  { margin: 0.5rem 0; }
        [contentEditable] hr {
          border: none;
          border-top: 1px solid hsl(var(--border));
          margin: 1rem 0;
        }
        [contentEditable] img {
          max-width: 100%;
          border-radius: 6px;
          margin: 8px 0;
          display: block;
          cursor: default;
        }
        [contentEditable] img:hover {
          outline: 2px solid hsl(var(--primary) / 0.4);
          border-radius: 6px;
        }
      `}</style>
    </div>
  )
}
