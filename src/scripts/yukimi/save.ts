import { writeTextFile } from "@tauri-apps/plugin-fs";
import { JSONContent } from "@tiptap/core";
import stringify from "../tiptap/exts/yukimi/transformers/stringify";

export function save(path: string, data: JSONContent) {
  const content = stringify(data);
  writeTextFile(path, content);
}
