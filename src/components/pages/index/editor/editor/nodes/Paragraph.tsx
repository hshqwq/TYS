import { deleteRange } from "@/scripts/util/editor";
import { useContext } from "solid-js";
import { editorContext, INode } from "../Editor";
import { CreateNode, createNodeElement, Text } from "./Text";

export interface IParagraph extends INode {
  name: 'paragraph';
}

export default createNodeElement('paragraph', function Paragraph(props) {
  const store = useContext(editorContext);

  return <p
    class='min-h-4 max-h-fit leading-4 my-0'
    onClick={(e) => {
      if (e.target !== e.currentTarget) return;
      store.currentNode = props.node;
      store.cursor = { start: { index: props.index, offset: props.node.value.length }, end: { index: props.index, offset: props.node.value.length } };
    }}
  >
    <Text node={props.node} index={props.index} height={'1rem'} />
  </p>;
});

export const createParagraph: CreateNode<IParagraph> = (node) => ({
  value: '',
  ...node,
  name: 'paragraph',
  onBreakLine: (node, store, i) => {
    const newValue = node.value.slice(store.cursor.end.offset, node.value.length);
    node.value = node.value.slice(0, store.cursor.start.offset);
    const newNode = node.next = store.currentNode = createParagraph({
      prev: node,
      next: store.document[i + 1] || null,
      value: newValue,
    });
    if (store.document[i + 1]) store.document[i + 1].prev = newNode;
    store.document.splice(i + 1, 0, newNode);
    deleteRange(store, store.cursor);
    store.cursor = { start: { index: store.cursor.start.index + 1, offset: 0 }, end: { index: store.cursor.start.index + 1, offset: 0 } };
  }
});
