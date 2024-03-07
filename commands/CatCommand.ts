import { objectRead } from "../helpers/gitobject";
import { GitRepository } from "../lib/GitRepository";
import { GitCommand } from "./GitCommand";

export class CatCommand extends GitCommand {
  private static instance: CatCommand;

  static getInstance(): CatCommand {
    if (!CatCommand.instance) {
      CatCommand.instance = new CatCommand();
    }
    return CatCommand.instance;
  }

  async execute(type: string, object: string) {
    const repository = GitRepository.repoFind()!;
    const obj = (await objectRead(repository, object))!;
    console.log(obj.serialize().toString("utf8"));
  }
}
