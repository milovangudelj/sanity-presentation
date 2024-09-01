import React from "react";

type WritableKeys<T> = {
  [K in keyof T]-?: IfEquals<
    { [Q in K]: T[K] },
    { -readonly [Q in K]: T[K] },
    K
  >;
}[keyof T];

type IfEquals<X, Y, A = X, B = never> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? A : B;

type MockedHooks = Partial<{
  [K in WritableKeys<typeof React>]: (typeof React)[K];
}>;

export function mockHooks(): MockedHooks {
  const ogUseMemo = React.useMemo;

  React.useMemo = (fn) => fn();

  return {
    useMemo: ogUseMemo,
  };
}

export function restoreHooks(hooks: MockedHooks) {
  for (const key in hooks) {
    const k = key as keyof typeof hooks;
    React[k] = hooks[k] as any;
  }
}
