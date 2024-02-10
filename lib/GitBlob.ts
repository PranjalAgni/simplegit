import { GitObject } from "./GitObject";

export class GitBlob extends GitObject {
  private readonly format = "blob";
  private blobData: string = "";
  constructor(content: string) {
    super(content);
  }

  public serialize() {
    return this.blobData;
  }

  public deserialize(data: string): void {
    this.blobData = data;
  }
}
