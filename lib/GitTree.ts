import { GitObject } from "./GitObject";

export class GitTree extends GitObject {
  public readonly format = "tree";
  private treeData: Buffer = Buffer.from("");
  constructor(content: Buffer) {
    super(content);
    this.deserialize(content);
  }

  public serialize() {
    return this.treeData;
  }

  public deserialize(data: Buffer): void {
    this.treeData = data;
  }
}
