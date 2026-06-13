import Editor, { setEditingFilePath } from "@/components/pages/index/editor/editor";
import Sidebar from "@/components/pages/index/sidebar/sidebar";
import resolve from "@/scripts/util/path/resolve";
import { globalStore } from "@/store/global";
import { onMount } from "solid-js";
import { isDev } from "solid-js/web";
import { useUrlSearchParams } from "solidjs-use";

export default function Index() {
  const [searches] = useUrlSearchParams<{ baseDir: string; start: string; }>();
  onMount(() => {
    globalStore.baseDir = isDev ? './test_scripts/' : searches().baseDir ? resolve(searches().baseDir) + '/' : '';
    setEditingFilePath(isDev ? resolve('./test_scripts/dev.ykm') : searches().start);
  });

  return (
    <div class="w-full h-screen flex overflow-hidden">
      <Sidebar></Sidebar>
      <Editor></Editor>
    </div>
  );
}
