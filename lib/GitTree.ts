import { GitObject } from "./GitObject";

export class GitTree extends GitObject {
  private readonly format = "tree";
  private treeData: string = "";
  constructor(content: string) {
    super(content);
  }

  public serialize() {
    return this.treeData;
  }

  public deserialize(data: string): void {
    this.treeData = data;
  }
}
