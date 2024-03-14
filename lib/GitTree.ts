import { treeParse, treeSerializer } from "../helpers/gittree";
import { GitObject } from "./GitObject";
import type { GitTreeLeaf } from "./GitTreeLeaf";

export class GitTree extends GitObject {
  public readonly format = "tree";
  public treeData: GitTreeLeaf[] = [];

  constructor(content: Buffer) {
    super(content);
    this.deserialize(content);
  }

  public serialize() {
    return treeSerializer(this.treeData);
  }

  public deserialize(data: Buffer): void {
    this.treeData = treeParse(data);
  }
}
