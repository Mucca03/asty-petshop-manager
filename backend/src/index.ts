import "dotenv/config";
import express, { Application, Request, Response } from 'express';
import {clientRoutes, petRoutes, registrationRoutes, servicesRoutes} from './routes'
import {errorHandler} from "./middleware/errorHandler";

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/clients", clientRoutes);
app.use("/pets", petRoutes);
app.use("/services", servicesRoutes);
app.use("/registrations", registrationRoutes);


app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express & TypeScript Server');
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
