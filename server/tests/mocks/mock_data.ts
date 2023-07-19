import { Property, Reservation } from "@prisma/client"

export const defaultProperty: Omit<Property, 'id'> = {
    name: "The Grand Budapest Hotel"
}

export const defaultReservation: Omit<Reservation, 'id'> = {
    startDate: new Date('2023-07-16 00:00:00.000'),
    endDate: new Date('2023-07-20 00:00:00.000'),
    propertyId: 1,
}