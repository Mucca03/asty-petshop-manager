import {Request, Response } from 'express'
import prisma from "../services/prisma"

export const createServices = async (req: Request, res: Response) =>{
    const {service_type, details, price, paid_amount, status, pet_id} = req.body;

    if(!service_type || !price || !status || !pet_id){
        return res.status(400).json({
            error: "Services type is required",
        });
    }

    const create = await prisma.services.create({
        data:{
            service_type,
            details,
            price,
            paid_amount,
            status,
            pet_id: Number(pet_id),
        },
    });

    res.status(201).json(create);
}