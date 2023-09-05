import { Link, User } from "@prisma/client";
import { extendType, intArg, mutationField, nonNull } from "nexus";

export const voteMutation = mutationField("vote", {
  type: "Vote",
  args: {
    linkId: nonNull(intArg()),
  },
  async resolve(parent, args, context) {
    const { userId } = context;
    const { linkId } = args;

    if (!userId) throw new Error("Can't vote without login in first");

    const link = await context.prisma.link.update({
      where: { id: linkId },
      data: {
        voters: {
          connect: {
            id: userId,
          },
        },
      },
    });

    const user = await context.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    const vote = {
      link: link as Link,
      user: user as User,
    };

    return vote;
  },
});
