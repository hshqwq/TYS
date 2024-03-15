import { Combobox } from "@kobalte/core";
import { NodeViewProps } from "@tiptap/core";
import { BsChevronDown, BsChevronUp, BsPlug, BsPlus } from "solid-icons/bs";
import { For, Match, Show, Switch, createSignal } from "solid-js";
import { useFocus, useFocusWithin } from "solidjs-use";
import { NodeViewWrapper } from "tiptap-solid";

type CmdInputProps = {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  options?: string[];
  placeholder?: string;
  errorMsg?: string;
};

function CmdInput(props: CmdInputProps) {
  const options = () => props.options || [];
  const [inputRef, setInputRef] = createSignal<HTMLElement>();
  const focused = useFocus(inputRef);

  return (
    <label contentEditable={false} class="form-control w-full max-w-max">
      <Show when={props.label}>
        <div class="label pb-0.5">
          <span class="label-text text-xs">{props.label}</span>
        </div>
      </Show>

      <Combobox.Root
        options={options()}
        open={!!focused}
        placeholder={props.placeholder}
        value={props.value}
        onChange={(value) => props.onChange?.(value)}
        itemComponent={(props) => (
          <Combobox.Item item={props.item}>
            <a>{props.item.rawValue}</a>
          </Combobox.Item>
        )}
      >
        <Switch>
          <Match when={props.options}>
            <Combobox.Control class="join">
              <input ref={setInputRef} class="join-item input input-sm input-bordered" />
              <Combobox.Trigger class="join-item btn btn-sm">
                <Combobox.Icon>
                  <BsChevronDown />
                </Combobox.Icon>
              </Combobox.Trigger>
            </Combobox.Control>

            <Combobox.Portal>
              <Combobox.Content class="menu dropdown-content bg-base-100 shadow rounded-box">
                <Combobox.Listbox />
              </Combobox.Content>
            </Combobox.Portal>
          </Match>

          <Match when={!props.options}>
            <Combobox.Control>
              <Combobox.Input class="join-item input input-sm input-bordered" />
            </Combobox.Control>
          </Match>
        </Switch>
      </Combobox.Root>
    </label>
  );
}

export default function Marco(props: NodeViewProps) {
  const [wrapperRef, setWrapperRef] = createSignal<HTMLDivElement>();
  const focusedWithin = useFocusWithin(wrapperRef);
  const [expand, setExpand] = createSignal<boolean | null>(null);

  const expanded = () => expand() ?? focusedWithin();

  const addArgument = () => {
    const args = props.node.attrs.args || [];
    args.push({
      name: "",
      type: "",
      defaultValue: null,
    });
    props.updateAttributes({ args });
  };

  return (
    <NodeViewWrapper ref={setWrapperRef}>
      <div class="marco" contentEditable={false}>
        <div class="form-control w-full gap-2 items-start">
          <input class="text-lg h-6" placeholder="宏名" />

          <button
            class="flex gap-1"
            contentEditable={false}
            onClick={() => setExpand((prev) => !prev)}
          >
            <label class="swap">
              <input type="checkbox" checked={expanded()} />
              <BsChevronDown class="swap-on" />
              <BsChevronUp class="swap-off" />
            </label>
            <label class="text-xs cursor-pointer">参数</label>
          </button>

          <Show when={expanded()}>
            <For each={props.node.attrs.args || []}>
              {(arg) => (
                <div class="flex join w-full">
                  <input
                    class="join-item input input-sm input-bordered max-w-sm"
                    placeholder="参数"
                  >
                    {arg.name}
                  </input>
                  <input class="join-item input input-sm input-bordered max-w-xs"></input>
                  <input class="join-item input input-sm input-bordered max-w-sm">
                    {arg.defaultValue}
                  </input>
                </div>
              )}
            </For>
          </Show>

          <button class="btn btn-xs" onClick={() => addArgument()}>
            <BsPlus />
          </button>
        </div>
      </div>
    </NodeViewWrapper>
  );
}
