import { Request, Response } from "express";

export const ping = (req: Request, res: Response) => {
    return res.send('pong')
}
