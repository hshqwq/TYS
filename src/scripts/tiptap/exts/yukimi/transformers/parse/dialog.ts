import { Handler, Pattern } from "./matchers";

const pattern: Pattern = (line) => /^.*:.*/.test(line);

const handler: Handler = (line, i, lines) => {
  lines.splice(i + 1, 0, line.slice(line.indexOf(":") + 1));
  const value = line[0] === ":" ? "" : line.slice(0, line.indexOf(":"));

  return {
    type: "dialog",
    content: value ? [{ type: "text", text: value }] : undefined,
  };
};

export default [pattern, handler] as const;
