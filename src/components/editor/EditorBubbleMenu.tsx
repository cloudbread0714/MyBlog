"use client";

import { BubbleMenu } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
import { Bold, Italic, Link as LinkIcon } from "lucide-react";
import { FONT_SIZES } from "@/components/editor/extensions/font-size";
import { cn } from "@/lib/utils";

type EditorBubbleMenuProps = {
  editor: Editor;
};

export function EditorBubbleMenu({ editor }: EditorBubbleMenuProps) {
  const currentSize =
    (editor.getAttributes("textStyle").fontSize as string | undefined) ?? "1rem";

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("링크 URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const btn = (active: boolean) =>
    cn(
      "rounded p-1.5 transition-colors hover:bg-accent-soft",
      active ? "bg-accent-soft text-accent" : "text-foreground",
    );

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 120, placement: "top" }}
      className="flex items-center gap-0.5 rounded-lg border border-border bg-card px-1 py-1 shadow-lg"
    >
      <select
        className="max-w-[5.5rem] rounded border border-border bg-background px-1.5 py-1 font-mono text-xs focus:border-accent focus:outline-none"
        value={currentSize}
        onChange={(e) => {
          const value = e.target.value;
          if (value === "1rem") {
            editor.chain().focus().unsetFontSize().run();
          } else {
            editor.chain().focus().setFontSize(value).run();
          }
        }}
        title="글자 크기"
      >
        {FONT_SIZES.map((size) => (
          <option key={size.value} value={size.value}>
            {size.label}
          </option>
        ))}
      </select>

      <span className="mx-0.5 h-5 w-px bg-border" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btn(editor.isActive("bold"))}
        title="굵게"
      >
        <Bold className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btn(editor.isActive("italic"))}
        title="기울임"
      >
        <Italic className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={setLink}
        className={btn(editor.isActive("link"))}
        title="링크"
      >
        <LinkIcon className="h-3.5 w-3.5" />
      </button>

      <span className="mx-0.5 h-5 w-px bg-border" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cn(
          "rounded px-1.5 py-1 font-mono text-xs font-medium transition-colors hover:bg-accent-soft",
          editor.isActive("heading", { level: 2 }) && "bg-accent-soft text-accent",
        )}
        title="소제목"
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={cn(
          "rounded px-1.5 py-1 font-mono text-xs font-medium transition-colors hover:bg-accent-soft",
          editor.isActive("paragraph") && !editor.isActive("heading") && "bg-accent-soft text-accent",
        )}
        title="본문"
      >
        P
      </button>
    </BubbleMenu>
  );
}
