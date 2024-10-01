import Util from "../../components/utils/util";
import UploadSchema from "./upload.schema";
import { BodyUploadMeasurement, BodyConfirmMeasurement } from "./upload.model";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

class UploadService {
  async UploadMeasurement(requestBody: BodyUploadMeasurement): Promise<any> {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

      const isExist = await UploadSchema.findOne({
        customer_code: requestBody.customer_code,
        measure_date: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
      });

      if (isExist) return Util.duplicado("Leitura do mês já realizada");
      // Upload the file and specify a display name.
      // Initialize GoogleAIFileManager with your API_KEY.
      const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
      // Initialize GoogleGenerativeAI with your API_KEY.
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

      const model = genAI.getGenerativeModel({
        // Choose a Gemini model.
        model: "gemini-1.5-pro",
      });

      const uri = requestBody.image.split(";base64,").pop();
      const mimetype = requestBody.image.split(";base64,");
      const typeFile = mimetype[0].split("/");

      await Util.uploadImage64(uri, requestBody.customer_code, "teste", String(typeFile[1]));

      const uploadResponse = await fileManager.uploadFile(`./src/docs/${requestBody.customer_code}/teste.${typeFile[1]}`, {
        mimeType: `image/${typeFile[1]}`,
        displayName: requestBody.measure_type,
      });

      // Generate content using text and the URI reference for the uploaded file.
      const result = await model.generateContent([
        {
          fileData: {
            mimeType: uploadResponse.file.mimeType,
            fileUri: uploadResponse.file.uri,
          },
        },
        {
          text: "Please analyze the following electricity bill and extract the due date and the total amount to be paid. Return the values as plain numbers, without any formatting, except the due date. The bill details are as follows:[Vencimento, Total a pagar]. [Vencimento, Total a pagar].",
        },
      ]);

      const responseIA = result.response.text().split(",");

      const dueDate = responseIA[0].replace("[", "");
      const totalAmount = parseFloat(responseIA[1]);

      const dateFormated = Util.formatDateString(dueDate);

      const dadosSalvos = await UploadSchema.create({
        measure_type: requestBody.measure_type,
        measure_value: totalAmount,
        measure_expiration: dateFormated,
        customer_code: requestBody.customer_code,
      });

      const tempLink = uploadResponse.file.uri;
      const response = {
        image_url: tempLink,
        measure_value: totalAmount,
        measure_uuid: dadosSalvos.id,
      };

      return Util.cadastro(response, "Consulta realizada com sucesso");
    } catch (e) {
      console.log(e);
    }
  }

  async ConfirmMeasurement(requestBody: BodyConfirmMeasurement): Promise<any> {
    try {
      const measurement = await UploadSchema.findById(requestBody.measure_uuid);

      if (!measurement) return Util.notFound("Leitura não encontrada.");

      if (measurement.measure_confirm) return Util.duplicado("Leitura não encontrada.");

      measurement.measure_value = requestBody.confirmed_value;
      measurement.measure_confirm = true;

      await measurement.save();

      return Util.confirmMeasure();
    } catch (e) {
      console.log(e);
    }
  }

  async GetMeasurement(customer_code: string, measure_type: string): Promise<any> {
    try {
      const query: any = { customer_code };

      if (measure_type) {
        query.measure_type = measure_type;
      }

      const measurements = await UploadSchema.find(query);

      if (measurements.length == 0) return Util.notFound("Nenhuma leitura encontrada");

      const response = {
        customer_code: customer_code,
        measurements,
      };

      return Util.recuperar(response);
    } catch (e) {
      console.log(e);
      throw new Error("Erro ao buscar medições");
    }
  }
}

export default new UploadService();
