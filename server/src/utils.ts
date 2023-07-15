import { promisify } from "util";

export const setTimeoutAsync = promisify(setTimeout)
