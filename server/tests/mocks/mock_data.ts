import { Property, Reservation } from "@prisma/client"

export const defaultProperty: Omit<Property, 'id'> = {
    name: "The Grand Budapest Hotel"
}

export const defaultReservation: Omit<Reservation, 'id'> = {
    startDate: '2023-07-16',
    endDate: '2023-07-20',
    propertyId: 1,
}