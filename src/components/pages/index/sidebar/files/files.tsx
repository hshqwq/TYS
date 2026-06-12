import editorConfig from "@/configs/editor";
import log from "@/hooks/log";
import { FileType, get_scripts, set_base_dir } from "@/scripts/api/tauri/file_list";
import { exists, mkdir, writeTextFile } from "@/scripts/api/tauri/fs";
import open_with_file_manager from "@/scripts/api/tauri/open_with_file_manager";
import resolvePath from "@/scripts/util/path/resolve";
import { globalStore } from "@/store/global";
import { createForm, submit, zodForm } from "@modular-forms/solid";
import { BsFileEarmarkFont, BsFolder2, BsPlus, BsSearch, BsThreeDotsVertical, BsX } from "solid-icons/bs";
import { For, Match, Show, Switch, createEffect, createMemo, createResource, createSignal } from "solid-js";
import { z } from "zod";
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
        <p class="text-xs text-base-300">{props.summary.length >= editorConfig.maxFileSummaryLength ? props.summary + '…' : props.summary}</p>
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

export default function Files(props: { rootDir: string; }) {
  const [path, setPath] = createSignal<string[]>([], { equals: false });
  const resolvedPath = () => resolvePath(props.rootDir, ...path());
  const fileGetter = async () => ((await get_scripts(resolvedPath(), editorConfig.maxFileSummaryLength || 80)) || [])
    .sort((a, b) => a.file_type === FileType.Dir && b.file_type !== FileType.Dir ? -1 : 1);
  const [files, { refetch }] = createResource(fileGetter);

  // search
  const [searchText, setSearchText] = createSignal("");
  const [caseSensitive, setCaseSensitive] = createSignal(false);
  const searchedFiles = createMemo(() => files()?.filter(
    (file) =>
      caseSensitive()
        ? file.name.includes(searchText())
        : file.name.toLocaleLowerCase().includes(searchText().toLocaleLowerCase()))
    || []
  );

  createEffect(() => {
    if (globalStore.saved)
      refetch();
  })

  createEffect(() => {
    path();
    props.rootDir;
    refetch();
  });

  log(() => [resolvedPath(), files()]);

  const dirName = () => props.rootDir.match(/\/?([^/]+)\/?$/)?.[1] || "未打开文件夹";

  // new script file
  let newScriptDialogRef!: HTMLDialogElement;
  const newScriptSchema = z.object({
    name: z
      .string()
      .min(1, "文件名不能为空")
      .max(255, "文件名不能超过 255 个字符")
      .regex(/^[^\\/:\*\?"<>\|]+$/, "文件名不能包含 \\ / : * ? \" < > | 字符")
      .refine(async (name) => await exists(resolvePath(resolvedPath(), name + ".ykm")) === false, "文件已存在")
  });

  type NewScriptForm = z.infer<typeof newScriptSchema>;
  const [newScriptForm, NewScript] = createForm<NewScriptForm>({
    validateOn: "input",
    validate: zodForm(newScriptSchema as any),
    initialValues: {
      name: '',
    },
  });

  // new dir
  let newDirDialogRef!: HTMLDialogElement;
  const newDirSchema = z.object({
    name: z
      .string()
      .min(1, "文件名不能为空")
      .max(255, "文件名不能超过 255 个字符")
      .regex(/^[^\\/:\*\?"<>\|]+$/, "文件名不能包含 \\ / : * ? \" < > | 字符")
      .refine(async (name) => await exists(resolvePath(resolvedPath(), name + "/")) === false, "文件夹已存在")
  });

  type NewDirForm = z.infer<typeof newDirSchema>;
  const [newDirForm, NewDir] = createForm<NewDirForm>({
    validateOn: "input",
    validate: zodForm(newDirSchema as any),
    initialValues: {
      name: '',
    },
  });

  return (
    <div class="flex flex-col justify-between w-full h-full">
      <ul class="w-full h-full overflow-auto border-b border-base-200">
        <Show when={path().length}>
          <div class="w-full p-2 border-base-200 border-t hover:bg-base-200 transition-colors">
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
          <Match when={!props.rootDir}>
            <div class="w-full h-full flex flex-col items-center justify-center p-4 text-center gap-4">
              <label class='text'>请先打开一个文件夹</label>
              <button class='btn w-fit' onClick={set_base_dir}>
                选择文件夹
              </button>
            </div>
          </Match>
          <Match when={files.loading}>
            <div class="w-full p-4 text-center">
              <span class="loading loading-dots" />
            </div>
          </Match>
          <Match when={!files.loading}>
            <For
              fallback={<div class="text-sm text-base-300 text-center h-6">无文件</div>}
              each={searchText() ? searchedFiles() : files()}
            >
              {(file) => (
                <div class="w-full p-2 border-base-200 border-b hover:bg-base-200 transition-colors">
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

      <div class="p-2 border-neutral border-b">
        <label class='input input-sm'>
          <span class="label"><BsSearch /></span>
          <input
            type="text"
            placeholder="搜索文件..."
            value={searchText()}
            onInput={(e) => setSearchText(e.currentTarget.value)}
          />
          <Show when={searchText()}>
            <button class="btn btn-xs btn-ghost" onClick={() => setSearchText('')}><BsX /></button>
          </Show>
          <label class="tooltip" data-tip="区分大小写">
            <button class="btn btn-xs btn-ghost" classList={{ 'btn-active': caseSensitive() }} onClick={() => setCaseSensitive(prev => !prev)}>Aa</button>
          </label>
        </label>
      </div>

      <div class="flex flex-none items-center w-full h-8">
        <div class="dropdown dropdown-top">
          <button
            tabIndex={0}
            class="btn btn-ghost btn-square btn-sm rounded-none">
            <BsPlus />
          </button>
          <ul
            tabIndex={0}
            class="dropdown-content menu p-2 shadow-lg border rounded-box bg-base-100 text-base-content w-48">
            <li class="menu-title">新建</li>
            <li classList={{ "menu-disabled": !props.rootDir }} onClick={() => props.rootDir && newScriptDialogRef.showModal()}>
              <a>
                <BsFileEarmarkFont />
                新建 Yukimi 脚本
              </a>
            </li>
            <li classList={{ "menu-disabled": !props.rootDir }} onClick={() => newDirDialogRef.showModal()}>
              <a>
                <BsFolder2 />
                新建文件夹
              </a>
            </li>
          </ul>
        </div>
        <dialog ref={newScriptDialogRef} id="new_ykm_script_modal" class="modal">
          <div class="modal-box">
            <h3 class="text-lg font-bold mb-4">新建 Yukimi 脚本</h3>
            <NewScript.Form action="" class='' method="dialog" onSubmit={async ({ name }) => {
              const filePath = resolvePath(resolvedPath(), name + ".ykm");
              await writeTextFile(filePath, '');
              newScriptDialogRef.close();
              refetch();
            }}>

              <NewScript.Field name="name">
                {(field, props) => (
                  <fieldset class="w-full">
                    <label
                      class="input"
                      classList={{ "input-error": !!field.error }}
                    >
                      <span class="label">文件名</span>
                      <input
                        {...props}
                        disabled={newScriptForm.submitting}
                        type="text"
                        placeholder="请输入文件名"
                      />
                      <span class="label">.ykm</span>
                    </label>
                    {field.error && (
                      <p class="label-text-alt text-error text-xs">
                        {field.error}
                      </p>
                    )}
                  </fieldset>
                )}
              </NewScript.Field>
              <div class="modal-action">
                <div class='flex gap-1'>
                  <button class="btn" onClick={() => newScriptDialogRef.close()}>取消</button>
                  <button class="btn btn-primary"
                    disabled={newScriptForm.submitting || !!newScriptForm.invalid}
                    onClick={() => submit(newScriptForm)}>
                    <Show when={newScriptForm.submitting}>
                      <span class="loading loading-spinner"></span>
                    </Show>
                    创建
                  </button>
                </div>
              </div>
            </NewScript.Form>
          </div>
        </dialog>
        <dialog ref={newDirDialogRef} id="new_ykm_script_modal" class="modal">
          <div class="modal-box">
            <h3 class="text-lg font-bold mb-4">新建文件夹</h3>
            <NewDir.Form action="" class='' method="dialog" onSubmit={async ({ name }) => {
              const filePath = resolvePath(resolvedPath(), name);
              await mkdir(filePath, { recursive: true });
              newDirDialogRef.close();
              refetch();
            }}>

              <NewDir.Field name="name">
                {(field, props) => (
                  <label
                    class="input"
                    classList={{ "input-error": !!field.error }}
                  >
                    <span class="label">文件夹名</span>
                    <input
                      {...props}
                      disabled={newDirForm.submitting}
                      type="text"
                      placeholder="请输入文件夹名"
                    />
                  </label>
                )}
              </NewDir.Field>
              <div class="modal-action">
                <div class='flex gap-1'>
                  <button class="btn" onClick={() => newDirDialogRef.close()}>取消</button>
                  <button class="btn btn-primary"
                    disabled={newDirForm.submitting || !!newDirForm.invalid}
                    onClick={() => submit(newDirForm)}>
                    <Show when={newDirForm.submitting}>
                      <span class="loading loading-spinner"></span>
                    </Show>
                    创建
                  </button>
                </div>
              </div>
            </NewDir.Form>
          </div>
        </dialog>
        <div class="dropdown dropdown-top w-full">
          <div
            tabIndex={0}
            role="button"
            class="flex items-center w-64 h-8 hover:bg-base-200 transition-colors"
          >
            <span class="w-full max-w-48 truncate text-center text-sm">{dirName()}</span>
            <BsThreeDotsVertical class="w-8" />
          </div>
          <ul
            tabIndex={0}
            class="dropdown-content menu menu-sm p-2 shadow-lg border rounded-box bg-base-100 text-base-content w-72"
          >
            <li class="menu-title">操作</li>
            <li onClick={() => open_with_file_manager(resolvedPath())}>
              <a>在资源管理器显示</a>
            </li>
            <li onClick={set_base_dir}>
              <a>打开文件夹</a>
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
