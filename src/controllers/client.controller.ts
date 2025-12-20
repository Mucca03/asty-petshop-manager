import {Request, Response } from 'express'
import prisma from "../services/prisma"

export const createClient = async (req: Request, res: Response) =>{
    const {name, phones} = req.body;

    if(!name || !phones){
        return res.status(400).json({
            error: "name and phones are required",
        });
    }

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
            pets: true,
        },
        orderBy: {
            id: "desc",
        },
    });
    res.json(get)
}


export const getClientsId =async (req: Request, res: Response) => {
    //req.params.id agarra el dato de la url
    const client_id = Number(req.params.id);

    if(isNaN(client_id)){
        return res.status(400).json({
            error: "Invalid client id",
        });
    }

    const get = await prisma.clients.findUnique({
        where:{
            id: client_id,
        },
        include: {
            client_phones: true,
            pets: {
                include: {
                    services: true,
                }
            }
        },
    });

    if(!get){
        return res.status(400).json({
            error: "cliend not found"
        });
    }
    res.json(get)
}

export const deleteClient = async (req: Request, res: Response)  =>{
    const {id} = req.params;
    const post= await prisma.clients.delete({
        where: {
            id: Number(id),
        },
    });
    res.json(post);
}


/*
app.delete(`/post/:id`, async (req, res) => {
    const { id } = req.params
    const post = await prisma.post.delete({
        where: {
            id: Number(id),
        },
    })
    res.json(post)
})*/

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
