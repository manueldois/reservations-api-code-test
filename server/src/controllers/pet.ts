import { ExegesisContext } from "exegesis-express"

export const postPet = (context: ExegesisContext) => {
    return { a: 1, name: context.requestBody.name }
}
