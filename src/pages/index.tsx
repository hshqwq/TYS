import Editor from "@/components/pages/index/editor/editor";
import Sidebar from "@/components/pages/index/sidebar/sidebar";

export default function Index() {
  return (
    <div class="w-full h-screen flex">
      <Sidebar></Sidebar>
      <Editor></Editor>
    </div>
  );
}
