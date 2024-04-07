import { invoke } from "@tauri-apps/api/core";

export default function open_with_file_manager(path: string) {
  return invoke<string>("open_with_file_manager_cmd", { path });
}
