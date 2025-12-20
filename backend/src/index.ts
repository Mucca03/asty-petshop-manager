import express, { Application, Request, Response } from 'express';
import {clientRoutes, petRoutes,servicesRoutes} from './routes'

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/clients", clientRoutes);
app.use("/pets", petRoutes);
app.use("/services", servicesRoutes);


app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express & TypeScript Server');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
