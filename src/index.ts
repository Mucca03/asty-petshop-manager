/*import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    await prisma.$connect();
    console.log("✅ Conectado a la BD");

    const clients = await prisma.clients.findMany({
        take: 5,
    });

    console.log(clients);

    await prisma.$disconnect();
}

main().catch(async (error) => {
    console.error("❌ Error:", error);
    await prisma.$disconnect();
});
*/

import express, { Application, Request, Response } from 'express';
import clientRoutes from "./routes/client.routes";

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/clients", clientRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express & TypeScript Server');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
