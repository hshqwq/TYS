import { JSX } from "solid-js";
import { Dynamic } from "solid-js/web";
import { INode, nodeMap } from "../Editor";
import NodeEl from "./Text";


export default function NodeMatch(props: { node: INode; index: number; height: JSX.CSSProperties['height'] }) {
  return <Dynamic component={nodeMap.has(props.node.name) ? nodeMap.get(props.node.name) : NodeEl} node={props.node} index={props.index} height={props.height}/>;
}
