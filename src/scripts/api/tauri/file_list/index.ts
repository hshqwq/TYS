import { globalStore } from "@/store/global";
import { invoke } from "@tauri-apps/api/core";

export enum FileType {
  YkmScript = "0",
  Dir = "1",
}

export interface FileInfo {
  name: string;
  file_type: FileType;
  path: string;
  summary: string;
}

export function get_scripts(path: string, maxLen:number=80) {
  return invoke<FileInfo[]>("get_scripts", { path, maxLen });
}

export async function set_base_dir() {
  const path = await invoke<string>("set_base_dir");
  return globalStore.baseDir = path || '';
}
