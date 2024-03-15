import { Editor } from "@tiptap/core";
import { BsLayoutSidebar } from "solid-icons/bs";
import { sidebarOpen, toggleSidebarOpen } from "../../sidebar/sidebar";
import { onKeyStroke } from "solidjs-use";

export default function EditorFooter(props: { editor: Editor }) {
  onKeyStroke(
    ["l", "L"],
    (ev) => {
      if (ev.ctrlKey) toggleSidebarOpen();
    },
    { dedupe: true },
  );

  return (
    <div class="flex w-full h-8 bg-base-100 border-t-2 border-primary">
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
