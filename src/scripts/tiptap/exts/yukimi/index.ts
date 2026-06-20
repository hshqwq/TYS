import { Extension } from "@tiptap/core";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Cmd from "./nodes/cmd/cmd";
import Dialog from "./nodes/dialog/dialog";
import Document from "./nodes/doc/doc";
import Marco from "./nodes/marco/marco";
import Scene from "./nodes/scene/scene";

const Yukimi = Extension.create({
  name: "yukimi",
  addExtensions: () => [Paragraph, Heading, Text, HardBreak, Document, Scene, Dialog, Marco, Cmd],
});

export default Yukimi;
