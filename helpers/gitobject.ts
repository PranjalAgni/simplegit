import fs from "node:fs";
import zlib from "node:zlib";
import crypto from "node:crypto";
import type { GitRepository } from "../lib/GitRepository";
import { GitCommit } from "../lib/GitCommit";
import { GitTree } from "../lib/GitTree";
import { GitTag } from "../lib/GitTag";
import { GitBlob } from "../lib/GitBlob";

export async function objectRead(repo: GitRepository, sha: string) {
  const [first, second, ...rest] = sha.split("");
  const repoPath = repo.repoFile([
    "objects",
    `${first}${second}`,
    rest.join("")
  ]);

  if (!(repoPath && fs.statSync(repoPath).isFile())) {
    return null;
  }

  const data = await Bun.file(repoPath).arrayBuffer();
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

  const content = raw.subarray(nbIndex + 1);
  // Call constructor and return object
  return new objectType(content);
}

export function objectWrite(
  obj: GitBlob | GitCommit | GitTag | GitTree,
  repo: GitRepository | null
): string {
  // Serialize date object
  const data = obj.serialize();
  // Construct object format
  const result = obj.format + " " + String(data.length) + "\x00" + data;
  // Compute hash
  const hash = crypto.createHash("sha1").update(result).digest("hex");
  // repo
  if (repo) {
    // Compute path
    const object_path = repo.repoFile(
      ["objects", hash.slice(0, 2), hash.slice(2)],
      true
    )!;

    // compress and write
    // Using heavily optimized Bun File I/O API 🚀
    Bun.write(object_path, zlib.deflateSync(result));
  }

  return hash;
}

export function objectHash(
  path: string,
  format: string,
  repo: GitRepository | null = null
): string {
  let data = fs.readFileSync(path);
  let gitobjectInstance: GitCommit | GitTree | GitTag | GitBlob;

  // Pick constructor
  switch (format) {
    case "commit":
      gitobjectInstance = new GitCommit(data);
      break;
    case "tree":
      gitobjectInstance = new GitTree(data);
      break;
    case "tag":
      gitobjectInstance = new GitTag(data);
      break;
    case "blob":
      gitobjectInstance = new GitBlob(data);
      break;
    default:
      throw new Error(`Unknown type ${format}`);
  }

  return objectWrite(gitobjectInstance, repo);
}

export function objectFind(
  repo: GitRepository,
  name: string,
  fmt = null,
  follow = true
) {
  return name;
}
