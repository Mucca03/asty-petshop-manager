import {Request, Response } from 'express'
import prisma from "../services/prisma"

export const createClient = async (req: Request, res: Response) =>{
    const {name, phones} = req.body;
    const create = await prisma.clients.create({
        data:{
            name,
            client_phones:{
                create: phones.map((phone:string)=> ({phone}))
            },
        },
        include: {
            client_phones: true,
        },
    });

    res.json(create);
}

export const getClients =async (req: Request, res: Response) => {
    const get = await prisma.clients.findMany({
        include: {
            client_phones: true,
        },
        orderBy: {
            id: "desc",
        },
    });
    res.json(get)
}


/*
export const putClients = async (req: Request, res: Response) =>{
    const {id} = req.params;
    const post = await prisma.clients.update({
        where: {id: Number(id)},
        data: {published: true},
    });
    res.json(post)
}

 */

/*
app.put('/publish/:id', async (req, res) => {
  const { id } = req.params
  const post = await prisma.post.update({
    where: { id: Number(id) },
    data: { published: true },
  })
  res.json(post)
})
 */
