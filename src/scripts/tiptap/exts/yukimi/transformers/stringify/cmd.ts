import { Transformer } from ".";
import { CommandAttrs } from "../../nodes/cmd/cmd";

const cmdTransformer: Transformer<"cmd", CommandAttrs> = (node) => {
  const name = node.attrs?.name || "";

  let index = 0;
  const args =
    node.attrs?.args?.reduce<string[]>((args, arg) => {
      if (arg.name == (index as unknown as string)) args.splice(index++, 0, arg.value);
      else args.push(`--${arg.name} ${arg.value}`);

      return args;
    }, []) || [];

  return `${name} ${args.join(" ")}`;
};

export default cmdTransformer;
