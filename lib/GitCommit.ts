import { kvlmParser, kvlmSerialize } from "../helpers/kvlm";
import { GitObject } from "./GitObject";

// add kvlm parser logic
// work on a separate class for this
// complete this please
export class GitCommit extends GitObject {
  public readonly format = "commit";
  private commitData: Buffer = Buffer.from("");
  private readonly possibleKeys: string[] = [
    "tree",
    "parent",
    "author",
    "committer",
    "gpgsig"
  ];

  private kvlm: Map<string, string>;

  constructor(content: Buffer) {
    super(content);
    this.deserialize(content);
    this.kvlm = new Map<string, string>();
  }

  public serialize() {
    return kvlmSerialize(this.kvlm);
  }

  public deserialize(data: Buffer): void {
    this.kvlm = kvlmParser(data.toString("utf8"), this.possibleKeys);
  }
}
