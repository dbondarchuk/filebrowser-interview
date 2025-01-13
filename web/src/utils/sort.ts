import { SortOrder } from "../types/sort";

export function compareStrings(a: string, b: string, order: SortOrder, ignoreCase = true) {
    const stringA = ignoreCase ? a.toLocaleLowerCase() : a;
    const stringB = ignoreCase ? b.toLocaleLowerCase() : b;
    const multiplier = order === 'asc' ? 1 : -1;

    if (stringA < stringB) return -1 * multiplier;
    if (stringA > stringB) return 1 * multiplier;

    return 0;
}

export function compareNumbers(a: number, b: number, order: SortOrder) {
    const multiplier = order === 'asc' ? 1 : -1;

    if (a < b) return -1 * multiplier;
    if (a > b) return 1 * multiplier;

    return 0;
}

export function compareDates(a: Date, b: Date, order: SortOrder) {
    const multiplier = order === 'asc' ? 1 : -1;

    if (a < b) return -1 * multiplier;
    if (a > b) return 1 * multiplier;

    return 0;
}