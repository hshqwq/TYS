import { TiptapNodeJson } from "../index";

export function isNode(json: unknown): json is TiptapNodeJson {
  if (typeof json !== "object") return false;
  if (json === null) return false;
  if (!("type" in json)) return false;

  if ("marks" in json) {
    if (!(json.marks instanceof Array)) return false;
    for (const mark of json.marks) if (typeof mark !== "string") return false;
  }
  if ("attrs" in json) {
    if (typeof json.attrs !== "object" || !json.attrs) return false;

    for (const key in json.attrs) {
      if (typeof key !== "string") return false;
      if (typeof (json.attrs as Record<string, unknown>)[key] !== "string") return false;
    }
  }

  if ("text" in json && (typeof json.text !== "string" || "content" in json)) return false;

  // 递归检查放最后避免不必要递归
  if ("content" in json) {
    if (!(json.content instanceof Array)) return false;
    for (const node of json.content) if (!isNode(node)) return false;
  }

  return true;
}
