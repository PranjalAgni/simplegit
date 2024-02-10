#! /usr/bin/env bun

import { Command } from "commander";
import { GitRepository } from "./lib/GitRepository";

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
