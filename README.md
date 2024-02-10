# simplegit

simplegit is git reimplementation from bottom-up

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

## Understanding Git object storage system

1.  Git storage format - It uses SHA-1 hash!!!

    `<header><ascii_space><size_of_object_in_bytes><null_byte_0x00><content>`

        header - specifies the type (blob, commit, tag or tree)
        ascii_space - ASCII space (0x20)
        size_of_object_in_bytes - size of the content stored in the object
        null_byte_0x00 - Null byte 0x00
        content - contents of object

    Fun tip 💡: Checkout `playground/zlib.ts` if you provide it any valid `.git/objects/<hash>/<hash>` location it will fetch the content from the hash it's really cool
