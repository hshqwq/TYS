import { $skip, Transformer, TransformingTiptapNodeJson } from ".";

const dialogTransformer: Transformer<"dialog"> = (node, line, doc, map) => {
  let sayer = node.content?.[0]?.text;
  if (!sayer) sayer = "";

  const contentNode = doc[line + 1];
  let content = "";
  if (!contentNode || contentNode.type !== "paragraph") {
    console.warn(`The dialog did not has content in line ${line}`);
  } else {
    contentNode[$skip] = true;
    const transformer = map.paragraph;
    if (contentNode.content && transformer instanceof Function) {
      content = transformer(
        contentNode as TransformingTiptapNodeJson<"paragraph">,
        line + 1,
        doc,
        map,
      );
    }
  }

  return `${sayer}:${content}`;
};

export default dialogTransformer;
