import { ExegesisContext } from "exegesis-express";
import prisma from "../prisma";

export const getAllReservations = async () => {
    return prisma.reservation.findMany({});
}

export const createReservation = async (context: ExegesisContext) => {
    const reservation = await prisma.reservation.create({
        data: context.requestBody,
    });

    context.res.status(201).json(reservation)
}

export const getReservationById = async (context: ExegesisContext) => {
    const { id } = context.params.path;
    const reservation = await prisma.reservation.findUnique({
        where: { id: parseInt(id) },
    });
    if (!reservation) {
        return context.res.status(404).end()
    }
    return context.res.status(200).json(reservation)
}

export const updateReservationById = async (context: ExegesisContext) => {
    const { id } = context.params.path;
    const reservation = await prisma.reservation.update({
        where: { id: parseInt(id) },
        data: context.requestBody,
    });
    if (!reservation) {
        return context.res.status(404).end()
    }
    return context.res.status(200).json(reservation)
}

export const deleteReservationById = async (context: ExegesisContext) => {
    const { id } = context.params.path;
    const reservation = await prisma.reservation.delete({
        where: { id: parseInt(id) },
    });
    if (!reservation) {
        return context.res.status(404).end()
    }
    return context.res.status(200).end()
}

