import {Request, Response } from 'express'
import prisma from "../services/prisma"
import {normalizePetBreed} from "../../../shared/petBreeds";

export const createPet = async (req: Request, res: Response) =>{
    const {name, raza, edad, client_id} = req.body ?? {};
    const petName = typeof name === "string" ? name.trim() : "";
    const petRaza = normalizePetBreed(typeof raza === "string" ? raza : "");
    const petAge = typeof edad === "string" && edad.trim().length > 0 ? edad.trim() : "Adulto";
    const clientId = Number(client_id);

    if(!petName || !petRaza || !Number.isInteger(clientId) || clientId <= 0){
        return res.status(400).json({
            error: "name, raza and client are required",
        });
    }

    const create = await prisma.pets.create({
        data:{
            name: petName,
            raza: petRaza,
            edad: petAge,
            client_id: clientId,
        },
    });

    res.status(201).json(create);
}