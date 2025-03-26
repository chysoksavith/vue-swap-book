import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import userRouter from "./routes/userRoutes";
import categoryRouter from "./routes/categoryRoutes";
import bookRouter from "./routes/bookRouters";
dotenv.config();
const app = express();

// middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// route
app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/books", bookRouter);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
