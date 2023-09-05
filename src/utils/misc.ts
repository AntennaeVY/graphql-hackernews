export function excludeKey<T extends Record<string, any>, Key extends keyof T>(
  object: T,
  keys: Key[]
): Omit<T, Key> {
  return Object.fromEntries(
    Object.entries(object).filter(([key]) => !keys.includes(key as Key))
  ) as Omit<T, Key>;
}
