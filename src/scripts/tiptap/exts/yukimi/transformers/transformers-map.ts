import dialogTransformer from "./dialog";
import paragraphTransformer from "./paragraph";
import sceneTransformer from "./scene";
import textTransformer from "./text";

const map = {
  scene: sceneTransformer,
  dialog: dialogTransformer,
  paragraph: paragraphTransformer,
  text: textTransformer,
} as const;

export default map;
