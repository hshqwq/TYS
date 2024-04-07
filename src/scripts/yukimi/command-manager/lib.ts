import { Command, addCommand, removeCommand } from ".";

export function registerCommand(command: Command) {
  addCommand(command);
}

export const registerCommands = addCommand;

export function unregisterCommand(command: Command) {
  removeCommand(command);
}

export const unregisterCommands = removeCommand;
