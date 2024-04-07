declare type RecordKey = string | symbol | number;
declare type Replace<O, K extends RecordKey, T> = Omit<O, K> & { [P in K]: T };
declare type Flatten<T extends Record<RecordKey, unknown>> = { [K in keyof T]: T[K] };
declare type Merge<O, T> = Omit<O, keyof T> & T;
declare type PartialWithKey<O, K extends keyof O> = Merge<O, { [k in K]?: O[k] }>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare type AnyFunction = (...args: any[]) => any;
declare type UnknownFunction = (...args: unknown[]) => unknown;
