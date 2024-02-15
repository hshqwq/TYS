import CharacterCount from "@tiptap/extension-character-count";
import DropCursor from "@tiptap/extension-dropcursor";
import History from "@tiptap/extension-history";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Yukimi from "@/scripts/tiptap/exts/yukimi";

const exts = [Bold, Italic, Yukimi, History, DropCursor, CharacterCount];

export default exts;
