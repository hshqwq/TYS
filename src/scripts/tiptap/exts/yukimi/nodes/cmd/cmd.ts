import "./style.scss";

import Component from "./component";
import { SolidNodeViewRenderer } from "tiptap-solid";
import { CommandProps, InputRule, Node, RawCommands } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    cmd: {
      setCmd: () => ReturnType;
      insertCmd: () => ReturnType;
    };
  }
}

export enum CommandType {}

export type CommandArg = {
  name: string;
  type: CommandType;
  value: string;
};

export type CommandAttrs = {
  name: string;
  args: CommandArg[];
  expanded: boolean;
};

const Cmd = Node.create({
  name: "cmd",
  group: "block",
  content: "text*",
  marks: "",

  addAttributes() {
    return {
      name: "",
      args: [],
    };
  },

  parseHTML: () => [{ tag: "yukimi-cmd" }],
  renderHTML({ HTMLAttributes: attrs }) {
    return ["yukimi-cmd", attrs, 0];
  },
  addInputRules() {
    return [
      new InputRule({
        find: /^@/,
        handler: ({ range, chain }) => {
          chain().deleteRange(range).setCmd().run();
        },
      }),
    ];
  },
  addCommands() {
    return {
      setCmd:
        () =>
        ({ commands }: CommandProps) => {
          commands.setNode(`cmd`);
        },
      insertCmd:
        () =>
        ({ chain }: CommandProps) => {
          chain().insertContent("\n").setCmd().run();
        },
    } as Partial<RawCommands>;
  },

  addNodeView() {
    return SolidNodeViewRenderer(Component);
  },
});

export default Cmd;
