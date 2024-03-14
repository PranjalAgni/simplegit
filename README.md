# simplegit

simplegit is git reimplementation from bottom-up
<img width="1017" alt="image" src="https://github.com/PranjalAgni/simplegit/assets/26196076/c816b0ea-f00f-4b13-8622-4f118fe1c19a">

To install dependencies:

```bash
bun install
```

Link the Bun CLI:

```bash
bun link
bun link simplegit
```

Now just run 🚀

```bash
simplegit
simplegit init testgit
simplegit cat-file blob <blob_sha>
simplegit hash-object <file_path>
simplegit log <valid_sha>
simplegit ls-tree <valid_sha>
```

##### **Note**: To get any sha just run `git log` on any git repo and you can plug it in simplegit commands💡

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

## Understanding Git commit format and writing a basic parser for it

1.  Format of commits history:

        ```
        tree 29ff16c9c14e2652b22f8b78bb08a5a07930c147
        parent 206941306e8a8af65b66eaaaea388a7ae24d49a0
        author Thibault Polge <thibault@thb.lt> 1527025023 +0200
        committer Thibault Polge <thibault@thb.lt> 1527025044 +0200
        gpgsig -----BEGIN PGP SIGNATURE-----

        iQIzBAABCAAdFiEExwXquOM8bWb4Q2zVGxM2FxoLkGQFAlsEjZQACgkQGxM2FxoL
        kGQdcBAAqPP+ln4nGDd2gETXjvOpOxLzIMEw4A9gU6CzWzm+oB8mEIKyaH0UFIPh
        rNUZ1j7/ZGFNeBDtT55LPdPIQw4KKlcf6kC8MPWP3qSu3xHqx12C5zyai2duFZUU
        wqOt9iCFCscFQYqKs3xsHI+ncQb+PGjVZA8+jPw7nrPIkeSXQV2aZb1E68wa2YIL
        3eYgTUKz34cB6tAq9YwHnZpyPx8UJCZGkshpJmgtZ3mCbtQaO17LoihnqPn4UOMr
        V75R/7FjSuPLS8NaZF4wfi52btXMSxO/u7GuoJkzJscP3p4qtwe6Rl9dc1XC8P7k
        NIbGZ5Yg5cEPcfmhgXFOhQZkD0yxcJqBUcoFpnp2vu5XJl2E5I/quIyVxUXi6O6c
        /obspcvace4wy8uO0bdVhc4nJ+Rla4InVSJaUaBeiHTW8kReSFYyMmDCzLjGIu1q
        doU61OM3Zv1ptsLu3gUE6GU27iWYj2RWN3e3HE4Sbd89IFwLXNdSuM0ifDLZk7AQ
        WBhRhipCCgZhkj9g2NEk7jRVslti1NdN5zoQLaJNqSwO1MtxTmJ15Ksk3QP6kfLB
        Q52UWybBzpaP9HEd4XnR+HuQ4k2K0ns2KgNImsNvIyFwbpMUyUWLMPimaV1DWUXo
        5SBjDB/V/W2JBFR+XKHFJeFwYhj7DD/ocsGr4ZMx/lgc8rjIBkI=
        =lgTX
        -----END PGP SIGNATURE-----

        Create first draft
        ```

- tree - A tree maps blobs IDs to filesystem locations, and descibes a state of the work tree. Put simply, it is the actual content of the commit: file contents, and where they go

- parent - is a reference to the parent of this commit. It may be repeated: merge commits, for example, have multiple parents. It may also be absent: the very first commit in a repository obviously doesn't have a parent

- author and committer - these can be different because author of commit is not necessarily the person who can commit it. (little bit wierd but earlier git was done through email)

- gpgsig - is the PGP signature of this object

Checkout `playground/commit.ts` to checkout the basic parser for this

2. Reading commit data

   Understaning Trees format:

   ```
   [mode] space [path] 0x00 [sha-1]
   ```

   - mode = upto 6 bytes and is an octal representation of a file mode (Buffer)
   - space = space character (32 ASCII)
   - path = its a single filesystem entry
   - 0X00 = null character (Buffer)
   - sha1 = object sha in binary encoding (Buffer)
