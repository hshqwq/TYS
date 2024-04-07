import { TiptapNodeJson } from "../stringify";
import { matchers } from "./matchers";

const parse = (data: string): TiptapNodeJson => {
  const lines = data.replaceAll("\r", "").split("\n");

  const nodes: TiptapNodeJson[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const matcher of matchers) {
      if (!matcher[0](line)) continue;

      const transformedNodes = matcher[1](line, i, lines);

      if (!transformedNodes) break;

      transformedNodes instanceof Array
        ? nodes.push(...transformedNodes)
        : nodes.push(transformedNodes);
      break;
    }
  }

  console.log(lines, nodes);

  return {
    type: "doc",
    content: nodes.length ? nodes : undefined,
  };
};

export default parse;
