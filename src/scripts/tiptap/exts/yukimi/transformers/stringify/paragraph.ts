import { $skip, Transformer, TransformingTiptapNodeJson } from ".";

const paragraphTransformer: Transformer<"paragraph"> = (node, line, doc, map) => {
  if (!node.content) return "";

  return node.content.reduce((res, node, i, nodes) => {
    if (node[$skip]) return res;

    if (node.type === "hardBreak") return res + "\\\n";

    if (node.type === "text") {
      const nextNode = nodes[i + 1];
      const text = map.text(node as TransformingTiptapNodeJson<"text">, line, doc, map);

      if (nextNode?.type === "hardBreak") {
        nextNode[$skip] = true;

        const commentSymbolPosition = text.indexOf("#");
        if (commentSymbolPosition === -1) return res + text + "\\\n";

        const contentText = text.slice(0, commentSymbolPosition);
        const commentText = text.slice(commentSymbolPosition);
        return `${res}${contentText}\\${commentText}\n`;
      }

      return res + text;
    }

    return res;
  }, "");
};

export default paragraphTransformer;
