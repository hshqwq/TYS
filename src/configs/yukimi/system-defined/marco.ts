import { Command } from "@/scripts/yukimi/command-manager";
import { registerCommands } from "@/scripts/yukimi/command-manager/lib";

const define = (configs: Partial<Command> & Omit<Command, "definer" | "visible">) => ({
  visible: false,
  definer: "system",
  ...configs,
});

const systemDefinedMarcos: Command[] = [
  // scene
  define({
    name: "__callback_scene_before",
    args: [{ name: "scene", type: ["string"], description: "场景名称" }],
    description: "该回调将会在没有继承场景的场景开头处被调用。",
  }),
  define({
    name: "__callback_scene_after",
    args: [{ name: "scene", type: ["string"], description: "场景名称" }],
    description: "该回调将会在没有继承场景的场景结尾处被调用。",
  }),
  define({
    name: "__callback_scene_inherit_before",
    args: [{ name: "scene", type: ["string"], description: "场景名称" }],
    description: "该回调将会在继承于某场景的场景开头处被调用。",
  }),
  define({
    name: "__callback_scene_inherit_after",
    args: [{ name: "scene", type: ["string"], description: "场景名称" }],
    description: "该回调将会在继承于某场景的场景结尾处被调用。",
  }),

  // diagram_link
  define({
    name: "__diagram_link_to",
    args: [
      {
        name: "target",
        type: ["string"],
        description: "以字符串表示，当前场景可以连接到的一个场景",
      },
    ],
    description:
      "这个宏用于指示当前场景可以连接到哪些场景。\n一般不在场景中手动调用，而是被写在用于跳转场景的宏中，随着跳转场景的宏一起展开。\n\n此宏仅对剧情图生成器有效，在执行时不会做任何操作。",
  }),

  // types
  define({
    name: "__type",
    args: [
      { name: "param", type: ["symbol"], description: "要被设置类型的参数名称" },
      { name: "type", type: ["symbol"], description: "要被设置上的类型" },
    ],
    description:
      "这个宏用于指示一个参数的类型为何，仅可在宏定义和外部定义下使用。\n\n此宏仅对类型检查器生效，执行时不会做任何操作。",
  }),
  define({
    name: "__type_symbol",
    args: [
      { name: "param", type: ["symbol"], description: "要被设置类型的参数名称" },
      { name: "type", type: ["symbol"], description: "允许被传入的symbol" },
    ],
    description:
      "这个宏用于指示一个参数的类型可以传入什么样的symbol，有关详细信息，请参见“类型检查器” - “Explicit Symbol 类型” 。\n\n此宏仅对类型检查器生效，执行时不会做任何操作。",
  }),
];

registerCommands(...systemDefinedMarcos);

export default systemDefinedMarcos;
