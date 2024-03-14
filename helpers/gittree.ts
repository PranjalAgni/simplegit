import path from "node:path";
import type { GitRepository } from "../lib/GitRepository";
import type { GitTree } from "../lib/GitTree";
import { GitTreeLeaf } from "../lib/GitTreeLeaf";
import { objectFind, objectRead } from "./gitobject";

// [mode] space [path] 0x00 [sha-1]
/**
 * [mode] is up to six bytes and is an octal representation of a file mode, stored in ASCII. For example, 100644 is encoded with byte values 49 (ASCII “1”), 48 (ASCII “0”), 48, 54, 52, 52. The first two digits encode the file type (file, directory, symlink or submodule), the last four the permissions.
 * It’s followed by 0x20, an ASCII space;
 * Followed by the null-terminated (0x00) path;
 * Followed by the object’s SHA-1 in binary encoding, on 20 bytes.
 */

export function treeParseOne(raw: Buffer, start = 0) {
  // Finding the space terminator of the mode
  // 32 is the ascii for the space
  const spacePos = raw.findIndex(
    (value, index) => index >= start && value === 32
  );

  // Read the mode
  let mode = raw.subarray(start, spacePos);
  if (mode.length === 5) {
    let paddedMode = Buffer.alloc(6);
    // fill the new buffer with a space to normalize the length to 6
    paddedMode.fill(" ", 0, 1);
    mode.copy(paddedMode, 1);
    mode = paddedMode;
  }

  // Find the null terminator of the path
  const nullTerminatorPos = raw.findIndex(
    (value, index) => index >= spacePos && value === 0
  );
  // read the path
  const path = raw.subarray(spacePos + 1, nullTerminatorPos);

  // Read the SHA and convert to a hex string
  const sha = raw
    .subarray(nullTerminatorPos + 1, nullTerminatorPos + 21)
    .toString("hex");

  return {
    pos: nullTerminatorPos + 21,
    tree: new GitTreeLeaf(mode, path.toString("utf8"), sha)
  };
}

export function treeParse(raw: Buffer) {
  let start = 0;
  let end = raw.length;
  const treesList: GitTreeLeaf[] = [];
  while (start < end) {
    const { pos, tree } = treeParseOne(raw, start);
    start = pos;
    treesList.push(tree);
  }

  return treesList;
}

export function treeSerializer(trees: GitTreeLeaf[]) {
  // initalize a buffer where we write all the stuff!!!
  let serializedData = Buffer.from("");
  for (const tree of trees) {
    // write the mode
    serializedData = Buffer.concat([serializedData, tree.mode]);
    // write the space
    serializedData = Buffer.concat([serializedData, Buffer.from(" ")]);
    // write the path
    serializedData = Buffer.concat([
      serializedData,
      Buffer.from(tree.path, "utf8")
    ]);
    // write the null character
    serializedData = Buffer.concat([serializedData, Buffer.from([0x00])]);
    // write the hex
    serializedData = Buffer.concat([
      serializedData,
      Buffer.from(tree.sha, "hex")
    ]);
  }

  return serializedData;
}

export async function lsTree(
  repo: GitRepository,
  tree: string,
  recursive: boolean,
  prefix = ""
) {
  const treeSha = objectFind(repo, tree, "tree");
  const treeObj = (await objectRead(repo, treeSha)) as GitTree;
  for (const tree of treeObj.treeData) {
    const typeBuffer =
      tree.mode.length === 5
        ? tree.mode.subarray(0, 1)
        : tree.mode.subarray(0, 2);

    let fileType = "";

    // Determine the type.
    if (Buffer.compare(typeBuffer, Buffer.from("04")) === 0) {
      fileType = "tree";
    } else if (Buffer.compare(typeBuffer, Buffer.from("10")) === 0) {
      // A regular file.
      fileType = "blob";
    } else if (Buffer.compare(typeBuffer, Buffer.from("12")) === 0) {
      // A symlink. Blob contents is link target.
      fileType = "blob";
    } else if (Buffer.compare(typeBuffer, Buffer.from("16")) === 0) {
      // A submodule
      fileType = "commit";
    }

    if (!fileType) throw new Error("Cannot determine the file type");

    if (!(recursive && fileType === "tree")) {
      // this is a leaf
      console.log(
        `${
          "0".repeat(6 - tree.mode.length) + tree.mode.toString("ascii")
        } ${fileType} ${tree.sha}\t${path.join(prefix, tree.path)}`
      );
    } else {
      // this is a branch recurse
      await lsTree(repo, tree.sha, recursive, path.join(prefix, tree.path));
    }
  }
}
