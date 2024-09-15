
import { Persistable } from "../types/writable.types";

export function isPersistable<T = object>(obj: object): obj is Persistable<T> {
    return 'toJson' in obj;
}

