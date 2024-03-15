export type TiptapMarkJson = {
  type: string;
};

export function isMark(mark: unknown): mark is TiptapMarkJson {
  if (typeof mark !== "object" || !mark) return false;
  if (!("type" in mark) || typeof mark.type !== "string") return false;

  return true;
}
