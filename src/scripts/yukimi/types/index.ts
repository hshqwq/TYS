import { YukimiTypeAny } from "./any";
import { YukimiTypeBool } from "./bool";
import { YukimiTypeInt } from "./int";
import { YukimiTypeNull } from "./null";
import { YukimiTypeReal } from "./real";
import { YukimiTypeString } from "./string";
import { YukimiTypeSymbol } from "./symbol";

export * from "./any";
export * from "./int";
export * from "./real";
export * from "./symbol";
export * from "./string";
export * from "./bool";
export * from "./null";

export type YukimiTypes =
  | YukimiTypeString
  | YukimiTypeInt
  | YukimiTypeBool
  | YukimiTypeReal
  | YukimiTypeSymbol
  | YukimiTypeNull
  | YukimiTypeAny;
