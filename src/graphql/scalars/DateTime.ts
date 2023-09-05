import { GraphQLDateTime } from "graphql-scalars";
import { asNexusMethod } from "nexus";

export const DateTime = asNexusMethod(GraphQLDateTime, "dateTime");
