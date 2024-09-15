export function sleep(ms: number) {
    const start = new Date().getTime(), expire = start + ms;
    while (new Date().getTime() < expire) {
        continue;
    }
    return;
}