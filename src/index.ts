import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import deepEqual from "deep-equal";

export type FieldUpdateHandler<TData, T> = (
  beforeValue: T | undefined,
  afterValue: T | undefined,
  change: functions.Change<admin.firestore.DocumentSnapshot<TData>>
) => Promise<void> | void;

export type FieldUpdateHandlers<TData> = {
  [K in keyof TData]?: FieldUpdateHandler<TData, TData[K]>;
};

export const onFieldUpdate = <TData>(
  change: functions.Change<admin.firestore.DocumentSnapshot<TData>>,
  handlers: FieldUpdateHandlers<TData>
): Promise<void[]> => {
  const promises: Promise<void>[] = [];

  Object.entries(handlers).forEach(([field, handler]) => {
    const afterValue = change.after.data()?.[field] as
      | TData[keyof TData]
      | undefined;
    const beforeValue = change.before.data()?.[field] as
      | TData[keyof TData]
      | undefined;

    if (typeof handler === "function" && !deepEqual(afterValue, beforeValue)) {
      promises.push(handler(beforeValue, afterValue, change));
    }
  });

  return Promise.all(promises);
};
