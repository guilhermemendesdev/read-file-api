import { Router } from "express";
import DefaultRouter from "./domain/default.router";
import swaggerUi from "swagger-ui-express";
import UploadRouter from "./domain/upload/upload.router";

const AppRouter = Router();
AppRouter.use("/", DefaultRouter).use("/upload", UploadRouter);

export default AppRouter;
