import { deleteRange } from "@/scripts/util/editor";
import { createContext, createEffect, createMemo, For, JSX, JSXElement, onMount } from "solid-js";
import { createMutable } from "solid-js/store";
import { onKeyStroke, useEventListener, useFocusWithin } from "solidjs-use";
import NodeMatch from "./nodes/NodeMatch";
import Paragraph, { createParagraph } from "./nodes/Paragraph";
import Text, { NodeProps } from './nodes/Text';

export type EventHandler = (node: INode, store: EditorContext, index: number) => void;

export type INode = {
  name: string,
  value: string,
  prev: INode | null;
  next: INode | null;
  onDelete?: EventHandler;
  onBreakLine?: EventHandler;
};

export type EditorRange = {
  start: {
    index: number;
    offset: number;
  };
  end: {
    index: number;
    offset: number;
  };
};

export type EditorContext = {
  cursor: EditorRange;
  selecting: boolean;
  document: INode[];
  currentNode: INode | null;
  focused: boolean;
};

const defaultEditorStore: EditorContext = {
  cursor: { start: { index: 0, offset: 0 }, end: { index: 0, offset: 0 } },
  selecting: false,
  document: [],
  currentNode: null,
  focused: false,
};

export const editorContext = createContext<EditorContext>(defaultEditorStore);


export const nodeMap = new Map<string, (props: NodeProps) => JSXElement>();
nodeMap.set('text', Text);
nodeMap.set('paragraph', Paragraph);

export default function Editor(props: {
  defaultValue?: string,
  class: string;
  onUpdate?: (content: string) => void;
  autoFocus?: boolean;
}) {
  let editorRef!: HTMLDivElement;
  let inputRef!: HTMLInputElement;
  let composition = false;
  let cursorSyncLock = false;
  const editorStore = createMutable<EditorContext>(defaultEditorStore);
  const currentNode = () => editorStore.currentNode;
  const currentIndex = createMemo(() => editorStore.document.findIndex(node => node === currentNode()));
  createEffect(() => {
    // handle empty document
    if (!editorStore.document.length) {
      const node: INode = editorStore.currentNode = createParagraph({ prev: null, next: null });
      editorStore.document.push(node);
    }
  });

  createEffect(() => {
    if (editorStore.cursor.start.index < editorStore.cursor.end.index) return;
    if ((editorStore.cursor.start.index === editorStore.cursor.end.index && editorStore.cursor.start.offset <= editorStore.cursor.end.offset)) return;
    editorStore.cursor = {
      start: editorStore.cursor.end,
      end: editorStore.cursor.start,
    };
  });

  // createEffect(() => {
  //   editorStore.currentNode = editorStore.document[editorStore.cursor.end.index];
  // })

  onMount(() => {
    const focused = useFocusWithin(editorRef);
    if (props.autoFocus) editorRef.focus();

    createEffect(() => {
      editorStore.focused = focused();
      if (focused()) return inputRef.focus();
      inputRef.blur();
      editorStore.selecting = false;
    });

    createEffect(() => {
      inputRef.selectionStart = editorStore.cursor.start.offset;
      inputRef.selectionEnd = editorStore.cursor.end.offset;
    });

    useEventListener(editorRef, 'mousedown', () => {
      editorStore.selecting = true;
    });

    useEventListener(editorRef, 'mouseup', () => {
      editorStore.selecting = false;
    });
  });

  const onInputHandler: JSX.InputEventHandlerUnion<HTMLInputElement, InputEvent> = (ev) => {
    if (composition || !currentNode()) return;
    currentNode()!.value = ev.currentTarget.value;
  };

  onKeyStroke('ArrowUp', (ev) => {
    if (!currentNode()?.prev) return;
    ev.preventDefault();
    const offset = inputRef.selectionStart;
    editorStore.currentNode = currentNode()!.prev;
    // if (ev.shiftKey) {
    //   editorStore.cursor.start.index = 0;
    //   editorStore.cursor.end.index = currentIndex();
    //   if (offset !== null) {
    //     inputRef.selectionStart = 0;
    //     inputRef.selectionEnd = offset;
    //   }
    // } else {
    editorStore.cursor.start.index = editorStore.cursor.end.index = currentIndex();
    if (offset !== null) inputRef.selectionStart = inputRef.selectionEnd = offset;
    // }
  });
  onKeyStroke('ArrowDown', (ev) => {
    if (!currentNode()?.next) return;
    ev.preventDefault();
    const offset = inputRef.selectionStart;
    editorStore.currentNode = currentNode()!.next;
    // if (ev.shiftKey) {
    //   editorStore.cursor.start.index = currentIndex() - 1;
    //   editorStore.cursor.end.index = currentIndex();
    //   if (offset !== null) {
    //     inputRef.selectionStart = 0;
    //     inputRef.selectionEnd = offset;
    //   }
    // } else {
    editorStore.cursor.start.index = editorStore.cursor.end.index = currentIndex();
    if (offset !== null) inputRef.selectionStart = inputRef.selectionEnd = offset;
    // }
  });
  onKeyStroke('ArrowLeft', (ev) => {
    if (inputRef.selectionStart || inputRef.selectionStart !== inputRef.selectionEnd || !currentNode()?.prev) return;
    ev.preventDefault();
    editorStore.currentNode = currentNode()!.prev || currentNode()!;
    inputRef.selectionStart = currentNode()!.value.length;
  });
  onKeyStroke('ArrowRight', (ev) => {
    if (!inputRef.selectionStart || inputRef.selectionStart < currentNode()!.value.length || inputRef.selectionStart !== inputRef.selectionEnd || !currentNode()?.next) return;
    ev.preventDefault();
    editorStore.currentNode = currentNode()!.next || currentNode()!;
    inputRef.selectionStart = inputRef.selectionEnd = 0;
  });
  onKeyStroke('Enter', (ev) => {
    ev.preventDefault();
    cursorSyncLock = true;
    currentNode()?.onBreakLine?.(currentNode()!, editorStore, editorStore.document.indexOf(currentNode()!));
  });
  onKeyStroke('Backspace', (ev) => {
    if (editorStore.cursor.start.index === editorStore.cursor.end.index) {
      if (editorStore.cursor.start.offset === 0 && editorStore.cursor.start.index > 0) {
        ev.preventDefault();
        const len = editorStore.document[editorStore.cursor.start.index - 1].value.length;
        deleteRange(editorStore, { start: { index: editorStore.cursor.start.index - 1, offset: editorStore.document[editorStore.cursor.start.index - 1].value.length }, end: editorStore.cursor.end });
        editorStore.currentNode = editorStore.document[editorStore.cursor.start.index-1];
        editorStore.cursor.end = editorStore.cursor.start = {index: editorStore.cursor.start.index - 1, offset: len };
      }
      return;
    }
    ev.preventDefault();
    deleteRange(editorStore, editorStore.cursor);
    editorStore.currentNode = editorStore.document[editorStore.cursor.start.index];
    editorStore.cursor.end = editorStore.cursor.start;
  });

  return <editorContext.Provider value={editorStore}>
    <div tabIndex={0} ref={editorRef} class={'relative w-full h-full ' + props.class || ''}>
      <button class='btn btn-sm absolute bottom-8' onClick={() => console.log(editorStore)}>log</button>
      <input
        ref={inputRef}
        class="absolute bottom-0 input input-xs"
        type="text"
        disabled={!currentNode()}
        value={currentNode()?.value || ''}
        onInput={onInputHandler}
        onCompositionStart={() => composition = true}
        onCompositionEnd={(ev) => {
          composition = false;
          onInputHandler(ev as unknown as InputEvent & { currentTarget: HTMLInputElement; target: HTMLInputElement; });
        }}
        onBlur={() => {
          composition = false;
          if (editorStore.focused) inputRef.focus();
        }}
        onSelectionChange={(ev) => {
          if (cursorSyncLock) return cursorSyncLock = false;
          const { selectionStart, selectionEnd } = ev.currentTarget;

          if (editorStore.selecting) return;
          editorStore.cursor = {
            start: { index: currentIndex(), offset: selectionStart || 0 },
            end: { index: currentIndex(), offset: selectionEnd || 0 }
          };
        }}
      ></input>
      <div class='relative break-all p-4'>
        <For each={editorStore.document}>{(node, i) => <NodeMatch node={node} index={i()} height={'1rem'} />}</For>
      </div>
    </div>
  </editorContext.Provider>;
}
