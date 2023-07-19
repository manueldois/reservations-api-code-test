import { NextFunction, Request, Response } from "express";
import { Reservation } from "@prisma/client";
import asyncHandler from "express-async-handler"
import prisma from "../prisma";

export const getAllReservations = asyncHandler(
    async (req: Request, res: Response) => {
        res.json(await prisma.reservation.findMany())
    }
)

export const createReservation = asyncHandler(
    async (req: Request, res: Response) => {
        const reservation = await prisma.reservation.create({
            data: {
                ...req.body,
                startDate: new Date(req.body.startDate),
                endDate: new Date(req.body.endDate)
            },
        });

        res.status(201).json(reservation)
        return
    }
)

export const checkReservationExistsById =
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const reservation = await prisma.reservation.findUnique({
            where: { id: parseInt(id) },
        });
        if (!reservation) {
            res.status(404).end()
        }
        req['reservation'] = reservation
        next()
    }
    )

interface RequestWithReservation extends Request {
    reservation: Reservation
}

export const getReservationById = [
    checkReservationExistsById,
    asyncHandler(async (req: RequestWithReservation, res: Response) => {
        res.status(200).json(req.reservation)
    }
    )
]

export const updateReservationById = [
    checkReservationExistsById,
    asyncHandler(async (req: RequestWithReservation, res: Response) => {
        const { id } = req.reservation;
        const updatedReservation = await prisma.reservation.update({
            where: { id },
            data: {
                ...req.body,
                startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
                endDate: req.body.endDate ? new Date(req.body.endDate) : undefined
            },
        });

        res.status(200).json(updatedReservation)
    }
    )
]

export const deleteReservationById = [
    checkReservationExistsById,
    asyncHandler(async (req: RequestWithReservation, res: Response) => {
        const { id } = req.reservation;
        await prisma.reservation.delete({
            where: { id },
        });
        res.status(200).end()
    })
]

