import fs from "node:fs";
import path from "node:path";
import ini from "ini";

export class GitRepository {
  private worktree: string;
  private gitdir: string;
  private conf: { [key: string]: any };

  constructor(dirPath: string, force = false) {
    this.worktree = dirPath;
    this.gitdir = path.join(dirPath, ".git");
    this.conf = {};

    // Check if gitdir path is a directory
    // if force = false and its present = no ex
    // if force = false and not present = ex
    // if force = true and its present = no ex
    // if force = false and not present = no ex
    if (!(force || fs.statSync(this.gitdir).isDirectory())) {
      throw new Error(`"Not a Git repository ${dirPath}`);
    }

    const cf = this.repoFile(["config"]);
    if (cf && fs.existsSync(cf)) {
      const text = fs.readFileSync(cf, { encoding: "utf-8" });
      this.conf = ini.parse(text);
    } else if (!force) {
      throw new Error("Configuration file missing");
    }

    if (!force) {
      const vers = Number(this.conf?.core?.repositoryformatversion);
      if (vers !== 0) {
        throw new Error(`Unsupported repositoryformatversion ${vers}`);
      }
    }
  }

  // Create a new repository at path.
  static repoCreate(repoPath: string) {
    const repo = new GitRepository(repoPath, true);

    // First, we make sure the path either doesn't exist or is an empty dir.
    if (fs.existsSync(repo.worktree)) {
      if (!fs.statSync(repo.worktree).isDirectory()) {
        throw new Error(`${repoPath} is not a directory!`);
      }

      if (fs.existsSync(repo.gitdir) && fs.statSync(repo.gitdir).size === 0) {
        throw new Error(`${repoPath} is not empty!`);
      }
    } else {
      fs.mkdirSync(repo.worktree, { recursive: true });
    }

    repo.repoDir(["branches"], true);
    repo.repoDir(["objects"], true);
    repo.repoDir(["refs", "tags"], true);
    repo.repoDir(["refs", "heads"], true);

    //  .git/description
    const descriptionFilePath = repo.repoFile(["description"]);
    if (descriptionFilePath) {
      fs.writeFileSync(
        descriptionFilePath,
        "Unnamed repository; edit this file 'description' to name the repository.\n"
      );
    }

    // .git/HEAD
    const headFilePath = repo.repoFile(["HEAD"]);
    if (headFilePath) {
      fs.writeFileSync(headFilePath, "ref: refs/heads/master\n");
    }

    // writing git config
    const configFilePath = repo.repoFile(["config"]);
    if (configFilePath) {
      repo.setRepoDefaultConfig();
      const text = ini.stringify(repo.conf);
      fs.writeFileSync(configFilePath, text);
    }

    return repo;
  }

  // Compute path under repo's gitdir
  private repoPath(dirPath: string[]): string {
    return path.join(this.gitdir, ...dirPath);
  }

  /* Same as repo_path, but create dirname(*path) if absent.
    For example, repoFile(r, \"refs\", \"remotes\", \"origin\", \"HEAD\") will create
    .git/refs/remotes/origin.
  */
  private repoFile(filePath: string[], mkdir = false): string | null {
    const dirPath = this.repoDir(filePath.slice(0, -1), mkdir);
    if (dirPath) {
      return this.repoPath(filePath);
    }

    return null;
  }

  private repoDir(dirPath: string[], mkdir = false): string | null {
    const completeDirPath = this.repoPath(dirPath);
    if (fs.existsSync(completeDirPath)) {
      if (fs.statSync(completeDirPath).isDirectory()) {
        return completeDirPath;
      } else {
        throw new Error(`Not a directory ${completeDirPath}`);
      }
    }

    if (mkdir) {
      fs.mkdirSync(completeDirPath, { recursive: true });
      return completeDirPath;
    } else {
      return null;
    }
  }

  // repository default config to be stored in .git/config
  private setRepoDefaultConfig() {
    Object.defineProperty(this.conf, "core", {
      value: {
        repositoryformatversion: "0",
        filemode: "false",
        bare: "false"
      },
      writable: true,
      enumerable: true
    });
  }
}
