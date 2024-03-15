import Document from "./nodes/doc/doc";
import Scene from "./nodes/scene/scene";
import Dialog from "./nodes/dialog/dialog";
import Text from "@tiptap/extension-text";
import HardBreak from "@tiptap/extension-hard-break";
import { Extension } from "@tiptap/core";
import Paragraph from "@tiptap/extension-paragraph";
import Cmd from "./nodes/cmd/cmd";
import Marco from "./nodes/marco/marco";

const Yukimi = Extension.create({
  name: "yukimi",
  addExtensions: () => [Paragraph, Text, HardBreak, Document, Scene, Dialog, Marco, Cmd],
});

export default Yukimi;
