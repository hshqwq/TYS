export type Plugin = {
  name: string;
  file: string; // js file path, relative to app root
};

const plugins = new Map<string, Plugin>();
