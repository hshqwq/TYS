import { Editor } from "@tiptap/core";
import { BsLayoutSidebar } from "solid-icons/bs";
import { onKeyStroke } from "solidjs-use";
import { sidebarOpen, toggleSidebarOpen } from "../../sidebar/sidebar";

export default function EditorFooter(props: { editor: Editor }) {
  onKeyStroke(
    ["l", "L"],
    (ev) => {
      if (ev.ctrlKey) toggleSidebarOpen();
    },
    { dedupe: true },
  );

  return (
    <div class="flex w-full h-8 bg-base-100 border-t border-base-300">
      <button
        onClick={toggleSidebarOpen}
        class="btn btn-sm btn-ghost rounded-none"
        classList={{ "btn-active": sidebarOpen() }}
      >
        <BsLayoutSidebar />
      </button>
    </div>
  );
}
