import fs from "node:fs";
import zlib from "node:zlib";
import type { GitRepository } from "./GitRepository";
import { GitCommit } from "./GitCommit";
import { GitTree } from "./GitTree";
import { GitTag } from "./GitTag";
import { GitBlob } from "./GitBlob";

export class GitObject {
  constructor(data: string | null = null) {
    if (data !== null) {
    }
  }

  // Abstract method that should be implemented by child classes
  /**
   * This function MUST be implemented by subclasses.
   * It must read the object's contents from self.data, a byte string, and do
   * whatever it takes to convert it into a meaningful representation.
   * What exactly that means depend on each subclass.
   */
  public serialize(repo: GitRepository) {
    throw new Error("Unimplemented");
  }

  public deserialize(data: string) {
    throw new Error("Unimplemented");
  }

  private init() {
    return 42;
  }

  // Read object sha from Git repository repo. Return a GitObject whose exact type depends on the object.
  private objectRead(repo: GitRepository, sha: string) {
    const [first, second, ...rest] = sha.split("");
    const repoPath = repo.repoFile([
      "objects",
      `${first}${second}`,
      rest.join("")
    ]);

    if (!(repoPath && fs.statSync(repoPath).isFile())) {
      return null;
    }

    const data = fs.readFileSync(repoPath);
    // decompress this data using zlib
    const raw = zlib.inflateSync(data);
    // Find the index of the space character (ASCII value: 32)
    const spaceIndex = raw.indexOf(32);
    const format = raw.subarray(0, spaceIndex).toString("utf8");
    // Finding the null byte index (0x00)
    const nbIndex = raw.indexOf("\x00", spaceIndex);
    const contentSize = parseInt(
      raw.subarray(spaceIndex, nbIndex).toString("ascii")
    );

    if (contentSize !== raw.length - nbIndex - 1) {
      throw new Error(`Malformed object {sha}: bad length`);
    }

    let objectType:
      | typeof GitCommit
      | typeof GitTree
      | typeof GitTag
      | typeof GitBlob;

    // Pick constructor
    switch (format) {
      case "commit":
        objectType = GitCommit;
        break;
      case "tree":
        objectType = GitTree;
        break;
      case "tag":
        objectType = GitTag;
        break;
      case "blob":
        objectType = GitBlob;
        break;
      default:
        throw new Error(`Unknown type ${format} for object ${sha}`);
    }

    const content = raw.subarray(nbIndex + 1).toString("utf8");
    // Call constructor and return object
    return new objectType(content);
  }
}
