import { NextFunction, Request, Response } from "express";
import { Property } from "@prisma/client";
import prisma from "../prisma";
import asyncHandler from "express-async-handler";

export const getAllProperties = asyncHandler(async (req: Request, res: Response) => {
    res.json(await prisma.property.findMany())
}
)

export const createProperty = asyncHandler(async (req: Request, res: Response) => {
    const property = await prisma.property.create({
        data: req.body,
    });

    res.status(201).json(property)
}
)

export const checkPropertyExistsById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const property = await prisma.property.findUnique({
            where: { id: parseInt(id) },
        });
        if (!property) {
            res.status(404).end()
        }
        req['property'] = property
        next()
    }
)

interface RequestWithProperty extends Request {
    property: Property
}

export const getPropertyById = [
    checkPropertyExistsById,
    asyncHandler(async (req: RequestWithProperty, res: Response) => {
        res.status(200).json(req.property)
    }
    )
]


export const updatePropertyById = [
    checkPropertyExistsById,
    asyncHandler(async (req: RequestWithProperty, res: Response) => {
        const { id } = req.property;
        const updated = await prisma.property.update({
            where: { id },
            data: req.body,
        });

        res.status(200).json(updated)
    }
    )
]

export const deletePropertyById = [
    checkPropertyExistsById,
    asyncHandler(async (req: RequestWithProperty, res: Response) => {
        const { id } = req.property;
        await prisma.property.delete({
            where: { id },
        });
        res.status(200).end()
    }
    )
]

