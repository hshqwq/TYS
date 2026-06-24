import { JSX, useContext } from "solid-js";
import { Dynamic } from "solid-js/web";
import { INode, nodeContext } from "../Editor";
import { Text } from "./Text";


export default function NodeMatch(props: { node: INode; index: number; height: JSX.CSSProperties['height']; }) {
  const nodeMap = useContext(nodeContext);
  return <Dynamic component={nodeMap.has(props.node.name) ? nodeMap.get(props.node.name) : Text} node={props.node} index={props.index} height={props.height}/>;
}
