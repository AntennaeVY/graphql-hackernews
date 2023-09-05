import { arg, intArg, list, nonNull, queryField, stringArg } from "nexus";
import { Prisma } from "@prisma/client";

export const feedQuery = queryField("feed", {
  type: "Feed",
  args: {
    filter: stringArg(),
    take: intArg(),
    skip: intArg(),
    orderBy: arg({ type: list(nonNull("LinkOrderByInput")) }),
  },
  async resolve(parent, args, context) {
    const filter = args?.filter as string | undefined;
    const skip = args?.skip as number | undefined;
    const take = args?.take as number | undefined;
    const orderBy = args?.orderBy as
      | Prisma.Enumerable<Prisma.LinkOrderByWithRelationInput>
      | undefined;

    const where = {
      OR: [
        {
          description: {
            contains: filter,
          },
        },
        {
          url: {
            contains: filter,
          },
        },
      ],
    };

    const links = await context.prisma.link.findMany({
      where: where,
      skip: skip,
      take: take,
      orderBy: orderBy,
    });

    const count = await context.prisma.link.count({ where: where });
    const id = `main-feed:${JSON.stringify(args)}`;
    const feed = {
      id: id,
      links: links,
      count: count,
    };

    return feed;
  },
});

export const link = queryField("link", {
  type: "Link",
  args: {
    id: nonNull(intArg()),
  },
  async resolve(parent, args, context) {
    const { id } = args;

    const link = await context.prisma.link.findUnique({
      where: {
        id: id,
      },
    });

    return link;
  },
});
