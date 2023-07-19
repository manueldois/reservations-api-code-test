import { Property, Reservation } from "@prisma/client"
import prisma from "../src/prisma"
import { promisify } from "util"
import { defaultProperty, defaultReservation } from "./mocks/mock_data"

export async function createProperty(data: Partial<Property> = {}): Promise<Property> {
    return prisma.property.create({
        data: { ...defaultProperty, ...data }
    })
}

export async function createReservation(data: Partial<Reservation> = {}): Promise<Reservation> {
    return prisma.reservation.create({
        data: { ...defaultReservation, ...data }
    })
}

export async function migrateDB() {
    const exec = promisify((await import('node:child_process')).exec);
    // const { stderr } = await exec(`echo y | DATABASE_URL='file:./test.db' npx prisma migrate reset --force`);
    const { stderr } = await exec(`DATABASE_URL='file:./test.db' npx prisma db push`)
    if (stderr) {
        console.error(stderr)
        process.exit(1)
    }
}

export async function resetDB() {
    await prisma.reservation.deleteMany({})
    await prisma.property.deleteMany({})
    await prisma.$queryRaw`DELETE FROM "sqlite_sequence";`
}
