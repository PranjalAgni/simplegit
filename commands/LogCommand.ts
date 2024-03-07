import { objectFind, objectHash, objectRead } from "../helpers/gitobject";
import { logGraphviz } from "../helpers/graphviz";
import { GitRepository } from "../lib/GitRepository";
import { GitCommand } from "./GitCommand";

export class LogCommand extends GitCommand {
  private static instance: LogCommand;

  static getInstance(): LogCommand {
    if (!LogCommand.instance) {
      LogCommand.instance = new LogCommand();
    }
    return LogCommand.instance;
  }

  async execute(commit: string) {
    const repo = GitRepository.repoFind();
    if (repo) {
      console.log("digraph wyaglog{");
      console.log("  node[shape=rect]");
      await logGraphviz(repo, objectFind(repo, commit), new Set());
      console.log("}");
    }
  }
}
