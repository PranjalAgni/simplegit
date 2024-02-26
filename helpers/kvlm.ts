function extract(rawLine: string, start: number, end: number) {
  return rawLine.slice(start, end);
}

export function kvlmParser(raw: string, keyList: string[]) {
  const commitByLine = raw.split("\n");
  const numLines = commitByLine.length;
  const map = new Map<string, string>();
  let currentLine = 0;
  let currentKey = "";
  while (currentLine < numLines) {
    const line = commitByLine.at(currentLine) as string;
    const isKeyLine = keyList.some((key) => line.startsWith(key));
    if (isKeyLine) {
      const spaceIndex = line.indexOf(" ");
      const key = extract(line, 0, spaceIndex);
      const value = extract(line, spaceIndex, line.length);
      currentKey = key;
      map.set(key, value);
    } else {
      if (!currentKey) throw new Error("Key is null while parsing");
      if (line.startsWith(" ")) {
        // this means its a continuation line as it starts with space
        let value = map.get(currentKey) as string;
        value += "\n" + line.trim();
        map.set(currentKey, value);
      } else if (line.length > 0) {
        // this means its a final message which we just read to the end of file
        map.set("msg", line);
      }
    }

    currentLine += 1;
  }

  return map;
}

export function kvlmSerialize(kvlm: Map<string, string>) {
  let result = "";
  for (const key of kvlm.keys()) {
    if (key === "msg") continue;
    const value = kvlm.get(key) as string;
    result += key + " " + value?.replace("\n", "\n ") + "\n";
  }

  result += "\n" + kvlm.get("msg") + "\n";
  return result;
}
