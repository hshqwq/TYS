export default function isYkmPath(path: string): boolean {
  const name = path.slice(path.lastIndexOf("/") + 1, path.length);

  return /\.ykm$/i.test(name);
}
