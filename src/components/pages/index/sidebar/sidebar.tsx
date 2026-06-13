import "./transition.scss";

import { globalStore } from "@/store/global";
import { Tabs } from "@ark-ui/solid";
import { Show, createSignal } from "solid-js";
import { Transition } from "solid-transition-group";
import Files from "./files/files";

export const [sidebarOpen, setSidebarOpen] = createSignal<boolean>(true);
export const toggleSidebarOpen = () => setSidebarOpen((prev) => !prev);

export default function Sidebar() {
  const [tab, setTab] = createSignal<string>("files");
  return (
    <Transition name="sidebar-transition">
      <Show when={sidebarOpen()}>
        <Tabs.Root
          class="w-64 h-screen flex flex-col bg-base-100 flex-none border-r-2 border-neutral"
          value={tab()}
          onValueChange={(v) => setTab(v.value)}
        >
          <Tabs.List role="tablist" class="tabs tabs-border flex h-14 pb-2 border-b border-base-200">
            <Tabs.Trigger
              role="tab"
              class="w-full flex-1 h-12 p-2 tab"
              classList={{ "tab-active": tab() === "files" }}
              value="files"
            >
              文件
            </Tabs.Trigger>
            <Tabs.Trigger
              role="tab"
              class="w-full flex-1 h-12 p-2 tab"
              classList={{ "tab-active": tab() === "outline" }}
              value="outline"
            >
              大纲
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content
            class=""
            style={{height: 'calc(100% - 3.5rem)'}}
            value="files"
            children={<Files rootDir={globalStore.baseDir} />}
          />
        </Tabs.Root>
      </Show>
    </Transition>
  );
}
