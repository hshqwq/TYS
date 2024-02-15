import { JSONContent } from "@tiptap/core";
import stringify from "../tiptap/exts/yukimi/transformers";

export function save(data: JSONContent) {
  const content = stringify(data);

  console.info(content);
}
