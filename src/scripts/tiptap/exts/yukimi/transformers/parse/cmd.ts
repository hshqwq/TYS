import { CommandArg } from "@/scripts/yukimi/command-manager";
import { Handler, Pattern } from "./matchers";
import { CommandAttrs } from "../../nodes/cmd/cmd";

const pattern: Pattern = (line) => /^@/.test(line);

const handler: Handler<CommandAttrs> = (line) => {
  const els = line
    .trim()
    .split(" ")
    .filter((el) => el.trim().length);

  const name = els[0].slice(1);
  function* createArgIter() {
    for (const arg of els.slice(1)) {
      yield arg;
    }
  }

  const iter = createArgIter();
  const args: CommandArg[] = [];

  // eslint-disable-next-line no-constant-condition
  for (let i = 0; ; ) {
    const arg = iter.next();

    if (!arg.value && arg.done) break;

    const name = arg.value as string;

    if (name.startsWith("--")) {
      const value = iter.next();

      args.push({
        name: name,
        value: value.done ? "" : value.value,
      });
    } else
      args.push({
        name: `${i++}`,
        value: name,
      });

    if (arg.done) break;
  }

  return {
    type: "cmd",
    attrs: {
      name,
      args,
    },
  };
};

export default [pattern, handler] as const;
