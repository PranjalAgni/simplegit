import { lsTree } from "../helpers/gittree";
import { GitRepository } from "../lib/GitRepository";
import { GitCommand } from "./GitCommand";

export class GitListTreeCommand extends GitCommand {
  private static instance: GitListTreeCommand;

  static getInstance(): GitListTreeCommand {
    if (!GitListTreeCommand.instance) {
      GitListTreeCommand.instance = new GitListTreeCommand();
    }
    return GitListTreeCommand.instance;
  }

  async execute(tree: string, options: { r: boolean }) {
    const repo = GitRepository.repoFind()!;
    await lsTree(repo, tree, options.r);
  }
}
