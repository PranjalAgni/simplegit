# simplegit

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

## Understanding and building simple git

Important files where our internal git data gets stored

1. .git/objects/ : the object store, more on this as we build it.
2. .git/refs/ the reference store, which we’ll discuss a bit later. It contains two subdirectories, heads and tags.
3. .git/HEAD, a reference to the current HEAD (more on that later!)
4. .git/config, the repository’s configuration file.
5. .git/description, holds a free-form description of this repository’s contents, for humans, and is rarely used.
