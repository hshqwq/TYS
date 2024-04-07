import {
  registerCommand,
  registerCommands,
  unregisterCommand,
  unregisterCommands,
} from "../yukimi/command-manager/lib";

const TYS_API = {
  commands: {
    registerCommand,
    unregisterCommand,
    registerCommands,
    unregisterCommands,
  },
};

export default TYS_API;
