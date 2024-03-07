import { objectHash, objectRead } from "../helpers/gitobject";
import { GitRepository } from "../lib/GitRepository";
import { GitCommand } from "./GitCommand";

export class HashObjectCommand extends GitCommand {
  private static instance: HashObjectCommand;

  static getInstance(): HashObjectCommand {
    if (!HashObjectCommand.instance) {
      HashObjectCommand.instance = new HashObjectCommand();
    }
    return HashObjectCommand.instance;
  }

  execute(path: string, options: { t: string; w: boolean }) {
    const repo = GitRepository.repoFind();
    const hash = objectHash(path, options.t, repo);
    console.log("Hash: ", hash);
  }
}
