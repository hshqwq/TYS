import { save } from "@/scripts/yukimi/save";
import { globalStore } from "@/store/global";
import { Tabs } from "@ark-ui/solid";
import { Editor } from "@tiptap/core";
import {
  BsArrow90degLeft,
  BsArrow90degRight,
  BsChevronDown,
  BsChevronUp,
  BsSave,
} from "solid-icons/bs";
import { Show, createSignal } from "solid-js";
import { createEditorTransaction } from "solid-tiptap";
import { Transition } from "solid-transition-group";
import { editingFilePath } from "../editor";
import CommonPanel from "./panels/common";
import "./transition.scss";
function Skeleton() {
  return (
    <div class="w-full h-full p-4 flex flex-col gap-2.5">
      <div class="flex flex-none justify-between">
        <div class="skeleton w-96 h-4" />
        <div class="skeleton w-24 h-4" />
      </div>
      <div class="skeleton w-full h-4" />
      <div class="skeleton w-full h-4" />
    </div>
  );
}

export default function EditorMenu(props: { editor: Editor; }) {
  const [open, setOpen] = createSignal<boolean>(true);
  const [tab, setTab] = createSignal<string>("common");

  const canUndo = createEditorTransaction(
    () => props.editor,
    (editor) => editor?.can().undo(),
  );
  const canRedo = createEditorTransaction(
    () => props.editor,
    (editor) => editor?.can().redo(),
  );

  return (
    <div class="flex-none w-full max-w-full max-h-36 bg-base-100 border-b border-neutral z-20">
      <Show when={props.editor && editingFilePath()} fallback={<Skeleton />}>
        <Tabs.Root value={tab()} onValueChange={(v) => setTab(v.value)}>
          <div class="relative flex px-4 py-2 justify-between h-8 w-full border-b border-neutral items-center bg-base-100 z-20">
            {/* left */}
            <div class="flex items-center">
              <div class="flex items-center gap-0.5">
                <button
                  class="btn btn-outline btn-xs"
                  disabled={!canUndo()}
                  onClick={() => props.editor.chain().focus().undo().run()}
                >
                  <BsArrow90degLeft />
                </button>
                <button
                  class="btn btn-outline btn-xs"
                  disabled={!canRedo()}
                  onClick={() => props.editor.chain().focus().redo().run()}
                >
                  <BsArrow90degRight />
                </button>
                <button
                  class="btn btn-outline btn-xs"
                  disabled={!editingFilePath()}
                  onClick={async () =>{
                    editingFilePath() && await save(editingFilePath()!, props.editor.getJSON());
                    globalStore.saved = true;
                  }
                  }
                >
                  <BsSave />
                </button>
              </div>

              <div class="divider divider-horizontal ml-0.5 mr-0.5" />

              <Tabs.List class="tabs tabs-border tabs-xs bg-transparent relative" role="tablist">
                <Tabs.Trigger
                  class="tab"
                  role="tab"
                  classList={{ "tab-active font-bold": tab() === "common" }}
                  value="common"
                >
                  常用
                </Tabs.Trigger>
                <Tabs.Trigger
                  class="tab"
                  role="tab"
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
          <Transition name="menu-panel-transition">
            <Show when={open()}>
              <div class="h-28 p-4 max-h-28 max-w-full overflow-x-auto overflow-y-hidden z-10">
                <Tabs.Content value="common" class="w-fit h-full">
                  <CommonPanel editor={props.editor} />
                </Tabs.Content>
                <Tabs.Content value="TEST" class="w-fit h-full">
                  TEST
                </Tabs.Content>
              </div>
            </Show>
          </Transition>
        </Tabs.Root>
      </Show>
    </div>
  );
}
