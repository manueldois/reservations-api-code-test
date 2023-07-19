import { promisify } from "util";

export const setTimeoutAsync = promisify(setTimeout)
export const viaJson = data => JSON.parse(JSON.stringify(data))