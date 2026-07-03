import { deleteRange } from "@/scripts/util/editor";
import { clamp } from 'lodash';
import { createEffect, JSX, JSXElement, onMount, useContext } from "solid-js";
import Cursor from "../Cursor";
import { editorContext, INode, InputRule, NodeComponent } from "../Editor";

export interface IText extends INode {
  name: 'text';
}

export type NodeProps = {
  node: INode;
  index: number;
  height: JSX.CSSProperties['height'];
  visibleRange?: [number, number];
  ref?: HTMLSpanElement;
} & Record<string, any>;

export function Text(props: NodeProps) {
  let nodeRef!: HTMLSpanElement;
  const store = useContext(editorContext);
  const content = () => {
    const [s, e] = props.visibleRange || [0, props.node.value.length];
    // const [s, e] = [0, props.node.value.length];
    const value = props.node.value.slice(s, e);
    const start = { index: store.cursor.start.index, offset: clamp(store.cursor.start.offset - s, 0, e) };
    const end = { index: store.cursor.end.index, offset: clamp(store.cursor.end.offset - s, 0, e) };

    if (start.index === props.index) {
      if (start.index === end.index) {
        const content = [];
        if (start.offset === 0 && end.offset === 0) content.push(<Cursor />);
        if (start.offset > 0) content.push(value.slice(0, start.offset), end.offset > start.offset ? void 0 : <Cursor />);
        if (end.offset > start.offset) content.push(<span class='bg-primary-content'>{value.slice(start.offset, end.offset)}</span>, value.slice(end.offset, value.length));
        else content.push(value.slice(start.offset, props.node.value.length));
        if (!props.node.value) content.push(<>&nbsp;</>);
        return content;
      }
      return [value.slice(0, start.offset), <span class='bg-primary-content'>{value.slice(start.offset)}</span>];
    }
    if (end.index === props.index) {
      return [<span class='bg-primary-content'>{value.slice(0, end.offset)}</span>, value.slice(end.offset, value.length)];
    }
    if (props.index > start.index && props.index < end.index)
      return [<span class='bg-primary-content'>{value || <>&nbsp;</>}</span>];
    return [value || <>&nbsp;</>];
  };

  onMount(() => {
    props.ref = nodeRef;
  });

  createEffect(() => {
    if (!props.visibleRange) return;
    if (props.index === store.cursor.start.index) {
      if (store.cursor.start.offset < props.visibleRange[0]) {
        if (store.cursor.start.offset === 0)
          store.cursor.start.offset = props.visibleRange[0];
        else if (props.node.prev) {
          store.currentNode = props.node.prev;
          store.cursor.start = { index: props.index - 1, offset: props.node.prev!.value.length };
        } else
          store.cursor.start.offset = props.visibleRange[0];
      }
      if (store.cursor.start.offset > props.visibleRange[1]+1) {
        if (store.cursor.start.offset === props.node.value.length)
          store.cursor.start.offset = props.visibleRange[1];
        else if (props.node.next) {
          store.currentNode = props.node.next;
          store.cursor.start = { index: props.index + 1, offset: 0 };
        } else
          store.cursor.start.offset = props.visibleRange[1];
      }
    }
    if (props.index === store.cursor.end.index) {
      if (store.cursor.end.offset < props.visibleRange[0]) {
        if (store.cursor.end.offset === 0)
          store.cursor.end.offset = props.visibleRange[0];
        else if (props.node.prev) {
          store.currentNode = props.node.prev;
          store.cursor.end = { index: props.index - 1, offset: props.node.prev!.value.length };
        } else
          store.cursor.end.offset = props.visibleRange[0];
      }
      if (store.cursor.end.offset > props.visibleRange[1]+1) {
        if (store.cursor.end.offset === props.node.value.length)
          store.cursor.end.offset = props.visibleRange[1];
        else if (props.node.next) {
          store.currentNode = props.node.next;
          store.cursor.end = { index: props.index + 1, offset: 0 };
        } else
          store.cursor.end.offset = props.visibleRange[1];
      }
    }
  });

  const getOffsetFromPosition = (position: CaretPosition) => {
    let offset: number = props.visibleRange?.[0] || 0;
    // let offset: number = 0;
    if (store.currentNode === props.node) {
      for (const child of nodeRef.childNodes.values()) {
        if ((child.nodeType === child.TEXT_NODE ? child : child.firstChild) === position.offsetNode) {
          offset += position.offset;
          return offset;
        }
        offset += child.textContent?.length || 0;
      }
      return offset;
    }
    store.currentNode = props.node;
    offset = position?.offset || props.node.value.length;
    return offset;
  };

  return <span
    ref={nodeRef}
    onMouseDown={(e) => {
      const position = document.caretPositionFromPoint(e.clientX, e.clientY);
      if (!position) return;
      const offset = getOffsetFromPosition(position);
      store.cursor = { start: { index: props.index, offset }, end: { index: props.index, offset } };
    }}
    onMouseMove={(e) => {
      if (!store.selecting) return;
      const position = document.caretPositionFromPoint(e.clientX, e.clientY);
      if (!position) return;
      store.cursor.end = { index: props.index, offset: getOffsetFromPosition(position) };
    }}
    // onMouseUp={(e) => {

    //   const position = document.caretPositionFromPoint(e.clientX, e.clientY);
    //   if (!position) return;
    //   store.cursor.end = { index: props.index, offset: getOffsetFromPosition(position) };

    // }}
    {...props}
    style={{ ...props.style, height: props.height, display: 'inline-block', 'white-space': 'break-spaces' }}
  >{content()}</span>;
}


export function createNodeElement<T extends string = string>(name: T, component: (props: NodeProps) => JSXElement, inputRules: InputRule[] = []): NodeComponent<T> {
  return { name, component, inputRules };
};

export type CreateNode<T extends INode> = (node: Partial<T> & Pick<INode, 'prev' | 'next'>) => T;
export const createText: CreateNode<IText> = (node) => ({
  value: '',
  ...node,
  name: 'text',
  onBreakLine: (node, store, i) => {
    node.value = node.value.slice(0, store.cursor.start.offset);
    const newValue = node.value.slice(store.cursor.end.offset, node.value.length);
    const newNode = node.next = store.currentNode = createText({
      prev: node,
      next: store.document[i + 1] || null,
      value: newValue,
    });
    if (store.document[i + 1]) store.document[i + 1].prev = newNode;
    store.document.splice(i + 1, 0, newNode);
    deleteRange(store, store.cursor);
    store.cursor = { start: { index: store.cursor.start.index + 1, offset: 0 }, end: { index: store.cursor.start.index + 1, offset: 0 } };
  },
});

export default createNodeElement('text', Text);
