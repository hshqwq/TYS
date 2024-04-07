import { TiptapNodeJson } from "../stringify";
import cmd from "./cmd";
import dialog from "./dialog";
import paragraph from "./paragraph";
import scene from "./scene";

export type Pattern = (line: string) => boolean;
export type Handler<A extends Record<string, unknown> = Record<string, unknown>> = (
  line: string,
  index: number,
  lines: string[],
) => TiptapNodeJson<string, A> | TiptapNodeJson<string, A>[] | null;
export type Matcher = readonly [Pattern, Handler];

export const matchers: Matcher[] = [scene, cmd, dialog, paragraph];
