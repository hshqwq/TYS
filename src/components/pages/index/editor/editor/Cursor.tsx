import { Show, useContext } from 'solid-js';
import { editorContext } from './Editor';
import './style.css';

export default function Cursor() {
  const store = useContext(editorContext);

  return <Show when={store.focused}>
    <span class={`cursor relative inline`}></span>
  </Show>;
}
