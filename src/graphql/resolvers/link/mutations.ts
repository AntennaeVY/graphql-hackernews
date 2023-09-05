import { intArg, mutationField, nonNull, stringArg } from "nexus";

export const postMutation = mutationField("post", {
  type: "Link",
  args: {
    url: nonNull(stringArg()),
    description: nonNull(stringArg()),
  },
  async resolve(parent, args, context, info) {
    const { description, url } = args;
    const { userId } = context;

    if (!userId) throw new Error("You need to log in first");

    const link = await context.prisma.link.create({
      data: {
        description,
        url,
        postedBy: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return link;
  },
});

export const updateLinkMutation = mutationField("updateLink", {
  type: "Link",
  args: {
    id: nonNull(intArg()),
    url: stringArg(),
    description: stringArg(),
  },
  async resolve(parent, args, context) {
    const { id, description, url } = args;
    const { userId } = context;

    if (!userId) throw new Error("You need to log in first");

    const link = await context.prisma.link.findUnique({
      select: { postedById: true },
      where: { id: id },
    });

    if (!link) throw new Error("Link doesn't exist");

    if (link.postedById != userId)
      throw new Error("You don't have permissions to do that");

    const newLink = await context.prisma.link.update({
      where: {
        id: id,
      },
      data: {
        description: description || undefined,
        url: url || undefined,
        postedBy: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return newLink;
  },
});

export const deleteLinkMutation = mutationField("deleteLink", {
  type: "Link",
  args: {
    id: nonNull(intArg()),
  },
  async resolve(parent, args, context) {
    const { id } = args;
    const { userId } = context;

    if (!userId) throw new Error("You need to log in first");

    const link = await context.prisma.link.findUnique({
      where: { id: id },
    });

    if (!link) throw new Error("Link doesn't exist");

    if (link.postedById != userId)
      throw new Error("You don't have permissions to do that");

    await context.prisma.link.delete({
      where: {
        id,
      },
    });

    return link;
  },
});
