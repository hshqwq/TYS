import { createTiptapEditor, useEditorJSON } from "solid-tiptap";
import TiptapExtensions from "@/configs/tiptap/exts";
import EditorMenu from "./menu/menu";
import { createEffect, onMount } from "solid-js";
import { save } from "@/scripts/yukimi/save";
import { onKeyStroke } from "solidjs-use";
import { isDev } from "solid-js/web";
import EditorFooter from "./footer/footer";

export default function Editor() {
  let editorRef!: HTMLDivElement;

  const editor = createTiptapEditor(() => ({
    element: editorRef,
    extensions: TiptapExtensions,
    content: ``,
    autofocus: true,
  }));

  onMount(() => {
    onKeyStroke(
      ["s", "S"],
      (ev) => {
        if (ev.ctrlKey) save(editor()!.getJSON());
      },
      { dedupe: true },
    );
  });

  if (isDev) {
    const json = useEditorJSON(editor);
    createEffect(() => {
      console.log(JSON.stringify(json(), null, 2));
    });
  }

  return (
    <div class="flex-auto w-full h-full flex flex-col bg-base-200 overflow-hidden">
      <EditorMenu editor={editor()} />
      <div class="flex-auto w-full max-w-full h-full max-h-full overflow-hidden bg-base-100 cursor-text">
        <div
          ref={editorRef}
          onClick={(ev) => ev.target === ev.currentTarget && editor()?.commands.focus()}
          class="w-full h-full max-h-full max-w-full p-6 pl-16 prose prose-sm overflow-auto spelling-error selection:bg-base-200"
        ></div>
      </div>
      <EditorFooter editor={editor()} />
    </div>
  );
}
