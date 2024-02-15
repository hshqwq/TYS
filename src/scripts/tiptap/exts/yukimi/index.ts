import Document from "./nodes/doc";
import Scene from "./nodes/scene/scene";
import Dialog from "./nodes/dialog/dialog";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import HardBreak from "@tiptap/extension-hard-break";
import { Extension } from "@tiptap/core";

const Yukimi = Extension.create({
  name: "yukimi",
  addExtensions: () => [Paragraph, Text, HardBreak, Document, Scene, Dialog],
});

export default Yukimi;
