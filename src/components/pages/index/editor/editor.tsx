import TiptapExtensions from "@/configs/tiptap/exts";
import parse from "@/scripts/tiptap/exts/yukimi/transformers/parse";
import isYkmPath from "@/scripts/yukimi/checkers/ykm-path";
import { save } from "@/scripts/yukimi/save";
import { globalStore } from "@/store/global";
import { exists, readTextFile } from "@tauri-apps/plugin-fs";
import { useEditor } from "@vrite/tiptap-solid";
import { Setter, createSignal, onMount } from "solid-js";
import { isDev } from "solid-js/web";
import { onKeyStroke, whenever } from "solidjs-use";
import Editor from "./editor/Editor";
import Paragraph from "./editor/nodes/Paragraph";
import Scene from "./editor/nodes/Scene/Scene";
import Text from "./editor/nodes/Text";
import EditorFooter from "./footer/footer";
import EditorMenu from "./menu/menu";

export type EditingFilePath = string | null;

const [editingFilePath, setEditingFilePath] = createSignal<EditingFilePath>(null);
let lastEditingFilePath: EditingFilePath = null;

const setEditingFilePathWithCheck: Setter<EditingFilePath> = async (
  path: EditingFilePath | ((prev: EditingFilePath) => EditingFilePath),
) => {
  const newPath = path instanceof Function ? path(editingFilePath()) : path;

  if (newPath !== null)
    if (!isYkmPath(newPath) || !(await exists(newPath))) return editingFilePath();

  lastEditingFilePath = editingFilePath();

  return setEditingFilePath(newPath);
};

export { editingFilePath, setEditingFilePathWithCheck as setEditingFilePath };

export default function TiptapEditor() {
  const editor = useEditor({
    extensions: TiptapExtensions,
    content: ``,
    autofocus: true,
    editable: !!editingFilePath(),
    onUpdate: () => globalStore.saved = false
  });

  whenever(editingFilePath, async () => {
    console.log('editing:', editingFilePath());

    lastEditingFilePath && await save(lastEditingFilePath, editor().getJSON());
    globalStore.saved = true;

    if (!editingFilePath()) {
      editor().setEditable(false);
      editor().commands.setContent("");
      return;
    }

    editor().setEditable(false);
    editor().commands.setContent('<div class="text-base-300">Loading...</div>');

    const newFileContent = parse(await readTextFile(editingFilePath()!));
    editor().commands.setContent(newFileContent);
    editor().setEditable(true);
  });

  onMount(() => {
    onKeyStroke(
      ["s", "S"],
      async (ev) => {
        if (ev.ctrlKey && editingFilePath()) {
          await save(editingFilePath()!, editor().getJSON());
          globalStore.saved = true;
        };
      },
      { dedupe: true },
    );
  });

  if (isDev) {
    const json = () => editor().getJSON();
    editor().on("update", () => {
      console.log('content', JSON.stringify(json(), null, 2));
    });
  }

  return (
    <div class="flex-auto w-full h-full flex flex-col bg-base-200 overflow-hidden">
      <EditorMenu editor={editor()} />
      <div class="flex-auto w-full max-w-full h-full max-h-full overflow-hidden bg-base-100 cursor-text">
        <Editor
          class="w-full h-full max-h-full max-w-full p-6 prose prose-sm overflow-auto spelling-error selection:bg-base-200"
          nodes={[Text, Paragraph, Scene]}
        />
        {/* <SolidEditorContent
          editor={editor()}
          onClick={(ev) => ev.target === ev.currentTarget && editor()?.commands.focus()}
          class="w-full h-full max-h-full max-w-full p-6 pl-16 prose prose-sm overflow-auto spelling-error selection:bg-base-200"
        ></SolidEditorContent> */}
      </div>
      <EditorFooter editor={editor()} />
    </div>
  );
}
