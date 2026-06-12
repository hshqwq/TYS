import { createMutable } from "solid-js/store";

export type GlobalStore = {
  baseDir: string;
  saved: boolean;
};

export const defaultGlobalStore: GlobalStore = {
  baseDir: "",
  saved: true
};

export const globalStore = createMutable<GlobalStore>(defaultGlobalStore);
