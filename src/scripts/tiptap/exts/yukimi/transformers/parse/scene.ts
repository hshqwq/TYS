import { Handler, Pattern } from "./matchers";

const pattern: Pattern = (line) => /^- scene +".*"/.test(line);

const handler: Handler = (line) => {
  const scene = line.match(/^- scene +"(.*)"/)?.[1] || "";
  return {
    type: "scene",
    content: scene ? [{ type: "text", text: scene }] : undefined,
  };
};

export default [pattern, handler] as const;
