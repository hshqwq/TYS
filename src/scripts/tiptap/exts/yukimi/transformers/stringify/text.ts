import { Transformer } from ".";

const textTransformer: Transformer<"text"> = (node) => {
  if (!node.text) return "";

  let text = node.text;
  if (node.marks && node.marks.length > 0) {
    node.marks.forEach((mark) => {
      if (mark.type) text = `<${mark.type} ${text}>`;
    });
  }

  return text;
};

export default textTransformer;
