export abstract class GitCommand {
  abstract execute(...args: any[]): void;
}
