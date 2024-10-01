import { Request, Response } from "express";

import UploadService from "./upload.service";

class UploadController {
  async UploadMeasurement(req: Request, res: Response, next) {
    try {
      const { status, result } = await UploadService.UploadMeasurement(req.body);
      if (status == 409) {
        return res.status(status).send({ error_code: "DOUBLE_REPORT", error_description: "Leitura do mês já realizada" });
      }
      return res.status(status).send(result);
    } catch (error) {
      return res.status(error.status).send({ error });
    }
  }

  async ConfirmMeasurement(req: Request, res: Response, next) {
    try {
      const { status, sucess } = await UploadService.ConfirmMeasurement(req.body);
      if (status == 409) {
        return res
          .status(status)
          .send({ error_code: "CONFIRMATION_DUPLICATE", error_description: "Leitura do mês já confirmada" });
      }
      if (status == 404) {
        return res
          .status(status)
          .send({ error_code: "MEASURE_NOT_FOUND", error_description: "Leitura do mês não encontrada" });
      }
      return res.status(status).send({ sucess });
    } catch (error) {
      return res.status(error.status).send({ error });
    }
  }

  async GetMeasurement(req: Request, res: Response, next) {
    try {
      const { customer_code } = req.params;
      const { measure_type } = req.query;

      const { status, result } = await UploadService.GetMeasurement(customer_code, String(measure_type));
      if (status == 404) {
        return res
          .status(status)
          .send({ error_code: "MEASURES_NOT_FOUND", error_description: "Nenhuma leitura encontrada" });
      }
      return res.status(status).send(result);
    } catch (error) {
      return res.status(error.status).send({ error });
    }
  }
}

export default new UploadController();
