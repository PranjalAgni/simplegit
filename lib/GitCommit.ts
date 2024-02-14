import { GitObject } from "./GitObject";

// add kvlm parser logic
// work on a separate class for this
export class GitCommit extends GitObject {
  public readonly format = "commit";
  private commitData: Buffer = Buffer.from("");
  constructor(content: Buffer) {
    super(content);
    this.deserialize(content);
  }

  public serialize() {
    return this.commitData;
  }

  public deserialize(data: Buffer): void {
    this.commitData = data;
  }
}
