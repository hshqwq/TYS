import { TiptapMarkJson } from "./checkers/mark";
import { isNode } from "./checkers/node";
import transformerMap from "./transformers-map";

export type TiptapNodeJson<T extends string = string> = {
  type: T;
  content?: TiptapNodeJson[];
  marks?: TiptapMarkJson[];
  attrs?: Record<string, string>;
  text?: string;
};

export type TransformingTiptapNodeJson<T extends string = string> = Omit<
  TiptapNodeJson<T>,
  "content"
> & {
  [$skip]?: boolean;
  content?: TransformingTiptapNodeJson[];
};

export type Transformer<T extends string = string> = (
  node: TransformingTiptapNodeJson<T>,
  line: number,
  doc: TransformingTiptapNodeJson[],
  map: typeof transformerMap,
) => string;

export const $skip = Symbol("Skip transform");

const stringify = (json: unknown): string => {
  if (!isNode(json)) throw new Error("It is not a tiptap json object.");

  const contents = json.content;

  if (!contents || contents.length === 0) return "";
  const doc = structuredClone(contents) as TransformingTiptapNodeJson[];

  const res: string[] = [];
  for (let line = 0; line < doc.length; line++) {
    const node = doc[line];

    if (node[$skip]) continue;
    const transformer = transformerMap[node.type as keyof typeof transformerMap];

    if (!(transformer instanceof Function)) {
      console.warn(`Unknown content in line ${line}`);
      continue;
    }

    res.push(transformer(node as never, line, doc, transformerMap));
  }

  return res.join("\n");
};

export default stringify;
