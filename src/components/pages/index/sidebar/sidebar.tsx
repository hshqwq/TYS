import "./transition.scss";

import { Tabs } from "@kobalte/core";
import { Show, createSignal } from "solid-js";
import { Transition } from "solid-transition-group";
import Files from "./files/files";

export const [sidebarOpen, setSidebarOpen] = createSignal<boolean>(true);
export const toggleSidebarOpen = () => setSidebarOpen((prev) => !prev);

export default function Sidebar() {
  return (
    <Transition name="sidebar-transition">
      <Show when={sidebarOpen()}>
        <Tabs.Root
          class="w-64 h-full flex flex-col relative bg-base-100 flex-none border-r-2 border-primary z-40"
          defaultValue="files"
        >
          <Tabs.List class="relative w-full h-10 flex justify-around items-center">
            <Tabs.Trigger class="w-full m-2" value="files">
              文件
            </Tabs.Trigger>
            <Tabs.Trigger class="w-full m-2" value="outline">
              大纲
            </Tabs.Trigger>
            <Tabs.Indicator class="absolute transition-transform bg-primary bottom-0 left-0 w-full h-0.5" />
          </Tabs.List>
          <Tabs.Content
            class="h-full"
            value="files"
            children={<Files rootDir="./test_scripts/" />}
          />
        </Tabs.Root>
      </Show>
    </Transition>
  );
}
