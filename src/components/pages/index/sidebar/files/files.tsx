import log from "@/hooks/log";
import { FileType, get_scripts } from "@/scripts/api/tauri/file_list";
import open_with_file_manager from "@/scripts/api/tauri/open_with_file_manager";
import resolvePath from "@/scripts/util/path/resolve";
import { BsFileEarmarkFont, BsFolder2, BsPlus, BsThreeDotsVertical } from "solid-icons/bs";
import { For, Match, Show, Switch, createEffect, createResource, createSignal } from "solid-js";
import { setEditingFilePath } from "../../editor/editor";

export function YkmScript(props: {
  name: string;
  summary: string;
  path: string;
  active?: boolean;
  onClick?: (event: MouseEvent) => unknown;
}) {
  return (
    <div class="flex items-center" onClick={props.onClick}>
      <BsFileEarmarkFont class="mr-2" />
      <div>
        <h1 class="font-bold">{props.name}</h1>
        <p class="text-xs text-base-300">{props.summary}</p>
      </div>
    </div>
  );
}

export function Dir(props: {
  name: string;
  path: string;
  onClick?: (event: MouseEvent) => unknown;
}) {
  return (
    <div class="flex items-center" onClick={props.onClick}>
      <BsFolder2 class="mr-2" />
      <div class="font-bold">{props.name}</div>
    </div>
  );
}

export default function Files(props: { rootDir: string }) {
  const [path, setPath] = createSignal<string[]>([], { equals: false });
  const resolvedPath = () => resolvePath(props.rootDir, ...path());
  const fileGetter = async () => (await get_scripts(resolvedPath())) || [];

  const [files, { refetch }] = createResource(fileGetter);

  createEffect(() => {
    path();
    refetch();
  });

  log(() => [resolvedPath(), files()]);

  const dirName = () => props.rootDir.match(/\/?([^/]+)\/?$/)![1] || ".";

  return (
    <div class="flex flex-col justify-between w-full h-full overflow-hidden">
      <ul class="w-full h-full overflow-auto">
        <Show when={path().length}>
          <div class="w-full p-2 border-base-200 border-t-[1px] hover:bg-base-200 transition-colors">
            <Dir
              name=".."
              path={resolvedPath()}
              onClick={() =>
                setPath((prev) => {
                  prev.pop();
                  return prev;
                })
              }
            />
          </div>
        </Show>
        <Switch>
          <Match when={files.loading}>
            <div class="w-full p-4 text-center">
              <span class="loading loading-dots" />
            </div>
          </Match>
          <Match when={!files.loading}>
            <For
              fallback={<div class="text-sm text-base-300 text-center h-6">无文件</div>}
              each={files()}
            >
              {(file) => (
                <div class="w-full p-2 border-base-200 border-t-[1px] hover:bg-base-200 transition-colors">
                  <Switch
                    fallback={<div class="alert alert-error rounded-none">Unknown Error</div>}
                  >
                    <Match
                      when={file.file_type === FileType.YkmScript}
                      children={
                        <YkmScript
                          name={file.name}
                          summary={file.summary}
                          path={file.path}
                          onClick={() => setEditingFilePath(file.path)}
                        />
                      }
                    />
                    <Match
                      when={file.file_type === FileType.Dir}
                      children={
                        <Dir
                          name={file.name}
                          path={file.path}
                          onClick={() =>
                            setPath((prev) => {
                              prev.push(file.name);
                              return prev;
                            })
                          }
                        />
                      }
                    />
                  </Switch>
                </div>
              )}
            </For>
          </Match>
        </Switch>
      </ul>
      <div class="flex flex-none items-center w-full h-8 border-t-2">
        <div class="dropdown dropdown-top">
          <button class="btn btn-ghost btn-square btn-sm rounded-none">
            <BsPlus />
          </button>
          <ul class="dropdown-content menu p-2 shadow-lg border rounded-box bg-base-100 text-base-content w-48">
            <li>
              <a>
                <BsFileEarmarkFont />
                新建 Yukimi 脚本
              </a>
            </li>
            <li>
              <a>
                <BsFolder2 />
                新建文件夹
              </a>
            </li>
          </ul>
        </div>
        <div class="dropdown dropdown-top w-full">
          <div
            tabIndex={0}
            role="button"
            class="flex items-center w-full p-1 hover:bg-base-200 transition-colors"
          >
            <span class="w-full text-center">{dirName()}</span>
            <BsThreeDotsVertical class="w-8" />
          </div>
          <ul
            tabIndex={0}
            class="dropdown-content menu menu-sm p-2 shadow-lg border rounded-box bg-base-100 text-base-content w-72"
          >
            <li class="menu menu-title">操作</li>
            <li onClick={() => open_with_file_manager(resolvedPath())}>
              <a>在资源管理器显示</a>
            </li>
            <li>
              <a></a>
            </li>
            <li onClick={() => refetch()}>
              <a>刷新</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
