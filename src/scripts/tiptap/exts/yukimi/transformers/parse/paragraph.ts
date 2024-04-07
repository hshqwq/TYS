import { TiptapNodeJson } from "../stringify";
import { Handler, Pattern } from "./matchers";

let handleNextLine = false;

const pattern: Pattern = (line) => handleNextLine || /.*/.test(line);

let cache: TiptapNodeJson[] = [];

const handler: Handler = (line) => {
  if (!line.length) return null;
  handleNextLine = line.at(-1) === "\\";

  cache.push({
    type: "text",
    text: handleNextLine ? line.slice(0, -1) : line,
  });

  if (handleNextLine) {
    cache.push({ type: "hardBreak" });

    return null;
  }

  const node = {
    type: "paragraph",
    content: cache,
  };

  cache = [];

  return node;
};

export default [pattern, handler] as const;
