#! /usr/bin/env bun

import { Command, Argument, Option } from "commander";
import { InitCommand } from "./commands/InitCommand";
import { CatCommand } from "./commands/CatCommand";
import { HashObjectCommand } from "./commands/HashObjectCommand";
import { LogCommand } from "./commands/LogCommand";
import { GitListTreeCommand } from "./commands/GitListTreeCommand";

function setupCommands(program: Command) {
  // init command
  program
    .command("init")
    .description("Initialize a new, empty repository.")
    .argument("[path]", "Where to create the repository.", "testgit")
    .action(function (path: string) {
      InitCommand.getInstance().execute(path);
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
      await CatCommand.getInstance().execute(type, object);
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
      HashObjectCommand.getInstance().execute(path, options);
    });

  // add the log command
  program
    .command("log")
    .description("Display history of a given commit.")
    .argument("[commit]", "Commit to start at.", "HEAD")
    .action(async function (commit: string) {
      await LogCommand.getInstance().execute(commit);
    });

  // ls-tree tree command
  program
    .command("ls-tree")
    .description("Recurse into sub-trees")
    .addOption(
      new Option("-r [recursive]", "Recurse into sub-trees").default(false)
    )
    .argument("<tree>", "A tree-ish object.")
    .action(async function (tree: string, options: { r: boolean }) {
      await GitListTreeCommand.getInstance().execute(tree, options);
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
