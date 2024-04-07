import { Command } from "@/scripts/yukimi/command-manager";
import { registerCommands } from "@/scripts/yukimi/command-manager/lib";

const define = (configs: Partial<Command> & Omit<Command, "definer" | "visible">) => ({
  visible: false,
  definer: "system",
  ...configs,
});

const systemDefinedMarcos: Command[] = [
  //text
  define({
    name: "__text_begin",
    args: [
      {
        name: "character",
        type: ["string", "null"],
        default: "null",
        description: "描述当前文本所标识的角色",
      },
    ],
    description: "表示一组文本开始。",
  }),
  define({
    name: "__text_end",
    args: [
      {
        name: "hasMore",
        type: ["bool"],
        default: "false",
        description: "如果文本后缀\\符号，则为true",
      },
    ],
    description: "一段文本结束。",
  }),
  define({
    name: "__text_type",
    args: [
      {
        name: "text",
        type: ["string"],
        description: "要输出的文本",
      },
    ],
    description: "表示一段文本。",
  }),
  define({
    name: "__text_pushMark",
    args: [
      {
        name: "mark",
        type: ["symbol"],
        description: "标记",
      },
    ],
    description: "表示一段文本标记的开始。",
  }),
  define({
    name: "__text_popMark",
    args: [
      {
        name: "mark",
        type: ["symbol"],
        description: "被结束的标记",
      },
    ],
    description: "表示一段文本标记的结束。",
  }),
  define({
    name: "__text_popMark",
    args: [
      {
        name: "mark",
        type: ["symbol"],
        description: "被结束的标记",
      },
    ],
    description: "表示一段文本标记的结束。",
  }),
];

registerCommands(...systemDefinedMarcos);

export default systemDefinedMarcos;
