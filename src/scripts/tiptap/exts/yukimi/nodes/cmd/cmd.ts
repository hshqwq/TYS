import "./cmd.scss";

import { CommandArg } from "@/scripts/yukimi/command-manager";
import { CommandProps, InputRule, Node, RawCommands } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    cmd: {
      setCmd: () => ReturnType;
      insertCmd: () => ReturnType;
    };
  }
}

export type CommandAttrs = {
  name: string;
  args: CommandArg[];
  expanded?: boolean;
};

const Cmd = Node.create(() => {

  return {
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
}});

export default Cmd;
