import { CommandProps, InputRule, Node, RawCommands } from "@tiptap/core";
import "./scene.scss";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    scene: {
      setScene: () => ReturnType;
    };
  }
}

const Scene = Node.create({
  name: "scene",
  group: "block",
  content: "text*",
  marks: "",

  parseHTML: () => [{ tag: "h1" }],
  renderHTML({ HTMLAttributes: attrs }) {
    return ["h1", attrs, 0];
  },
  addInputRules() {
    return [
      new InputRule({
        find: /^(scene|场景|-) /,
        handler: ({ range, chain }) => {
          chain().deleteRange(range).setScene().run();
        },
      }),
    ];
  },
  addCommands() {
    return {
      setScene:
        () =>
        ({ commands }: CommandProps) => {
          commands.setNode(`scene`);
        },
    } as Partial<RawCommands>;
  },
});

export default Scene;
