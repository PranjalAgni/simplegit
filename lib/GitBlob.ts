import { GitObject } from "./GitObject";

export class GitBlob extends GitObject {
  public readonly format = "blob";
  private blobData: Buffer = Buffer.from("");
  constructor(content: Buffer) {
    super(content);
    this.deserialize(content);
  }

  public serialize() {
    return this.blobData;
  }

  public deserialize(data: Buffer): void {
    this.blobData = data;
  }
}
