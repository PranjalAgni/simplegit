import { GitObject } from "./GitObject";

export class GitTag extends GitObject {
  public readonly format = "tag";
  private tagData: Buffer = Buffer.from("");
  constructor(content: Buffer) {
    super(content);
    this.deserialize(content);
  }

  public serialize() {
    return this.tagData;
  }

  public deserialize(data: Buffer): void {
    this.tagData = data;
  }
}
