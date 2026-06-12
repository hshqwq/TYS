/**
 * 文件操作封装，方便与后端解耦
 * 若修改后端只需按封装类型重新编写此文件与后端的交互就行
 */

import { invoke } from "@tauri-apps/api/core";
import * as fs from "@tauri-apps/plugin-fs";
import { defaults } from "lodash";

const defaultTauriFileOptions = { baseDir: void 0 };

export function readTextFile(path: string | URL): Promise<string> {
  return fs.readTextFile(path, defaultTauriFileOptions);
}

export function readBinaryFile(path: string | URL): Promise<Uint8Array> {
  return fs.readFile(path, defaultTauriFileOptions);
}

export interface IReadDirOptions {
  /** 递归获取子目录内容 */
  recursion?: boolean;
  /** 最大递归深度 */
  maxDepth?: number;
  /** 递归次数，仅程序内部递归使用 */
  readonly _depth?: number;
}

export function readDir(path: string | URL): Promise<fs.DirEntry[]> {
  return fs.readDir(path, defaultTauriFileOptions);
}

export function exists(path: string | URL): Promise<boolean> {
  return fs.exists(path, defaultTauriFileOptions);
}

/** 获取父目录路径 */
export function getParentPath(path: string | URL): string {
  if (path instanceof URL) path = path.href;
  if (path[path.length - 1] === "/") path = path.slice(0, -1);
  return path.slice(0, path.lastIndexOf("/") + 1);
}

export function mkdir(
  path: string | URL,
  options: fs.MkdirOptions,
): Promise<void> {
  return fs.mkdir(path, defaults(options, defaultTauriFileOptions));
}

/** 仅在路径不存在时创建文件夹 */
export async function mkdirWhenInexistent(
  path: string | URL,
  recursive = true,
): Promise<void> {
  if (!(await exists(path))) {
    return await mkdir(path, { ...defaultTauriFileOptions, recursive });
  }
}

export async function writeTextFile(
  path: string | URL,
  contents: string,
  create = true,
): Promise<void> {
  if (create) {
    // 路径不存在时先创建路径
    const parentDirPath = getParentPath(path);
    await mkdirWhenInexistent(parentDirPath, true);
  }
  return fs.writeTextFile(path, contents, defaultTauriFileOptions);
}

export async function writeBinaryFile(
  path: string | URL,
  contents: Uint8Array,
  create = true,
): Promise<void> {
  if (create) {
    // 路径不存在时先创建路径
    const parentDirPath = getParentPath(path);
    await mkdirWhenInexistent(parentDirPath, true);
  }
  return fs.writeFile(path, contents, defaultTauriFileOptions);
}

const defaultRemoveOptions = { ...defaultTauriFileOptions, recursive: true };
export function remove(
  path: string | URL,
  options?: fs.RemoveOptions,
): Promise<void> {
  return fs.remove(path, defaults(options, defaultRemoveOptions));
}

export function rename(path: string | URL, newName: string): Promise<void> {
  if (path instanceof URL) path = path.href;
  if (path[path.length - 1] === "/") path = path.slice(0, -1);
  return fs.rename(path, path.slice(0, path.lastIndexOf("/") + 1) + newName, {
    newPathBaseDir: defaultTauriFileOptions.baseDir,
    oldPathBaseDir: defaultTauriFileOptions.baseDir,
  });
}

export function append(path: string | URL, content: Uint8Array): Promise<void> {
  if (path instanceof URL) path = path.href;
  return invoke("append", { path, content });
}

export function appendText(path: string | URL, content: string): Promise<void> {
  return invoke("append_text", { path, content });
}

export function watch(
  paths: string | string[] | URL | URL[],
  cb: (event: fs.WatchEvent) => void,
  options: fs.DebouncedWatchOptions,
) {
  fs.watch(paths, cb, defaults(options, defaultTauriFileOptions));
}
