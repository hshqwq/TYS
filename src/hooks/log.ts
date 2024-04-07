import { createEffect } from "solid-js";
import { isDev } from "solid-js/web";

const log = (() => {
  if (isDev)
    return (fn: () => unknown[]) => {
      createEffect(() => console.log(...fn()));
    };

  return () => {};
})();

export default log;
