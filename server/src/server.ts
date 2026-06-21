import express ,{type Request, type Response} from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import serviceProviderRoutes from "./routes/ServiceRoutes.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//DB CONNECTION 
connectDB();

app.use(cors());
app.use(express.json());

//Mounting the service provider routes

app.use("/api/servics", serviceProviderRoutes);


app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Server is running"
    });
});



app.listen(PORT, () => {

    console.log(`Server is Connected and running on port  http://localhost:${PORT}`);
});