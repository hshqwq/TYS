import "./transition.scss";

import { Show, createSignal } from "solid-js";
import { Transition } from "solid-transition-group";

export const [sidebarOpen, setSidebarOpen] = createSignal<boolean>(true);
export const toggleSidebarOpen = () => setSidebarOpen((prev) => !prev);

export default function Sidebar() {
  return (
    <Transition name="sidebar-transition">
      <Show when={sidebarOpen()}>
        <div class="w-64 bg-base-100 flex-none border-r-2 border-primary z-40">Side Bar</div>
      </Show>
    </Transition>
  );
}
