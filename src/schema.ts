import { makeSchema } from "nexus";
import { resolve } from "path";

import * as types from "./graphql";

export const schema = makeSchema({
  types: types,
  outputs: {
    typegen: resolve(__dirname, "../nexus/nexus-typegen.ts"),
    schema: resolve(__dirname, "../nexus/schema.graphql"),
  },
  contextType: {
    module: resolve(__dirname, "./context.ts"),
    export: "Context",
  },
});
