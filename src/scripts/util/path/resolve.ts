const resolve = (...path: string[]) =>
  path
    .map((p) =>
      p
        .trim()
        .replaceAll("\\", "/")
        .replace(/(^\/)|(\/$)/g, ""),
    )
    .join("/");
export default resolve;
