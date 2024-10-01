import { BAD_REQUEST } from "http-status";
import { Request, Response, NextFunction } from "express";

class UploadMiddleware {
  private isValidBase64 = (str: string): boolean => {
    // Verifica se a string está vazia
    if (!str) return false;

    // Expressão regular para validar Base64
    const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:(?:[A-Za-z0-9+/]{2}==)|(?:[A-Za-z0-9+/]{3}=)|[A-Za-z0-9+/]{4})?$/;

    // Verifica se a string é válida e se o comprimento é um múltiplo de 4
    return base64Regex.test(str) && str.length % 4 === 0;
  };

  validarBodyUpload = (req: Request, res: Response, next: NextFunction) => {
    const { image, customer_code, measure_datetime, measure_type } = req.body;

    // Validação dos campos obrigatórios
    if (!image) {
      return res.status(BAD_REQUEST).send({
        error_code: "INVALID_DATA",
        error_description: `O campo {image} não foi informado`,
      });
    }

    if (!customer_code) {
      return res.status(BAD_REQUEST).send({
        error_code: "INVALID_DATA",
        error_description: `O campo {customer_code} não foi informado`,
      });
    }

    if (!measure_datetime) {
      return res.status(BAD_REQUEST).send({
        error_code: "INVALID_DATA",
        error_description: `O campo {measure_datetime} não foi informado`,
      });
    }

    if (!measure_type) {
      return res.status(BAD_REQUEST).send({
        error_code: "INVALID_DATA",
        error_description: `O campo {measure_type} não foi informado.`,
      });
    }

    // Validação dos tipos de dados
    const isValidBase64 = (image) => {
      const base64Pattern = /^data:(.+);base64,(.+)$/;
      return base64Pattern.test(image);
    };

    if (typeof image !== "string" || !isValidBase64(image)) {
      return res.status(BAD_REQUEST).send({
        error_code: "INVALID_DATA",
        error_description: "O campo {image} não é uma string Base64 válida. Data URI -- data:content/type;base64",
      });
    }

    if (typeof customer_code !== "string") {
      return res.status(BAD_REQUEST).send({
        error_code: "INVALID_DATA",
        error_description: `O campo {customer_code} não é uma string.`,
      });
    }

    const date = new Date(measure_datetime as string);
    if (isNaN(date.getTime())) {
      return res.status(BAD_REQUEST).send({
        error_code: "INVALID_DATA",
        error_description: `O campo {measure_datetime} não é uma data válida.`,
      });
    }

    const validMeasureTypes = ["WATER", "GAS"];
    if (!validMeasureTypes.includes(measure_type as string)) {
      return res.status(BAD_REQUEST).send({
        error_code: "INVALID_DATA",
        error_description: `O campo measure_type deve ser um dos seguintes: ${validMeasureTypes.join(", ")}.`,
      });
    }

    next();
  };

  validarBodyConfirm = (req: Request, res: Response, next: NextFunction) => {
    const { measure_uuid, confirmed_value } = req.body;

    // Validação dos campos obrigatórios
    if (!measure_uuid) {
      return res.status(BAD_REQUEST).send({
        error_code: "INVALID_DATA",
        error_description: `O campo {measure_uuid} não foi informado`,
      });
    }

    if (!confirmed_value) {
      return res.status(BAD_REQUEST).send({
        error_code: "INVALID_DATA",
        error_description: `O campo {confirmed_value} não foi informado`,
      });
    }

    // Validação dos tipos de dados
    if (typeof measure_uuid !== "string") {
      return res.status(BAD_REQUEST).send({
        error_code: "INVALID_DATA",
        error_description: `O campo {measure_uuid} não é um ID válido.`,
      });
    }

    if (typeof confirmed_value !== "number") {
      return res.status(BAD_REQUEST).send({
        error_code: "INVALID_DATA",
        error_description: `O campo {confirmed_value} não é um número.`,
      });
    }

    next();
  };

  validarGetMeasure = (req: Request, res: Response, next: NextFunction) => {
    const { customer_code } = req.params;
    const { measure_type } = req.query;

    if (!customer_code) {
      return res.status(BAD_REQUEST).send({
        error_code: "INVALID_DATA",
        error_description: `O campo {customer_code} não foi informado`,
      });
    }

    const validMeasureTypes = ["WATER", "GAS"];
    if (measure_type && !validMeasureTypes.includes(measure_type as string)) {
      return res.status(BAD_REQUEST).send({
        error_code: "INVALID_DATA",
        error_description: `O campo measure_type deve ser um dos seguintes: ${validMeasureTypes.join(", ")}.`,
      });
    }
    next();
  };
}

export default new UploadMiddleware();
