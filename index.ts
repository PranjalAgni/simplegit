#! /usr/bin/env bun

import { Command, Argument, Option } from "commander";
import { GitRepository } from "./lib/GitRepository";
import { objectFind, objectHash, objectRead } from "./helpers/gitobject";
import { logGraphviz } from "./helpers/graphviz";

function setupCommands(program: Command) {
  // init command
  program
    .command("init")
    .description("Initialize a new, empty repository.")
    .argument("[path]", "Where to create the repository.", "testgit")
    .action(function (path: string) {
      GitRepository.repoCreate(path);
      console.log("Repository created");
    });

  // cat-file command
  program
    .command("cat-file")
    .description("Provide content of repository objects.")
    .addArgument(
      new Argument("<type>", "Specify the type").choices([
        "blob",
        "commit",
        "tag",
        "tree"
      ])
    )
    .addArgument(
      new Argument("object", "The object hash to display content from")
    )
    .action(async function (type: string, object: string) {
      const repository = GitRepository.repoFind()!;
      const obj = (await objectRead(repository, object))!;
      console.log(obj.serialize().toString("utf8"));
    });

  // hash-object command
  program
    .command("hash-object")
    .description("Compute object ID and optionally creates a blob from a file")
    .addOption(
      new Option("-t <type>", "Specify the type")
        .choices(["blob", "commit", "tag", "tree"])
        .default("blob")
    )
    .addOption(
      new Option(
        "-w [write]",
        "Actually write the object into the database"
      ).default(false)
    )
    .addArgument(new Argument("<path>", "Read object from a <file>"))
    .action(function (path: string, options: { t: string; w: boolean }) {
      const repo = GitRepository.repoFind();
      const hash = objectHash(path, options.t, repo);
      console.log("Hash: ", hash);
    });

  // add the log command
  program
    .command("log")
    .description("Display history of a given commit.")
    .argument("[commit]", "Commit to start at.", "HEAD")
    .action(async function (commit: string) {
      const repo = GitRepository.repoFind();
      if (repo) {
        console.log("digraph wyaglog{");
        console.log("  node[shape=rect]");
        await logGraphviz(repo, objectFind(repo, commit), new Set());
        console.log("}");
      }
    });
}

function main() {
  const program = new Command();
  program
    .name("simplegit")
    .description("The stupidest content tracker")
    .exitOverride(function () {
      process.exit(0);
    })
    .version("0.0.1");

  setupCommands(program);

  program.parse(process.argv);
}

main();
