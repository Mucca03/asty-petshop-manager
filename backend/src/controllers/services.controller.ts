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

export const deleteService = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (isNaN(Number(id))) {
        return res.status(400).json({ error: "Invalid service id" });
    }

    try {
        const deletedService = await prisma.services.delete({
            where: {
                id: Number(id),
            },
        });
        res.json(deletedService);
    } catch {
        res.status(500).json({ error: "Error deleting service or service not found" });
    }
};
