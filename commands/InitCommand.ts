import { GitRepository } from "../lib/GitRepository";
import { GitCommand } from "./GitCommand";

export class InitCommand extends GitCommand {
  private static instance: InitCommand;

  static getInstance(): InitCommand {
    if (!InitCommand.instance) {
      InitCommand.instance = new InitCommand();
    }
    return InitCommand.instance;
  }

  execute(path: string) {
    GitRepository.repoCreate(path);
    console.log("Repository created");
  }
}
