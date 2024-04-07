import { Transformer } from ".";

const sceneTransformer: Transformer<"scene"> = (node, line) => {
  let name = node.content?.[0]?.text;

  if (!name) {
    console.warn(`The scene did not has name in line ${line}.`);
    name = "";
  }

  return `- scene "${name}"`;
};

export default sceneTransformer;
