/* eslint-disable @typescript-eslint/no-explicit-any */

export type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;

type Writeable<T> = { -readonly [P in keyof T]: T[P] };
type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };