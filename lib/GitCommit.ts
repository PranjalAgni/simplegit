import { GitObject } from "./GitObject";

export class GitCommit extends GitObject {
  private readonly format = "commit";
  private commitData: string = "";
  constructor(content: string) {
    super(content);
  }

  public serialize() {
    return this.commitData;
  }

  public deserialize(data: string): void {
    this.commitData = data;
  }
}
