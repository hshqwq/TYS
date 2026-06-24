import { EditorContext, EditorRange } from "@/components/pages/index/editor/editor/Editor";

export function deleteRange(store: EditorContext, range: EditorRange) {
  const node = store.document[range.start.index];
  if (range.start.index === range.end.index)
    return node.value = node.value.slice(0, range.start.offset) + node.value.slice(range.end.offset, node.value.length);
  const endNode = store.document[range.end.index];
  node.value = node.value.slice(0, range.start.offset) + endNode.value.slice(range.end.offset, endNode.value.length);
  store.document.splice(range.start.index + 1, range.end.index - range.start.index);
  node.next = store.document[range.start.index + 1] || null;
  if(store.document[range.start.index + 1]) store.document[range.start.index + 1].prev = node;
}
