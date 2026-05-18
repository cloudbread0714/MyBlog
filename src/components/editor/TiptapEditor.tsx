"use client";

import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import type { Editor } from "@tiptap/react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { common, createLowlight } from "lowlight";
import { useCallback, useEffect, useRef } from "react";
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import { extractImageFiles, uploadImage, type UploadContext } from "@/lib/upload";

const lowlight = createLowlight(common);

type TiptapEditorProps = {
  content?: string;
  onChange?: (html: string) => void;
  uploadContext: UploadContext;
  placeholder?: string;
};

export function TiptapEditor({
  content = "",
  onChange,
  uploadContext,
  placeholder = "내용을 입력하세요…",
}: TiptapEditorProps) {
  const uploading = useRef(false);
  const insertImages = useCallback(
    async (files: File[], ed: Editor) => {
      if (!files.length || uploading.current) return;
      uploading.current = true;

      try {
        for (const file of files) {
          const url = await uploadImage(file, uploadContext);
          ed.chain().focus().setImage({ src: url }).run();
        }
      } finally {
        uploading.current = false;
      }
    },
    [uploadContext],
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight }),
      Link.configure({ openOnClick: false }),
      Image.configure({ HTMLAttributes: { class: "editor-image" } }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose-editor min-h-[320px] max-w-none px-4 py-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange?.(ed.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const dom = editor.view.dom;

    const onPaste = (event: ClipboardEvent) => {
      const files = extractImageFiles(event.clipboardData);
      if (!files.length) return;

      event.preventDefault();
      void insertImages(files, editor);
    };

    const onDrop = (event: DragEvent) => {
      const files = extractImageFiles(event.dataTransfer);
      if (!files.length) return;

      event.preventDefault();
      void insertImages(files, editor);
    };

    dom.addEventListener("paste", onPaste);
    dom.addEventListener("drop", onDrop);

    return () => {
      dom.removeEventListener("paste", onPaste);
      dom.removeEventListener("drop", onDrop);
    };
  }, [editor, insertImages]);

  const handleImageUpload = useCallback(
    async (files: FileList | null) => {
      if (!editor || !files?.length) return;
      await insertImages(Array.from(files), editor);
    },
    [editor, insertImages],
  );

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <EditorToolbar editor={editor} onImageUpload={handleImageUpload} />
      <EditorContent editor={editor} />
    </div>
  );
}
