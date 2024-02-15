import commentTransformer from "./comment";
import dialogTransformer from "./dialog";
import paragraphTransformer from "./paragraph";
import sceneTransformer from "./scene";

const map = {
  scene: sceneTransformer,
  dialog: dialogTransformer,
  comment: commentTransformer,
  paragraph: paragraphTransformer,
} as const;

export default map;
