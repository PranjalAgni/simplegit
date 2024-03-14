export class GitTreeLeaf {
  public mode: Buffer;
  public path: string;
  public sha: string;

  constructor(mode: Buffer, path: string, sha: string) {
    this.mode = mode;
    this.path = path;
    this.sha = sha;
  }
}
