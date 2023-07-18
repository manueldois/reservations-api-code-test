import { NextFunction, Request, Response } from "express";
import { Property } from "@prisma/client";
import prisma from "../prisma";

export const getAllProperties = async (req: Request, res: Response) => {
    return res.json(await prisma.property.findMany())
}

export const createProperty = async (req: Request, res: Response) => {
    const property = await prisma.property.create({
        data: req.body,
    });

    return res.status(201).json(property)
}

export const checkPropertyExistsById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const property = await prisma.property.findUnique({
        where: { id: parseInt(id) },
    });
    if (!property) {
        return res.status(404).end()
    }
    req['property'] = property
    next()
}

interface RequestWithProperty extends Request {
    property: Property
}

export const getPropertyById = [
    checkPropertyExistsById,
    async (req: RequestWithProperty, res: Response) => {
        return res.status(200).json(req.property)
    }
]


export const updatePropertyById = [
    checkPropertyExistsById,
    async (req: RequestWithProperty, res: Response) => {
        const { id } = req.property;
        const updated = await prisma.property.update({
            where: { id },
            data: req.body,
        });

        return res.status(200).json(updated)
    }
]

export const deletePropertyById = [
    checkPropertyExistsById,
    async (req: RequestWithProperty, res: Response) => {
        const { id } = req.property;
        await prisma.property.delete({
            where: { id },
        });
        return res.status(200).end()
    }
]

