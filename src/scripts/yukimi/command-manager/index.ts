import { createSignal } from "solid-js";
import { YukimiTypes } from "../types";

export type CommandArgDefinition = {
  name: string;
  /** @default {YukimiTypeAny} */
  type: [YukimiTypes, ...YukimiTypes[]];
  default?: YukimiTypes;
  description?: string;
};

export type CommandArg = Merge<
  Omit<CommandArgDefinition, "description">,
  {
    type?: CommandArgDefinition["type"];
    value: string;
  }
>;

export type Command = {
  name: string;
  args: CommandArgDefinition[];
  definer: string;
  description?: string;
  visible?: boolean; // default: true
};

export const [commands, setCommands] = createSignal<Command[]>([], { equals: false });

export function addCommand(...commands: Command[]) {
  console.log(
    setCommands((prev) => {
      prev.push(...commands);
      return prev;
    }),
  );
}

export function removeCommand(...commands: Command[]) {
  setCommands((prev) => prev.filter((c) => !commands.includes(c)));
}

// register system defined.
import("@/configs/yukimi/system-defined/marco");
import("@/configs/yukimi/system-defined/extern");
