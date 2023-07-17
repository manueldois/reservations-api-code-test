import prisma from "../prisma";

export const getAllProperties = async () => {
    return prisma.property.findMany();
}

export const createProperty = async (context) => {
    const property = await prisma.property.create({
        data: context.requestBody,
    });
    return {
        statusCode: 201,
        body: property,
    };
}

export const getPropertyById = async (context) => {
    const { id } = context.params;
    const property = await prisma.property.findUnique({
        where: { id: parseInt(id) },
    });
    if (!property) {
        return { statusCode: 404 };
    }
    return {
        statusCode: 200,
        body: property,
    };
}

export const updatePropertyById = async (context) => {
    const { id } = context.params;
    const property = await prisma.property.update({
        where: { id: parseInt(id) },
        data: context.requestBody,
    });
    if (!property) {
        return { statusCode: 404 };
    }
    return {
        statusCode: 200,
        body: property,
    };
}

export const deletePropertyById = async (context) => {
    const { id } = context.params;
    await prisma.property.delete({
        where: { id: parseInt(id) },
    });
    return { statusCode: 204 };
}


