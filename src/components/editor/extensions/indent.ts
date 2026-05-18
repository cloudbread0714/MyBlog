import { Extension } from "@tiptap/core";

export type IndentOptions = {
  types: string[];
  max: number;
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    indent: {
      indent: () => ReturnType;
      outdent: () => ReturnType;
    };
  }
}

export const IndentExtension = Extension.create<IndentOptions>({
  name: "indent",

  addOptions() {
    return {
      types: ["paragraph", "heading", "blockquote"],
      max: 6,
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: 0,
            parseHTML: (element) => {
              const margin = element.style.marginLeft;
              if (!margin) return 0;
              const rem = parseFloat(margin);
              return Number.isNaN(rem) ? 0 : Math.min(Math.round(rem / 1.5), this.options.max);
            },
            renderHTML: (attributes) => {
              const level = Number(attributes.indent) || 0;
              if (level <= 0) return {};
              return { style: `margin-left: ${level * 1.5}rem` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    const adjust =
      (delta: number) =>
      ({ tr, state, dispatch }: { tr: import("@tiptap/pm/state").Transaction; state: import("@tiptap/pm/state").EditorState; dispatch?: (tr: import("@tiptap/pm/state").Transaction) => void }) => {
        const { types, max } = this.options;
        const { from, to } = state.selection;
        let changed = false;

        state.doc.nodesBetween(from, to, (node, pos) => {
          if (!types.includes(node.type.name)) return;
          const current = Number(node.attrs.indent) || 0;
          const next = Math.min(max, Math.max(0, current + delta));
          if (next === current) return;
          tr.setNodeMarkup(pos, undefined, { ...node.attrs, indent: next });
          changed = true;
        });

        if (changed && dispatch) dispatch(tr);
        return changed;
      };

    return {
      indent: () => adjust(1),
      outdent: () => adjust(-1),
    };
  },

  addKeyboardShortcuts() {
    return {
      Tab: () => {
        if (this.editor.isActive("codeBlock")) return false;
        if (this.editor.isActive("table")) return false;
        if (this.editor.can().sinkListItem("listItem")) {
          return this.editor.chain().focus().sinkListItem("listItem").run();
        }
        return this.editor.commands.indent();
      },
      "Shift-Tab": () => {
        if (this.editor.isActive("codeBlock")) return false;
        if (this.editor.isActive("table")) return false;
        if (this.editor.can().liftListItem("listItem")) {
          return this.editor.chain().focus().liftListItem("listItem").run();
        }
        return this.editor.commands.outdent();
      },
    };
  },
});
