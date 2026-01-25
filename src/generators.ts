import { sha256 } from "js-sha256";

import { Context, Tag } from "./types.js";

type Tags = {
  [key: string]: Tag;
};

type Payload = {
  text: string;
  tags?: Tags;
  context?: Context;
  index?: number;
};

type IdGeneratorOptions = {
  ignoreIndex?: boolean;
};

class IdGenerator {
  private indexMap: Record<string, number> = {};
  private ignoreIndex: boolean;

  constructor(options: IdGeneratorOptions = {}) {
    this.ignoreIndex = options.ignoreIndex || false;
  }

  public generateId(text: string, tags?: Tags, context?: Context): string {
    let index: number | undefined;

    if (!this.ignoreIndex) {
      if (this.indexMap[text]) {
        this.indexMap[text] += 1;
      } else {
        this.indexMap[text] = 1;
      }
      index = this.indexMap[text];
    }

    const payload: Payload = {
      text,
      tags,
      context,
      index,
    };

    return sha256(JSON.stringify(payload));
  }
}

export { IdGenerator };
