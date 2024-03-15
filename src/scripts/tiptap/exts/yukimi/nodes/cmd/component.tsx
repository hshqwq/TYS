import { Combobox } from "@kobalte/core";
import { NodeViewProps } from "@tiptap/core";
import { BsChevronDown, BsChevronUp } from "solid-icons/bs";
import { Match, Show, Switch, createSignal } from "solid-js";
import { useFocusWithin } from "solidjs-use";
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

  return (
    <label contentEditable={false} class="form-control w-full max-w-max">
      <Show when={props.label}>
        <div class="label pb-0.5">
          <span class="label-text text-xs">{props.label}</span>
        </div>
      </Show>

      <Combobox.Root
        options={options()}
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
              <Combobox.Input class="join-item input input-sm input-bordered" />
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

export default function Cmd(props: NodeViewProps) {
  const [wrapperRef, setWrapperRef] = createSignal<HTMLDivElement>();
  const focusedWithin = useFocusWithin(wrapperRef);
  const [expand, setExpand] = createSignal<boolean | null>(null);
  const expanded = () => expand() ?? focusedWithin();

  return (
    <NodeViewWrapper ref={setWrapperRef}>
      <div class="cmd">
        <div class="form-control w-full gap-2">
          <CmdInput
            label="命令名"
            onChange={(v) => props.updateAttributes({ name: v })}
            options={["test", "ttttest"]}
            errorMsg="未知的命令"
          />

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
            <div class="ml-4">
              <CmdInput />
            </div>
          </Show>
        </div>
      </div>
    </NodeViewWrapper>
  );
}
