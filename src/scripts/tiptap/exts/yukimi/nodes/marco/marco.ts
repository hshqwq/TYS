import "./style.scss";

import Component from "./component";
import { SolidNodeViewRenderer } from "tiptap-solid";
import { CommandProps, InputRule, Node, RawCommands } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    marco: {
      setMarco: () => ReturnType;
      insertMarco: () => ReturnType;
    };
  }
}

const Marco = Node.create({
  name: "marco",
  group: "block",
  content: "text*",
  marks: "",

  addAttributes() {
    return {
      name: "",
      args: [],
    };
  },

  parseHTML: () => [{ tag: "marco" }],
  renderHTML({ HTMLAttributes: attrs }) {
    return ["marco", attrs, 0];
  },
  addInputRules() {
    return [
      new InputRule({
        find: /^(marco|宏|\$) /,
        handler: ({ range, chain }) => {
          chain().deleteRange(range).setMarco().run();
        },
      }),
    ];
  },
  addCommands() {
    return {
      setMarco:
        () =>
        ({ commands }: CommandProps) => {
          commands.setNode(`marco`);
        },
      insertMarco:
        () =>
        ({ chain }: CommandProps) => {
          chain().insertContent("\n").setMarco().run();
        },
    } as Partial<RawCommands>;
  },

  addNodeView() {
    return SolidNodeViewRenderer(Component);
  },
});

export default Marco;
