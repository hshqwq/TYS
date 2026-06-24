import styles from "./scene.module.scss";

import { deleteRange } from "@/scripts/util/editor";
import { createEffect, JSX, onMount, useContext } from "solid-js";
import { editorContext, INode } from "../../Editor";
import { createParagraph, IParagraph } from "../Paragraph";
import { CreateNode, createNodeElement, Text } from "../Text";

export interface IScene extends INode {
  name: 'scene';
}

export type NodeProps = {
  node: INode;
  index: number;
  height: JSX.CSSProperties['height'];
  ref?: HTMLSpanElement;
} & Record<string, any>;

export default createNodeElement('scene', function Scene(props: NodeProps) {
  let nodeRef!: HTMLSpanElement;
  const store = useContext(editorContext);

  onMount(() => {
    props.ref = nodeRef;
  });

  createEffect(() => {
    if (props.node.value.startsWith('- ')) return;
    store.document[props.index] = store.currentNode = createParagraph(props.node as IParagraph);
  });

  return <h2 class={styles.scene}
    onClick={(e) => {
      if (e.target !== e.currentTarget) return;
      store.currentNode = props.node;
      store.cursor = { start: { index: props.index, offset: props.node.value.length }, end: { index: props.index, offset: props.node.value.length } };
    }}>
    <Text node={props.node}
      height='1.75rem'
      index={props.index}
      visibleRange={[2, props.node.value.length]}
      ref={nodeRef}/>
  </h2>;
},
  [(v, node, i, store) => {
    if (!v.startsWith('- ')) return false;
    const newNode = store.currentNode = store.document[i] = createScene(node as IScene);
    if (i > 0) store.document[i - 1].next = newNode;
    if (i < store.document.length - 1) store.document[i + 1].prev = newNode;
    return v;
  }]
);

export const createScene: CreateNode<IScene> = (node) => ({
  value: '',
  ...node,
  name: 'scene',
  onBreakLine: (node, store, i) => {
    if (store.cursor.start.index === store.cursor.end.index && store.cursor.start.offset <= 2 && store.cursor.end.offset <= 2) {
      const newNode = createParagraph({ prev: node.prev, next: node });
      if(node.prev) node.prev.next = newNode;
      node.prev = newNode;
      store.document.splice(i, 0, newNode);
      return;
    }
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
