import "./dialog.scss";

import { CommandProps, InputRule, RawCommands, mergeAttributes } from "@tiptap/core";
import Paragraph from "@tiptap/extension-paragraph";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    dialog: {
      setDialog: () => ReturnType;
    };
  }
}

const Dialog = Paragraph.extend({
  name: "dialog",
  content: "text*",
  marks: "",

  parseHTML: () => [
    {
      tag: "p",
      getAttrs: (node) => ((node as Node).textContent?.at(-1) === ":" ? null : false),
    },
  ],
  renderHTML: ({ HTMLAttributes: attrs }) => ["p", mergeAttributes(attrs, { class: "dialog" }), 0],
  addInputRules() {
    return [
      new InputRule({
        find: /^([^:]*)(:|：)$/g,
        handler: ({ match, chain, range }) => {
          const chaining = chain();
          if (match[2] === "：") chaining.deleteRange({ from: range.to - 1, to: range.to });
          chaining.setDialog();

          chaining.run();
        },
      }),
    ];
  },
  addCommands() {
    return {
      setDialog:
        () =>
        ({ commands }: CommandProps) => {
          commands.setNode(`dialog`);
        },
    } as Partial<RawCommands>;
  },
});

export default Dialog;
