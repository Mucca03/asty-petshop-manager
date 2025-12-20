import {Request, Response } from 'express'
import prisma from "../services/prisma"

export const createPet = async (req: Request, res: Response) =>{
    const {name, raza, client_id} = req.body;

    if(!name || !raza || !client_id){
        return res.status(400).json({
            error: "name, raza and client are required",
        });
    }

    const create = await prisma.pets.create({
        data:{
            name,
            raza,
            client_id: Number(client_id),
        },
    });

    res.status(201).json(create);
}