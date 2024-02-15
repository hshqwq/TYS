import { Editor } from "@tiptap/core";
import { BsTree, BsChatLeftText, BsCommand, BsTypeBold, BsTypeItalic } from "solid-icons/bs";
import { useEditorIsActive } from "solid-tiptap";

export default function CommonPanel(props: { editor: Editor }) {
  const isBold = useEditorIsActive(
    () => props.editor,
    () => "bold",
    {},
  );

  const isItalic = useEditorIsActive(
    () => props.editor,
    () => "italic",
    {},
  );

  return (
    <div class="flex min-w-full h-full w-fit">
      <div class="divider divider-horizontal text-xs ml-1">语句</div>
      <div class="grid grid-rows-2 grid-flow-col auto-cols-max justify-items-start items-center gap-1">
        <button
          class="btn btn-outline btn-xs"
          onClick={() => props.editor.chain().focus().setScene().run()}
        >
          <BsTree />
          场景
        </button>
        <button
          class="btn btn-outline btn-xs col-span-2"
          onClick={() => props.editor.chain().focus().setDialog().run()}
        >
          <BsChatLeftText />
          对话 / 旁白
        </button>
        <button
          class="btn btn-outline btn-xs"
          disabled
          onClick={() => props.editor.chain().focus().setScene().run()}
        >
          <BsCommand />
          命令
        </button>
      </div>

      <div class="divider divider-horizontal text-xs">样式</div>
      <div class="grid grid-rows-2 grid-flow-col auto-cols-max justify-items-start items-center gap-1">
        <div class="join">
          <button
            class="btn btn-xs btn-neutral join-item"
            classList={{
              "btn-outline": !isBold(),
            }}
            onClick={() => props.editor.chain().focus().toggleBold().run()}
          >
            <BsTypeBold />
          </button>
          <button
            class="btn btn-neutral btn-xs join-item"
            classList={{
              "btn-outline": !isItalic(),
            }}
            onClick={() => props.editor.chain().focus().toggleItalic().run()}
          >
            <BsTypeItalic />
          </button>
        </div>
      </div>
    </div>
  );
}
