import type { GitCommit } from "../lib/GitCommit";
import type { GitRepository } from "../lib/GitRepository";
import { objectRead } from "./gitobject";

export async function logGraphviz(
  repo: GitRepository,
  sha: string,
  seen: Set<string>
) {
  if (seen.has(sha)) {
    return;
  }
  seen.add(sha);
  const commit = (await objectRead(repo, sha)) as GitCommit | null;
  if (!commit) return;
  const shortHash = sha.substring(0, 8);
  let message = commit.kvlm.get("msg")!.toString().trim();
  message = message.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  if (message.includes("\n")) {
    message = message.substring(0, message.indexOf("\n"));
  }
  console.log(`  c_${sha} [label="${sha.substring(0, 7)}: ${message}"]`);
  if (commit.format.toString() !== "commit") {
    throw new Error("Invalid commit format");
  }

  if (!commit.kvlm.get("parent")) {
    // Base case: the initial commit.
    return;
  }

  let parents = commit.kvlm.get("parent")!;
  let parentsList: string[] = [];
  if (!Array.isArray(parents)) {
    parentsList = [parents];
  }

  for (const p of parentsList) {
    const parentSha = p.trim();
    console.log(`  c_${sha} -> c_${parentSha};`);
    await logGraphviz(repo, parentSha, seen);
  }
}
