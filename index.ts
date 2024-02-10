import { GitRepository } from './lib/GitRepository';

function main() {
  const dir = process.argv[2];
  GitRepository.repoCreate(dir);
}

main();
