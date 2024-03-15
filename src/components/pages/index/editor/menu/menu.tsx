import { Show, createSignal } from "solid-js";
import { Editor } from "@tiptap/core";
import { Tabs } from "@kobalte/core";
import {
  BsChevronUp,
  BsChevronDown,
  BsArrow90degLeft,
  BsArrow90degRight,
  BsSave,
} from "solid-icons/bs";
import CommonPanel from "./panels/common";
import { createEditorTransaction } from "solid-tiptap";
import { save } from "@/scripts/yukimi/save";

function Skeleton() {
  return (
    <div class="w-full h-full p-4 flex flex-col gap-2.5">
      <div class="flex flex-none justify-between">
        <div class="skeleton w-96 h-4" />
        <div class="skeleton w-24 h-4" />
      </div>
      <div class="skeleton w-full h-full" />
      <div class="skeleton w-full h-full" />
    </div>
  );
}

export default function EditorMenu(props: { editor: Editor | undefined }) {
  const [open, setOpen] = createSignal<boolean>(true);
  const [tab, setTab] = createSignal<string>("");

  const canUndo = createEditorTransaction(
    () => props.editor,
    (editor) => editor?.can().undo(),
  );
  const canRedo = createEditorTransaction(
    () => props.editor,
    (editor) => editor?.can().redo(),
  );

  return (
    <div class="flex-none w-full max-w-full h-36 min-h-36 bg-base-100 shadow-md shadow-primary z-20">
      <Show when={props.editor} fallback={<Skeleton />}>
        <Tabs.Root value={tab()} onChange={(v) => setTab(v)}>
          <div class="relative flex pl-4 pr-4 justify-between h-8 w-full pb-1 border-b-2 border-primary items-center">
            {/* left */}
            <div class="flex items-center">
              <div class="flex items-center gap-0.5">
                <button
                  class="btn btn-outline btn-xs"
                  disabled={!canUndo()}
                  onClick={() => props.editor!.chain().focus().undo().run()}
                >
                  <BsArrow90degLeft />
                </button>
                <button
                  class="btn btn-outline btn-xs"
                  disabled={!canRedo()}
                  onClick={() => props.editor!.chain().focus().redo().run()}
                >
                  <BsArrow90degRight />
                </button>
                <button
                  class="btn btn-outline btn-xs"
                  onClick={() => save(props.editor!.getJSON())}
                >
                  <BsSave />
                </button>
              </div>

              <div class="divider divider-horizontal ml-0.5 mr-0.5" />

              <Tabs.List class="tabs tabs-boxed tabs-xs bg-transparent relative">
                <Tabs.Trigger
                  class="tab"
                  classList={{ "tab-active font-bold": tab() === "common" }}
                  value="common"
                >
                  常用
                </Tabs.Trigger>
                <Tabs.Trigger
                  class="tab"
                  classList={{ "tab-active font-bold": tab() === "TEST" }}
                  value="TEST"
                >
                  TEST
                </Tabs.Trigger>
              </Tabs.List>
            </div>

            {/* right */}
            <div class="w-fit max-w-sm">
              <label class="swap h-full btn btn-ghost btn-xs">
                <input
                  type="checkbox"
                  value={String(open())}
                  onClick={() => void setOpen((prev) => !prev)}
                />
                <BsChevronUp class="swap-on" />
                <BsChevronDown class="swap-off" />
              </label>
            </div>
          </div>

          {/* panels */}
          <Show when={open()}>
            <div class="h-28 p-4 max-h-28 max-w-full overflow-auto">
              <Tabs.Content value="common" class="w-fit h-full">
                <CommonPanel editor={props.editor!} />
              </Tabs.Content>
              <Tabs.Content value="TEST" class="w-fit h-full">
                TEST
              </Tabs.Content>
            </div>
          </Show>
        </Tabs.Root>
      </Show>
    </div>
  );
}
