import { JSONContent } from "@tiptap/core";
import stringify from "../tiptap/exts/yukimi/transformers/stringify";
import { writeTextFile } from "@tauri-apps/plugin-fs";

export function save(path: string, data: JSONContent) {
  const content = stringify(data);

  console.info(content);

  writeTextFile(path, content);
}
