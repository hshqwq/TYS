import { Transformer } from ".";

export const transformComment = (comment: string) => comment.replace("//", "#");

const commentTransformer: Transformer<"comment"> = (node) => {
  let comment = node.content?.[0]?.text;

  if (!comment) comment = "";

  return transformComment("//" + comment);
};

export default commentTransformer;
