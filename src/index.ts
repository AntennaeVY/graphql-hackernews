require("./utils/env");

import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

import { schema } from "./schema";
import { context } from "./context";

export const server = new ApolloServer({
  schema: schema,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
  context: context,
});

server
  .listen({ port: 3000 })
  .then(() => console.log("Server is running on port 3000"));
