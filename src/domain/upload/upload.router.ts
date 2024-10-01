import { Router } from "express";

import UploadController from "./upload.controller";
import UploadMiddleware from "./upload.middleware";

const UploadRouter = Router();

UploadRouter.route("/").post(UploadMiddleware.validarBodyUpload, UploadController.UploadMeasurement);
UploadRouter.route("/").patch(UploadMiddleware.validarBodyConfirm, UploadController.ConfirmMeasurement);
UploadRouter.route("/:customer_code").get(UploadMiddleware.validarGetMeasure, UploadController.GetMeasurement);

export default UploadRouter;
