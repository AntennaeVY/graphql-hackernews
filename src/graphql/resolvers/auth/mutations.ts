import { mutationField, nonNull, stringArg } from "nexus";

import { createToken, hashPassword, verifyPassword } from "../../../utils/auth";
import { excludeKey } from "../../../utils/misc";

export const signUpMutation = mutationField("signup", {
  type: "AuthPayload",
  args: {
    name: nonNull(stringArg()),
    email: nonNull(stringArg()),
    password: nonNull(stringArg()),
  },
  async resolve(parent, args, context) {
    // TODO: validate name, email, password
    const { name, email, password } = args;
    const hash = hashPassword(password);

    const user = await context.prisma.user.create({
      data: {
        name,
        email,
        password: hash,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    const token = createToken({ userId: user.id });
    const payload = { token: token, user: user };

    return payload;
  },
});

export const loginMutation = mutationField("login", {
  type: "AuthPayload",
  args: {
    email: nonNull(stringArg()),
    password: nonNull(stringArg()),
  },
  async resolve(parent, args, context) {
    const { email, password } = args;

    const user = await context.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw new Error("Invalid email/password");

    const isValid = verifyPassword(password, user.password);

    if (!isValid) throw new Error("Invalid email/password");

    const token = createToken({ userId: user.id });
    const userWithoutPassword = excludeKey(user, ["password"]);
    const payload = { token: token, user: userWithoutPassword };

    return payload;
  },
});
