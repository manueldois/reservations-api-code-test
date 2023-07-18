import { NextFunction, Request, Response } from "express";
import { Reservation } from "@prisma/client";
import prisma from "../prisma";

export const getAllReservations = async (req: Request, res: Response) => {
    return res.json(await prisma.reservation.findMany())
}

export const createReservation = async (req: Request, res: Response) => {
    const reservation = await prisma.reservation.create({
        data: req.body,
    });

    return res.status(201).json(reservation)
}

export const checkReservationExistsById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const reservation = await prisma.reservation.findUnique({
        where: { id: parseInt(id) },
    });
    if (!reservation) {
        return res.status(404).end()
    }
    req['reservation'] = reservation
    next()
}

interface RequestWithReservation extends Request {
    reservation: Reservation
}

export const getReservationById = [
    checkReservationExistsById,
    async (req: RequestWithReservation, res: Response) => {
        return res.status(200).json(req.reservation)
    }
]

export const updateReservationById = [
    checkReservationExistsById,
    async (req: RequestWithReservation, res: Response) => {
        const { id } = req.reservation;
        const updatedReservation = await prisma.reservation.update({
            where: { id },
            data: req.body,
        });

        return res.status(200).json(updatedReservation)
    }
]

export const deleteReservationById = [
    checkReservationExistsById,
    async (req: RequestWithReservation, res: Response) => {
        const { id } = req.reservation;
        await prisma.reservation.delete({
            where: { id },
        });
        return res.status(200).end()
    }
]

