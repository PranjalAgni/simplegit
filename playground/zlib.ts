import zlib from "node:zlib";
import fs from "node:fs";
import path from "node:path";

/**
 * <header><ascii_space><size_of_object_in_bytes><null_byte_0x00><content>
 */
const gitObjectFile = path.join(
  __dirname,
  "..",
  ".git",
  "objects",
  "01",
  "b8c673f24455a2292c851cb49ca8982906f119"
);

const content = fs.readFileSync(gitObjectFile);
const raw = zlib.inflateSync(content);
console.log("Raw data here: ", raw);
const x = raw.indexOf(32);
console.log("Space index: ", x);
const format = raw.subarray(0, x);
console.log("format: ", format.toString("utf8"));
// start searching null byte now
const y = raw.indexOf("\x00", x);
console.log("Null byte index: ", y);
const size = parseInt(raw.subarray(x, y).toString("ascii"));
console.log("Size:", size, raw.length - y - 1);
const contentAgain = raw.subarray(y + 1).toString("utf8");
console.log("Fetching content from .git directory: ", contentAgain);
