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

export function get_scripts(path: string) {
  return invoke<FileInfo[]>("get_scripts", { path });
}
