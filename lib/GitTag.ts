import { GitObject } from "./GitObject";

export class GitTag extends GitObject {
  private readonly format = "tag";
  private tagData: string = "";
  constructor(content: string) {
    super(content);
  }

  public serialize() {
    return this.tagData;
  }

  public deserialize(data: string): void {
    this.tagData = data;
  }
}
